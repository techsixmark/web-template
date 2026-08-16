import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatVnd } from "@/lib/types";
import { PriceTag } from "@/components/PriceTag";
import { getProductBySlug, getProductById } from "@/lib/products";
import { getBundlesForProduct } from "@/lib/bundles";
import { ImageGallery } from "@/components/ImageGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getEmbedUrl, isDirectVideoFile } from "@/lib/video";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isFree = product.price === 0;
  const relatedProduct = product.related_product_id
    ? await getProductById(product.related_product_id)
    : null;
  const bundlesWithThisProduct = await getBundlesForProduct(product.id);
  const checkoutHref = ref
    ? `/checkout/${product.slug}?ref=${encodeURIComponent(ref)}`
    : `/checkout/${product.slug}`;

  const embedUrl = product.video_url ? getEmbedUrl(product.video_url) : null;
  const isDirectVideo =
    product.video_url && !embedUrl ? isDirectVideoFileSafe(product.video_url) : false;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link href="/san-pham" className="text-sm font-medium text-slate-500 hover:text-brand-600">
        ← Tất cả sản phẩm
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ImageGallery images={product.preview_images} alt={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <span>{CATEGORY_ICONS[product.category]}</span>
              {CATEGORY_LABELS[product.category]}
            </span>
            {isFree && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Miễn phí
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink">{product.name}</h1>
          <div className="mt-4">
            <PriceTag price={product.price} compareAtPrice={product.compare_at_price} size="lg" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={checkoutHref}
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700"
            >
              {isFree ? "Tải miễn phí" : "Mua ngay — thanh toán qua VietQR"}
            </Link>
            {!isFree && <AddToCartButton product={product} />}
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {isFree
              ? "File sẽ được gửi ngay qua email sau khi bạn đăng ký — không cần thanh toán."
              : "File sẽ được gửi tự động qua email ngay sau khi hệ thống xác nhận đã nhận được thanh toán."}
          </p>

          {relatedProduct && (
            <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-4">
              <p className="text-sm text-slate-600">
                {isFree ? "Muốn nhiều tính năng hơn?" : "Đã có bản miễn phí:"}
              </p>
              <Link
                href={`/san-pham/${relatedProduct.slug}`}
                className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
              >
                {relatedProduct.name} →
              </Link>
            </div>
          )}

          {bundlesWithThisProduct.map((b) => (
            <div key={b.id} className="mt-6 rounded-xl border border-accent-500/20 bg-accent-500/5 p-4">
              <p className="text-sm text-slate-600">Mua kèm combo, tiết kiệm hơn:</p>
              <Link
                href={`/combo/${b.slug}`}
                className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent-500 hover:underline"
              >
                {b.name} — {formatVnd(b.price)} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Video hướng dẫn */}
      {product.video_url && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-ink">Video hướng dẫn</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-black">
            {embedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl}
                  title={`Video hướng dẫn — ${product.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : isDirectVideo ? (
              <video src={product.video_url} controls className="aspect-video w-full" />
            ) : (
              <a
                href={product.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 text-center text-sm font-medium text-white underline"
              >
                Xem video hướng dẫn →
              </a>
            )}
          </div>
        </section>
      )}

      {/* Mô tả chi tiết */}
      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-ink">Mô tả chi tiết</h2>
          <div className="prose-sm mt-4 whitespace-pre-line leading-relaxed text-slate-600">
            {product.description}
          </div>
        </section>
      )}
    </div>
  );
}

function isDirectVideoFileSafe(url: string): boolean {
  try {
    return isDirectVideoFile(url);
  } catch {
    return false;
  }
}
