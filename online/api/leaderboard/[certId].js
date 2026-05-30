import { createClient } from '@supabase/supabase-js';
import * as db from '../../src/db/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const limit    = parseInt(req.query.limit, 10) || 10;
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    const board = await db.getLeaderboard(req.query.certId, limit, supabase);
    res.json(board);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
