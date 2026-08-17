import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Product, ProductCategory } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionary";

/** Gắn bản dịch (name/description) theo locale cho danh sách sản phẩm — 'vi'
 * không cần dịch, dùng thẳng cột gốc. */
async function applyTranslations(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  products: Product[],
  locale: Locale
): Promise<Product[]> {
  if (locale === "vi" || products.length === 0) return products;

  const { data: translations, error } = await supabase
    .from("product_translations")
    .select("product_id, name, description")
    .eq("locale", locale)
    .in(
      "product_id",
      products.map((p) => p.id)
    );

  if (error || !translations) return products;

  const byId = new Map(translations.map((t) => [t.product_id, t]));
  return products.map((p) => {
    const t = byId.get(p.id);
    return t ? { ...p, name: t.name, description: t.description } : p;
  });
}

export async function getActiveProducts(locale: Locale = "vi"): Promise<Product[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getActiveProducts error:", error.message);
    return [];
  }
  return applyTranslations(supabase, data as Product[], locale);
}

export async function getProductBySlug(slug: string, locale: Locale = "vi"): Promise<Product | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getProductBySlug error:", error.message);
    return null;
  }
  const [translated] = await applyTranslations(supabase, [data as Product], locale);
  return translated;
}

/** Sản phẩm cùng nhóm ngành, không tính sản phẩm đang xem — dùng cho khối "Sản phẩm liên quan". */
export async function getRelatedProducts(
  category: ProductCategory,
  excludeId: string,
  limit = 4,
  locale: Locale = "vi"
): Promise<Product[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts error:", error.message);
    return [];
  }
  return applyTranslations(supabase, data as Product[], locale);
}

export async function getProductById(id: string, locale: Locale = "vi"): Promise<Product | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getProductById error:", error.message);
    return null;
  }
  const [translated] = await applyTranslations(supabase, [data as Product], locale);
  return translated;
}
