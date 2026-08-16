import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/types";

const HOTLINE = process.env.NEXT_PUBLIC_CONTACT_HOTLINE;
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const ADDRESS = process.env.NEXT_PUBLIC_CONTACT_ADDRESS;
const FACEBOOK = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
const TIKTOK = process.env.NEXT_PUBLIC_TIKTOK_URL;

export function Footer() {
  const hasSocial = FACEBOOK || INSTAGRAM || TIKTOK;
  const hasContact = HOTLINE || EMAIL || ADDRESS;

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <span className="flex w-fit items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                T
              </span>
              <span className="text-lg font-bold text-white">
                Template<span className="text-brand-500">Shop</span>
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Template Google Sheets/Excel chuyên nghiệp cho 10 nhóm ngành.
              Thanh toán chuyển khoản VietQR, giao file tự động qua email.
            </p>

            {hasSocial && (
              <div className="mt-4 flex gap-3">
                {FACEBOOK && <SocialIcon href={FACEBOOK} label="Facebook" />}
                {INSTAGRAM && <SocialIcon href={INSTAGRAM} label="Instagram" />}
                {TIKTOK && <SocialIcon href={TIKTOK} label="TikTok" />}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Nhóm ngành</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-400">
              {CATEGORY_ORDER.slice(0, 5).map((c) => (
                <li key={c}>
                  <Link href="/san-pham" className="transition hover:text-white">
                    {CATEGORY_LABELS[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">&nbsp;</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-400">
              {CATEGORY_ORDER.slice(5).map((c) => (
                <li key={c}>
                  <Link href="/san-pham" className="transition hover:text-white">
                    {CATEGORY_LABELS[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Hỗ trợ</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-400">
              <li>
                <Link href="/combo" className="transition hover:text-white">
                  Combo tiết kiệm
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach" className="transition hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach#thanh-toan" className="transition hover:text-white">
                  Chính sách thanh toán
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach#giao-hang" className="transition hover:text-white">
                  Chính sách giao hàng
                </Link>
              </li>
            </ul>

            {hasContact && (
              <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
                {HOTLINE && <li>Hotline: {HOTLINE}</li>}
                {EMAIL && <li>Email: {EMAIL}</li>}
                {ADDRESS && <li>Địa chỉ: {ADDRESS}</li>}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} TemplateShop. Đã đăng ký kinh doanh tại Việt Nam.</p>
          <p>Thanh toán an toàn qua VietQR · Xác nhận &amp; giao hàng tự động</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white transition hover:bg-white/20"
    >
      {label[0]}
    </a>
  );
}
