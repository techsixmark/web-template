@AGENTS.md

# CLAUDE.md — Web bán template (thị trường Việt Nam)

## Mô tả dự án
Website bán template số (Canva/Figma, PowerPoint/Word/Excel). Khách xem
catalog trên landing page, đặt hàng, chuyển khoản qua mã VietQR động, hệ
thống tự đối soát và **tự động gửi email kèm link tải** sau khi xác nhận đã
thanh toán — không cần người trực xác nhận thủ công.

Quyết định kiến trúc/công nghệ quan trọng: xem [docs/DECISIONS.md](docs/DECISIONS.md).

## Kiến trúc
- **Frontend/Backend:** Next.js 15 (App Router, TypeScript, Tailwind CSS),
  deploy trên Vercel.
- **Database + Storage:** Supabase (Postgres + Storage lưu file template gốc).
- **Thanh toán:** SePay — tạo mã VietQR riêng theo từng đơn, xác nhận qua
  webhook khi tiền về tài khoản ngân hàng.
- **Email:** Resend — gửi email tự động kèm link tải sau khi đơn được xác
  nhận thanh toán.

## Luồng nghiệp vụ
1. Khách xem catalog (`/`, `/san-pham/[slug]`) → chọn sản phẩm.
2. `/checkout`: nhập tên + email → tạo `orders` (status `pending`) + mã
   `order_code` duy nhất dùng làm nội dung chuyển khoản → hiển thị QR VietQR.
3. Khách chuyển khoản qua app ngân hàng.
4. SePay gọi `POST /api/webhook/sepay` khi phát hiện giao dịch vào tài khoản.
5. Webhook đối chiếu nội dung CK với `order_code` + số tiền → cập nhật
   `orders.status = 'paid'` → ghi `payment_transactions` → sinh
   `download_tokens` có hạn → gửi email qua Resend kèm link tải.
6. Khách bấm link trong email → `/download/[token]` kiểm tra hạn/lượt tải →
   trả file từ Supabase Storage.

## Cấu trúc thư mục
```
src/app/            Next.js App Router: landing, /san-pham, /checkout,
                     /download/[token], /api/webhook/sepay
src/components/      React components dùng chung
src/lib/             supabase.ts, sepay.ts, email.ts — client & helper
supabase/migrations/ SQL migration, nguồn sự thật cho schema DB
docs/DECISIONS.md    Bảng quyết định kiến trúc/quy trình
tests/               Test
```

## Database (Supabase)
`products` · `orders` · `payment_transactions` · `download_tokens` ·
`email_logs` — định nghĩa đầy đủ tại
[supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql).

RLS: `products` cho phép đọc công khai sản phẩm `is_active = true`; 4 bảng
còn lại khoá hoàn toàn với anon/authenticated, chỉ server (service role key)
mới truy cập được — không bao giờ dùng service role key ở phía client.

## Quản trị sản phẩm
Giai đoạn đầu: thêm/sửa sản phẩm trực tiếp qua Supabase Studio (bảng
`products` + upload file vào bucket `product-files`). Chưa có trang admin
riêng (xem [docs/DECISIONS.md](docs/DECISIONS.md)).

## Biến môi trường (`.env.local`, xem `.env.example`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # chỉ dùng server-side (API routes)
SEPAY_WEBHOOK_API_KEY=            # xác thực request webhook từ SePay
BANK_ACCOUNT_NUMBER=
BANK_ACCOUNT_NAME=
BANK_NAME_CODE=                   # mã ngân hàng theo chuẩn VietQR (napas code)
RESEND_API_KEY=
EMAIL_FROM=
```

## Lệnh thường dùng
```bash
npm run dev      # chạy dev server
npm run build    # build production
npm run lint      # kiểm tra lint
```

## Quy ước code
- TypeScript strict, không dùng `any` khi tránh được.
- Toàn bộ thao tác nhạy cảm (tạo đơn, xác nhận thanh toán, sinh link tải)
  chạy ở server (Route Handler), không expose service role key ra client.
- Tiền tệ lưu dạng số nguyên VNĐ (không dùng số thập phân).
- Tên biến/hàm/comment kỹ thuật: tiếng Anh. Nội dung hiển thị cho khách
  (UI text, email): tiếng Việt.
