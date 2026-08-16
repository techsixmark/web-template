"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatVnd } from "@/lib/types";
import { DiscountCodeInput } from "@/components/DiscountCodeInput";

export function CartPageClient() {
  const { items, removeItem, total, clear } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const affiliateCode = searchParams.get("ref") ?? undefined;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [discount, setDiscount] = useState<{ code: string; discountAmount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug })),
          customerName,
          customerEmail,
          affiliateCode,
          discountCode: discount?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Có lỗi xảy ra, vui lòng thử lại");
        setLoading(false);
        return;
      }
      clear();
      router.push(`/don-hang/${data.orderCode}`);
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Giỏ hàng trống</h1>
        <p className="mt-2 text-slate-500">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng.
        </p>
        <Link
          href="/san-pham"
          className="mt-6 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    );
  }

  const finalTotal = total - (discount?.discountAmount ?? 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-ink">Giỏ hàng ({items.length} sản phẩm)</h1>

      <ul className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item) => (
          <li key={item.slug} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{item.name}</p>
              <p className="text-sm text-slate-500">{formatVnd(item.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.slug)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <DiscountCodeInput
          target={{ kind: "cart", slugs: items.map((i) => i.slug) }}
          onApplied={setDiscount}
        />
      </div>

      <div className="mt-4 space-y-1 rounded-xl bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Tạm tính</span>
          <span>{formatVnd(total)}</span>
        </div>
        {discount && (
          <div className="flex items-center justify-between text-sm text-emerald-700">
            <span>Giảm giá ({discount.code})</span>
            <span>-{formatVnd(discount.discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
          <span className="font-medium text-ink">Tổng cộng</span>
          <span className="text-lg font-bold text-ink">{formatVnd(finalTotal)}</span>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Thông tin nhận file</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email nhận file</label>
          <input
            required
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="ban@email.com"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Tạo mã thanh toán VietQR"}
        </button>
      </form>
    </div>
  );
}
