# Hướng dẫn vận hành — không cần biết code

Tất cả thao tác dưới đây làm qua **Supabase Studio** (giao diện web quản lý
dữ liệu, giống Google Sheets nhưng cho database). Truy cập:

1. Vào https://supabase.com/dashboard/project/rwumfxqyhwluivyeunxq
2. Đăng nhập bằng tài khoản Supabase của bạn
3. Bên trái chọn **Table Editor** — đây là nơi bạn thao tác mọi thứ bên dưới

---

## 1. Đăng sản phẩm mới

1. Table Editor → chọn bảng **`products`**
2. Bấm **Insert** → **Insert row**
3. Điền các ô sau:

| Cột | Ý nghĩa | Ví dụ |
|---|---|---|
| `slug` | Đường dẫn URL, không dấu, không khoảng trắng, cách nhau bằng `-` | `mau-quan-ly-kho` |
| `name` | Tên sản phẩm hiển thị cho khách | `Mẫu quản lý kho hàng` |
| `description` | Mô tả chi tiết (có thể xuống dòng, dùng dấu `-` để tạo gạch đầu dòng) | xem cách viết ở các sản phẩm có sẵn để làm mẫu |
| `category` | Nhóm ngành — **phải gõ đúng 1 trong 10 mã này**: `personal-finance`, `accounting-b2b`, `project-management`, `hr-operations`, `marketing-sales`, `real-estate`, `ecommerce`, `event-wedding`, `education-coaching`, `fitness-health` | `ecommerce` |
| `price` | Giá bán, đơn vị VNĐ, chỉ nhập số nguyên (không dấu chấm/phẩy) | `299000` |
| `preview_images` | Danh sách ảnh xem trước — bấm vào ô, thêm từng dòng 1 link ảnh | xem mục 1b bên dưới |
| `file_path` | Tên file trong kho lưu trữ (xem mục 1c) | `mau-quan-ly-kho.xlsx` |
| `is_active` | Bật `true` để sản phẩm hiển thị công khai, `false` để ẩn/ngừng bán | `true` |
| `video_url` | (không bắt buộc) link YouTube hướng dẫn | để trống nếu chưa có |
| `compare_at_price` | (không bắt buộc) giá gốc trước giảm — điền để hiện giá gạch ngang + badge Sale | để trống nếu không khuyến mãi |

4. Bấm **Save**

### 1b. Thêm ảnh sản phẩm
Cách đơn giản nhất: upload ảnh lên Supabase Storage rồi copy link.
1. Bên trái chọn **Storage** → bucket **`product-files`**
2. Upload ảnh (kéo thả file vào)
3. Bấm vào file vừa upload → **Copy URL**
4. Dán link đó vào cột `preview_images` của sản phẩm (có thể thêm nhiều ảnh, mỗi ảnh 1 dòng)

### 1c. Upload file sản phẩm thật (file khách sẽ tải về)
1. Storage → bucket **`product-files`** → **Upload file**
2. Đặt tên file trùng khớp với giá trị bạn điền ở cột `file_path`
3. **Không cần** để bucket này public — hệ thống tự tạo link tải có hạn khi khách mua hàng

---

## 2. Sửa giá / đặt giá khuyến mãi

1. Table Editor → bảng `products` → tìm dòng sản phẩm cần sửa
2. Bấm trực tiếp vào ô `price` → sửa giá bán mới → Enter
3. Muốn hiện giá khuyến mãi (giá gốc gạch ngang + badge "-X%"):
   - Điền `compare_at_price` = giá gốc (cao hơn `price`)
   - Điền `price` = giá đang bán
   - Ví dụ: `compare_at_price = 499000`, `price = 399000` → web tự hiện "499.000đ ~~gạch ngang~~ 399.000đ -20%"
   - Muốn bỏ khuyến mãi: xoá giá trị ở `compare_at_price` (để trống/null)

---

## 3. Thêm mã giảm giá

1. Table Editor → bảng **`discount_codes`** → **Insert row**
2. Điền:

| Cột | Ý nghĩa | Ví dụ |
|---|---|---|
| `code` | Mã khách sẽ nhập lúc checkout (viết hoa) | `SALE20` |
| `type` | `percent` (giảm theo %) hoặc `fixed` (giảm số tiền cố định) | `percent` |
| `value` | Số giảm — nếu `type=percent` thì từ 1-100 (vd 20 = giảm 20%), nếu `type=fixed` thì là số tiền VNĐ (vd 50000) | `20` |
| `max_uses` | Giới hạn số lượt dùng — để trống = không giới hạn | `100` |
| `min_order_amount` | Đơn tối thiểu để áp dụng mã — để trống = không yêu cầu | `200000` |
| `expires_at` | Ngày hết hạn (định dạng `2026-12-31 23:59:59+07`) — để trống = không hết hạn | |
| `is_active` | `true` = đang áp dụng, `false` = tạm ngừng mã (không cần xoá) | `true` |

3. Bấm **Save** — mã có hiệu lực ngay, khách nhập được luôn lúc checkout

**Tắt 1 mã đang chạy:** sửa `is_active` thành `false` (không cần xoá dòng, có thể bật lại sau).

---

## 4. Tạo combo mới

1. Table Editor → bảng **`bundles`** → **Insert row**
2. Điền `slug`, `name`, `description`, `price` (giá bán combo — thường thấp hơn tổng giá lẻ)
3. Cột `product_ids`: danh sách ID của các sản phẩm muốn gộp vào combo
   - Lấy ID: vào bảng `products`, tìm sản phẩm, copy giá trị cột `id` (dạng chuỗi dài `xxxx-xxxx-...`)
   - Điền các ID này vào `product_ids`, mỗi ID 1 dòng
4. `preview_images`, `is_active` làm giống mục 1

---

## 5. Duyệt đánh giá sản phẩm

Khách gửi đánh giá (sao + nhận xét) ở trang chi tiết sản phẩm, nhưng đánh
giá **chưa hiển thị công khai ngay** — cần bạn duyệt để tránh spam.

1. Table Editor → bảng **`product_reviews`**
2. Các đánh giá mới có cột `is_approved` = `false`
3. Đọc nội dung ở cột `comment`, nếu hợp lệ thì bấm vào ô `is_approved` → đổi thành `true` → Enter
4. Đánh giá sẽ hiện công khai trên trang sản phẩm trong ít phút (do cache ~60 giây)

Muốn ẩn 1 đánh giá đã duyệt (vd phát hiện nội dung không phù hợp): đổi lại `is_approved` = `false`, hoặc xoá hẳn dòng đó.

---

## 6. Xem đơn hàng / doanh thu

Table Editor → bảng **`orders`** — mỗi dòng là 1 đơn hàng, cột `status` = `paid` là đơn đã thanh toán thành công.

Muốn xem đơn nào dùng mã giảm giá nào: lọc theo cột `discount_code`.
Muốn xem đơn nào đến từ affiliate nào: lọc theo cột `affiliate_code`.

---

## Lưu ý chung
- Mọi thay đổi trong Supabase Studio có hiệu lực **gần như ngay lập tức** trên web (tối đa ~60 giây do cache).
- Nếu gõ sai `category` (không đúng 1 trong 10 mã ở mục 1), sản phẩm vẫn lưu được nhưng có thể hiển thị sai icon/nhóm — kiểm tra lại chính tả.
- Nếu cần thao tác gì phức tạp hơn (đổi cấu trúc, thêm tính năng mới), quay lại nhờ Claude — không tự sửa các bảng khác ngoài `products`, `bundles`, `discount_codes` để tránh ảnh hưởng luồng thanh toán.
