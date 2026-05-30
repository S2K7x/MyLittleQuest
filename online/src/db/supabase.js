/**
 * Supabase DB adapter — mirrors the interface of local/src/db/sqlite.js
 *
 * Dual-context design:
 *   Browser (React app): call init(supabase) once, then call functions without the client arg.
 *   Vercel API functions: pass a per-request authenticated client as the last argument.
 */

import xpEngine    from '../../../shared/engine/xp.js';
import streakEngine from '../../../shared/engine/streak.js';
import lootEngine  from '../../../shared/engine/loot.js';
import questEngine from '../../../shared/engine/quests.js';

const { calculateXP, getLevelFromXP } = xpEngine;
const { incrementStreak } = streakEngine;
const { shouldTriggerLoot, rollLoot, applyLoot } = lootEngine;
const { MISSIONS, checkMissionCompletion } = questEngine;

// Global client (set once by the React app on mount)
let _client = null;

export function init(supabaseClient) {
  _client = supabaseClient;
}

// Use passed client or fall back to global
function c(override) {
  const client = override || _client;
  if (!client) throw new Error('Supabase client not initialized. Call init() or pass a client.');
  return client;
}

// ── Field mapping helpers ─────────────────────────────────

function mapPlayerFromDB(row) {
  if (!row) return null;
  return {
    id:                row.id,
    name:              row.name,
    xp:                row.xp,
    level:             row.level,
    streak:            row.streak,
    streakFreezeCount: row.streak_freeze_count,
    lastPlayedDate:    row.last_played_date,
    xpBoostActive:     row.xp_boost_active,
    xpBoostExpires:    row.xp_boost_expires
  };
}

function mapPlayerToDB(player) {
  const out = {};
  if (player.name              !== undefined) out.name               = player.name;
  if (player.xp                !== undefined) out.xp                 = player.xp;
  if (player.level             !== undefined) out.level              = player.level;
  if (player.streak            !== undefined) out.streak             = player.streak;
  if (player.streakFreezeCount !== undefined) out.streak_freeze_count = player.streakFreezeCount;
  if (player.lastPlayedDate    !== undefined) out.last_played_date   = player.lastPlayedDate;
  if (player.xpBoostActive     !== undefined) out.xp_boost_active    = player.xpBoostActive;
  if (player.xpBoostExpires    !== undefined) out.xp_boost_expires   = player.xpBoostExpires;
  return out;
}

// ── Player ────────────────────────────────────────────────

export async function getPlayer(playerId, supabase) {
  const { data, error } = await c(supabase)
    .from('players')
    .select('*')
    .eq('id', playerId)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    // Auto-create player row on first call (anon user just signed in)
    const { data: created, error: createErr } = await c(supabase)
      .from('players')
      .insert({ id: playerId, name: 'CloudHero' })
      .select()
      .single();
    if (createErr) throw createErr;
    return mapPlayerFromDB(created);
  }

  return mapPlayerFromDB(data);
}

export async function updatePlayer(playerId, fields, supabase) {
  const { data, error } = await c(supabase)
    .from('players')
    .update(mapPlayerToDB(fields))
    .eq('id', playerId)
    .select()
    .single();
  if (error) throw error;
  return mapPlayerFromDB(data);
}

// ── Progress ──────────────────────────────────────────────

export async function getProgress(playerId, certId, supabase) {
  const { data, error } = await c(supabase)
    .from('progress')
    .select('question_id, module_id, correct, time_ms, answered_at')
    .eq('player_id', playerId)
    .eq('cert_id', certId)
    .order('answered_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(r => ({
    questionId: r.question_id,
    moduleId:   r.module_id,
    correct:    r.correct,
    timeMs:     r.time_ms,
    answeredAt: r.answered_at
  }));
}

// ── Answer + XP ───────────────────────────────────────────

export async function saveAnswer(playerId, certId, questionId, moduleId, correct, timeMs, supabase) {
  const sc = c(supabase);
  const player = await getPlayer(playerId, sc);
  if (!player) throw new Error(`Player not found: ${playerId}`);

  const today = new Date().toISOString().split('T')[0];
  const boostActive = !!(
    player.xpBoostActive &&
    player.xpBoostExpires &&
    new Date(player.xpBoostExpires) > new Date()
  );

  const xpEarned  = calculateXP(correct, timeMs, player.streak || 0, boostActive);
  const newXP     = (player.xp || 0) + xpEarned;
  const oldLevel  = getLevelFromXP(player.xp || 0);
  const newLevel  = getLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  const updatedPlayer = incrementStreak(player, today);
  updatedPlayer.xp    = newXP;
  updatedPlayer.level = newLevel;

  // Insert answer row
  const { error: insertErr } = await sc.from('progress').insert({
    player_id:   playerId,
    cert_id:     certId,
    module_id:   moduleId || 0,
    question_id: questionId,
    correct,
    time_ms:     timeMs,
    answered_at: new Date().toISOString()
  });
  if (insertErr) throw insertErr;

  // Roll loot
  let loot = null;
  if (shouldTriggerLoot(correct, leveledUp)) {
    loot = rollLoot();
    Object.assign(updatedPlayer, applyLoot(updatedPlayer, loot));
  }

  // Persist updated player state
  await updatePlayer(playerId, {
    xp:                updatedPlayer.xp,
    level:             updatedPlayer.level,
    streak:            updatedPlayer.streak,
    lastPlayedDate:    updatedPlayer.lastPlayedDate,
    streakFreezeCount: updatedPlayer.streakFreezeCount || 0,
    xpBoostActive:     updatedPlayer.xpBoostActive || false,
    xpBoostExpires:    updatedPlayer.xpBoostExpires || null
  }, sc);

  return {
    xpEarned,
    totalXP:   updatedPlayer.xp,
    level:     updatedPlayer.level,
    leveledUp,
    streakDays: updatedPlayer.streak,
    loot:      loot || undefined
  };
}

// ── Daily quests ──────────────────────────────────────────

export async function getDailyQuest(playerId, certId, supabase) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await c(supabase)
    .from('daily_quests')
    .select('*')
    .eq('player_id', playerId)
    .eq('cert_id', certId)
    .eq('date', today)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id:             data.id,
    playerId:       data.player_id,
    certId:         data.cert_id,
    type:           data.quest_type,
    date:           data.date,
    completed:      data.completed,
    rewardClaimed:  data.reward_claimed,
    ...(data.quest_data || {})
  };
}

export async function saveDailyQuest(quest, supabase) {
  const { error } = await c(supabase)
    .from('daily_quests')
    .insert({
      player_id:  quest.playerId || quest.id?.split('-')[0],
      cert_id:    quest.certId,
      quest_type: quest.type,
      date:       quest.date,
      quest_data: {
        description:    quest.description,
        targetN:        quest.targetN,
        targetPct:      quest.targetPct,
        targetModuleId: quest.targetModuleId,
        reward:         quest.reward
      }
    });
  // Ignore unique-constraint conflicts (quest already created for today)
  if (error && error.code !== '23505') throw error;
}

export async function completeDailyQuest(playerId, questId, supabase) {
  const { error } = await c(supabase)
    .from('daily_quests')
    .update({ completed: true })
    .eq('id', questId)
    .eq('player_id', playerId);
  if (error) throw error;
}

// ── Leaderboard ───────────────────────────────────────────

export async function getLeaderboard(certId, limit = 10, supabase) {
  // certId is used for filtering in future; for now, global leaderboard
  const { data, error } = await c(supabase)
    .from('public_leaderboard')
    .select('name, xp, level, streak')
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ── Cert progress ─────────────────────────────────────────

export async function getCertProgress(playerId, certId, supabase) {
  const { data, error } = await c(supabase)
    .from('progress')
    .select('module_id, correct, time_ms')
    .eq('player_id', playerId)
    .eq('cert_id', certId);
  if (error) throw error;

  const rows          = data || [];
  const totalAnswered = rows.length;
  const totalCorrect  = rows.filter(r => r.correct).length;
  const byModule      = {};

  for (const row of rows) {
    if (!byModule[row.module_id]) byModule[row.module_id] = { answered: 0, correct: 0 };
    byModule[row.module_id].answered++;
    if (row.correct) byModule[row.module_id].correct++;
  }
  for (const mod of Object.values(byModule)) {
    mod.accuracy = mod.answered > 0 ? Math.round((mod.correct / mod.answered) * 100) : 0;
  }

  return { totalAnswered, totalCorrect, byModule };
}

// ── Missions ──────────────────────────────────────────────

export async function getMissions(playerId, certId, supabase) {
  const sc           = c(supabase);
  const certMissions = MISSIONS.filter(m => m.certId === certId);

  // Fetch progress stats
  const { data: progressRows } = await sc
    .from('progress')
    .select('module_id, correct, time_ms')
    .eq('player_id', playerId)
    .eq('cert_id', certId);

  const rows         = progressRows || [];
  const totalAnswered = rows.length;
  const totalCorrect  = rows.filter(r => r.correct).length;
  const speedCorrect  = rows.filter(r => r.correct && r.time_ms < 10000).length;

  const byModule = {};
  for (const row of rows) {
    if (!byModule[row.module_id]) byModule[row.module_id] = { answered: 0, correct: 0 };
    byModule[row.module_id].answered++;
    if (row.correct) byModule[row.module_id].correct++;
  }
  for (const mod of Object.values(byModule)) {
    mod.accuracy = mod.answered > 0 ? Math.round((mod.correct / mod.answered) * 100) : 0;
  }

  // Player streak
  const player    = await getPlayer(playerId, sc);
  const streakDays = player?.streak || 0;

  const playerStats = { totalAnswered, totalCorrect, speedCorrect, streakDays, byModule };

  // Claimed states
  const { data: missionRows } = await sc
    .from('missions')
    .select('mission_id, reward_claimed')
    .eq('player_id', playerId)
    .eq('cert_id', certId);

  const claimedMap = {};
  for (const row of (missionRows || [])) {
    claimedMap[row.mission_id] = row.reward_claimed;
  }

  return certMissions.map(mission => {
    const completed = checkMissionCompletion(mission, playerStats);
    const claimed   = !!(claimedMap[mission.id]);

    let progress = 0;
    const target = mission.conditionValue;

    switch (mission.conditionType) {
      case 'total_answered': progress = totalAnswered; break;
      case 'total_correct':  progress = totalCorrect;  break;
      case 'speed_correct':  progress = speedCorrect;  break;
      case 'streak_reach':   progress = streakDays;    break;
      case 'module_accuracy': {
        const mod = byModule[mission.conditionModuleId];
        progress = mod ? mod.accuracy : 0;
        break;
      }
    }

    return { ...mission, progress, target, completed, claimed };
  });
}

export async function claimMissionReward(playerId, certId, missionId, supabase) {
  const sc       = c(supabase);
  const missions = await getMissions(playerId, certId, sc);
  const mission  = missions.find(m => m.id === missionId);

  if (!mission)          throw new Error(`Mission not found: ${missionId}`);
  if (!mission.completed) throw new Error('Mission not yet completed');
  if (mission.claimed)    throw new Error('Reward already claimed');

  // Upsert mission record
  const { error } = await sc.from('missions').upsert({
    mission_id:    missionId,
    player_id:     playerId,
    cert_id:       certId,
    completed:     true,
    reward_claimed: true,
    completed_at:  new Date().toISOString(),
    claimed_at:    new Date().toISOString()
  });
  if (error) throw error;

  // Apply XP reward
  const xpReward = mission.reward?.xp || 0;
  const player   = await getPlayer(playerId, sc);
  const newXP    = (player.xp || 0) + xpReward;
  const newLevel = getLevelFromXP(newXP);
  await updatePlayer(playerId, { xp: newXP, level: newLevel }, sc);

  return { ok: true, xpEarned: xpReward, totalXP: newXP, level: newLevel };
}
