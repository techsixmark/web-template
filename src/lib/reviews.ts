import { createBrowserSupabaseClient } from "@/lib/supabase";

export interface ProductReview {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewSummary {
  reviews: ProductReview[];
  average: number;
  count: number;
}

/** Đánh giá đã duyệt (is_approved = true) của 1 sản phẩm, mới nhất trước. */
export async function getApprovedReviews(productId: string): Promise<ReviewSummary> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, customer_name, rating, comment, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getApprovedReviews error:", error.message);
    return { reviews: [], average: 0, count: 0 };
  }

  const reviews = data as ProductReview[];
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return { reviews, average, count };
}
