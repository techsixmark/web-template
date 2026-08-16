import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { generateOrderCode } from "@/lib/sepay";
import { fulfillOrder } from "@/lib/fulfillment";

const CreateCartOrderSchema = z.object({
  items: z.array(z.object({ slug: z.string().min(1) })).min(1, "Giỏ hàng đang trống"),
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  customerEmail: z.string().email("Email không hợp lệ"),
  affiliateCode: z.string().trim().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateCartOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }
  const { items, customerName, customerEmail, affiliateCode } = parsed.data;

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

  const slugs = items.map((i) => i.slug);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, slug, price, is_active")
    .in("slug", slugs);

  if (productsError) {
    return NextResponse.json({ error: "Không lấy được thông tin sản phẩm" }, { status: 500 });
  }

  const missing = slugs.filter((s) => !products?.some((p) => p.slug === s && p.is_active));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Một số sản phẩm trong giỏ không còn hợp lệ: ${missing.join(", ")}` },
      { status: 404 }
    );
  }

  const validProducts = products!.filter((p) => slugs.includes(p.slug));
  const amount = validProducts.reduce((sum, p) => sum + p.price, 0);

  let validAffiliateCode: string | null = null;
  if (affiliateCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("code")
      .eq("code", affiliateCode)
      .maybeSingle();
    validAffiliateCode = affiliate?.code ?? null;
  }

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

  const isFree = amount === 0;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_code: orderCode,
      product_id: null,
      bundle_id: null,
      customer_name: customerName,
      customer_email: customerEmail,
      amount,
      affiliate_code: validAffiliateCode,
      status: isFree ? "paid" : "pending",
      paid_at: isFree ? new Date().toISOString() : null,
    })
    .select("id, order_code")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Không tạo được đơn hàng, vui lòng thử lại" },
      { status: 500 }
    );
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    validProducts.map((p) => ({ order_id: order.id, product_id: p.id, price: p.price }))
  );
  if (itemsError) {
    console.error("insert order_items error:", itemsError.message);
    return NextResponse.json(
      { error: "Không lưu được danh sách sản phẩm trong đơn, vui lòng thử lại" },
      { status: 500 }
    );
  }

  if (isFree) {
    await fulfillOrder(supabase, order.id);
  }

  return NextResponse.json({ orderCode: order.order_code });
}
