import { getDictionary, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";

const ZALO_LINK = process.env.NEXT_PUBLIC_ZALO_LINK;
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function NeedHelp({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  if (!ZALO_LINK && !EMAIL) return null;

  const t = getDictionary(locale).needHelp;

  return (
    <section className="mt-14 max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-ink">{t.heading}</h2>
        <p className="mt-1.5 text-sm text-slate-600">{t.text}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {ZALO_LINK && (
            <a
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[#0068FF] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {t.zaloCta}
            </a>
          )}
          {EMAIL && (
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
            >
              {t.emailCta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
