const { calculateXP, getLevelFromXP } = require('../../../shared/engine/xp');
const { incrementStreak } = require('../../../shared/engine/streak');
const { shouldTriggerLoot, rollLoot, applyLoot } = require('../../../shared/engine/loot');

// Supabase client — injected by the caller
let supabase;

function init(client) {
  supabase = client;
}

async function getPlayer(id) {
  const { data, error } = await supabase
    .from('players')
    .select('id, name, xp, level, streak, streakFreezeCount, lastPlayedDate, xpBoostActive, xpBoostExpires')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

async function updatePlayer(id, fields) {
  const { error } = await supabase
    .from('players')
    .update(fields)
    .eq('id', id);
  if (error) throw error;
  return getPlayer(id);
}

async function getProgress(playerId, certId) {
  const { data, error } = await supabase
    .from('answers')
    .select('questionId, correct, timeMs, answeredAt')
    .eq('playerId', playerId)
    .eq('certId', certId)
    .order('answeredAt', { ascending: true });
  if (error) throw error;
  return data;
}

async function saveAnswer(playerId, certId, questionId, correct, timeMs) {
  const player = await getPlayer(playerId);
  if (!player) throw new Error(`Player not found: ${playerId}`);

  const today = new Date().toISOString().split('T')[0];
  const boostActive = player.xpBoostActive &&
    player.xpBoostExpires &&
    new Date(player.xpBoostExpires) > new Date();

  const xpEarned = calculateXP(correct, timeMs, player.streak || 0, boostActive);
  const newXP = player.xp + xpEarned;
  const oldLevel = getLevelFromXP(player.xp);
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  const updatedPlayer = incrementStreak(player, today);
  updatedPlayer.xp = newXP;
  updatedPlayer.level = newLevel;

  const { error: insertError } = await supabase.from('answers').insert({
    playerId, certId, questionId,
    correct,
    timeMs,
    answeredAt: new Date().toISOString()
  });
  if (insertError) throw insertError;

  let loot = null;
  if (shouldTriggerLoot(correct, leveledUp)) {
    loot = rollLoot();
    Object.assign(updatedPlayer, applyLoot(updatedPlayer, loot));
  }

  await updatePlayer(playerId, {
    xp: updatedPlayer.xp,
    level: updatedPlayer.level,
    streak: updatedPlayer.streak,
    lastPlayedDate: updatedPlayer.lastPlayedDate,
    streakFreezeCount: updatedPlayer.streakFreezeCount,
    xpBoostActive: updatedPlayer.xpBoostActive,
    xpBoostExpires: updatedPlayer.xpBoostExpires || null
  });

  return { xpEarned, leveledUp, newLevel, loot: loot || undefined };
}

async function getDailyQuest(playerId, certId, date) {
  const { data, error } = await supabase
    .from('daily_quests')
    .select('*')
    .eq('playerId', playerId)
    .eq('certId', certId)
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function completeDailyQuest(playerId, questId) {
  const { error } = await supabase
    .from('daily_quests')
    .update({ completed: true, completedAt: new Date().toISOString() })
    .eq('id', questId)
    .eq('playerId', playerId);
  if (error) throw error;
}

async function getLeaderboard(certId, limit = 10) {
  const { data, error } = await supabase
    .from('players')
    .select('name, xp, level, streak')
    .order('xp', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function getCertProgress(playerId, certId) {
  const { data, error } = await supabase
    .from('answers')
    .select('questionId, correct, timeMs')
    .eq('playerId', playerId)
    .eq('certId', certId);
  if (error) throw error;

  const totalAnswered = data.length;
  const totalCorrect = data.filter(r => r.correct).length;

  return { totalAnswered, totalCorrect, byModule: {} };
}

module.exports = {
  init,
  getPlayer,
  updatePlayer,
  getProgress,
  saveAnswer,
  getDailyQuest,
  completeDailyQuest,
  getLeaderboard,
  getCertProgress
};
