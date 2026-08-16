import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type ProductCategory,
} from "@/lib/types";

export const revalidate = 60;

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getActiveProducts();
  const activeCategory = CATEGORY_ORDER.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : null;
  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-ink">Tất cả sản phẩm</h1>
      <p className="mt-2 text-slate-500">
        {filtered.length} / {products.length} template đang mở bán.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/san-pham"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !activeCategory
              ? "bg-ink text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300"
          }`}
        >
          Tất cả
        </Link>
        {CATEGORY_ORDER.map((c) => (
          <Link
            key={c}
            href={`/san-pham?category=${c}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === c
                ? "bg-ink text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300"
            }`}
          >
            <span>{CATEGORY_ICONS[c]}</span>
            {CATEGORY_LABELS[c]}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-slate-500">
          Chưa có sản phẩm nào ở nhóm này. Vui lòng quay lại sau.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
