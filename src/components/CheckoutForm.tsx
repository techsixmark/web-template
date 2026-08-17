"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiscountCodeInput } from "@/components/DiscountCodeInput";
import { getDictionary, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";

export function CheckoutForm({
  type,
  slug,
  affiliateCode,
  isFree,
  locale = DEFAULT_LOCALE,
}: {
  type: "product" | "bundle";
  slug: string;
  affiliateCode?: string;
  isFree?: boolean;
  locale?: Locale;
}) {
  const t = getDictionary(locale).checkoutForm;
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [discount, setDiscount] = useState<{ code: string; discountAmount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          slug,
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
      router.push(`/don-hang/${data.orderCode}`);
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">{t.fullName}</label>
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">{t.email}</label>
        <input
          required
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="ban@email.com"
        />
      </div>

      {!isFree && (
        <div>
          <label className="block text-sm font-medium text-slate-700">{t.discountCode}</label>
          <div className="mt-1">
            <DiscountCodeInput target={{ kind: type, slug }} onApplied={setDiscount} locale={locale} />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? t.processing : isFree ? t.registerFree : t.createQr}
      </button>
    </form>
  );
}
