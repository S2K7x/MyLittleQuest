# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les Pull Requests ouvertes** (`mcp__github__list_pull_requests`) pour ne
pas refaire un lot déjà produit. Ce garde-fou a déjà évité des doublons (sessions du 2026-07-10 et
2026-07-11).

État des PR de contenu ouvertes au 2026-07-11 (après merge de PR #11) :

- **PR #7 (ouverte, draft)** — Lot C (Networking & Databases, 14 concepts / 28 assets). Non mergée.
- **PR #10 (ouverte, draft)** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets). Non mergée.
- **PR de cette session (ouverte, draft)** — Enrichissement SM-2 des 11 concepts à 2 assets (+11 assets,
  0 concept). Non mergée.

Les trois appendent aux mêmes tableaux JSON → **conflits d'append triviaux** à l'intégration (garder
tous les blocs). **Aucune collision d'id.** Lancer `python3 scripts/validate.py` avant chaque PR.

## ⚠️ L'enrichissement SM-2 « planchers » est TERMINÉ — décision de Shai souhaitée

Sur `main`, **plus aucun concept n'est sous 3 assets** (les 17 à 1 asset → PR #11 mergée ; les 11 à
2 assets → cette PR). La cible d'enrichissement « remonter les planchers » est **épuisée**. Répartition
actuelle sur `main` + cette PR : 47 concepts à 3 assets, 17 à 4, 7 à 5, 1 à 7.

**3 PR de contenu s'accumulent non mergées. Générer encore aggrave le backlog et les conflits
d'append.** La suite dépend d'un arbitrage de Shai — deux voies :

- **(A) Résorber le backlog (recommandé)** : merger **#7 → #10 → PR de cette session** (ordre de
  production, rebaser chaque suivante), puis passer le statut certif à `needs_review` (les 4 domaines
  seront alors sur `main`). Après ça, la prochaine session aura une base propre et à jour, et on pourra
  reprendre la génération sans backlog.
- **(B) Laisser tourner le pipeline sans nouveau domaine** : voir la mission recommandée ci-dessous,
  sûre et non-doublon, mais qui ajoute une 4ᵉ PR au backlog.

## Mission recommandée (si Shai ne tranche pas et laisse tourner le pipeline)

**Montée en difficulté — fin de courbe SM-2.** La grande majorité des assets de `main` sont en
difficulté 1-2. Ajouter des **QCM et scénarios de difficulté 3** (situations d'arbitrage, comparaisons
fines) sur les concepts les plus avancés **déjà sur `main`** (pour rester non-doublon vis-à-vis de #7
et #10 encore non mergés) :

- **Cibles suggérées** (déjà sur `main`) : `svc-outposts`, `comp-eks`, `comp-ecs`, `comp-fargate`,
  `infra-local-zones`, `infra-global-accelerator`, `ml-sagemaker`, `app-eventbridge`, `ana-glue`.
- **Volume** : ~8-12 assets de difficulté 3 (mix qcm/scénario), en **ajout strict**. Continuer les
  suites d'id par préfixe/type (pas de collision). Le scénario reste le format le plus sous-représenté
  (12/177) — en privilégier quelques-uns.
- **Ne PAS toucher** aux concepts réseau/BdD/billing tant que #7 et #10 ne sont pas mergés (ils y sont
  déjà traités → risque de doublon).

- **Dossier** : `content/aws-cloud-practitioner/` (AJOUT strict, ne rien écraser).
- **Branche** : celle imposée par la config de session (`claude/...`), repartant de `main` à jour
  (`git fetch origin main && git checkout -B <branche> origin/main`).
- **Rappels garde-fous** : assets sans `source_url` (§6.1 = champ concept) ; contenu original, pas de
  braindump (§6.3) ; match ≥ 2 paires ; qcm `correct_index` valide ; swipe `is_true` booléen ; scénario
  = exactement 1 choix correct. Valider via `scripts/validate.py`. Aucun secret. PR draft.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint
(§6.4). Tant que #7 et #10 ne sont pas mergées, rester à `in_progress`.

## Pistes alternatives (si Shai préfère réorienter)

- **Résorber le backlog de PR** (voie A ci-dessus) — probablement le plus utile à court terme.
- **CI/robustesse** : versionner une GitHub Action qui lance `scripts/validate.py` à chaque PR (déjà
  suggéré antérieurement). Améliore la sécurité du pipeline sans produire de contenu.
- **Ajouter une 2ᵉ certification** (OSCP ou AZ-900, évoquées dans la roadmap) — **nécessite d'abord un
  arbitrage de Shai** (garde-fou §6.2 : pas de certif hors `certifications_roadmap.md`).

## Décisions produit en attente de Shai (non bloquantes, inchangées)

1. **Ordre de merge des 3 PR de contenu** (#7, #10, cette PR) et résolution des conflits d'append.
2. **Statut certif → `needs_review`** une fois les 4 domaines sur `main`.
3. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
4. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche ?
5. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint
   + docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
6. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration (Business Support+, arrêt
   d'Enterprise On-Ramp au 01/01/2027). Contenu aligné sur le modèle classique à 5 plans testé par
   CLF-C02 — conserver l'alignement examen ou anticiper la nouvelle nomenclature ?
