-- 0003_freemium_bundle_affiliate.sql
-- Bo sung ha tang cho 3 co che khai thac: freemium (lead magnet), combo/bundle,
-- affiliate. Khong build UI quan tri rieng o migration nay, chi data model +
-- rang buoc can thiet.

-- ============ products: lien ket Basic (mien phi) <-> Pro (tra phi) ============
alter table products add column if not exists related_product_id uuid references products(id);

-- ============ bundles (combo nhieu san pham) ============
create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price integer not null check (price >= 0),
  product_ids uuid[] not null,
  preview_images text[] not null default '{}',
  is_active boolean not null default true,
  monetization_strategy text,
  created_at timestamptz not null default now()
);

alter table bundles enable row level security;

create policy "Cong khai xem combo dang active"
  on bundles for select
  to anon, authenticated
  using (is_active = true);

-- ============ affiliates (chi phuc vu doi soat hoa hong, khong lo public) ============
create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  commission_rate numeric(4,2) not null default 0.20 check (commission_rate >= 0 and commission_rate <= 1),
  created_at timestamptz not null default now()
);

alter table affiliates enable row level security;
-- Khong tao policy public nao: chi service_role doc/ghi duoc.

-- ============ orders: ho tro mua bundle + gan affiliate ============
alter table orders alter column product_id drop not null;
alter table orders add column if not exists bundle_id uuid references bundles(id);
alter table orders add column if not exists affiliate_code text references affiliates(code);

alter table orders drop constraint if exists orders_product_or_bundle_check;
alter table orders add constraint orders_product_or_bundle_check
  check (num_nonnulls(product_id, bundle_id) = 1);

-- ============ download_tokens: gan truc tiep product_id (khong suy tu order) ============
-- Cho phep 1 order (vd mua combo) sinh nhieu download_tokens, moi token ung
-- voi 1 file san pham cu the.
alter table download_tokens add column if not exists product_id uuid references products(id);

-- ============ seed: freemium (Basic mien phi -> Pro tra phi) ============
update products
set name = 'Ultimate Personal Finance Dashboard — Pro',
    description = 'Bản đầy đủ: biểu đồ động, dashboard tự cập nhật, mục tiêu tiết kiệm đa kỳ hạn. Nâng cấp từ bản Basic miễn phí.',
    monetization_strategy = 'Upsell: bán cho người đã dùng bản Basic miễn phí, giá 5-10 USD.'
where slug = 'ultimate-personal-finance-dashboard';

insert into products (slug, name, description, category, price, preview_images, file_path, is_active, monetization_strategy, related_product_id)
select
  'ultimate-personal-finance-dashboard-basic',
  'Ultimate Personal Finance Dashboard — Basic (Miễn phí)',
  'Bảng theo dõi thu chi cơ bản trên Google Sheets, tặng miễn phí để bạn dùng thử trước khi nâng cấp bản Pro.',
  'personal-finance', 0,
  array['https://placehold.co/600x450?text=Personal+Finance+Basic+Free'],
  'ultimate-personal-finance-dashboard-basic.xlsx', true,
  'Phễu mối nhử (Lead Magnet): tặng miễn phí để thu Email, dẫn khách sang mua bản Pro.',
  id
from products where slug = 'ultimate-personal-finance-dashboard'
on conflict (slug) do nothing;

update products set related_product_id = (select id from products where slug = 'ultimate-personal-finance-dashboard-basic')
where slug = 'ultimate-personal-finance-dashboard';

-- ============ seed: combo Marketing & Sales ============
insert into bundles (slug, name, description, price, product_ids, preview_images, is_active, monetization_strategy)
select
  'combo-kinh-doanh-cho-sme',
  'Combo Kinh doanh cho SME',
  'Trọn bộ 2 template: Mini CRM & Sales Pipeline + Automated Invoice & Client Tracker. Mua chung tiết kiệm hơn mua lẻ.',
  599000,
  array[
    (select id from products where slug = 'mini-crm-sales-pipeline'),
    (select id from products where slug = 'automated-invoice-client-tracker')
  ],
  array['https://placehold.co/600x450?text=Combo+Kinh+Doanh+SME'],
  true,
  'Gói combo (Bundle): bán chung 2 template Marketing/Sales + Kế toán cho Startup/SME, giá 599.000đ (rẻ hơn ~20% so với mua lẻ 748.000đ).'
where not exists (select 1 from bundles where slug = 'combo-kinh-doanh-cho-sme');

-- ============ seed: affiliate mau cho nhom Fitness ============
insert into affiliates (code, name, commission_rate)
values ('FITBLOG01', 'Fitness Blogger Partner (mẫu)', 0.20)
on conflict (code) do nothing;
