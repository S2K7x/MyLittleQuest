/**
 * certContent.js — Static certification content loader for Vercel
 *
 * Vercel serverless functions are bundled by esbuild. Dynamic filesystem reads
 * via certifications.js (which uses __dirname + fs.readdirSync) are unreliable
 * in Lambda because __dirname is resolved at bundle time, not runtime.
 *
 * Solution: statically import all JSON content here. esbuild inlines these as
 * JS objects. On every Vercel deploy (triggered by git push), the latest
 * question files are bundled in — zero manual steps needed.
 *
 * When adding a new certification, also add its imports and entries here.
 */

// ── aws-clf-c02 ──────────────────────────────────────────
import awsClfMeta from '../../../shared/content/certifications/aws-clf-c02/meta.json' assert { type: 'json' };
import awsClfM1   from '../../../shared/content/certifications/aws-clf-c02/module1_cloud_concepts.json' assert { type: 'json' };
import awsClfM2   from '../../../shared/content/certifications/aws-clf-c02/module2_security.json' assert { type: 'json' };
import awsClfM3   from '../../../shared/content/certifications/aws-clf-c02/module3_technology.json' assert { type: 'json' };
import awsClfM4   from '../../../shared/content/certifications/aws-clf-c02/module4_billing.json' assert { type: 'json' };

// ── Registry ─────────────────────────────────────────────
const CERT_META = [
  awsClfMeta
  // add more: azMeta, gcpMeta, ...
];

const CERT_QUESTIONS = {
  'aws-clf-c02': [...awsClfM1, ...awsClfM2, ...awsClfM3, ...awsClfM4]
  // add more: 'az-900': [...], ...
};

// ── Public API ────────────────────────────────────────────

export function getAllCertifications() {
  return CERT_META;
}

export function getCertification(certId) {
  return CERT_META.find(c => c.id === certId) || null;
}

export function getAllQuestions(certId) {
  return CERT_QUESTIONS[certId] || [];
}

export function getCertStats(certId) {
  const questions = getAllQuestions(certId);
  const byModule = {};
  const byDifficulty = { 1: 0, 2: 0, 3: 0 };

  for (const q of questions) {
    if (!byModule[q.moduleId]) byModule[q.moduleId] = 0;
    byModule[q.moduleId]++;
    if (byDifficulty[q.difficulty] !== undefined) byDifficulty[q.difficulty]++;
  }

  return { totalQuestions: questions.length, byModule, byDifficulty };
}
