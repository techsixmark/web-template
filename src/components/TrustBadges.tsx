import { getDictionary, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";

export function TrustBadges({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const badges = getDictionary(locale).trustBadges;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {badges.map((b) => (
        <div key={b.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <span className="text-xl">{b.icon}</span>
          <div>
            <p className="text-sm font-semibold text-ink">{b.title}</p>
            <p className="text-xs text-slate-500">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
