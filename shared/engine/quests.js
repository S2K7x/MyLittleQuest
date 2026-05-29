const QUEST_TYPES = [
  { type: 'answer_n',    template: 'Answer {n} questions',             n: [5, 10, 20] },
  { type: 'streak_n',    template: 'Get {n} correct in a row',         n: [3, 5, 10] },
  { type: 'module_acc',  template: 'Score {pct}%+ in {module}',        pct: [70, 80, 90] },
  { type: 'speed_n',     template: 'Answer {n} questions under 10s',   n: [3, 5] },
  { type: 'full_module', template: 'Complete all questions in {module}' }
];

const QUEST_REWARD = { xpMultiplier: 2, lootChance: 0.8 };

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generateDailyQuest(player, certId, date, certMeta) {
  // Deterministic per player+date so all sessions for the same day get the same quest
  const seed = (player.id || 0) ^ new Date(date).getTime();
  const rand = seededRandom(seed);

  const typeIndex = Math.floor(rand() * QUEST_TYPES.length);
  const questType = QUEST_TYPES[typeIndex];

  let description = questType.template;
  const quest = {
    id: `${player.id}-${certId}-${date}`,
    certId,
    date,
    type: questType.type,
    reward: { ...QUEST_REWARD }
  };

  if (questType.n) {
    const n = questType.n[Math.floor(rand() * questType.n.length)];
    quest.targetN = n;
    description = description.replace('{n}', n);
  }

  if (questType.pct) {
    const pct = questType.pct[Math.floor(rand() * questType.pct.length)];
    quest.targetPct = pct;
    description = description.replace('{pct}', pct);
  }

  if (description.includes('{module}') && certMeta && certMeta.modules) {
    const modIndex = Math.floor(rand() * certMeta.modules.length);
    const mod = certMeta.modules[modIndex];
    quest.targetModuleId = mod.id;
    description = description.replace('{module}', mod.name);
  }

  quest.description = description;
  return quest;
}

function checkQuestCompletion(quest, todayProgress) {
  if (!quest || !todayProgress) return false;

  switch (quest.type) {
    case 'answer_n':
      return todayProgress.totalAnswered >= quest.targetN;

    case 'streak_n': {
      let streak = 0;
      let best = 0;
      for (const p of todayProgress.answers || []) {
        streak = p.correct ? streak + 1 : 0;
        if (streak > best) best = streak;
      }
      return best >= quest.targetN;
    }

    case 'module_acc': {
      const modAnswers = (todayProgress.answers || []).filter(
        p => p.moduleId === quest.targetModuleId
      );
      if (modAnswers.length === 0) return false;
      const correct = modAnswers.filter(p => p.correct).length;
      const accuracy = (correct / modAnswers.length) * 100;
      return accuracy >= quest.targetPct;
    }

    case 'speed_n': {
      const speedCorrect = (todayProgress.answers || []).filter(
        p => p.correct && p.timeMs < 10000
      ).length;
      return speedCorrect >= quest.targetN;
    }

    case 'full_module': {
      const modAnswers = (todayProgress.answers || []).filter(
        p => p.moduleId === quest.targetModuleId
      );
      return modAnswers.length >= quest.totalModuleQuestions;
    }

    default:
      return false;
  }
}

const MISSIONS = [
  {
    id: 'aws-clf-c02-m001',
    certId: 'aws-clf-c02',
    title: 'Cloud Rookie',
    description: 'Answer your first 5 questions correctly',
    icon: '🌱',
    conditionType: 'total_correct',
    conditionValue: 5,
    reward: { xp: 100 }
  },
  {
    id: 'aws-clf-c02-m002',
    certId: 'aws-clf-c02',
    title: 'Security Aware',
    description: 'Achieve 70%+ accuracy in Security & Compliance (min 5 answers)',
    icon: '🔐',
    conditionType: 'module_accuracy',
    conditionModuleId: 2,
    conditionValue: 70,
    reward: { xp: 250 }
  },
  {
    id: 'aws-clf-c02-m003',
    certId: 'aws-clf-c02',
    title: 'The Architect',
    description: 'Answer 50 questions total',
    icon: '🏗️',
    conditionType: 'total_answered',
    conditionValue: 50,
    reward: { xp: 500 }
  },
  {
    id: 'aws-clf-c02-m004',
    certId: 'aws-clf-c02',
    title: 'Lightning Brain',
    description: 'Answer 10 questions correctly in under 10 seconds each',
    icon: '⚡',
    conditionType: 'speed_correct',
    conditionValue: 10,
    reward: { xp: 200 }
  },
  {
    id: 'aws-clf-c02-m005',
    certId: 'aws-clf-c02',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    conditionType: 'streak_reach',
    conditionValue: 7,
    reward: { xp: 350 }
  }
];

function checkMissionCompletion(mission, playerStats) {
  switch (mission.conditionType) {
    case 'total_answered':
      return playerStats.totalAnswered >= mission.conditionValue;
    case 'total_correct':
      return playerStats.totalCorrect >= mission.conditionValue;
    case 'module_accuracy': {
      const mod = playerStats.byModule && playerStats.byModule[mission.conditionModuleId];
      if (!mod || mod.answered < 5) return false;
      return mod.accuracy >= mission.conditionValue;
    }
    case 'speed_correct':
      return playerStats.speedCorrect >= mission.conditionValue;
    case 'streak_reach':
      return playerStats.streakDays >= mission.conditionValue;
    default:
      return false;
  }
}

module.exports = {
  QUEST_TYPES,
  QUEST_REWARD,
  MISSIONS,
  generateDailyQuest,
  checkQuestCompletion,
  checkMissionCompletion
};
