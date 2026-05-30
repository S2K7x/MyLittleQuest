import { createClient } from '@supabase/supabase-js';
import * as db from '../../../src/db/supabase.js';
import { getAllCertifications } from '../../../src/lib/certContent.js';
import questEngine from '../../../../shared/engine/quests.js';

const { generateDailyQuest } = questEngine;

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
    const { playerId, certId } = req.query;
    const supabase = makeClient(req);

    let quest = await db.getDailyQuest(playerId, certId, supabase);

    if (!quest) {
      const player   = await db.getPlayer(playerId, supabase);
      if (!player) return res.status(404).json({ error: 'Player not found' });
      const certMeta = getAllCertifications().find(c => c.id === certId);
      const today    = new Date().toISOString().split('T')[0];
      const generated = generateDailyQuest(player, certId, today, certMeta);
      generated.playerId = playerId;
      await db.saveDailyQuest(generated, supabase);
      quest = await db.getDailyQuest(playerId, certId, supabase);
    }

    res.json(quest);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
