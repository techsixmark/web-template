import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatVnd, getCategoryLabel } from "@/lib/types";
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
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/locale";

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
  const locale = await getLocale();
  const t = getDictionary(locale).product;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const isFree = product.price === 0;
  const relatedProduct = product.related_product_id
    ? await getProductById(product.related_product_id, locale)
    : null;
  const bundlesWithThisProduct = await getBundlesForProduct(product.id, locale);
  const relatedProducts = await getRelatedProducts(product.category, product.id, 4, locale);
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
    category: getCategoryLabel(product.category, locale),
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
        {t.backToAll}
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ImageGallery images={product.preview_images} alt={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {getCategoryLabel(product.category, locale)}
            </span>
            {isFree && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {t.free}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink">{product.name}</h1>
          {reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={average} size="sm" />
              <span className="text-sm text-slate-500">
                {average.toFixed(1)} ({reviewCount} {t.reviewsCountSuffix})
              </span>
            </div>
          )}
          <div className="mt-4">
            <PriceTag
              price={product.price}
              compareAtPrice={product.compare_at_price}
              size="lg"
              freeLabel={t.free}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={checkoutHref}
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700"
            >
              {isFree ? t.downloadFree : t.buyNow}
            </Link>
            {!isFree && <AddToCartButton product={product} locale={locale} />}
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {isFree ? t.freeDeliveryNote : t.paidDeliveryNote}
          </p>

          <div className="mt-5">
            <TrustBadges locale={locale} />
          </div>

          {relatedProduct && (
            <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-4">
              <p className="text-sm text-slate-600">
                {isFree ? t.upgradeNote : t.freeVersionNote}
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
              <p className="text-sm text-slate-600">{t.bundleNote}</p>
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
          <h2 className="text-xl font-bold text-ink">{t.videoHeading}</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-black">
            {embedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl}
                  title={`${t.videoHeading} — ${product.name}`}
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
                {t.watchVideo}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Mô tả chi tiết */}
      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-ink">{t.descHeading}</h2>
          <div className="prose-sm mt-4 whitespace-pre-line leading-relaxed text-slate-600">
            {product.description}
          </div>
        </section>
      )}

      {/* Câu hỏi thường gặp */}
      <section className="mt-14 max-w-3xl">
        <h2 className="text-xl font-bold text-ink">{t.faqHeading}</h2>
        <div className="mt-4">
          <ProductFaq locale={locale} />
        </div>
      </section>

      {/* Đánh giá từ khách hàng */}
      <section className="mt-14 max-w-3xl">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink">{t.reviewsHeading}</h2>
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
          <p className="mt-4 text-sm text-slate-500">{t.noReviews}</p>
        )}

        <div className="mt-6">
          <ReviewForm productSlug={product.slug} locale={locale} />
        </div>
      </section>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-ink">{t.relatedHeading}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
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
