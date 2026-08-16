import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getActiveProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Template thiết kế &amp; văn phòng, tải ngay sau khi thanh toán
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Canva, Figma, PowerPoint, Word, Excel — chuyển khoản qua VietQR,
            hệ thống tự động xác nhận và gửi file về email trong vài giây.
          </p>
          <div className="mt-8">
            <Link
              href="/san-pham"
              className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Điểm nổi bật */}
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-3">
        <Highlight
          title="Thanh toán VietQR"
          desc="Quét mã, chuyển khoản trực tiếp từ app ngân hàng, không cần thẻ."
        />
        <Highlight
          title="Xác nhận tự động"
          desc="Hệ thống tự đối soát giao dịch, không cần chờ admin duyệt."
        />
        <Highlight
          title="Nhận file qua email"
          desc="Link tải được gửi tự động ngay sau khi thanh toán thành công."
        />
      </section>

      {/* Sản phẩm nổi bật */}
      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Sản phẩm nổi bật</h2>
            <Link href="/san-pham" className="text-sm font-medium text-indigo-600">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Highlight({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}
