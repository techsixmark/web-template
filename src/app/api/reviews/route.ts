import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient } from "@/lib/supabase";

const CreateReviewSchema = z.object({
  productSlug: z.string().min(1),
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }
  const { productSlug, customerName, rating, comment } = parsed.data;

  let supabase: ReturnType<typeof createServiceSupabaseClient>;
  try {
    supabase = createServiceSupabaseClient();
  } catch (err) {
    console.error("createServiceSupabaseClient error:", err);
    return NextResponse.json(
      { error: "Máy chủ chưa được cấu hình đầy đủ, vui lòng thử lại sau" },
      { status: 500 }
    );
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, is_active")
    .eq("slug", productSlug)
    .maybeSingle();

  if (!product || !product.is_active) {
    return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
  }

  const { error: insertError } = await supabase.from("product_reviews").insert({
    product_id: product.id,
    customer_name: customerName,
    rating,
    comment: comment || null,
    is_approved: false,
  });

  if (insertError) {
    console.error("insert product_reviews error:", insertError.message);
    return NextResponse.json(
      { error: "Không gửi được đánh giá, vui lòng thử lại" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
