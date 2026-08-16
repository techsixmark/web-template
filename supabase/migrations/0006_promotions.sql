-- 0006_promotions.sql
-- Gia khuyen mai (compare_at_price) + ma giam gia (discount_codes) ap dung
-- luc checkout cho ca san pham le, combo, va gio hang.

alter table products add column if not exists compare_at_price integer check (compare_at_price is null or compare_at_price >= 0);
alter table bundles add column if not exists compare_at_price integer check (compare_at_price is null or compare_at_price >= 0);

create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percent', 'fixed')),
  value integer not null check (value > 0),
  max_uses integer check (max_uses is null or max_uses > 0),
  used_count integer not null default 0,
  min_order_amount integer check (min_order_amount is null or min_order_amount >= 0),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint discount_codes_value_range check (
    (type = 'percent' and value between 1 and 100) or (type = 'fixed' and value > 0)
  )
);

alter table discount_codes enable row level security;
-- Khong tao policy public: chi service_role (server) doc/ghi duoc, tranh lo
-- danh sach ma giam gia ra ngoai (anon khong liet ke duoc ma nao dang chay).

alter table orders add column if not exists discount_code text references discount_codes(code);
alter table orders add column if not exists discount_amount integer not null default 0;

-- Tang used_count nguyen tu (tranh race condition khi nhieu khach cung dung
-- 1 ma cung luc). SECURITY DEFINER de chay duoc voi quyen bang du service_role.
create or replace function increment_discount_usage(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update discount_codes set used_count = used_count + 1 where code = p_code;
$$;

-- ============ seed: gia khuyen mai demo ============
update products set compare_at_price = 499000, price = 399000 where slug = 'agile-scrum-project-manager';
update products set compare_at_price = 349000, price = 279000 where slug = 'automated-invoice-client-tracker';

-- ============ seed: ma giam gia mau ============
insert into discount_codes (code, type, value, max_uses, min_order_amount, expires_at, is_active)
values
  ('CHAOMUNG10', 'percent', 10, null, null, null, true),
  ('GIAM50K', 'fixed', 50000, 100, 200000, '2026-12-31 23:59:59+07', true)
on conflict (code) do nothing;
