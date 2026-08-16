import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { extractOrderCode, verifySePayWebhook } from "@/lib/sepay";
import { fulfillOrder } from "@/lib/fulfillment";

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

  let supabase: ReturnType<typeof createServiceSupabaseClient>;
  try {
    supabase = createServiceSupabaseClient();
  } catch (err) {
    console.error("createServiceSupabaseClient error:", err);
    return NextResponse.json({ error: "Máy chủ chưa được cấu hình đầy đủ" }, { status: 500 });
  }

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
    .select("id, order_code, amount, status")
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

  await fulfillOrder(supabase, order.id);

  return NextResponse.json({ success: true, matched: true });
}
