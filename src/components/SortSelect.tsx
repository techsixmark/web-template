"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function SortSelect({
  labels,
}: {
  labels: { prefix: string; newest: string; priceAsc: string; priceDesc: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  const options = [
    { value: "newest", label: labels.newest },
    { value: "price-asc", label: labels.priceAsc },
    { value: "price-desc", label: labels.priceDesc },
  ];

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
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {labels.prefix} {o.label}
        </option>
      ))}
    </select>
  );
}
