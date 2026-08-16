import { createServiceSupabaseClient } from "@/lib/supabase";
import { sendDownloadEmail } from "@/lib/email";

const DOWNLOAD_LINK_TTL_HOURS = 48;

/**
 * Hoàn tất 1 đơn hàng đã được xác nhận (trả phí qua SePay hoặc freemium
 * miễn phí): sinh download_token cho từng sản phẩm liên quan (1 sản phẩm
 * thường, hoặc nhiều sản phẩm nếu là combo/bundle), gửi email kèm (các)
 * link tải. Dùng chung cho webhook SePay và luồng freemium để không lặp
 * logic.
 */
export async function fulfillOrder(
  supabase: ReturnType<typeof createServiceSupabaseClient>,
  orderId: string
): Promise<void> {
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, customer_name, customer_email, product_id, bundle_id, amount, products(name, file_path), bundles(name, product_ids)"
    )
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return;

  const bundleInfo = Array.isArray(order.bundles) ? order.bundles[0] : order.bundles;
  const productInfo = Array.isArray(order.products) ? order.products[0] : order.products;

  // Danh sách { productId, productName, filePath } cần cấp quyền tải
  let items: { productId: string; productName: string; filePath: string }[] = [];
  let orderLabel = "";

  if (order.bundle_id && bundleInfo) {
    orderLabel = bundleInfo.name;
    const { data: bundleProducts } = await supabase
      .from("products")
      .select("id, name, file_path")
      .in("id", bundleInfo.product_ids);
    items = (bundleProducts ?? []).map((p) => ({
      productId: p.id,
      productName: p.name,
      filePath: p.file_path,
    }));
  } else if (order.product_id && productInfo) {
    orderLabel = productInfo.name;
    items = [
      {
        productId: order.product_id,
        productName: productInfo.name,
        filePath: productInfo.file_path,
      },
    ];
  } else {
    // Don gio hang: khong gan product_id/bundle_id, danh sach san pham
    // nam trong bang order_items.
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, products(name, file_path)")
      .eq("order_id", order.id);
    items = (orderItems ?? [])
      .map((oi) => {
        const p = Array.isArray(oi.products) ? oi.products[0] : oi.products;
        return p ? { productId: oi.product_id, productName: p.name, filePath: p.file_path } : null;
      })
      .filter((x): x is { productId: string; productName: string; filePath: string } => x !== null);
    orderLabel = items.length > 1 ? `Giỏ hàng (${items.length} sản phẩm)` : (items[0]?.productName ?? "Đơn hàng");
  }

  if (items.length === 0) return;

  const expiresAt = new Date(Date.now() + DOWNLOAD_LINK_TTL_HOURS * 60 * 60 * 1000);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const emailItems: { productName: string; downloadUrl: string }[] = [];
  for (const item of items) {
    const { data: token } = await supabase
      .from("download_tokens")
      .insert({
        order_id: order.id,
        product_id: item.productId,
        expires_at: expiresAt.toISOString(),
      })
      .select("token")
      .single();
    if (token) {
      emailItems.push({
        productName: item.productName,
        downloadUrl: `${siteUrl}/download/${token.token}`,
      });
    }
  }

  try {
    const emailResult = await sendDownloadEmail({
      to: order.customer_email,
      customerName: order.customer_name,
      orderLabel,
      items: emailItems,
      expiresAt,
      isFree: order.amount === 0,
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
}
