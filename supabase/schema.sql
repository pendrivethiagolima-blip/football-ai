create extension if not exists "pgcrypto";

create table if not exists jogos (
  id uuid primary key default gen_random_uuid(),
  home text not null,
  away text not null,
  ts timestamptz default now()
);

create table if not exists analises_ia (
  id uuid primary key default gen_random_uuid(),
  jogo_id uuid references jogos(id),
  previsao_ia jsonb,
  accuracy real,
  timestamp timestamptz default now()
);

create index if not exists idx_analises_ia_jogo on analises_ia(jogo_id);

create table if not exists live_samples (
  id uuid primary key default gen_random_uuid(),
  jogo_id uuid references jogos(id),
  payload jsonb,
  ts timestamptz default now()
);


