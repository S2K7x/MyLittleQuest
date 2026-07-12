# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les Pull Requests ouvertes** (`mcp__github__list_pull_requests`) pour ne
pas refaire un lot déjà produit. Ce garde-fou a déjà évité des doublons (sessions des 2026-07-10/11/12).

État des PR de contenu ouvertes au 2026-07-12 (après merge de #11 et #12) :

- **PR #7 (ouverte, draft)** — Lot C (Networking & Databases, 14 concepts / 28 assets). Non mergée.
- **PR #10 (ouverte, draft)** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets). Non mergée.
- **PR de cette session (ouverte, draft)** — Montée en difficulté 3 (10 assets, 0 concept). Non mergée.

Les trois appendent aux mêmes tableaux JSON → **conflits d'append triviaux** à l'intégration (garder
tous les blocs). **Aucune collision d'id.** Lancer `python3 scripts/validate.py` avant chaque PR.

## ⚠️ Le backlog de PR est le vrai point de blocage — arbitrage de Shai souhaité

Le pipeline **produit plus vite que Shai ne merge**. L'enrichissement SM-2 « planchers » est terminé et
mergé (#11, #12). Il reste **3 PR de contenu non mergées** (#7, #10, celle de cette nuit). Deux voies :

- **(A) Résorber le backlog (recommandé)** : merger **#7 → #10 → PR de cette session** (ordre de
  production, rebaser chaque suivante). Une fois #7 et #10 sur `main`, les **4 domaines du blueprint CCP**
  sont couverts → passer le statut certif à **`needs_review`** (garde-fou §6.4). La prochaine session
  aura alors une base propre et complète, et pourra générer sans backlog.
- **(B) Laisser tourner le pipeline** : voir la mission recommandée ci-dessous — sûre et non-doublon,
  mais qui ajoute une 4ᵉ PR au backlog.

## Mission recommandée (si Shai ne tranche pas et laisse tourner le pipeline)

**Étendre la couverture difficulté 3 aux familles non encore traitées.** La session du 2026-07-12 a
posé une première couche de difficulté 3 sur le **compute avancé / edge / event-driven / data-ML**. Il
reste à couvrir en difficulté 3, toujours sur des concepts **déjà présents sur `main`** (donc
non-doublon vis-à-vis de #7 et #10) :

- **Sécurité (Domaine 2, 30 % du blueprint)** : arbitrages IAM (policies vs roles vs users), modèle de
  responsabilité partagée sur cas concrets, chiffrement (KMS vs SSE), MFA/least privilege. Cibles
  probables déjà sur `main` : concepts à préfixe `sec-` / `iam-` / `trusted-advisor-security`.
- **Storage (Domaine 3)** : arbitrage classes S3 (coût/accès), EBS vs EFS vs S3, snapshots. Cibles à
  préfixe `stor-` / `comp-ec2-*`.
- **Cloud Concepts (Domaine 1)** : Well-Architected / CAF / avantages du cloud sur des scénarios de
  décision.
- **Volume** : ~8-12 assets de difficulté 3 (mix qcm/scénario). Continuer les suites d'id par
  préfixe/type. Privilégier quelques scénarios (format le plus sous-représenté : 15/187).
- **Ne PAS toucher** aux concepts réseau/BdD/billing tant que #7 et #10 ne sont pas mergés (doublon).

- **Dossier** : `content/aws-cloud-practitioner/` (AJOUT strict, ne rien écraser).
- **Branche** : celle imposée par la config de session (`claude/...`), repartant de `main` à jour
  (`git fetch origin main && git checkout -B <branche> origin/main`).
- **Rappels garde-fous** : contenu original, pas de braindump (§6.3) ; match ≥ 2 paires ; qcm
  `correct_index` valide ; swipe `is_true` booléen ; scénario = exactement 1 choix correct. Valider via
  `scripts/validate.py`. Aucun secret. PR draft.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint
(§6.4). Tant que #7 et #10 ne sont pas mergées, rester à `in_progress`.

## Pistes alternatives (si Shai préfère réorienter)

- **Résorber le backlog de PR** (voie A ci-dessus) — probablement le plus utile à court terme.
- **CI/robustesse** : `scripts/validate.py` est déjà lancé par une GitHub Action (PR #8 mergée) — vérifier
  qu'elle tourne bien sur les PR de contenu ouvertes, sinon l'ajuster.
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
