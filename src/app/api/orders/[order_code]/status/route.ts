import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ order_code: string }> }
) {
  const { order_code } = await params;

  try {
    const supabase = createServiceSupabaseClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("status")
      .eq("order_code", order_code)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    return NextResponse.json({ status: order.status });
  } catch (err) {
    console.error("GET order status error:", err);
    return NextResponse.json({ error: "Có lỗi xảy ra, vui lòng thử lại" }, { status: 500 });
  }
}
