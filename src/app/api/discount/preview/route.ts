import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { validateDiscountCode } from "@/lib/discount";

const PreviewSchema = z.object({
  code: z.string().min(1),
  target: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("product"), slug: z.string().min(1) }),
    z.object({ kind: z.literal("bundle"), slug: z.string().min(1) }),
    z.object({ kind: z.literal("cart"), slugs: z.array(z.string().min(1)).min(1) }),
  ]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PreviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const { code, target } = parsed.data;

  let supabase: ReturnType<typeof createServiceSupabaseClient>;
  try {
    supabase = createServiceSupabaseClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Máy chủ chưa được cấu hình đầy đủ" }, { status: 500 });
  }

  let subtotal = 0;
  if (target.kind === "product") {
    const { data } = await supabase
      .from("products")
      .select("price, is_active")
      .eq("slug", target.slug)
      .maybeSingle();
    if (!data || !data.is_active) {
      return NextResponse.json({ ok: false, error: "Sản phẩm không tồn tại" }, { status: 404 });
    }
    subtotal = data.price;
  } else if (target.kind === "bundle") {
    const { data } = await supabase
      .from("bundles")
      .select("price, is_active")
      .eq("slug", target.slug)
      .maybeSingle();
    if (!data || !data.is_active) {
      return NextResponse.json({ ok: false, error: "Combo không tồn tại" }, { status: 404 });
    }
    subtotal = data.price;
  } else {
    const { data } = await supabase
      .from("products")
      .select("price, is_active, slug")
      .in("slug", target.slugs);
    const missing = target.slugs.filter((s) => !data?.some((p) => p.slug === s && p.is_active));
    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Một số sản phẩm trong giỏ không còn hợp lệ" },
        { status: 404 }
      );
    }
    subtotal = (data ?? []).reduce((sum, p) => sum + p.price, 0);
  }

  const result = await validateDiscountCode(supabase, code, subtotal);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    code: result.code,
    subtotal,
    discountAmount: result.discountAmount,
    total: subtotal - result.discountAmount,
  });
}
