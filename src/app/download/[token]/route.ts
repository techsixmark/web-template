import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";

const SIGNED_URL_TTL_SECONDS = 60; // link ký tạm thời từ Storage, chỉ để redirect ngay

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceSupabaseClient();

  const { data: downloadToken } = await supabase
    .from("download_tokens")
    .select("id, expires_at, download_count, products(file_path)")
    .eq("token", token)
    .maybeSingle();

  if (!downloadToken) {
    return NextResponse.json({ error: "Link tải không tồn tại" }, { status: 404 });
  }
  if (new Date(downloadToken.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Link tải đã hết hạn. Vui lòng liên hệ để được cấp lại." },
      { status: 410 }
    );
  }

  const productInfo = Array.isArray(downloadToken.products)
    ? downloadToken.products[0]
    : downloadToken.products;
  const filePath = productInfo?.file_path;

  if (!filePath) {
    return NextResponse.json({ error: "Không tìm thấy file sản phẩm" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("product-files")
    .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS, { download: true });

  if (signError || !signed) {
    return NextResponse.json({ error: "Không tạo được link tải, vui lòng thử lại" }, { status: 500 });
  }

  await supabase
    .from("download_tokens")
    .update({
      download_count: downloadToken.download_count + 1,
      last_downloaded_at: new Date().toISOString(),
    })
    .eq("id", downloadToken.id);

  return NextResponse.redirect(signed.signedUrl);
}
