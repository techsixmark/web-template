import { cookies } from "next/headers";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";
import { LOCALE_COOKIE } from "@/lib/i18n/cookie";

/** Đọc locale hiện tại từ cookie (Server Component/Route Handler). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value === "en" || value === "zh" || value === "vi") return value;
  return DEFAULT_LOCALE;
}
