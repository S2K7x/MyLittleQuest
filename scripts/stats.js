#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const CERTS_DIR = path.join(__dirname, '..', 'shared', 'content', 'certifications');
const LOW_THRESHOLD = 10;

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function color(str, code) {
  return `${code}${str}${RESET}`;
}

const certDirs = fs.readdirSync(CERTS_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name)
  .sort();

if (certDirs.length === 0) {
  console.log('No certifications found.');
  process.exit(0);
}

for (const certId of certDirs) {
  const certDir = path.join(CERTS_DIR, certId);
  const metaPath = path.join(certDir, 'meta.json');

  if (!fs.existsSync(metaPath)) {
    console.log(`${certId}: missing meta.json, skipping\n`);
    continue;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  console.log(`\n${meta.id} (${meta.name})`);

  const moduleFiles = fs.readdirSync(certDir)
    .filter(f => f.startsWith('module') && f.endsWith('.json'))
    .sort();

  const moduleStats = new Map();
  let total = 0;

  for (const file of moduleFiles) {
    const questions = JSON.parse(fs.readFileSync(path.join(certDir, file), 'utf8'));
    for (const q of questions) {
      if (!moduleStats.has(q.moduleId)) {
        moduleStats.set(q.moduleId, { count: 0, d1: 0, d2: 0, d3: 0 });
      }
      const s = moduleStats.get(q.moduleId);
      s.count++;
      if (q.difficulty === 1) s.d1++;
      else if (q.difficulty === 2) s.d2++;
      else if (q.difficulty === 3) s.d3++;
      total++;
    }
  }

  const modules = meta.modules || [];
  modules.forEach((mod, idx) => {
    const s = moduleStats.get(mod.id) || { count: 0, d1: 0, d2: 0, d3: 0 };
    const isLast = idx === modules.length - 1;
    const prefix = isLast ? '└──' : '├──';
    const diffStr = `(d1:${s.d1} d2:${s.d2} d3:${s.d3})`;
    const countStr = `${s.count} questions`.padEnd(14);
    const status = s.count < LOW_THRESHOLD
      ? color('⚠ low', RED)
      : color('✓', GREEN);
    console.log(`  ${prefix} Module ${mod.id} — ${mod.name}: ${color(countStr, s.count < LOW_THRESHOLD ? YELLOW : RESET)} ${diffStr} ${status}`);
  });

  // Modules in files but not in meta
  for (const [moduleId] of moduleStats) {
    if (!modules.find(m => m.id === moduleId)) {
      console.log(`  ⚠ Module ${moduleId} has questions but is not in meta.json`);
    }
  }

  console.log(`  Total: ${color(String(total), total > 0 ? GREEN : RED)} questions`);
}

console.log('');
