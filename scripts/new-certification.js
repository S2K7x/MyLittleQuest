#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CERTS_DIR = path.join(__dirname, '..', 'shared', 'content', 'certifications');
const CHECKLIST_PATH = path.join(__dirname, '..', 'docs', 'CHECKLIST.md');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('\n=== MyLittleQuest — New Certification Scaffold ===\n');

  const id = slugify(await ask('Certification ID (e.g. aws-saa-c03): '));
  const name = await ask('Full name (e.g. AWS Solutions Architect Associate): ');
  const provider = await ask('Provider (e.g. Amazon Web Services): ');
  const code = await ask('Exam code (e.g. SAA-C03): ');
  const color = await ask('Brand color hex (e.g. #FF9900): ');
  const icon = await ask('Icon emoji (e.g. 🏗️): ');
  const difficulty = await ask('Difficulty [beginner/associate/professional/specialty]: ');
  const passingScore = parseInt(await ask('Passing score (e.g. 720): '), 10);
  const passingScoreMax = parseInt(await ask('Max score (e.g. 1000): '), 10);
  const totalQuestions = parseInt(await ask('Total exam questions (e.g. 65): '), 10);
  const durationMinutes = parseInt(await ask('Duration in minutes (e.g. 130): '), 10);

  const numModules = parseInt(await ask('Number of modules: '), 10);
  const modules = [];
  for (let i = 1; i <= numModules; i++) {
    console.log(`\n  Module ${i}:`);
    const modName = await ask(`    Name: `);
    const modWeight = parseInt(await ask(`    Exam weight % (must add up to 100): `), 10);
    modules.push({ id: i, name: modName, weight: modWeight });
  }

  rl.close();

  const certDir = path.join(CERTS_DIR, id);
  if (fs.existsSync(certDir)) {
    console.error(`\nError: ${certDir} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(certDir, { recursive: true });

  const meta = {
    id, name, provider, code, color, icon, difficulty,
    passingScore, passingScoreMax, totalQuestions, durationMinutes,
    modules
  };

  fs.writeFileSync(path.join(certDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  console.log(`\n✓ Created ${id}/meta.json`);

  for (const mod of modules) {
    const safeName = mod.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `module${mod.id}_${safeName}.json`;
    fs.writeFileSync(path.join(certDir, filename), '[]\n');
    console.log(`✓ Created ${id}/${filename} (empty)`);
  }

  // Append to CHECKLIST.md
  if (fs.existsSync(CHECKLIST_PATH)) {
    const section = `
═══════════════════════════════════════════
## [${id}] ${name}
═══════════════════════════════════════════

### Done
<!-- - [x] Example topic — ${new Date().toISOString().split('T')[0]} — 7 questions -->

${modules.map(m => `### Module ${m.id} — ${m.name} (${m.weight}%)\n- [ ] TODO: Add topics for this module`).join('\n\n')}
`;
    fs.appendFileSync(CHECKLIST_PATH, section);
    console.log(`✓ Added ${id} section to CHECKLIST.md`);
  }

  console.log(`\n✓ Certification "${name}" scaffolded successfully.`);
  console.log(`  Next: add at least 5 questions per module before marking as active.`);
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
