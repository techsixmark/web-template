import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatVnd } from "@/lib/types";
import { getProductBySlug } from "@/lib/products";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cover = product.preview_images[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link href="/san-pham" className="text-sm font-medium text-slate-500 hover:text-brand-600">
        ← Tất cả sản phẩm
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] w-full bg-slate-100">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <span>{CATEGORY_ICONS[product.category]}</span>
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-ink">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-ink">
            {formatVnd(product.price)}
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
              {product.description}
            </p>
          )}

          <Link
            href={`/checkout/${product.slug}`}
            className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            Mua ngay — thanh toán qua VietQR
          </Link>

          <p className="mt-3 text-sm text-slate-500">
            File sẽ được gửi tự động qua email ngay sau khi hệ thống xác
            nhận đã nhận được thanh toán.
          </p>
        </div>
      </div>
    </div>
  );
}
