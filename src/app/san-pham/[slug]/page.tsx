import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, formatVnd } from "@/lib/types";
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
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="aspect-[4/3] w-full bg-zinc-100">
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
          <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-zinc-900">
            {formatVnd(product.price)}
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-zinc-600">
              {product.description}
            </p>
          )}

          <Link
            href={`/checkout/${product.slug}`}
            className="mt-8 inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
          >
            Mua ngay — thanh toán qua VietQR
          </Link>

          <p className="mt-3 text-sm text-zinc-500">
            File sẽ được gửi tự động qua email ngay sau khi hệ thống xác
            nhận đã nhận được thanh toán.
          </p>
        </div>
      </div>
    </div>
  );
}
