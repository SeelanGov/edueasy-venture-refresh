create table if not exists public.marketing_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  grade text,
  consent boolean not null,
  consent_timestamp timestamptz not null default now(),
  source text not null default 'landing',
  utm jsonb not null default '{}'::jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketing_leads enable row level security;

-- No anon insert policies; insert via service-role only (Edge Function);