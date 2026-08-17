import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Bundle, Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionary";

async function applyBundleTranslations(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  bundles: Bundle[],
  locale: Locale
): Promise<Bundle[]> {
  if (locale === "vi" || bundles.length === 0) return bundles;

  const { data: translations, error } = await supabase
    .from("bundle_translations")
    .select("bundle_id, name, description")
    .eq("locale", locale)
    .in(
      "bundle_id",
      bundles.map((b) => b.id)
    );

  if (error || !translations) return bundles;

  const byId = new Map(translations.map((t) => [t.bundle_id, t]));
  return bundles.map((b) => {
    const t = byId.get(b.id);
    return t ? { ...b, name: t.name, description: t.description } : b;
  });
}

export async function getActiveBundles(locale: Locale = "vi"): Promise<Bundle[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getActiveBundles error:", error.message);
    return [];
  }
  return applyBundleTranslations(supabase, data as Bundle[], locale);
}

export async function getBundleBySlug(slug: string, locale: Locale = "vi"): Promise<Bundle | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getBundleBySlug error:", error.message);
    return null;
  }
  const [translated] = await applyBundleTranslations(supabase, [data as Bundle], locale);
  return translated;
}

/** Các combo (đang active) có chứa 1 sản phẩm cụ thể — dùng cho banner cross-sell. */
export async function getBundlesForProduct(productId: string, locale: Locale = "vi"): Promise<Bundle[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("is_active", true)
    .contains("product_ids", [productId]);

  if (error) {
    console.error("getBundlesForProduct error:", error.message);
    return [];
  }
  return applyBundleTranslations(supabase, data as Bundle[], locale);
}

/** Lấy danh sách sản phẩm nằm trong 1 bundle, dùng service/browser client tuỳ ngữ cảnh gọi. */
export async function getProductsByIds(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  ids: string[],
  locale: Locale = "vi"
): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("products").select("*").in("id", ids);
  if (error) {
    console.error("getProductsByIds error:", error.message);
    return [];
  }
  if (locale === "vi") return data as Product[];

  const { data: translations } = await supabase
    .from("product_translations")
    .select("product_id, name, description")
    .eq("locale", locale)
    .in("product_id", ids);

  const byId = new Map((translations ?? []).map((t) => [t.product_id, t]));
  return (data as Product[]).map((p) => {
    const t = byId.get(p.id);
    return t ? { ...p, name: t.name, description: t.description } : p;
  });
}
