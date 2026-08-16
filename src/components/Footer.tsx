import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/types";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
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
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} TemplateShop. Đã đăng ký kinh doanh tại Việt Nam.</p>
          <p>Thanh toán an toàn qua VietQR · Xác nhận &amp; giao hàng tự động</p>
        </div>
      </div>
    </footer>
  );
}
