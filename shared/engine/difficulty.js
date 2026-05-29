const TARGET_ACCURACY = 0.85;

function analyzeKeywordAccuracy(progressHistory, keyword) {
  const relevant = progressHistory.filter(
    p => p.keywords && p.keywords.includes(keyword)
  );
  if (relevant.length === 0) return null;
  const correct = relevant.filter(p => p.correct).length;
  return correct / relevant.length;
}

function getNextDifficulty(currentDifficulty, recentAccuracy) {
  if (recentAccuracy === null || recentAccuracy === undefined) return currentDifficulty;

  if (recentAccuracy > TARGET_ACCURACY && currentDifficulty < 3) {
    return currentDifficulty + 1;
  }
  if (recentAccuracy < TARGET_ACCURACY - 0.15 && currentDifficulty > 1) {
    return currentDifficulty - 1;
  }
  return currentDifficulty;
}

function selectQuestion(questions, playerProgress, certMeta) {
  if (!questions || questions.length === 0) return null;

  const answeredIds = new Set((playerProgress || []).map(p => p.questionId));
  const unanswered = questions.filter(q => !answeredIds.has(q.id));
  const pool = unanswered.length > 0 ? unanswered : questions;

  // Score each question by desirability
  const scored = pool.map(q => {
    let score = 0;

    // Prefer questions matching module weight distribution
    if (certMeta && certMeta.modules) {
      const mod = certMeta.modules.find(m => m.id === q.moduleId);
      if (mod) score += mod.weight;
    }

    // Penalize recently seen keywords
    const recentKeywords = new Set(
      (playerProgress || [])
        .slice(-20)
        .flatMap(p => p.keywords || [])
    );
    const freshKeywords = (q.keywords || []).filter(k => !recentKeywords.has(k));
    score += freshKeywords.length * 5;

    // Prefer questions not yet answered
    if (!answeredIds.has(q.id)) score += 20;

    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick from top 5 with some randomness
  const topN = scored.slice(0, 5);
  const pick = topN[Math.floor(Math.random() * topN.length)];
  return pick ? pick.q : null;
}

module.exports = {
  TARGET_ACCURACY,
  analyzeKeywordAccuracy,
  getNextDifficulty,
  selectQuestion
};
