import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { extractOrderCode, verifySePayWebhook } from "@/lib/sepay";
import { sendDownloadEmail } from "@/lib/email";

const DOWNLOAD_LINK_TTL_HOURS = 48;

// Payload SePay gửi khi có giao dịch mới vào tài khoản đã đăng ký.
// Tham khảo: https://sepay.vn/lap-trinh-cong-thanh-toan.html
interface SePayWebhookPayload {
  id: number | string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  content: string;
  transferType: "in" | "out";
  transferAmount: number;
  referenceCode: string;
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!verifySePayWebhook(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => null)) as SePayWebhookPayload | null;
  if (!payload || payload.transferType !== "in") {
    // Không phải giao dịch tiền vào -> bỏ qua, vẫn trả 200 để SePay không retry vô ích
    return NextResponse.json({ success: true, skipped: true });
  }

  const supabase = createServiceSupabaseClient();

  // Chống xử lý trùng nếu SePay gửi lại webhook (referenceCode là duy nhất mỗi giao dịch ngân hàng)
  const { data: existingTx } = await supabase
    .from("payment_transactions")
    .select("id")
    .eq("sepay_transaction_id", String(payload.referenceCode))
    .maybeSingle();
  if (existingTx) {
    return NextResponse.json({ success: true, duplicated: true });
  }

  const orderCode = extractOrderCode(payload.content ?? "");
  if (!orderCode) {
    return NextResponse.json({ success: true, matched: false });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_code, amount, status, customer_email, customer_name, products(name, file_path)")
    .eq("order_code", orderCode)
    .maybeSingle();

  // Ghi log giao dịch dù có khớp đơn hay không, để tiện đối soát thủ công sau này
  await supabase.from("payment_transactions").insert({
    order_id: order?.id ?? null,
    sepay_transaction_id: String(payload.referenceCode),
    amount: payload.transferAmount,
    transaction_content: payload.content,
    raw_payload: payload,
  });

  if (!order || order.status !== "pending") {
    return NextResponse.json({ success: true, matched: false });
  }
  if (payload.transferAmount < order.amount) {
    // Chuyển thiếu tiền -> không xác nhận, cần xử lý thủ công
    return NextResponse.json({ success: true, matched: false, reason: "amount_mismatch" });
  }

  await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id);

  const expiresAt = new Date(Date.now() + DOWNLOAD_LINK_TTL_HOURS * 60 * 60 * 1000);
  const { data: downloadToken } = await supabase
    .from("download_tokens")
    .insert({ order_id: order.id, expires_at: expiresAt.toISOString() })
    .select("token")
    .single();

  const productInfo = Array.isArray(order.products) ? order.products[0] : order.products;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const downloadUrl = `${siteUrl}/download/${downloadToken?.token}`;

  try {
    const emailResult = await sendDownloadEmail({
      to: order.customer_email,
      customerName: order.customer_name,
      productName: productInfo?.name ?? "Template",
      downloadUrl,
      expiresAt,
    });
    await supabase.from("email_logs").insert({
      order_id: order.id,
      email_to: order.customer_email,
      status: "sent",
      provider_message_id: emailResult.data?.id ?? null,
    });
  } catch (err) {
    await supabase.from("email_logs").insert({
      order_id: order.id,
      email_to: order.customer_email,
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return NextResponse.json({ success: true, matched: true });
}
