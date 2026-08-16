-- 0008_product_reviews.sql
-- Danh gia/binh luan san pham. Khach gui qua API (khong insert truc tiep tu
-- client) de server validate; danh gia can duyet (is_approved) truoc khi
-- hien thi cong khai, tranh spam/noi dung xau ngay lap tuc.

create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_reviews_product_id on product_reviews(product_id);

alter table product_reviews enable row level security;

create policy "Cong khai xem danh gia da duyet"
  on product_reviews for select
  to anon, authenticated
  using (is_approved = true);

-- Khong tao policy insert cho anon: viec gui danh gia di qua API (service
-- role) de validate rating/do dai comment, tranh spam truc tiep vao DB.
