# NEXT MISSION

## ⚠️ D'ABORD : vérifier l'état du backlog avant toute génération

Avant de générer, **lister les PR ouvertes** (`mcp__github__list_pull_requests`) et **relire le git log de
`main`**. Des PR peuvent être mergées entre deux sessions. Ne jamais refaire un lot déjà produit.

État au 2026-07-17 (après cette session) :

- **`main`** : **72 concepts / 227 assets / 227 mappings** (3 domaines : Cloud Concepts, Cloud Technology and
  Services, Security and Compliance). Difficulté 1 renforcée (37 → 58 assets), **0 concept faible**.
- **PR #7 (ouverte, draft, 11 j)** — Lot C, réseau/BdD, 14 concepts / 28 assets. **Non mergée.**
- **PR #10 (ouverte, draft, 11 j)** — Domaine 4, Billing, 14 concepts / 28 assets. **Non mergée.**
- **PR de cette session (ouverte, draft)** — rampe débutant difficulté 1, Cloud Concepts, **21 assets, 0 concept.**
- PR #17 (outil `merge_content_pr.py`) : **mergée** ✅ — l'outil est sur `main`.

## ⚠️ Le seul vrai blocage restant = décision de merge de Shai (§6.7)

Répété depuis plusieurs nuits : **le pipeline produit plus vite que Shai ne merge.** L'outil de fusion est
livré et sur `main`, la fusion est vérifiée sûre — **il ne manque plus que la décision humaine de merger
#7 et #10.** Une session nocturne ne merge jamais (§6.7). Tant que ce n'est pas fait :

- Générer sur réseau / BdD / billing = **doublon garanti** de #7/#10 → interdit.
- Générer sur les 3 domaines déjà sur `main` = rendement décroissant (déjà bien couverts).

## Recommandation forte (décision de Shai)

**(A) Résorber le backlog — la seule action à vrai rendement.** Procédure (outil déjà sur `main`) :

```bash
git fetch origin
git checkout -B integration-backlog origin/main
python3 scripts/merge_content_pr.py \
    origin/claude/content-aws-clf-c02-domain-3-lot-c \   # #7
    origin/claude/loving-curie-d74pqn                    # #10
python3 scripts/validate.py     # union par id + rapport de couverture
# relire, committer, ouvrir la PR d'intégration, merger, fermer #7 et #10.
```

Une fois #7 + #10 sur `main`, les **4 domaines du blueprint CCP sont couverts** → passer le statut certif à
**`needs_review`** dans `certifications_roadmap.md` (§6.4).

## Si Shai laisse tourner le pipeline malgré tout — options non-doublon restantes

Toutes strictement **hors réseau/BdD/billing** tant que #7/#10 non mergées, **sur des concepts déjà sur `main`**,
en **ajout strict** avec ids au-dessus des maxima actuels (vérifier l'absence de collision avec #7/#10 comme
cette nuit) :

- **(B) Compléter les 2 concepts faibles — SEULEMENT après merge de #7.** `net-vpc-endpoints` et `db-neptune`
  n'auront qu'1 asset une fois #7 mergée. Impossible avant (ces concepts n'existent pas encore sur `main`).
- **(C) Étendre la rampe difficulté 1 aux 2 autres domaines.** La difficulté 1 reste globalement mince (58/227),
  et le grain fin montre **Security and Compliance d1 = 9** et surtout un besoin d'onboarding sur
  Cloud Technology and Services (compute/storage de base). Prochaine cible logique : **rampe débutant
  Security and Compliance** (modèle de responsabilité partagée, IAM de base, chiffrement au repos/en transit —
  concepts déjà sur `main` et sourcés). Puis un mini-lot débutant sur les services cœur (EC2, S3).
- **(D) Poursuivre le rééquilibrage `match`/`scenario`** (désormais 21 / 25, toujours les plus minces) sur des
  concepts déjà sur `main` hors réseau/BdD/billing. Rendement décroissant.

**Contraintes communes (B/C/D)** : dossier `content/aws-cloud-practitioner/` en AJOUT strict (diff 100 %
additif) ; contenu original, pas de braindump (§6.3) ; schémas de `CLAUDE.md` §3 respectés (match ≥ 2 paires,
scénario = exactement 1 choix correct, swipe `is_true` booléen, qcm `correct_index` valide) ; valider via
`scripts/validate.py` ; aucun secret ; PR draft ; jamais de push sur `main` ni de merge.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint (§6.4).

## Décisions produit en attente de Shai (non bloquantes)

1. **Merge du backlog #7 + #10** (outil prêt) puis **statut certif → `needs_review`**. ← priorité n°1.
2. **Durcir `validate.py`** : rendre bloquant le plancher « ≥ 2 assets par concept » ? (aujourd'hui indicatif).
3. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
4. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche du blueprint ?
5. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint +
   docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
6. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration. Conserver l'alignement examen
   (5 plans classiques) ou anticiper la nouvelle nomenclature ?
7. **Ajouter une 2ᵉ certification** (OSCP ou AZ-900) — arbitrage de Shai requis (§6.2). Pertinent une fois
   la CCP en `needs_review`/`complete`.
