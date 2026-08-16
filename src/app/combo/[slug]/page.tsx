import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBundleBySlug, getProductsByIds } from "@/lib/bundles";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { CATEGORY_ICONS, formatVnd } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) return {};

  const description =
    bundle.description?.slice(0, 155).trim() ??
    `${bundle.name} — combo template tiết kiệm hơn mua lẻ.`;
  const image = bundle.preview_images[0];
  const url = `${SITE_URL}/combo/${bundle.slug}`;

  return {
    title: bundle.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: bundle.name,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) notFound();

  const supabase = createBrowserSupabaseClient();
  const products = await getProductsByIds(supabase, bundle.product_ids);
  const individualTotal = products.reduce((sum, p) => sum + p.price, 0);
  const savings = individualTotal - bundle.price;
  const cover = bundle.preview_images[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link href="/combo" className="text-sm font-medium text-slate-500 hover:text-brand-600">
        ← Tất cả combo
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] w-full bg-slate-100">
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={bundle.name} className="h-full w-full object-cover" />
            )}
          </div>
        </div>

        <div>
          <span className="inline-flex items-center rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-500">
            Combo · {products.length} sản phẩm
          </span>
          <h1 className="mt-3 text-3xl font-bold text-ink">{bundle.name}</h1>
          {bundle.description && (
            <p className="mt-3 leading-relaxed text-slate-600">{bundle.description}</p>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-2xl font-bold text-ink">{formatVnd(bundle.price)}</p>
            {savings > 0 && (
              <>
                <p className="text-sm text-slate-400 line-through">{formatVnd(individualTotal)}</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Tiết kiệm {formatVnd(savings)}
                </span>
              </>
            )}
          </div>

          <Link
            href={`/checkout/combo/${bundle.slug}`}
            className="mt-6 inline-flex items-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            Mua combo — thanh toán qua VietQR
          </Link>

          <p className="mt-3 text-sm text-slate-500">
            Sau khi thanh toán, bạn nhận email chứa link tải cho tất cả sản phẩm trong combo.
          </p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-ink">Bao gồm:</h2>
            <ul className="mt-3 space-y-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    <span>{CATEGORY_ICONS[p.category]}</span>
                    {p.name}
                  </span>
                  <span className="text-sm text-slate-500">{formatVnd(p.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
