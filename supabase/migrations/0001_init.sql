-- 0001_init.sql
-- Schema khoi tao cho web ban template: products, orders, payment_transactions,
-- download_tokens, email_logs.

create extension if not exists pgcrypto;

-- ============ products ============
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null, -- 'canva' | 'figma' | 'powerpoint' | 'word' | 'excel'
  price integer not null check (price >= 0), -- VND, so nguyen
  preview_images text[] not null default '{}',
  file_path text not null, -- duong dan file trong Supabase Storage (bucket 'product-files')
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ orders ============
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique, -- vd: DH2A9F3K, dung lam noi dung chuyen khoan
  product_id uuid not null references products(id),
  customer_name text not null,
  customer_email text not null,
  amount integer not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending','paid','expired','cancelled')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_orders_order_code on orders(order_code);
create index if not exists idx_orders_status on orders(status);

-- ============ payment_transactions ============
-- Luu lai moi giao dich webhook SePay gui ve, dung de doi soat va chong xu ly trung
create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  sepay_transaction_id text not null unique,
  amount integer not null,
  transaction_content text,
  raw_payload jsonb not null,
  received_at timestamptz not null default now()
);

-- ============ download_tokens ============
-- Link tai file co han, sinh ra sau khi don hang duoc xac nhan da thanh toan
create table if not exists download_tokens (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  expires_at timestamptz not null,
  download_count integer not null default 0,
  last_downloaded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_download_tokens_token on download_tokens(token);

-- ============ email_logs ============
create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  email_to text not null,
  status text not null check (status in ('sent','failed')),
  provider_message_id text,
  error text,
  sent_at timestamptz not null default now()
);

-- ============ RLS ============
-- Mac dinh: khoa toan bo, chi service_role (server, dung service key) moi doc/ghi duoc
-- orders/payment_transactions/download_tokens/email_logs vi chua thong tin nhay cam.
-- Rieng 'products' cho phep khach (anon key) xem cac san pham dang active.

alter table products enable row level security;
alter table orders enable row level security;
alter table payment_transactions enable row level security;
alter table download_tokens enable row level security;
alter table email_logs enable row level security;

create policy "Cong khai xem san pham dang active"
  on products for select
  to anon, authenticated
  using (is_active = true);

-- Khong tao policy nao cho orders/payment_transactions/download_tokens/email_logs
-- => anon/authenticated khong truy cap duoc, chi service_role (bypass RLS) moi dung duoc.
