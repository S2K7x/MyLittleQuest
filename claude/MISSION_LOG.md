# MISSION LOG — Enrichissement SM-2 (CLF-C02) : les 11 concepts de `main` à 2 assets

**Date** : 2026-07-11 (session nocturne autonome)
**Branche** : claude/loving-curie-t51kkw
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **PR #11 (enrichissement des 17 concepts à 1 asset) a été MERGÉE** entre-temps → `main` est
  désormais à **72 concepts / 166 assets / 166 mappings**. Cette session repart de ce `main` à jour.
- **Mission de la nuit exécutée** : amener les **11 concepts de `main` qui n'avaient que 2 assets**
  à **3 assets** (+1 asset chacun, type **complémentaire** de l'existant). **+11 assets, +11 mappings.**
  Résultat : **plus aucun concept sous 3 assets** (rotation SM-2 assainie). Nouveaux totaux :
  **72 concepts / 177 assets / 177 mappings**. `python3 scripts/validate.py` → ✅ OK.
- **Diff 100 % additif : 255 insertions, 0 suppression.** Aucun concept touché, aucune `source_url`
  requise (garde-fou §6.1 concerne les concepts, pas les assets).
- **2 PR de contenu restent ouvertes et non mergées** : **PR #7** (Lot C — Networking & Databases,
  14 concepts / 28 assets) et **PR #10** (Domaine 4 — Billing, 14 concepts / 28 assets). Elles
  appendent aux mêmes tableaux JSON → **conflits d'append triviaux** à l'intégration (garder tous
  les blocs). **Aucune collision d'id** avec cette PR. Voir « Décision demandée ».

## Ce qui a été fait

Enrichissement pédagogique ciblé pour la rotation SM-2 : chacun des 11 concepts déjà sur `main`
qui n'avait que 2 assets reçoit **1 asset supplémentaire d'un type qu'il n'avait pas encore**, pour
atteindre 3 assets. Le format **scénario** (le plus sous-représenté : 10/166) a été privilégié quand
il était pédagogiquement pertinent → **2 scénarios ajoutés** (comp-fargate, ml-sagemaker), portant
le total de scénarios à **12**. Contenu 100 % original, ancré sur le `core_explanation` de chaque
concept — aucune reproduction de question d'examen (§6.3).

Concepts enrichis et asset ajouté (type complémentaire) :
- **cloud-adoption-framework** (Cloud Concepts) → **match** (`match-cloud-04`) : les 6 perspectives du CAF.
- **iam-roles-temp-credentials** (Security) → **flashcard** (`flashcard-sec-10`).
- **aws-compliance-programs** (Security) → **swipe** (`swipe-sec-10`).
- **infra-local-zones** (Cloud Tech) → **swipe** (`swipe-infra-09`).
- **svc-management-console** (Cloud Tech) → **swipe** (`swipe-infra-10`).
- **svc-iac-concept** (Cloud Tech) → **flashcard** (`flashcard-infra-09`).
- **comp-auto-scaling** (Cloud Tech) → **qcm** (`qcm-comp-08`).
- **comp-fargate** (Cloud Tech) → **scénario** (`scenario-comp-02`).
- **app-eventbridge** (Cloud Tech) → **qcm** (`qcm-app-03`).
- **ana-glue** (Cloud Tech) → **qcm** (`qcm-ana-02`).
- **ml-sagemaker** (Cloud Tech) → **scénario** (`scenario-ml-01`).

## Certification / domaine traités

- **aws-cloud-practitioner** — enrichissement transverse (Domaines 1, 2 et 3 déjà sur `main`).
- **11 assets créés** : qcm ×3, flashcard ×2, swipe ×3, scénario ×2, match ×1.
  **11 mappings** (1 par asset, 0 orphelin). Ids sans collision (suites continuées par préfixe/type).

## Répartition finale des assets par concept (les 72 concepts de `main`)

- 0 concept à 1 ou 2 assets (**objectif atteint** : ils étaient 11 à 2 assets).
- 47 concepts à 3 assets, 17 à 4, 7 à 5, 1 à 7.

## Contrôle technique passé

- `python3 scripts/validate.py` : ✅ OK (schéma par format + intégrité référentielle : 72 / 177 / 177).
- Diff : **255 insertions, 0 suppression** (ajout strict, non-régression garantie).
- Aucun secret / credential dans le diff (contenu 100 % pédagogique).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+11 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+11 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)
- `content/aws-cloud-practitioner/concepts.json` : **non modifié** (0 nouveau concept).

## Garde-fous vérifiés

- §6.1 Aucun nouveau concept → pas de nouveau `source_url` requis. §6.2 Aucune certif hors roadmap.
- §6.3 Contenu original pédagogique, aucun braindump. §6.4 Statut certif inchangé (`in_progress`).
- §6.5 Aucune touche côté client (IndexedDB/exports). §6.6 Aucun secret. §6.7 Branche + PR draft, pas
  de push sur `main`.

## Questions ouvertes pour Shai (par priorité)

1. **2 PR de contenu ouvertes à merger** : **PR #7** (Lot C — réseau/BdD) et **PR #10** (Domaine 4 —
   billing). Elles appendent aux mêmes tableaux JSON que cette PR → **conflits d'append triviaux**
   (garder tous les blocs). **Ordre de merge suggéré** : #7 → #10 → cette PR. Aucune collision d'id.
2. **Statut certif** : une fois PR #7 + #10 mergées, les 4 domaines sont couverts → basculer vers
   `needs_review` (garde-fou §6.4 ; exam guide PDF inaccessible au fetcher). Non fait cette session
   pour ne pas surestimer le coverage tant que #7/#10 ne sont pas sur `main`.
3. **Le pipeline produit plus vite que le merge** : le backlog est passé de 3 à 2 PR (PR #11 mergée),
   mais cette PR le ramène à 3. **Résorber le backlog (merger #7/#10) est probablement plus utile que
   de générer davantage.** Détail des options dans `NEXT_MISSION.md`.
4. Décisions produit anciennes toujours ouvertes (langue FR/bilingue ; granularité du champ `domain` ;
   critère de `complete` ; plans de support AWS en restructuration — soulevé par PR #10) — inchangées.

## Lien PR

PR (draft) de cette session : https://github.com/S2K7x/MyLittleQuest/pull/12
Autres PR de contenu ouvertes : #7 (Lot C) et #10 (Domaine 4 — Billing).
