import { notFound } from "next/navigation";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { formatVnd } from "@/lib/types";
import { getVietQrImageUrl } from "@/lib/sepay";
import { OrderStatusPoller } from "./OrderStatusPoller";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ order_code: string }>;
}) {
  const { order_code } = await params;
  const supabase = createServiceSupabaseClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "order_code, amount, status, customer_email, product_id, bundle_id, products(name), bundles(name)"
    )
    .eq("order_code", order_code)
    .maybeSingle();

  if (!order) notFound();

  const productInfo = Array.isArray(order.products) ? order.products[0] : order.products;
  const bundleInfo = Array.isArray(order.bundles) ? order.bundles[0] : order.bundles;
  const itemName = order.bundle_id ? bundleInfo?.name : productInfo?.name;
  const isFree = order.amount === 0;

  const qrUrl = getVietQrImageUrl({
    amount: order.amount,
    orderCode: order.order_code,
  });

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12 text-center">
      <h1 className="text-2xl font-bold text-ink">
        {isFree ? "Đơn đăng ký nhận file" : "Thanh toán đơn hàng"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">Mã đơn: {order.order_code}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="font-medium text-ink">{itemName}</p>
        <p className="mt-1 text-lg font-bold text-ink">
          {isFree ? "Miễn phí" : formatVnd(order.amount)}
        </p>

        {order.status === "pending" && !isFree && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="Mã QR chuyển khoản VietQR"
              className="mx-auto mt-4 w-full max-w-xs rounded-lg border border-slate-200"
            />
            <p className="mt-3 text-sm text-slate-600">
              Quét mã bằng app ngân hàng, giữ nguyên{" "}
              <strong>nội dung chuyển khoản: {order.order_code}</strong> để hệ
              thống tự động xác nhận.
            </p>
          </>
        )}

        <OrderStatusPoller
          orderCode={order.order_code}
          initialStatus={order.status}
          customerEmail={order.customer_email}
        />
      </div>
    </div>
  );
}
