import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
          Template<span className="text-indigo-600">Shop</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/san-pham" className="hover:text-zinc-900">
            Sản phẩm
          </Link>
          <Link href="/san-pham" className="hover:text-zinc-900">
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
}
