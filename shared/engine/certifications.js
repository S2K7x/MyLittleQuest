const fs = require('fs');
const path = require('path');

const CERTS_DIR = path.join(__dirname, '..', 'content', 'certifications');

function loadAllCertifications() {
  const entries = fs.readdirSync(CERTS_DIR, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory())
    .map(e => {
      const metaPath = path.join(CERTS_DIR, e.name, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;
      return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    })
    .filter(Boolean);
}

function loadCertification(certId) {
  const metaPath = path.join(CERTS_DIR, certId, 'meta.json');
  if (!fs.existsSync(metaPath)) throw new Error(`Certification not found: ${certId}`);
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

function loadModule(certId, moduleId) {
  const certDir = path.join(CERTS_DIR, certId);
  const files = fs.readdirSync(certDir);
  const moduleFile = files.find(f => f.startsWith(`module${moduleId}_`) && f.endsWith('.json'));
  if (!moduleFile) throw new Error(`Module ${moduleId} not found for cert ${certId}`);
  return JSON.parse(fs.readFileSync(path.join(certDir, moduleFile), 'utf8'));
}

function loadAllQuestions(certId) {
  const certDir = path.join(CERTS_DIR, certId);
  const files = fs.readdirSync(certDir).filter(
    f => f.startsWith('module') && f.endsWith('.json')
  );

  const allQuestions = [];
  for (const file of files) {
    const questions = JSON.parse(fs.readFileSync(path.join(certDir, file), 'utf8'));
    allQuestions.push(...questions);
  }
  return allQuestions;
}

function getCertStats(certId) {
  const questions = loadAllQuestions(certId);

  const byModule = {};
  const byDifficulty = { 1: 0, 2: 0, 3: 0 };

  for (const q of questions) {
    if (!byModule[q.moduleId]) byModule[q.moduleId] = 0;
    byModule[q.moduleId]++;
    if (byDifficulty[q.difficulty] !== undefined) byDifficulty[q.difficulty]++;
  }

  return { totalQuestions: questions.length, byModule, byDifficulty };
}

function validateQuestion(question, schema) {
  // Schema is passed in to avoid circular dependency with validate-content.js
  const required = schema.required || [];
  for (const field of required) {
    if (question[field] === undefined || question[field] === null) {
      throw new Error(`Missing required field: ${field} in question ${question.id}`);
    }
  }

  if (question.id && !/^[a-z0-9-]+-[0-9]{4}$/.test(question.id)) {
    throw new Error(`Invalid question ID format: ${question.id}`);
  }

  if (question.difficulty && ![1, 2, 3].includes(question.difficulty)) {
    throw new Error(`Invalid difficulty ${question.difficulty} in question ${question.id}`);
  }

  if (question.type && !['single', 'multiple'].includes(question.type)) {
    throw new Error(`Invalid type ${question.type} in question ${question.id}`);
  }

  if (question.options && (question.options.length < 4 || question.options.length > 4)) {
    throw new Error(`Question ${question.id} must have exactly 4 options`);
  }

  return true;
}

module.exports = {
  CERTS_DIR,
  loadAllCertifications,
  loadCertification,
  loadModule,
  loadAllQuestions,
  getCertStats,
  validateQuestion
};
