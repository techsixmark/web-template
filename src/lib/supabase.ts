import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client dùng ở browser / Server Component đọc dữ liệu công khai (vd danh
 * sách sản phẩm). Chỉ có quyền theo RLS của role "anon".
 */
export function createBrowserSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Client dùng trong Route Handler (server) để tạo đơn hàng, xử lý webhook,
 * sinh download token... Bỏ qua RLS (service role) — KHÔNG bao giờ import
 * file này vào code chạy ở client.
 */
export function createServiceSupabaseClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Thiếu SUPABASE_SERVICE_ROLE_KEY trong biến môi trường");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
