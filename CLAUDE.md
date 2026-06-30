# CLAUDE.md — MyLittleQuest

Mémoire permanente du projet. Toute session Claude Code (manuelle ou nocturne via routine)
doit lire ce fichier en premier.

## 1. C'est quoi MyLittleQuest

Application web mobile-first (PWA) pour apprendre des certifications informatiques en jouant.
Gratuit, accessible à tous, multi-certification, mis à jour en continu par génération de
contenu automatisée (Claude Code Remote, en tâche de fond, chaque nuit).

Le contenu pédagogique (questions, scénarios, flashcards...) est généré par Claude à partir de
sources officielles (documentation, exam guides), proposé en Pull Request, et review/mergé par
Shai. Aucun contenu n'atteint `main` sans passer par ce circuit.

## 2. Stack technique

- **Frontend** : Next.js + Vercel, PWA mobile-first (tap/swipe/drag, pas de dépendance clavier)
- **Contenu** : 100% fichiers JSON versionnés dans Git, pas de base de données externe
- **Progression utilisateur** : IndexedDB côté client uniquement (aucune donnée user ne quitte
  le navigateur), avec export/import JSON manuel pour sauvegarde
- **Génération de contenu** : Claude Code Remote sur trigger cron nocturne

## 3. Structure des données

```
content/
  {certification-slug}/
    certification.json     # name, code, exam_domains[], exam_guide_url, status
    concepts.json           # unité atomique de connaissance
    assets/
      qcm.json
      flashcard.json
      scenario.json
      swipe.json
      match.json
    asset_concepts.json     # mapping many-to-many asset_id <-> concept_ids[]
```

Les `id` (concept_id, asset_id) sont uniques **uniquement dans leur dossier de certification**,
jamais besoin de vérifier l'unicité cross-certif. L'app préfixe par le slug du dossier au
runtime si besoin d'un identifiant global (ex: `aws-cloud-practitioner:storage-s3-classes`).

### Schéma `concepts.json` (un élément du tableau)

```json
{
  "id": "storage-s3-classes",
  "domain": "Storage",
  "title": "S3 Storage Classes",
  "core_explanation": "...",
  "difficulty": 1,
  "source_url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
  "generated_at": "2026-06-30T02:00:00Z"
}
```

### Schémas `assets/*.json` (un élément du tableau, par type)

Base commune à toutes les entrées :
```json
{ "id": "qcm-storage-01", "game_type": "qcm", "difficulty": 1, "payload": { ... } }
```

**QCM**
```json
{ "question": "...", "choices": ["...", "...", "...", "..."], "correct_index": 0, "explanation": "..." }
```

**Flashcard**
```json
{ "front": "...", "back": "..." }
```

**Scénario** (un seul niveau, pas de branchement en cascade)
```json
{
  "intro": "...",
  "choices": [
    { "text": "...", "is_correct": true, "feedback": "..." }
  ]
}
```

**Swipe** (vrai/faux)
```json
{ "statement": "...", "is_true": false, "explanation": "..." }
```

**Match** (nombre de paires variable, Claude juge le nombre pertinent par concept)
```json
{ "pairs": [ { "left": "...", "right": "..." } ] }
```

### `asset_concepts.json`

```json
[
  { "asset_id": "scenario-storage-02", "concept_ids": ["storage-s3-classes", "iam-least-privilege", "cost-optimization-basics"] }
]
```

Many-to-many : un asset (typiquement un scénario) peut tester plusieurs concepts à la fois.
Chaque réponse utilisateur à cet asset met à jour la mastery SM-2 de **tous** les concepts liés.

## 4. Modèle de progression (côté client, IndexedDB)

Deux systèmes **volontairement étanches** — aucune lecture croisée :

- **Mastery (SM-2)** : `user_concept_mastery` par `(user, concept_id)` — easiness, interval,
  repetitions, next_review_at. Reflète la connaissance réelle, indépendant de la pression de jeu.
- **Score arcade** : `user_game_sessions` — vies, points, par session de jeu. Purement
  motivationnel/cosmétique, ne doit jamais influencer le calcul SM-2.

Sélection des concepts à une session : priorité aux concepts dont `next_review_at <= now`,
fallback sur du contenu jamais vu si rien n'est dû. L'utilisateur a une checklist de
certifications suivies (`user_certifications`) et peut jouer en mode mono-certif ou mix
cross-certif.

## 5. Pipeline de génération nocturne — fichiers de pilotage

```
claude/
  MISSION_LOG.md              # écrasé à chaque run — état de la dernière mission uniquement
  NEXT_MISSION.md              # mission planifiée pour la prochaine session, écrasée à chaque run
  certifications_roadmap.md   # liste des certifs autorisées, statut, lien vers l'exam guide officiel
```

`MISSION_LOG.md` n'est PAS un historique cumulatif — il est écrasé à chaque session. L'historique
complet vit dans Git (commits + PR mergées). Son seul rôle est de transmettre le contexte
immédiat à la session suivante.

## 6. Garde-fous — à respecter sans exception

Ces règles priment sur toute mission, même si la mission semble les justifier implicitement.
Si une mission entre en conflit avec un garde-fou, **arrête-toi, documente le conflit dans
`MISSION_LOG.md` et dans la PR, ne tranche pas seul.**

1. **Aucun concept publié sans `source_url` précis et vérifiable.** Pas de lien générique
   ("AWS docs"), un lien vers la page exacte consultée. Si Claude ne trouve pas de source fiable
   pour un point, le concept n'est pas créé — pas d'approximation, pas d'invention.

2. **Jamais de nouvelle certification hors `certifications_roadmap.md`.** Claude ne crée jamais
   de dossier `content/{nouvelle-certif}/`, même partiellement, si la certif n'y figure pas déjà
   avec un statut l'autorisant. Une certif intéressante mais non planifiée se propose dans
   `NEXT_MISSION.md` pour arbitrage de Shai, elle ne se génère pas en avance de phase.

3. **Jamais de reproduction de questions d'examen réelles ou de braindumps.** Si une recherche
   de source mène vers du contenu de type "leaked exam questions" ou "braindump", l'ignorer
   complètement. Le contenu généré doit être pédagogique, inspiré du scope officiel (exam guide,
   documentation), jamais une copie ou paraphrase proche d'une question d'examen existante.

4. **Statut `complete` d'une certification soumis à preuve.** Claude ne marque une certification
   `complete` dans `certifications_roadmap.md` que s'il a explicitement comparé le coverage des
   concepts générés au blueprint/exam guide officiel listé pour cette certif, et peut justifier
   que chaque domaine du blueprint est couvert. Sinon, statut `in_progress` ou `needs_review`.

5. **Aucune donnée utilisateur ne sort du navigateur.** Le pipeline nocturne ne touche jamais à
   IndexedDB, aux exports JSON utilisateur, ni à quoi que ce soit côté client — il ne génère que
   du contenu dans `content/`.

6. **Aucun secret, clé API, ou credential dans un commit.** Vérification avant chaque commit.

7. **Jamais de push direct sur `main`.** Toujours une branche `claude/<nom-descriptif>`, toujours
   terminer par une Pull Request, jamais merger soi-même.

## 7. Conventions de travail

- Branche : `claude/<nom-descriptif-de-la-mission>`
- Commits atomiques, messages clairs en français
- Une mission nocturne doit être réalisable en une seule session — granularité variable, Claude
  estime ce qui est faisable plutôt que de viser un quota fixe
- Si une mission dépend d'un accès non disponible dans cette session (ex: un outil non connecté),
  le documenter clairement dans `MISSION_LOG.md` plutôt que de bloquer toute la session dessus
- Si tout ce qui est raisonnablement planifiable est fait sans nouvelle décision de Shai, le dire
  clairement dans `NEXT_MISSION.md` plutôt que d'inventer une tâche artificielle — proposer 2-3
  options et attendre l'arbitrage
