import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { FadeIn } from "@/components/FadeIn";
import { getActiveProducts } from "@/lib/products";
import { CATEGORY_ICONS, CATEGORY_ORDER, getCategoryLabel, type ProductCategory } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/locale";

export const revalidate = 60;

export const metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Toàn bộ template Google Sheets/Excel theo 10 nhóm ngành: tài chính cá nhân, kế toán, quản lý dự án, nhân sự, sales, bất động sản và hơn thế nữa.",
};

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale).catalog;
  const products = await getActiveProducts(locale);
  const activeCategory = CATEGORY_ORDER.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : null;

  let filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">
          {t.home}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-ink">
          {activeCategory ? getCategoryLabel(activeCategory, locale) : t.allProducts}
        </span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar danh mục */}
        <aside>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink">
            {t.sidebarHeading}
          </h2>
          <ul className="mt-4 space-y-1 border-t border-slate-200 pt-4">
            <li>
              <Link
                href="/san-pham"
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  !activeCategory
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.sidebarAll}
              </Link>
            </li>
            {CATEGORY_ORDER.map((c) => (
              <li key={c}>
                <Link
                  href={`/san-pham?category=${c}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeCategory === c
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{CATEGORY_ICONS[c]}</span>
                  {getCategoryLabel(c, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Danh sách sản phẩm */}
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {t.showing} {filtered.length} {t.of} {products.length} {t.results}
            </p>
            <SortSelect
              labels={{
                prefix: t.sortPrefix,
                newest: t.sortNewest,
                priceAsc: t.sortPriceAsc,
                priceDesc: t.sortPriceDesc,
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-slate-500">{t.empty}</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <FadeIn key={p.id} delay={(i % 3) * 80}>
                  <ProductCard product={p} locale={locale} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
