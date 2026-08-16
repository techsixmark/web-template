-- 0005_cart.sql
-- Gio hang: cho phep 1 don hang chua nhieu san pham le (khac voi bundle da
-- dong goi san). orders.product_id/bundle_id co the deu null khi don la
-- gio hang -> danh sach san pham lay tu bang order_items.

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  product_id uuid not null references products(id),
  price integer not null check (price >= 0), -- gia tai thoi diem mua
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on order_items(order_id);

alter table order_items enable row level security;
-- Khong tao policy public: chi service_role doc/ghi duoc, giong cac bang
-- orders/payment_transactions/download_tokens/email_logs.

-- Noi long rang buoc: don gio hang co the khong gan product_id lan bundle_id
-- (danh sach san pham nam o order_items thay vi 1 truong duy nhat).
alter table orders drop constraint if exists orders_product_or_bundle_check;
alter table orders add constraint orders_product_or_bundle_check
  check (num_nonnulls(product_id, bundle_id) <= 1);
