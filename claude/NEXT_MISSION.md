# NEXT MISSION

## ⚠️ D'ABORD : vérifier l'état du backlog avant toute génération

Avant de générer, **lister les PR ouvertes** (`mcp__github__list_pull_requests`) et **relire le git log de
`main`** (des PR peuvent être mergées entre deux sessions). Ne jamais refaire un lot déjà produit.

État au 2026-07-16 (après cette session) :

- **`main`** : 72 concepts / 206 assets / 206 mappings (3 domaines : Cloud Concepts, Cloud Technology and
  Services, Security and Compliance). Couverture **équilibrée** sur ces 3 domaines, **0 concept faible**.
- **PR #7 (ouverte, draft)** — Lot C, réseau/BdD, 14 concepts / 28 assets.
- **PR #10 (ouverte, draft)** — Domaine 4, Billing, 14 concepts / 28 assets.
- **PR de cette session (ouverte, draft)** — **outil** `scripts/merge_content_pr.py` + pilotage. **0 contenu.**

## ⚠️ Le backlog reste LE blocage — mais il est désormais outillé et vérifié

Constat répété depuis plusieurs nuits : **le pipeline produit plus vite que Shai ne merge**. Cette nuit a
tranché la question technique qui traînait : **#7 et #10 ne se mergeaient pas en un clic** (conflits entrelacés
sur tous les fichiers de contenu, pas des « appends triviaux »). C'était la vraie raison du blocage de 10 jours.

**La fusion est maintenant vérifiée sûre et outillée** (`main ∪ #7 ∪ #10` = 100 / 262 / 262, `validate.py` ✅,
0 collision, 4 domaines couverts). Voir `claude/MISSION_LOG.md` pour la procédure exacte en 2 minutes.

**Tant que #7 et #10 ne sont pas sur `main`, générer du contenu neuf a un rendement quasi nul** : les 3 domaines
présents sont déjà équilibrés, et réseau/BdD/billing sont des doublons garantis de #7/#10.

## Recommandation forte (décision de Shai) : résorber le backlog avec l'outil livré

**(A) Résorber le backlog (fortement recommandé)** — procédure vérifiée cette nuit :

```bash
git fetch origin
git checkout -B integration-backlog origin/main
python3 scripts/merge_content_pr.py \
    origin/claude/content-aws-clf-c02-domain-3-lot-c \   # #7
    origin/claude/loving-curie-d74pqn                    # #10
python3 scripts/validate.py            # -> 100 / 262 / 262, ✅
# relire, committer, ouvrir la PR d'intégration, merger, fermer #7 et #10.
```

Une fois #7 + #10 sur `main`, les **4 domaines du blueprint CCP sont couverts** → passer le statut certif à
**`needs_review`** dans `certifications_roadmap.md` (§6.4). Cette décision de **merge** relève de Shai (§6.7).

## Si Shai laisse tourner le pipeline malgré tout — options non-doublon restantes

Toutes strictement **hors réseau/BdD/billing** tant que #7/#10 non mergées, et **uniquement sur des concepts
déjà sur `main`** :

- **(B) Compléter les 2 concepts faibles — mais SEULEMENT après merge de #7.** `net-vpc-endpoints` et
  `db-neptune` n'ont qu'1 asset. **Impossible avant merge de #7** (ces concepts n'existent pas encore sur
  `main` → `validate.py` échouerait). À garder en tête pour la première session *après* résorption du backlog.
- **(C) Rampe « débutant » (difficulté 1)** sur les concepts fondamentaux déjà sur `main` (Cloud Concepts,
  sécurité de base). La difficulté 1 (37 assets) reste la plus mince. Ajout strictement additif, ids en
  continuant la numérotation, vérifier l'absence de collision avec #7/#10.
- **(D) Poursuivre le rééquilibrage `match`/`scenario`** (18 / 23, toujours les plus minces) sur des concepts
  déjà sur `main` hors réseau/BdD/billing. Rendement décroissant — à ne faire que si (A) n'est pas encore fait
  par Shai.

**Contraintes communes (B/C/D)** : dossier `content/aws-cloud-practitioner/` en AJOUT strict (diff 100 %
additif) ; contenu original, pas de braindump (§6.3) ; schémas de `CLAUDE.md` §3 respectés (match ≥ 2 paires,
scénario = exactement 1 choix correct, swipe `is_true` booléen, qcm `correct_index` valide) ; valider via
`scripts/validate.py` ; aucun secret ; PR draft ; jamais de push sur `main`.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint (§6.4).

## Décisions produit en attente de Shai (non bloquantes)

1. **Merge du backlog #7 + #10** (outil prêt, fusion vérifiée) puis **statut certif → `needs_review`**.
2. **Durcir `validate.py`** : rendre bloquant le plancher « ≥ 2 assets par concept » ? (aujourd'hui indicatif).
3. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
4. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche du blueprint ?
5. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint +
   docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
6. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration (Business Support+, arrêt d'Enterprise
   On-Ramp au 01/01/2027). Conserver l'alignement examen (5 plans classiques) ou anticiper la nouvelle
   nomenclature ?
7. **Ajouter une 2ᵉ certification** (OSCP ou AZ-900, notes de la roadmap) — arbitrage de Shai requis (§6.2).
   Pertinent une fois la CCP en `needs_review`/`complete`.
