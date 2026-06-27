create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default '新進' check (status in ('新進', '已聯繫', '已完成')),
  name text not null,
  phone text not null,
  line_id text,
  contact_time text,
  consent boolean not null default false,
  age_group text not null,
  retirement_age text not null,
  monthly_budget text not null,
  income_sources jsonb not null default '[]'::jsonb,
  concern text not null,
  result_type text not null,
  result_title text not null,
  result_summary text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

alter table public.leads enable row level security;

-- No public policies by design.
-- The server route uses the Supabase service_role key, which bypasses RLS.
-- Do not create anonymous SELECT/UPDATE/DELETE policies.

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
