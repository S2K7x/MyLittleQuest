import { createClient } from '@supabase/supabase-js';
import { getAllQuestions, getCertification } from '../../../src/lib/certContent.js';
import * as db from '../../../src/db/supabase.js';
import selectQuestionModule from '../../../../shared/engine/difficulty.js';

const { selectQuestion } = selectQuestionModule;

function makeClient(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}
  );
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { certId }  = req.query;
    const { moduleId, limit = '1', excludeIds = '', playerId } = req.query;
    const excluded    = new Set(excludeIds ? excludeIds.split(',') : []);
    const supabase    = makeClient(req);

    let questions = getAllQuestions(certId);
    if (moduleId) questions = questions.filter(q => q.moduleId === parseInt(moduleId, 10));
    questions = questions.filter(q => !excluded.has(q.id));

    const certMeta      = getCertification(certId);
    const playerProgress = playerId
      ? await db.getProgress(playerId, certId, supabase).catch(() => [])
      : [];

    const result  = [];
    const usedIds = new Set(excluded);

    for (let i = 0; i < parseInt(limit, 10); i++) {
      const remaining = questions.filter(q => !usedIds.has(q.id));
      if (!remaining.length) break;
      const q = selectQuestion(remaining, playerProgress, certMeta);
      if (!q) break;
      result.push(q);
      usedIds.add(q.id);
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
