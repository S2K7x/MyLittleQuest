'use strict';

const { calculateXP, getLevelFromXP } = require('../../../shared/engine/xp');
const { incrementStreak } = require('../../../shared/engine/streak');
const { shouldTriggerLoot, rollLoot, applyLoot } = require('../../../shared/engine/loot');
const { MISSIONS, checkMissionCompletion } = require('../../../shared/engine/quests');

let db;

function init(database) {
  db = database;

  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'CloudHero',
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      streakFreezeCount INTEGER DEFAULT 0,
      lastPlayedDate TEXT,
      xpBoostActive INTEGER DEFAULT 0,
      xpBoostExpires TEXT
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerId TEXT NOT NULL,
      certId TEXT NOT NULL,
      moduleId INTEGER NOT NULL DEFAULT 0,
      questionId TEXT NOT NULL,
      correct INTEGER NOT NULL,
      timeMs INTEGER NOT NULL,
      answeredAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_quests (
      id TEXT PRIMARY KEY,
      playerId TEXT NOT NULL,
      certId TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      targetN INTEGER,
      targetPct INTEGER,
      targetModuleId INTEGER,
      completed INTEGER DEFAULT 0,
      completedAt TEXT,
      reward TEXT
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerId TEXT NOT NULL,
      badgeId TEXT NOT NULL,
      awardedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerId TEXT NOT NULL,
      certId TEXT NOT NULL,
      missionId TEXT NOT NULL,
      claimed INTEGER DEFAULT 0,
      claimedAt TEXT,
      UNIQUE(playerId, certId, missionId)
    );

    CREATE INDEX IF NOT EXISTS idx_progress_player_cert ON progress(playerId, certId);
    CREATE INDEX IF NOT EXISTS idx_progress_player_cert_module ON progress(playerId, certId, moduleId);
    CREATE INDEX IF NOT EXISTS idx_daily_quests_player ON daily_quests(playerId, certId, date);
    CREATE INDEX IF NOT EXISTS idx_missions_player ON missions(playerId, certId);
  `);

  db.prepare(
    "INSERT OR IGNORE INTO players (id, name) VALUES ('local-player-1', 'CloudHero')"
  ).run();
}

function getPlayer(id) {
  return db.prepare(`
    SELECT id, name, xp, level, streak, streakFreezeCount,
           lastPlayedDate, xpBoostActive, xpBoostExpires
    FROM players WHERE id = ?
  `).get(id);
}

function updatePlayer(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getPlayer(id);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  db.prepare(`UPDATE players SET ${setClause} WHERE id = ?`).run(...values, id);
  return getPlayer(id);
}

function getProgress(playerId, certId) {
  return db.prepare(`
    SELECT questionId, moduleId, correct, timeMs, answeredAt
    FROM progress
    WHERE playerId = ? AND certId = ?
    ORDER BY answeredAt ASC
  `).all(playerId, certId);
}

function saveAnswer(playerId, certId, questionId, moduleId, correct, timeMs) {
  const player = getPlayer(playerId);
  if (!player) throw new Error(`Player not found: ${playerId}`);

  const today = new Date().toISOString().split('T')[0];
  const boostActive = !!(
    player.xpBoostActive &&
    player.xpBoostExpires &&
    new Date(player.xpBoostExpires) > new Date()
  );

  const xpEarned = calculateXP(correct, timeMs, player.streak || 0, boostActive);
  const newXP = (player.xp || 0) + xpEarned;
  const oldLevel = getLevelFromXP(player.xp || 0);
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  const updatedPlayer = incrementStreak(player, today);
  updatedPlayer.xp = newXP;
  updatedPlayer.level = newLevel;

  db.prepare(`
    INSERT INTO progress (playerId, certId, moduleId, questionId, correct, timeMs, answeredAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(playerId, certId, moduleId || 0, questionId, correct ? 1 : 0, timeMs, new Date().toISOString());

  let loot = null;
  if (shouldTriggerLoot(correct, leveledUp)) {
    loot = rollLoot();
    Object.assign(updatedPlayer, applyLoot(updatedPlayer, loot));
  }

  updatePlayer(playerId, {
    xp: updatedPlayer.xp,
    level: updatedPlayer.level,
    streak: updatedPlayer.streak,
    lastPlayedDate: updatedPlayer.lastPlayedDate,
    streakFreezeCount: updatedPlayer.streakFreezeCount || 0,
    xpBoostActive: updatedPlayer.xpBoostActive ? 1 : 0,
    xpBoostExpires: updatedPlayer.xpBoostExpires || null
  });

  return {
    xpEarned,
    totalXP: updatedPlayer.xp,
    level: updatedPlayer.level,
    leveledUp,
    streakDays: updatedPlayer.streak,
    loot: loot || undefined
  };
}

function getDailyQuest(playerId, certId) {
  const today = new Date().toISOString().split('T')[0];
  return db.prepare(`
    SELECT * FROM daily_quests
    WHERE playerId = ? AND certId = ? AND date = ?
  `).get(playerId, certId, today) || null;
}

function saveDailyQuest(quest) {
  db.prepare(`
    INSERT OR IGNORE INTO daily_quests
      (id, playerId, certId, date, type, description, targetN, targetPct, targetModuleId, reward)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    quest.id,
    quest.playerId || quest.id.split('-')[0],
    quest.certId,
    quest.date,
    quest.type,
    quest.description,
    quest.targetN || null,
    quest.targetPct || null,
    quest.targetModuleId || null,
    JSON.stringify(quest.reward || {})
  );
}

function completeDailyQuest(playerId, questId) {
  db.prepare(`
    UPDATE daily_quests SET completed = 1, completedAt = ?
    WHERE id = ? AND playerId = ?
  `).run(new Date().toISOString(), questId, playerId);
}

function getLeaderboard(certId, limit = 10) {
  return db.prepare(`
    SELECT p.name, p.xp, p.level, p.streak
    FROM players p
    WHERE EXISTS (SELECT 1 FROM progress a WHERE a.playerId = p.id AND a.certId = ?)
    ORDER BY p.xp DESC
    LIMIT ?
  `).all(certId, limit);
}

function getCertProgress(playerId, certId) {
  const rows = db.prepare(`
    SELECT moduleId, correct, timeMs
    FROM progress
    WHERE playerId = ? AND certId = ?
  `).all(playerId, certId);

  const totalAnswered = rows.length;
  const totalCorrect = rows.filter(r => r.correct).length;
  const byModule = {};

  for (const row of rows) {
    if (!byModule[row.moduleId]) {
      byModule[row.moduleId] = { answered: 0, correct: 0 };
    }
    byModule[row.moduleId].answered++;
    if (row.correct) byModule[row.moduleId].correct++;
  }

  for (const mod of Object.values(byModule)) {
    mod.accuracy = mod.answered > 0 ? Math.round((mod.correct / mod.answered) * 100) : 0;
  }

  return { totalAnswered, totalCorrect, byModule };
}

function getMissions(playerId, certId) {
  const certMissions = MISSIONS.filter(m => m.certId === certId);
  const certProgress = getCertProgress(playerId, certId);
  const player = getPlayer(playerId);

  // speedCorrect: correct answers under 10s
  const speedRows = db.prepare(`
    SELECT COUNT(*) as cnt FROM progress
    WHERE playerId = ? AND certId = ? AND correct = 1 AND timeMs < 10000
  `).get(playerId, certId);
  const speedCorrect = speedRows ? speedRows.cnt : 0;

  const playerStats = {
    totalAnswered: certProgress.totalAnswered,
    totalCorrect: certProgress.totalCorrect,
    speedCorrect,
    streakDays: player ? player.streak : 0,
    byModule: certProgress.byModule
  };

  // claimed states
  const claimedRows = db.prepare(`
    SELECT missionId, claimed FROM missions
    WHERE playerId = ? AND certId = ?
  `).all(playerId, certId);
  const claimedMap = {};
  for (const row of claimedRows) {
    claimedMap[row.missionId] = row.claimed;
  }

  return certMissions.map(mission => {
    const completed = checkMissionCompletion(mission, playerStats);
    const claimed = !!(claimedMap[mission.id]);

    let progress = 0;
    let target = mission.conditionValue;

    switch (mission.conditionType) {
      case 'total_answered': progress = playerStats.totalAnswered; break;
      case 'total_correct':  progress = playerStats.totalCorrect;  break;
      case 'speed_correct':  progress = playerStats.speedCorrect;  break;
      case 'streak_reach':   progress = playerStats.streakDays;    break;
      case 'module_accuracy': {
        const mod = playerStats.byModule[mission.conditionModuleId];
        progress = mod ? mod.accuracy : 0;
        break;
      }
    }

    return { ...mission, progress, target, completed, claimed };
  });
}

function claimMissionReward(playerId, certId, missionId) {
  const missions = getMissions(playerId, certId);
  const mission = missions.find(m => m.id === missionId);

  if (!mission) throw new Error(`Mission not found: ${missionId}`);
  if (!mission.completed) throw new Error('Mission not yet completed');
  if (mission.claimed) throw new Error('Reward already claimed');

  db.prepare(`
    INSERT INTO missions (playerId, certId, missionId, claimed, claimedAt)
    VALUES (?, ?, ?, 1, ?)
    ON CONFLICT(playerId, certId, missionId) DO UPDATE SET claimed = 1, claimedAt = excluded.claimedAt
  `).run(playerId, certId, missionId, new Date().toISOString());

  const xpReward = mission.reward && mission.reward.xp ? mission.reward.xp : 0;
  const player = getPlayer(playerId);
  const newXP = (player.xp || 0) + xpReward;
  const newLevel = getLevelFromXP(newXP);
  updatePlayer(playerId, { xp: newXP, level: newLevel });

  return { ok: true, xpEarned: xpReward, totalXP: newXP, level: newLevel };
}

module.exports = {
  init,
  getPlayer,
  updatePlayer,
  getProgress,
  saveAnswer,
  getDailyQuest,
  saveDailyQuest,
  completeDailyQuest,
  getLeaderboard,
  getCertProgress,
  getMissions,
  claimMissionReward
};
