import { getDictionary, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";

export function ProductFaq({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const items = getDictionary(locale).faq;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-slate-200 bg-white px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
            {item.q}
            <span className="ml-2 text-slate-400 transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
