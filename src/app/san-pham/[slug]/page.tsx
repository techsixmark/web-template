import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatVnd } from "@/lib/types";
import { PriceTag } from "@/components/PriceTag";
import { getProductBySlug, getProductById, getRelatedProducts } from "@/lib/products";
import { getBundlesForProduct } from "@/lib/bundles";
import { ImageGallery } from "@/components/ImageGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getEmbedUrl, isDirectVideoFile } from "@/lib/video";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductFaq } from "@/components/ProductFaq";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { getApprovedReviews } from "@/lib/reviews";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description =
    product.description?.slice(0, 155).trim() ??
    `${product.name} — template Google Sheets/Excel, giao file tự động qua email sau khi thanh toán.`;
  const image = product.preview_images[0];
  const url = `${SITE_URL}/san-pham/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

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
  const relatedProducts = await getRelatedProducts(product.category, product.id);
  const { reviews, average, count: reviewCount } = await getApprovedReviews(product.id);
  const checkoutHref = ref
    ? `/checkout/${product.slug}?ref=${encodeURIComponent(ref)}`
    : `/checkout/${product.slug}`;

  const embedUrl = product.video_url ? getEmbedUrl(product.video_url) : null;
  const isDirectVideo =
    product.video_url && !embedUrl ? isDirectVideoFileSafe(product.video_url) : false;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.preview_images,
    category: CATEGORY_LABELS[product.category],
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/san-pham/${product.slug}`,
    },
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: average.toFixed(1),
            reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          {reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={average} size="sm" />
              <span className="text-sm text-slate-500">
                {average.toFixed(1)} ({reviewCount} đánh giá)
              </span>
            </div>
          )}
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

          <div className="mt-5">
            <TrustBadges />
          </div>

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

      {/* Câu hỏi thường gặp */}
      <section className="mt-14 max-w-3xl">
        <h2 className="text-xl font-bold text-ink">Câu hỏi thường gặp</h2>
        <div className="mt-4">
          <ProductFaq />
        </div>
      </section>

      {/* Đánh giá từ khách hàng */}
      <section className="mt-14 max-w-3xl">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink">Đánh giá từ khách hàng</h2>
          {reviewCount > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <StarRating value={average} size="sm" />
              {average.toFixed(1)} ({reviewCount})
            </span>
          )}
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{r.customer_name}</p>
                  <StarRating value={r.rating} size="sm" />
                </div>
                {r.comment && <p className="mt-1.5 text-sm text-slate-600">{r.comment}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        )}

        <div className="mt-6">
          <ReviewForm productSlug={product.slug} />
        </div>
      </section>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-ink">Sản phẩm liên quan</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
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
