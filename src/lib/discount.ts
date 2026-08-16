import { createServiceSupabaseClient } from "@/lib/supabase";

export type DiscountValidationResult =
  | { ok: true; code: string; discountAmount: number }
  | { ok: false; error: string };

/**
 * Kiểm tra 1 mã giảm giá có áp dụng được cho đơn hàng giá trị `subtotal`
 * (VNĐ, trước khi giảm) hay không. Không tăng `used_count` ở đây — chỉ tăng
 * sau khi đơn hàng thực sự được tạo thành công (tránh đếm nhầm khi request
 * lỗi giữa chừng).
 */
export async function validateDiscountCode(
  supabase: ReturnType<typeof createServiceSupabaseClient>,
  rawCode: string,
  subtotal: number
): Promise<DiscountValidationResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Vui lòng nhập mã giảm giá" };

  const { data: discount, error } = await supabase
    .from("discount_codes")
    .select("code, type, value, max_uses, used_count, min_order_amount, expires_at, is_active")
    .eq("code", code)
    .maybeSingle();

  if (error || !discount || !discount.is_active) {
    return { ok: false, error: "Mã giảm giá không tồn tại hoặc đã ngừng áp dụng" };
  }
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
    return { ok: false, error: "Mã giảm giá đã hết hạn" };
  }
  if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
    return { ok: false, error: "Mã giảm giá đã hết lượt sử dụng" };
  }
  if (discount.min_order_amount !== null && subtotal < discount.min_order_amount) {
    return {
      ok: false,
      error: `Đơn hàng cần tối thiểu ${discount.min_order_amount.toLocaleString("vi-VN")} đ để áp dụng mã này`,
    };
  }

  const rawDiscount =
    discount.type === "percent" ? Math.round((subtotal * discount.value) / 100) : discount.value;
  const discountAmount = Math.min(rawDiscount, subtotal);

  return { ok: true, code: discount.code, discountAmount };
}

/**
 * Tăng used_count sau khi đơn hàng áp dụng mã đã được tạo thành công. Dùng
 * RPC tăng nguyên tử để tránh race condition khi nhiều khách cùng dùng 1 mã
 * cùng lúc (thay vì đọc rồi ghi lại — có thể mất lượt tăng khi trùng thời điểm).
 */
export async function incrementDiscountUsage(
  supabase: ReturnType<typeof createServiceSupabaseClient>,
  code: string
): Promise<void> {
  const { error } = await supabase.rpc("increment_discount_usage", { p_code: code });
  if (error) console.error("incrementDiscountUsage error:", error.message);
}
