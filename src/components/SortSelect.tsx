"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: thấp đến cao" },
  { value: "price-desc", label: "Giá: cao đến thấp" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          Sắp xếp: {o.label}
        </option>
      ))}
    </select>
  );
}
