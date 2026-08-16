import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { generateOrderCode } from "@/lib/sepay";

const CreateOrderSchema = z.object({
  slug: z.string().min(1),
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  customerEmail: z.string().email("Email không hợp lệ"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }
  const { slug, customerName, customerEmail } = parsed.data;

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

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price, is_active")
    .eq("slug", slug)
    .maybeSingle();

  if (productError || !product || !product.is_active) {
    return NextResponse.json(
      { error: "Sản phẩm không tồn tại hoặc đã ngừng bán" },
      { status: 404 }
    );
  }

  // Sinh order_code duy nhất (thử tối đa 5 lần nếu trùng)
  let orderCode = "";
  for (let i = 0; i < 5; i++) {
    const candidate = generateOrderCode();
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("order_code", candidate)
      .maybeSingle();
    if (!existing) {
      orderCode = candidate;
      break;
    }
  }
  if (!orderCode) {
    return NextResponse.json(
      { error: "Không tạo được mã đơn hàng, vui lòng thử lại" },
      { status: 500 }
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_code: orderCode,
      product_id: product.id,
      customer_name: customerName,
      customer_email: customerEmail,
      amount: product.price,
      status: "pending",
    })
    .select("order_code")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Không tạo được đơn hàng, vui lòng thử lại" },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderCode: order.order_code });
}
