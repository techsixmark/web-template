import { notFound } from "next/navigation";
import { formatVnd } from "@/lib/types";
import { getProductBySlug } from "@/lib/products";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold text-ink">Xác nhận đơn hàng</h1>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="font-medium text-ink">{product.name}</p>
        <p className="mt-1 text-lg font-bold text-ink">
          {formatVnd(product.price)}
        </p>
      </div>

      <CheckoutForm slug={product.slug} />
    </div>
  );
}
