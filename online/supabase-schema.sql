-- MyLittleQuest — Supabase Schema
-- Run this in the Supabase SQL editor to initialize the database.

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Adventurer',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  "streakFreezeCount" INTEGER NOT NULL DEFAULT 0,
  "lastPlayedDate" DATE,
  "xpBoostActive" BOOLEAN NOT NULL DEFAULT FALSE,
  "xpBoostExpires" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  "playerId" UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  "certId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  "timeMs" INTEGER NOT NULL,
  "answeredAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_quests (
  id TEXT PRIMARY KEY,
  "playerId" UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  "certId" TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  "targetN" INTEGER,
  "targetPct" INTEGER,
  "targetModuleId" INTEGER,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  "completedAt" TIMESTAMPTZ,
  reward JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_answers_player_cert ON answers("playerId", "certId");
CREATE INDEX IF NOT EXISTS idx_daily_quests_player ON daily_quests("playerId", "certId", date);

-- Row-level security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "players_self" ON players
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "answers_self" ON answers
  FOR ALL USING (auth.uid() = "playerId");

CREATE POLICY "daily_quests_self" ON daily_quests
  FOR ALL USING (auth.uid() = "playerId");

-- Leaderboard view (read-only, no PII beyond name)
CREATE OR REPLACE VIEW leaderboard AS
  SELECT name, xp, level, streak FROM players
  ORDER BY xp DESC;

GRANT SELECT ON leaderboard TO anon, authenticated;
