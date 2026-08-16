import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            T
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Template<span className="text-brand-500">Shop</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/san-pham"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block"
          >
            Tất cả sản phẩm
          </Link>
          <Link
            href="/san-pham"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-brand-50"
          >
            Mua template
          </Link>
        </nav>
      </div>
    </header>
  );
}
