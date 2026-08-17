import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CategoryBanner } from "@/components/CategoryBanner";
import { FadeIn } from "@/components/FadeIn";
import { getActiveProducts } from "@/lib/products";
import { CATEGORY_ICONS, CATEGORY_ORDER, getCategoryLabel } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/locale";

export const revalidate = 60;

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale).home;
  const products = await getActiveProducts(locale);
  const featured = products.slice(0, 6);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="bg-grid-mesh absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t.heroBadge}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t.heroTitle}{" "}
            <span className="bg-gradient-to-r from-brand-500 via-violet-400 to-accent-400 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{t.heroDesc}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-ink transition hover:bg-brand-50"
            >
              {t.heroCta1}
            </Link>
            <Link
              href="#quy-trinh"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {t.heroCta2}
            </Link>
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section id="quy-trinh" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-3">
          <FadeIn delay={0}>
            <Step index="01" title={t.step1Title} desc={t.step1Desc} />
          </FadeIn>
          <FadeIn delay={100}>
            <Step index="02" title={t.step2Title} desc={t.step2Desc} />
          </FadeIn>
          <FadeIn delay={200}>
            <Step index="03" title={t.step3Title} desc={t.step3Desc} />
          </FadeIn>
        </div>
      </section>

      {/* Banner: freemium */}
      <FadeIn>
        <CategoryBanner
          eyebrow={t.bannerFreeEyebrow}
          title={t.bannerFreeTitle}
          subtitle={t.bannerFreeSubtitle}
          description={t.bannerFreeDesc}
          image="https://placehold.co/700x525?text=Free+Basic+Template"
          primaryHref="/san-pham/ultimate-personal-finance-dashboard-basic"
          primaryLabel={t.bannerFreeCta1}
          secondaryHref="/san-pham"
          secondaryLabel={t.bannerFreeCta2}
        />
      </FadeIn>

      {/* Banner: doanh nghiệp */}
      <FadeIn>
        <CategoryBanner
          eyebrow={t.bannerBizEyebrow}
          title={t.bannerBizTitle}
          subtitle={t.bannerBizSubtitle}
          description={t.bannerBizDesc}
          image="https://placehold.co/700x525?text=Business+Templates"
          primaryHref="/checkout/agile-scrum-project-manager"
          primaryLabel={t.bannerBizCta1}
          secondaryHref="/san-pham?category=project-management"
          secondaryLabel={t.bannerBizCta2}
          reverse
          tone="dark"
        />
      </FadeIn>

      {/* Banner: combo */}
      <FadeIn>
        <CategoryBanner
          eyebrow={t.bannerComboEyebrow}
          title={t.bannerComboTitle}
          subtitle={t.bannerComboSubtitle}
          description={t.bannerComboDesc}
          image="https://placehold.co/700x525?text=Combo+Tiet+Kiem"
          primaryHref="/combo"
          primaryLabel={t.bannerComboCta1}
          secondaryHref="/san-pham"
          secondaryLabel={t.bannerComboCta2}
        />
      </FadeIn>

      {/* Danh mục ngành */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">{t.categoryHeading}</h2>
          <p className="mt-2 text-slate-500">{t.categorySub}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_ORDER.map((c, i) => (
            <FadeIn key={c} delay={(i % 5) * 60}>
              <Link
                href="/san-pham"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <span className="text-3xl">{CATEGORY_ICONS[c]}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-brand-700">
                  {getCategoryLabel(c, locale)}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      {featured.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">{t.featuredHeading}</h2>
              <Link href="/san-pham" className="text-sm font-semibold text-brand-600">
                {t.viewAll}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <FadeIn key={p.id} delay={(i % 3) * 80}>
                  <ProductCard product={p} locale={locale} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Step({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <span className="shrink-0 text-2xl font-bold text-brand-100">{index}</span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
