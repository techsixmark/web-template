import Link from "next/link";
import { CATEGORY_LABELS, formatVnd, type Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.preview_images[0];
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            Không có ảnh
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="font-semibold text-zinc-900">{product.name}</h3>
        <p className="text-sm font-medium text-zinc-700">
          {formatVnd(product.price)}
        </p>
      </div>
    </Link>
  );
}
