-- MyLittleQuest — Supabase Schema
-- Run this in the Supabase SQL editor to initialize the database.
-- Wipe-and-recreate order: missions, badges, daily_quests, progress, players

-- ─────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'CloudHero',
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  streak_freeze_count integer default 0,
  last_played_date date,
  xp_boost_active boolean default false,
  xp_boost_expires timestamptz,
  created_at timestamptz default now()
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  cert_id text not null,
  module_id integer not null default 0,
  question_id text not null,
  correct boolean not null,
  time_ms integer,
  answered_at timestamptz default now()
);

create table if not exists daily_quests (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  cert_id text not null,
  quest_type text not null,
  quest_data jsonb not null default '{}',
  date date not null,
  completed boolean default false,
  reward_claimed boolean default false,
  unique(player_id, cert_id, date)
);

create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  badge_id text not null,
  rarity text check (rarity in ('common','rare','epic')) not null,
  earned_at timestamptz default now(),
  unique(player_id, badge_id)
);

create table if not exists missions (
  mission_id text not null,
  player_id uuid references players(id) on delete cascade,
  cert_id text not null,
  completed boolean default false,
  reward_claimed boolean default false,
  completed_at timestamptz,
  claimed_at timestamptz,
  primary key (mission_id, player_id, cert_id)
);

-- ─────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────

create index if not exists idx_progress_player_cert        on progress(player_id, cert_id);
create index if not exists idx_progress_player_cert_module on progress(player_id, cert_id, module_id);
create index if not exists idx_daily_quests_player         on daily_quests(player_id, cert_id, date);
create index if not exists idx_missions_player             on missions(player_id, cert_id);

-- ─────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────

alter table players      enable row level security;
alter table progress     enable row level security;
alter table daily_quests enable row level security;
alter table badges       enable row level security;
alter table missions     enable row level security;

create policy "own player"   on players      for all using (auth.uid() = id);
create policy "own progress" on progress     for all using (auth.uid() = player_id);
create policy "own quests"   on daily_quests for all using (auth.uid() = player_id);
create policy "own badges"   on badges       for all using (auth.uid() = player_id);
create policy "own missions" on missions     for all using (auth.uid() = player_id);

-- ─────────────────────────────────────────────────────────
-- Leaderboard view (public read, no PII beyond name)
-- ─────────────────────────────────────────────────────────

create or replace view public_leaderboard as
  select name, xp, level, streak
  from players
  order by xp desc
  limit 100;

grant select on public_leaderboard to anon, authenticated;
