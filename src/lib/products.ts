import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Product, ProductCategory } from "@/lib/types";

export async function getActiveProducts(): Promise<Product[]> {
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
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug error:", error.message);
    return null;
  }
  return data as Product | null;
}

/** Sản phẩm cùng nhóm ngành, không tính sản phẩm đang xem — dùng cho khối "Sản phẩm liên quan". */
export async function getRelatedProducts(
  category: ProductCategory,
  excludeId: string,
  limit = 4
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
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductById error:", error.message);
    return null;
  }
  return data as Product | null;
}
