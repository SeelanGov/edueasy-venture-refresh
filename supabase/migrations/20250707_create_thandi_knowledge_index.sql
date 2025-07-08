create table if not exists public.thandi_knowledge_index (
  id uuid primary key default gen_random_uuid(),
  module text not null unique,
  title text not null,
  tags text[] not null,
  source_links text[] not null,
  json_path text not null,
  html_path text not null
); 