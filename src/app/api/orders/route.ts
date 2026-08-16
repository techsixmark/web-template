import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { generateOrderCode } from "@/lib/sepay";
import { fulfillOrder } from "@/lib/fulfillment";
import { validateDiscountCode, incrementDiscountUsage } from "@/lib/discount";

const CreateOrderSchema = z.object({
  type: z.enum(["product", "bundle"]).default("product"),
  slug: z.string().min(1),
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  customerEmail: z.string().email("Email không hợp lệ"),
  affiliateCode: z.string().trim().optional(),
  discountCode: z.string().trim().optional(),
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
  const { type, slug, customerName, customerEmail, affiliateCode, discountCode } = parsed.data;

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

  // Xác định sản phẩm/combo + giá tiền
  let subtotal: number;
  let productId: string | null = null;
  let bundleId: string | null = null;

  if (type === "bundle") {
    const { data: bundle, error } = await supabase
      .from("bundles")
      .select("id, price, is_active")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !bundle || !bundle.is_active) {
      return NextResponse.json({ error: "Combo không tồn tại hoặc đã ngừng bán" }, { status: 404 });
    }
    subtotal = bundle.price;
    bundleId = bundle.id;
  } else {
    const { data: product, error } = await supabase
      .from("products")
      .select("id, price, is_active")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !product || !product.is_active) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại hoặc đã ngừng bán" }, { status: 404 });
    }
    subtotal = product.price;
    productId = product.id;
  }

  // Ap dung ma giam gia (neu co) - sai/het han/het luot thi tra loi ngay, khong tao don
  let validDiscountCode: string | null = null;
  let discountAmount = 0;
  if (discountCode) {
    const result = await validateDiscountCode(supabase, discountCode, subtotal);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    validDiscountCode = result.code;
    discountAmount = result.discountAmount;
  }
  const amount = subtotal - discountAmount;

  // Validate ma affiliate (neu co) - sai ma thi bo qua, khong chan don hang
  let validAffiliateCode: string | null = null;
  if (affiliateCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("code")
      .eq("code", affiliateCode)
      .maybeSingle();
    validAffiliateCode = affiliate?.code ?? null;
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

  const isFree = amount === 0;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_code: orderCode,
      product_id: productId,
      bundle_id: bundleId,
      customer_name: customerName,
      customer_email: customerEmail,
      amount,
      discount_code: validDiscountCode,
      discount_amount: discountAmount,
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

  if (validDiscountCode) {
    await incrementDiscountUsage(supabase, validDiscountCode);
  }

  // San pham/combo mien phi -> hoan tat va gui email ngay, khong can cho thanh toan
  if (isFree) {
    await fulfillOrder(supabase, order.id);
  }

  return NextResponse.json({ orderCode: order.order_code });
}
