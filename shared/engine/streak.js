const DAILY_THRESHOLD = 5;

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function incrementStreak(player, today) {
  const last = player.lastPlayedDate;
  const updated = { ...player };

  if (!last) {
    updated.streak = 1;
    updated.lastPlayedDate = today;
    return updated;
  }

  const diff = daysBetween(last, today);

  if (diff === 0) {
    return updated;
  }

  if (diff === 1) {
    updated.streak = (player.streak || 0) + 1;
    updated.lastPlayedDate = today;
    return updated;
  }

  // More than 1 day gap — streak is lost
  updated.streak = 1;
  updated.lastPlayedDate = today;
  return updated;
}

function checkStreakLoss(player, today) {
  if (!player.lastPlayedDate) return false;
  const diff = daysBetween(player.lastPlayedDate, today);
  return diff > 1;
}

function useStreakFreeze(player) {
  if (!player.streakFreezeCount || player.streakFreezeCount < 1) {
    throw new Error('No streak freezes remaining');
  }
  return {
    ...player,
    streakFreezeCount: player.streakFreezeCount - 1
  };
}

module.exports = {
  DAILY_THRESHOLD,
  incrementStreak,
  checkStreakLoss,
  useStreakFreeze,
  daysBetween
};
