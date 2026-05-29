const BASE_XP = 10;
const SPEED_BONUS = 5;
const SPEED_THRESHOLD_MS = 10000;

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000,
  6500, 8200, 10100, 12200, 14500, 17000, 19700, 22600, 25700, 29000,
  32500, 36200, 40100, 44200, 48500, 53000, 57700, 62600, 67700, 73000
];

function streakMultiplier(streakDays) {
  return Math.min(2.0, 1 + streakDays * 0.1);
}

function calculateXP(correct, timeMs, streakDays = 0, boostActive = false) {
  if (!correct) return 0;

  let xp = BASE_XP;
  if (timeMs < SPEED_THRESHOLD_MS) xp += SPEED_BONUS;

  const multiplier = streakMultiplier(streakDays);
  xp = Math.floor(xp * multiplier);

  if (boostActive) xp *= 2;

  return xp;
}

function getLevelFromXP(xp) {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i;
    else break;
  }
  return level;
}

function getXPToNextLevel(xp) {
  const current = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[current] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[current + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const xpInLevel = xp - currentThreshold;
  const required = nextThreshold - currentThreshold;
  const percentage = Math.min(100, Math.floor((xpInLevel / required) * 100));

  return { current: xpInLevel, required, percentage };
}

module.exports = {
  BASE_XP,
  SPEED_BONUS,
  SPEED_THRESHOLD_MS,
  LEVEL_THRESHOLDS,
  calculateXP,
  getLevelFromXP,
  getXPToNextLevel,
  streakMultiplier
};
