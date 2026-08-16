"use client";

import { useState } from "react";
import { formatVnd } from "@/lib/types";

type Target =
  | { kind: "product"; slug: string }
  | { kind: "bundle"; slug: string }
  | { kind: "cart"; slugs: string[] };

export function DiscountCodeInput({
  target,
  onApplied,
}: {
  target: Target;
  onApplied: (result: { code: string; discountAmount: number } | null) => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<{ code: string; discountAmount: number } | null>(null);

  async function handleApply() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/discount/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input.trim(), target }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Mã giảm giá không hợp lệ");
        setApplied(null);
        onApplied(null);
        setLoading(false);
        return;
      }
      const result = { code: data.code, discountAmount: data.discountAmount };
      setApplied(result);
      onApplied(result);
    } catch {
      setError("Không kiểm tra được mã, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    setApplied(null);
    setInput("");
    setError(null);
    onApplied(null);
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm">
        <span className="font-medium text-emerald-700">
          Đã áp dụng mã <strong>{applied.code}</strong> · -{formatVnd(applied.discountAmount)}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="font-medium text-emerald-700 underline hover:text-emerald-900"
        >
          Bỏ mã
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mã giảm giá (nếu có)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "..." : "Áp dụng"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
