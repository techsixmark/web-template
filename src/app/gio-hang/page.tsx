import { Suspense } from "react";
import { CartPageClient } from "./CartPageClient";
import { getLocale } from "@/lib/i18n/locale";

export default async function CartPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={null}>
      <CartPageClient locale={locale} />
    </Suspense>
  );
}
