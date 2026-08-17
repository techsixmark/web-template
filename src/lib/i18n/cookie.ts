/** Tên cookie lưu locale — tách riêng file này (không import next/headers) để
 * client component (LanguageSwitcher) dùng được mà không kéo theo code
 * server-only vào bundle client. */
export const LOCALE_COOKIE = "locale";
