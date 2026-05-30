import { createClient } from '@supabase/supabase-js';
import * as db from '../../src/db/supabase.js';

function makeClient(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}
  );
}

export default async function handler(req, res) {
  const { id }    = req.query;
  const supabase  = makeClient(req);

  if (req.method === 'GET') {
    try {
      const player = await db.getPlayer(id, supabase);
      if (!player) return res.status(404).json({ error: 'Player not found' });
      res.json(player);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const updated = await db.updatePlayer(id, req.body, supabase);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).end();
}
