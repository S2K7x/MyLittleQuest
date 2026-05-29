const LOOT_TABLE = [
  { id: 'xp-boost-50',    rarity: 'common', weight: 40, label: 'XP Boost +50' },
  { id: 'title-initiate', rarity: 'common', weight: 20, label: 'Title: Cloud Initiate' },
  { id: 'streak-freeze',  rarity: 'rare',   weight: 25, label: 'Streak Freeze' },
  { id: 'badge-rare',     rarity: 'rare',   weight: 10, label: 'Rare Badge' },
  { id: 'xp-boost-24h',   rarity: 'epic',   weight: 4,  label: 'Double XP 24h' },
  { id: 'badge-epic',     rarity: 'epic',   weight: 1,  label: 'Epic Badge' }
];

const TRIGGER_CHANCE = 0.15;

function rollLoot() {
  const totalWeight = LOOT_TABLE.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of LOOT_TABLE) {
    roll -= item.weight;
    if (roll <= 0) return { ...item };
  }

  return { ...LOOT_TABLE[0] };
}

function shouldTriggerLoot(correct, leveledUp = false) {
  if (!correct) return false;
  if (leveledUp) return true;
  return Math.random() < TRIGGER_CHANCE;
}

function applyLoot(player, loot) {
  const updated = { ...player };

  switch (loot.id) {
    case 'xp-boost-50':
      updated.xp = (updated.xp || 0) + 50;
      break;
    case 'streak-freeze':
      updated.streakFreezeCount = (updated.streakFreezeCount || 0) + 1;
      break;
    case 'xp-boost-24h':
      updated.xpBoostActive = true;
      updated.xpBoostExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      break;
    // titles and badges are stored separately in player inventory (future feature)
    default:
      break;
  }

  return updated;
}

module.exports = {
  LOOT_TABLE,
  TRIGGER_CHANCE,
  rollLoot,
  shouldTriggerLoot,
  applyLoot
};
