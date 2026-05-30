import { createClient } from '@supabase/supabase-js';
import * as db from '../../../../src/db/supabase.js';

function makeClient(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { playerId, questId } = req.query;
    await db.completeDailyQuest(playerId, questId, makeClient(req));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
