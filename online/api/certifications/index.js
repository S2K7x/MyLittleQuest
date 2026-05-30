import { getAllCertifications } from '../../src/lib/certContent.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    res.json(getAllCertifications());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
