"use client";

import { useState } from "react";

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, customerName, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Có lỗi xảy ra, vui lòng thử lại");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
        Cảm ơn bạn đã gửi đánh giá! Đánh giá sẽ hiển thị sau khi được duyệt.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Đánh giá của bạn</label>
        <div className="mt-1 flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={i <= rating ? "text-accent-500" : "text-slate-200"}
              aria-label={`${i} sao`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Họ tên</label>
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Nhận xét (không bắt buộc)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Bạn thấy template này thế nào?"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
}
