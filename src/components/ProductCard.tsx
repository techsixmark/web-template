import Link from "next/link";
import { CATEGORY_BG, CATEGORY_ICONS, CATEGORY_LABELS, type Product } from "@/lib/types";
import { PriceTag } from "@/components/PriceTag";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.preview_images[0];
  const onSale = !!product.compare_at_price && product.compare_at_price > product.price;
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${CATEGORY_BG[product.category]}`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Không có ảnh
          </div>
        )}
        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-base shadow-sm backdrop-blur">
          {CATEGORY_ICONS[product.category]}
        </span>
        {onSale && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="font-semibold leading-snug text-ink">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag price={product.price} compareAtPrice={product.compare_at_price} />
          <span className="text-sm font-medium text-brand-600 opacity-0 transition group-hover:opacity-100">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}
