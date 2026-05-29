'use strict';

const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');
const db = require('../db/sqlite');
const {
  loadAllCertifications,
  loadAllQuestions,
  getCertStats
} = require('../../../shared/engine/certifications');
const { selectQuestion } = require('../../../shared/engine/difficulty');
const { generateDailyQuest } = require('../../../shared/engine/quests');

// Resolve DB path relative to this file: local/src/server/ → ../../.. → root → data/
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../../data/game.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
const fs = require('fs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const database = new Database(DB_PATH);
db.init(database);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../../dist')));

// ────────────────────────────────────────────────
// Health
// ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  let dbStatus = 'connected';
  let certsLoaded = 0;
  try {
    database.prepare('SELECT 1').get();
    certsLoaded = loadAllCertifications().length;
  } catch {
    dbStatus = 'error';
  }
  res.json({ status: 'ok', db: dbStatus, certsLoaded });
});

// ────────────────────────────────────────────────
// Certifications
// ────────────────────────────────────────────────
app.get('/api/certifications', (req, res) => {
  try {
    res.json(loadAllCertifications());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/certifications/:certId/questions', (req, res) => {
  try {
    const { certId } = req.params;
    const { moduleId, limit = '1', excludeIds = '', playerId = 'local-player-1' } = req.query;

    const excluded = new Set(excludeIds ? excludeIds.split(',') : []);

    let questions = loadAllQuestions(certId);
    if (moduleId) questions = questions.filter(q => q.moduleId === parseInt(moduleId, 10));
    questions = questions.filter(q => !excluded.has(q.id));

    const playerProgress = db.getProgress(playerId, certId);
    const certMeta = loadAllCertifications().find(c => c.id === certId);

    const result = [];
    const usedIds = new Set(excluded);

    for (let i = 0; i < parseInt(limit, 10); i++) {
      const remaining = questions.filter(q => !usedIds.has(q.id));
      if (remaining.length === 0) break;
      const q = selectQuestion(remaining, playerProgress, certMeta);
      if (!q) break;
      result.push(q);
      usedIds.add(q.id);
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/certifications/:certId/stats', (req, res) => {
  try {
    res.json(getCertStats(req.params.certId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────
// Player
// ────────────────────────────────────────────────
app.get('/api/player/:id', (req, res) => {
  try {
    const player = db.getPlayer(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/player/:id', (req, res) => {
  try {
    res.json(db.updatePlayer(req.params.id, req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────
// Answers
// ────────────────────────────────────────────────
app.post('/api/answers', (req, res) => {
  try {
    const { playerId, certId, questionId, moduleId, correct, timeMs } = req.body;
    const result = db.saveAnswer(playerId, certId, questionId, moduleId, correct, timeMs);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────
// Daily quests
// ────────────────────────────────────────────────
app.get('/api/daily-quest/:playerId/:certId', (req, res) => {
  try {
    const { playerId, certId } = req.params;
    let quest = db.getDailyQuest(playerId, certId);

    if (!quest) {
      const player = db.getPlayer(playerId);
      if (!player) return res.status(404).json({ error: 'Player not found' });
      const certMeta = loadAllCertifications().find(c => c.id === certId);
      const today = new Date().toISOString().split('T')[0];
      quest = generateDailyQuest(player, certId, today, certMeta);
      // Attach playerId so saveDailyQuest can store it correctly
      quest.playerId = playerId;
      db.saveDailyQuest(quest);
      quest = db.getDailyQuest(playerId, certId);
    }

    res.json(quest);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/daily-quest/:playerId/:questId/complete', (req, res) => {
  try {
    db.completeDailyQuest(req.params.playerId, req.params.questId);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────
// Leaderboard
// ────────────────────────────────────────────────
app.get('/api/leaderboard/:certId', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    res.json(db.getLeaderboard(req.params.certId, limit));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────
// Missions
// ────────────────────────────────────────────────
app.get('/api/missions/:playerId/:certId', (req, res) => {
  try {
    res.json(db.getMissions(req.params.playerId, req.params.certId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/missions/:playerId/:missionId/claim', (req, res) => {
  try {
    const { certId } = req.body;
    const result = db.claimMissionReward(req.params.playerId, certId, req.params.missionId);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ────────────────────────────────────────────────
// SPA fallback
// ────────────────────────────────────────────────
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, '../../../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<h1>MyLittleQuest API</h1><p>Run <code>npm run build</code> to serve the frontend.</p>');
  }
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MyLittleQuest local server running on http://0.0.0.0:${PORT}`);
  console.log(`DB: ${DB_PATH}`);
});
