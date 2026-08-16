import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getActiveProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="bg-grid-mesh absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            10 nhóm ngành · Google Sheets &amp; Excel chuyên nghiệp
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Template quản trị giúp bạn{" "}
            <span className="bg-gradient-to-r from-brand-500 via-violet-400 to-accent-400 bg-clip-text text-transparent">
              vận hành gọn gàng hơn
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Từ tài chính cá nhân đến vận hành doanh nghiệp — chuyển khoản qua
            VietQR, hệ thống tự động xác nhận và gửi file về email chỉ trong
            vài giây.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-ink transition hover:bg-brand-50"
            >
              Khám phá 10 nhóm sản phẩm
            </Link>
            <Link
              href="#quy-trinh"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Xem cách hoạt động
            </Link>
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section id="quy-trinh" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-3">
          <Step
            index="01"
            title="Thanh toán VietQR"
            desc="Quét mã, chuyển khoản trực tiếp từ app ngân hàng, không cần thẻ."
          />
          <Step
            index="02"
            title="Xác nhận tự động"
            desc="Hệ thống tự đối soát giao dịch, không cần chờ admin duyệt."
          />
          <Step
            index="03"
            title="Nhận file qua email"
            desc="Link tải được gửi tự động ngay sau khi thanh toán thành công."
          />
        </div>
      </section>

      {/* Danh mục ngành */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            Chọn theo lĩnh vực của bạn
          </h2>
          <p className="mt-2 text-slate-500">
            10 nhóm ngành, mỗi nhóm là template được thiết kế riêng cho nhu cầu cụ thể.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_ORDER.map((c) => (
            <Link
              key={c}
              href="/san-pham"
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <span className="text-3xl">{CATEGORY_ICONS[c]}</span>
              <span className="text-sm font-medium text-slate-700 group-hover:text-brand-700">
                {CATEGORY_LABELS[c]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      {featured.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                Sản phẩm nổi bật
              </h2>
              <Link href="/san-pham" className="text-sm font-semibold text-brand-600">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Step({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <span className="shrink-0 text-2xl font-bold text-brand-100">{index}</span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
