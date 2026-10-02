-- Optional production persistence schema for the Exovia CRM.
-- The current website works locally with browser storage; this schema is the next step for shared multi-device data.
create table if not exists public.exovia_leads (
  id text primary key, created_at timestamptz not null default now(), source text, status text,
  name text not null, phone text, event_type text, city text, message text
);
create table if not exists public.exovia_vendors (
  id text primary key, created_at timestamptz not null default now(), status text,
  name text not null, phone text, business text, category text, city text, event text,
  location text, package_name text, notes text, payment_file text
);
create table if not exists public.exovia_customers (
  id text primary key, created_at timestamptz not null default now(), status text,
  name text not null, phone text, interest text, category text, city text, event text,
  location text, registration text, notes text
);
create table if not exists public.exovia_events (
  id text primary key, created_at timestamptz not null default now(), name text not null,
  type text, date text, city text, venue text, status text, capacity text, notes text
);
create table if not exists public.exovia_payments (
  id text primary key, created_at timestamptz not null default now(), party text, type text,
  amount numeric default 0, status text, reference text, notes text
);
create table if not exists public.exovia_tasks (
  id text primary key, created_at timestamptz not null default now(), title text not null,
  owner text, due text, status text, priority text
);
-- Before using a hosted database, configure authentication and RLS policies appropriate to your team.
