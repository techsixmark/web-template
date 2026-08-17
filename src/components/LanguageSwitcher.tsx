"use client";

import { useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n/dictionary";
import { LOCALE_COOKIE } from "@/lib/i18n/cookie";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();

  function setLocale(locale: Locale) {
    // eslint-disable-next-line react-hooks/immutability -- document.cookie là API trình duyệt toàn cục, không phải state/hook bị mutate ngoài quy tắc
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-medium">
      {LOCALES.map((l) => (
        <button
          key={l.value}
          type="button"
          onClick={() => setLocale(l.value)}
          className={`rounded-full px-2.5 py-1 transition ${
            current === l.value ? "bg-white text-ink" : "text-slate-300 hover:text-white"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
