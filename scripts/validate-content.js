#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const CERTS_DIR = path.join(__dirname, '..', 'shared', 'content', 'certifications');
const CERT_SCHEMA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'shared', 'content', '_cert_schema.json'), 'utf8')
);
const Q_SCHEMA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'shared', 'content', '_question_schema.json'), 'utf8')
);

let errors = 0;
let warnings = 0;
const allIds = new Map(); // id -> filename

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

function validateMeta(metaPath, certId) {
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (e) {
    fail(`Invalid JSON in ${metaPath}: ${e.message}`);
    return null;
  }

  const required = CERT_SCHEMA.required || [];
  for (const field of required) {
    if (meta[field] === undefined) {
      fail(`meta.json [${certId}] missing required field: "${field}"`);
    }
  }

  if (meta.id && meta.id !== certId) {
    fail(`meta.json [${certId}] id "${meta.id}" does not match folder name "${certId}"`);
  }

  if (meta.id && !/^[a-z0-9-]+$/.test(meta.id)) {
    fail(`meta.json [${certId}] id "${meta.id}" contains invalid characters`);
  }

  if (meta.color && !/^#[0-9A-Fa-f]{6}$/.test(meta.color)) {
    fail(`meta.json [${certId}] color "${meta.color}" is not a valid hex color`);
  }

  if (meta.difficulty && !['beginner','associate','professional','specialty'].includes(meta.difficulty)) {
    fail(`meta.json [${certId}] difficulty "${meta.difficulty}" is not valid`);
  }

  return meta;
}

function validateQuestion(q, filename, index) {
  const loc = `${filename}[${index}]`;
  const required = Q_SCHEMA.required || [];

  for (const field of required) {
    if (q[field] === undefined || q[field] === null) {
      fail(`${loc} id=${q.id || '?'} missing required field: "${field}"`);
    }
  }

  if (q.id) {
    if (!/^[a-z0-9-]+-[0-9]{4}$/.test(q.id)) {
      fail(`${loc} id="${q.id}" does not match pattern ^[a-z0-9-]+-[0-9]{4}$`);
    }
    if (allIds.has(q.id)) {
      fail(`${loc} duplicate id="${q.id}" (also in ${allIds.get(q.id)})`);
    } else {
      allIds.set(q.id, filename);
    }
  }

  if (q.difficulty !== undefined && ![1, 2, 3].includes(q.difficulty)) {
    fail(`${loc} id=${q.id} difficulty must be 1, 2, or 3 (got ${q.difficulty})`);
  }

  if (q.type !== undefined && !['single', 'multiple'].includes(q.type)) {
    fail(`${loc} id=${q.id} type must be "single" or "multiple" (got "${q.type}")`);
  }

  if (q.options !== undefined && q.options.length !== 4) {
    fail(`${loc} id=${q.id} must have exactly 4 options (got ${q.options.length})`);
  }

  if (q.question !== undefined && q.question.length < 20) {
    fail(`${loc} id=${q.id} question is too short (min 20 chars)`);
  }

  if (q.explanation !== undefined && q.explanation.length < 30) {
    fail(`${loc} id=${q.id} explanation is too short (min 30 chars)`);
  }

  if (q.correct !== undefined && q.options !== undefined) {
    for (const idx of q.correct) {
      if (idx < 0 || idx >= q.options.length) {
        fail(`${loc} id=${q.id} correct index ${idx} is out of range`);
      }
    }
    if (q.type === 'single' && q.correct.length !== 1) {
      warn(`${loc} id=${q.id} type="single" but ${q.correct.length} correct answers`);
    }
    if (q.type === 'multiple' && q.correct.length < 2) {
      warn(`${loc} id=${q.id} type="multiple" but only 1 correct answer`);
    }
  }
}

function validateModuleFile(filePath, certId) {
  let questions;
  try {
    questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    fail(`Invalid JSON in ${filePath}: ${e.message}`);
    return 0;
  }

  if (!Array.isArray(questions)) {
    fail(`${filePath} must be a JSON array`);
    return 0;
  }

  const filename = path.relative(process.cwd(), filePath);
  questions.forEach((q, i) => validateQuestion(q, filename, i));

  // Check that all questions reference the correct certId
  for (const q of questions) {
    if (q.certId && q.certId !== certId) {
      fail(`${filename} question ${q.id} has certId="${q.certId}" but should be "${certId}"`);
    }
  }

  return questions.length;
}

// Main
const certDirs = fs.readdirSync(CERTS_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

if (certDirs.length === 0) {
  console.log('No certifications found.');
  process.exit(0);
}

let totalQuestions = 0;

for (const certId of certDirs) {
  console.log(`\nValidating: ${certId}`);
  const certDir = path.join(CERTS_DIR, certId);
  const metaPath = path.join(certDir, 'meta.json');

  if (!fs.existsSync(metaPath)) {
    fail(`Missing meta.json for ${certId}`);
    continue;
  }

  const meta = validateMeta(metaPath, certId);
  if (meta) console.log(`  ✓ meta.json`);

  const moduleFiles = fs.readdirSync(certDir)
    .filter(f => f.startsWith('module') && f.endsWith('.json'))
    .sort();

  if (moduleFiles.length === 0) {
    warn(`No module files found for ${certId}`);
    continue;
  }

  for (const file of moduleFiles) {
    const count = validateModuleFile(path.join(certDir, file), certId);
    totalQuestions += count;
    if (errors === 0) {
      console.log(`  ✓ ${file} (${count} questions)`);
    }
  }
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`Total questions: ${totalQuestions}`);
console.log(`Errors: ${errors} | Warnings: ${warnings}`);

if (errors > 0) {
  console.error(`\n✗ Validation FAILED with ${errors} error(s)`);
  process.exit(1);
} else {
  console.log(`\n✓ Validation PASSED`);
  process.exit(0);
}
