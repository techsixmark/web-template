import { getDictionary, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";

export function HowItWorks({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDictionary(locale).howItWorks;
  return (
    <section className="mt-14 max-w-3xl">
      <h2 className="text-xl font-bold text-ink">{t.heading}</h2>
      <ol className="mt-4 space-y-3">
        {t.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-600">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
