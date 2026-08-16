import { notFound } from "next/navigation";
import { formatVnd } from "@/lib/types";
import { getBundleBySlug } from "@/lib/bundles";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function BundleCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) notFound();

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold text-ink">Xác nhận đơn hàng combo</h1>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="font-medium text-ink">{bundle.name}</p>
        <p className="mt-1 text-lg font-bold text-ink">{formatVnd(bundle.price)}</p>
      </div>

      <CheckoutForm type="bundle" slug={bundle.slug} affiliateCode={ref} />
    </div>
  );
}
