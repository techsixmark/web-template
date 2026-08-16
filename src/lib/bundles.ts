import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Bundle, Product } from "@/lib/types";

export async function getActiveBundles(): Promise<Bundle[]> {
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
  return data as Bundle[];
}

export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getBundleBySlug error:", error.message);
    return null;
  }
  return data as Bundle | null;
}

/** Các combo (đang active) có chứa 1 sản phẩm cụ thể — dùng cho banner cross-sell. */
export async function getBundlesForProduct(productId: string): Promise<Bundle[]> {
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
  return data as Bundle[];
}

/** Lấy danh sách sản phẩm nằm trong 1 bundle, dùng service/browser client tuỳ ngữ cảnh gọi. */
export async function getProductsByIds(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  ids: string[]
): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("products").select("*").in("id", ids);
  if (error) {
    console.error("getProductsByIds error:", error.message);
    return [];
  }
  return data as Product[];
}
