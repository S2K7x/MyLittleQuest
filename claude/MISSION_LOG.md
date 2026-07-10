# MISSION LOG — Enrichissement assets SM-2 (CLF-C02) : les 17 concepts à un seul asset

**Date** : 2026-07-10 (session nocturne autonome)
**Branche** : claude/loving-curie-l3m6q9
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **La mission prévue (Domaine 4 — Billing/Pricing/Support) était DÉJÀ FAITE.** Elle existe dans
  la **PR #10** (ouverte, draft, 14 concepts / 28 assets, créée le 2026-07-09, branche
  `claude/loving-curie-d74pqn`). **Je ne l'ai PAS régénérée** (garde-fou anti-doublon, règle #1 de
  l'ancien `NEXT_MISSION.md`). L'ancien `NEXT_MISSION.md` avait été écrit **avant** que cette PR #10
  ne soit produite.
- **À la place, j'ai fait un travail utile, non-doublon et sans décision requise** : enrichir en
  assets les **17 concepts de `main` qui n'avaient qu'UN seul asset** (mauvaise rotation SM-2 — un
  concept à réviser renvoyait toujours le même item). **+34 assets** (2 par concept) → chacun de ces
  17 concepts passe à **3 assets**. `python3 scripts/validate.py` → ✅ OK (72 concepts / **166**
  assets / **166** mappings). Diff **100 % additif : 661 insertions, 0 suppression**.
- **Il y a maintenant 3 PR de contenu ouvertes** qui appendent toutes aux mêmes tableaux JSON →
  **conflits Git d'append triviaux attendus** (garder tous les blocs). Voir « Décision demandée ».

## Ce qui a été fait

Enrichissement pédagogique pour améliorer la rotation SM-2. Les 17 concepts déjà mergés sur `main`
qui n'avaient qu'un asset en reçoivent 2 de plus (types complémentaires de l'existant), pour atteindre
3 assets chacun. **Aucun nouveau concept**, donc aucune nouvelle recherche de `source_url` (garde-fou
§6.1 concerne les concepts, pas les assets). Contenu original, ancré sur le `core_explanation` de
chaque concept — aucune reproduction de question d'examen (§6.3).

Concepts enrichis (par domaine) :
- **Cloud Concepts (5)** : economies-of-scale, elasticity-agility-global, deployment-models,
  well-architected-framework, economics-tco.
- **Security and Compliance (5)** : iam-identities, iam-least-privilege, iam-mfa,
  encryption-at-rest-in-transit, trusted-advisor-security.
- **Cloud Technology and Services (7)** : infra-global-accelerator, svc-outposts, comp-ecs,
  comp-eks, comp-elastic-beanstalk, stor-aws-backup, dev-codepipeline.

## Certification / domaine traités

- **aws-cloud-practitioner** — enrichissement transverse (Domaines 1, 2 et parties du 3 déjà sur `main`).
- **34 assets créés** : QCM ×17, flashcards ×7, swipe ×8, match ×2 (aucun scénario ajouté cette fois).
  34 mappings (1 par asset, 0 orphelin). Ids sans collision (suites continuées par préfixe/type).
- Totaux certif sur cette branche (base = `main`, qui contient déjà le Lot D mais **pas** le Lot C
  ni le Domaine 4) : **72 concepts, 166 assets, 166 mappings**.

## Répartition finale des assets par concept (les 72 concepts de `main`)

- 0 concept à 1 asset (**objectif atteint**, ils étaient 17).
- 11 concepts à 2 assets, 36 à 3, 17 à 4, 7 à 5, 1 à 7.

## Contrôle technique passé

- `python3 scripts/validate.py` : ✅ OK (schéma par format + intégrité référentielle : 72/166/166).
- Diff : **661 insertions, 0 suppression** (ajout strict, non-régression garantie).
- Aucun secret / credential dans le diff (contenu 100 % pédagogique).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,match}.json` (+34 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+34 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)
- `content/aws-cloud-practitioner/concepts.json` : **non modifié** (0 nouveau concept).

## Garde-fous vérifiés

- §6.1 Aucun nouveau concept → pas de nouveau `source_url` requis. §6.2 Aucune certif hors roadmap.
- §6.3 Contenu original pédagogique, aucun braindump. §6.4 Statut certif inchangé (`in_progress`).
- §6.5 Aucune touche côté client (IndexedDB/exports). §6.6 Aucun secret. §6.7 Branche + PR draft, pas
  de push sur `main`.

## Questions ouvertes pour Shai (par priorité)

1. **3 PR de contenu ouvertes à merger** : PR #7 (Lot C — réseau/BdD), PR #10 (Domaine 4 — billing),
   et **cette PR** (enrichissement). Elles appendent toutes aux mêmes tableaux JSON → **conflits
   d'append triviaux** (garder tous les blocs). **Ordre de merge suggéré** : #7 → #10 → cette PR
   (ordre de production), en rebasant chaque suivante. Aucune collision d'id entre les trois.
2. **Statut certif** : une fois PR #7 + #10 mergées, les 4 domaines sont couverts → basculer vers
   `needs_review` (garde-fou §6.4 ; exam guide PDF inaccessible au fetcher). Non fait cette session
   pour ne pas surestimer le coverage tant que #7/#10 ne sont pas sur `main`.
3. **Le pipeline produit plus vite que le merge** : 3 PR de contenu s'accumulent non mergées. Décision
   utile : soit merger le backlog, soit mettre en pause la génération de nouveau contenu jusqu'à
   résorption. Voir `NEXT_MISSION.md`.
4. Décisions produit anciennes toujours ouvertes (langue FR/bilingue ; granularité du champ `domain` ;
   critère de `complete`) — inchangées.

## Lien PR

PR (draft) de cette session : https://github.com/S2K7x/MyLittleQuest/pull/11
Autres PR de contenu ouvertes : #7 (Lot C) et #10 (Domaine 4 — Billing).
