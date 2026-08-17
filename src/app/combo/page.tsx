import Link from "next/link";
import { getActiveBundles } from "@/lib/bundles";
import { formatVnd } from "@/lib/types";
import { getLocale } from "@/lib/i18n/locale";

export const revalidate = 60;

export const metadata = {
  title: "Combo tiết kiệm",
  description: "Mua trọn bộ nhiều template liên quan trong 1 đơn hàng, giá tốt hơn mua lẻ.",
};

export default async function BundleListPage() {
  const locale = await getLocale();
  const bundles = await getActiveBundles(locale);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-ink">Combo tiết kiệm</h1>
      <p className="mt-2 text-slate-500">
        Mua trọn bộ nhiều template liên quan, giá tốt hơn mua lẻ.
      </p>

      {bundles.length === 0 ? (
        <p className="mt-10 text-slate-500">Chưa có combo nào đang mở bán.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b) => {
            const cover = b.preview_images[0];
            return (
              <Link
                key={b.id}
                href={`/combo/${b.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={b.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-accent-500">
                    Combo · {b.product_ids.length} sản phẩm
                  </span>
                  <h3 className="font-semibold leading-snug text-ink">{b.name}</h3>
                  <p className="mt-auto pt-2 text-base font-bold text-ink">
                    {formatVnd(b.price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
