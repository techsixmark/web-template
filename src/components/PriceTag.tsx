import { formatVnd } from "@/lib/types";

export function PriceTag({
  price,
  compareAtPrice,
  size = "base",
  freeLabel = "Miễn phí",
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "base" | "lg";
  freeLabel?: string;
}) {
  const isFree = price === 0;
  const onSale = !!compareAtPrice && compareAtPrice > price;
  const percentOff = onSale ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0;

  const priceClass = size === "lg" ? "text-2xl font-bold" : "text-base font-bold";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${priceClass} text-ink`}>
        {isFree ? <span className="text-emerald-600">{freeLabel}</span> : formatVnd(price)}
      </span>
      {onSale && !isFree && (
        <>
          <span className="text-sm text-slate-400 line-through">{formatVnd(compareAtPrice!)}</span>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
            -{percentOff}%
          </span>
        </>
      )}
    </div>
  );
}
