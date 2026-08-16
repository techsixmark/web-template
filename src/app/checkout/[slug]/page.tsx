import { notFound } from "next/navigation";
import { formatVnd } from "@/lib/types";
import { getProductBySlug } from "@/lib/products";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isFree = product.price === 0;

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold text-ink">
        {isFree ? "Nhận file miễn phí" : "Xác nhận đơn hàng"}
      </h1>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="font-medium text-ink">{product.name}</p>
        <p className="mt-1 text-lg font-bold text-ink">
          {isFree ? "Miễn phí" : formatVnd(product.price)}
        </p>
      </div>

      <CheckoutForm type="product" slug={product.slug} affiliateCode={ref} isFree={isFree} />
    </div>
  );
}
