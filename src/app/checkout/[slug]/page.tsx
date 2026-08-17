import { notFound } from "next/navigation";
import { formatVnd } from "@/lib/types";
import { getProductBySlug } from "@/lib/products";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/locale";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale).checkoutForm;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const isFree = product.price === 0;

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold text-ink">
        {isFree ? t.registerFree : t.confirmOrder}
      </h1>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="font-medium text-ink">{product.name}</p>
        <p className="mt-1 text-lg font-bold text-ink">
          {isFree ? getDictionary(locale).product.free : formatVnd(product.price)}
        </p>
      </div>

      <CheckoutForm type="product" slug={product.slug} affiliateCode={ref} isFree={isFree} locale={locale} />
    </div>
  );
}
