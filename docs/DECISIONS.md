# Quyết định dự án — Web bán template

| Ngày | Quyết định | Lý do / đánh đổi | Trạng thái |
|---|---|---|---|
| 2026-08-17 | Sản phẩm bán: template Canva/Figma + template Office (PPT/Word/Excel) | Theo yêu cầu ban đầu của chủ shop | Đã áp dụng |
| 2026-08-17 | Xác nhận thanh toán chuyển khoản tự động qua VietQR + webhook, không xác nhận thủ công | Muốn giao hàng (email) ngay không cần trực canh chuyển khoản | Đã áp dụng |
| 2026-08-17 | Chọn Next.js + Supabase + Vercel thay vì WordPress/WooCommerce hoặc Ladipage SaaS | Hosting hiện có là JAMstack (Vercel/Netlify-kiểu), không chạy được PHP nên WordPress không khả thi; Ladipage phát sinh thêm subscription mới ngoài hạ tầng đã có. Next.js + Supabase tận dụng đúng Vercel + domain sẵn có, chi phí thấp hơn; Claude phụ trách toàn bộ code, chủ shop không cần biết code | Đã áp dụng |
| 2026-08-17 | Chọn SePay làm cổng đối soát VietQR tự động | Có SDK/plugin sẵn, tích hợp webhook nhanh, hỗ trợ 12+ ngân hàng | Đã áp dụng |
| 2026-08-17 | Giai đoạn đầu quản trị sản phẩm trực tiếp qua Supabase Studio, chưa làm trang admin riêng | Giảm khối lượng code ban đầu, đủ dùng khi số lượng sản phẩm còn ít | Đã áp dụng |
| 2026-08-17 | Dùng Supabase project `web-tempalte` (ref `rwumfxqyhwluivyeunxq`, org riêng) do chủ shop tự tạo, thay vì tạo project mới trong org Sixmark | Org Sixmark đã đạt giới hạn 2 project miễn phí (`solo-biz`, `Autopost`); tạo project ở org khác tránh phải pause/upgrade project đang dùng | Đã áp dụng |

| 2026-08-17 | Đổi `products.category` từ loại file (canva/figma/ppt/word/excel) sang 10 nhóm ngành (personal-finance, accounting-b2b, project-management, hr-operations, marketing-sales, real-estate, ecommerce, event-wedding, education-coaching, fitness-health) theo chiến lược SEO/nội dung; thêm cột `monetization_strategy` (nội bộ) ghi chú chiến lược khai thác từng sản phẩm | Bám sát bảng chiến lược ngành do chủ shop cung cấp, mỗi nhóm nhắm 1 từ khoá SEO + đối tượng khách riêng | Đã áp dụng |
| 2026-08-17 | Chưa build cơ chế freemium (tặng bản Basic đổi email), combo/bundle, hay affiliate dù bảng chiến lược có đề cập | Khối lượng code lớn, cần thiết kế lại luồng thanh toán/email riêng; ưu tiên có catalog đúng cấu trúc trước, các cơ chế này để làm ở giai đoạn sau (đã ghi chú trong `monetization_strategy` từng sản phẩm để tra lại) | Việc tương lai |

> Cập nhật bảng này mỗi khi có quyết định kiến trúc/công nghệ/quy trình đáng chú ý — kể cả khi sau này đổi ý (thêm dòng mới, không xoá dòng cũ).
