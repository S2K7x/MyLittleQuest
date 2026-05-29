---
name: project-overview
description: MyLittleQuest — gamified certification learning game. Architecture, stack, key constraints.
metadata:
  type: project
---

MyLittleQuest is a certification-agnostic gamified quiz game. The engine never knows which cert is loaded — it only sees "a cert with modules and questions". New certs = drop a folder in shared/content/certifications/.

**Stack:**
- `shared/engine/` — pure JS game logic (xp, streak, difficulty, loot, quests, certifications loader)
- `shared/components/` — React components used by both local and online
- `shared/content/` — JSON question bank + schemas
- `local/` — Vite + React frontend + Express + SQLite (Docker-friendly, offline)
- `online/` — Vite + React + Supabase (deployed on Vercel)

**Key rules (from docs/CLAUDE.md):**
- Only content authors touch `shared/content/certifications/` and `docs/CHECKLIST.md`
- Never touch engine or component files during content sessions
- Run `node scripts/validate-content.js` (pre-commit hook wired via Husky)
- Must be iPhone PWA-compatible (https://web.dev/learn/pwa/progressive-web-apps?hl=fr)

**Content state (as of 2026-05-29):**
- aws-clf-c02: 40 questions (10 per module), all passing validation
- Question ID format: `clf-c02-m{moduleId}-{NNNN}` (zero-padded)

**How to apply:** When making content changes, only touch files under `shared/content/certifications/` and `docs/CHECKLIST.md`. When working on game logic, touch `shared/engine/` and `shared/components/`. Run `npm run validate` from root to verify.
