# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les Pull Requests ouvertes** (`mcp__github__list_pull_requests`) pour ne
pas refaire un lot déjà produit. Ce garde-fou a déjà évité des doublons (sessions des 2026-07-10 → 13).

État des PR de contenu ouvertes au 2026-07-13 :

- **PR #7 (ouverte, draft)** — Lot C (Domaine 3 : Networking & Databases, 14 concepts / 28 assets).
- **PR #10 (ouverte, draft)** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets).
- **PR de la session du 2026-07-13 (ouverte, draft)** — 11 assets de difficulté 3 (0 concept).

Les trois appendent aux mêmes tableaux JSON → **conflits d'append triviaux** à l'intégration (garder
tous les blocs). **Aucune collision d'id.** Lancer `python3 scripts/validate.py` avant chaque PR.

## ⚠️ Le backlog de PR est LE point de blocage — arbitrage de Shai vraiment souhaité

Le pipeline **produit plus vite que Shai ne merge**, et ce depuis plusieurs nuits. Les deux grands chantiers
de génération sont désormais terminés côté production :
1. **Enrichissement SM-2 « planchers »** → mergé (#11, #12).
2. **Couverture difficulté 3** → posée sur compute/edge/event-driven (2026-07-12) puis étendue à
   sécurité/stockage/Cloud Concepts (2026-07-13). Large.

Il reste **3 PR de contenu non mergées** (#7, #10, celle du 2026-07-13). **Générer davantage a maintenant un
rendement clairement décroissant** tant que ce backlog n'est pas résorbé.

## Recommandation forte : résorber le backlog plutôt que générer

**(A) Résorber le backlog (fortement recommandé)** : merger **#7 → #10 → PR du 2026-07-13** (ordre de
production, rebaser chaque suivante ; conflits d'append triviaux, garder tous les blocs). Une fois #7 et #10
sur `main`, les **4 domaines du blueprint CCP sont couverts** → passer le statut certif à **`needs_review`**
(garde-fou §6.4). La prochaine session partira alors d'une base propre et complète.

Cette décision de **merge** relève de Shai (une session nocturne ne merge jamais elle-même, §6.7). Si Shai
veut que la session nocturne **prépare** l'intégration sans merger, une tâche utile et sûre existe : voir (C).

## Si Shai laisse tourner le pipeline malgré tout — options non-doublon

- **(B) Dernière frange de difficulté 3** sur les familles encore non couvertes : **monitoring/observabilité**
  (mon-cloudwatch vs mon-cloudtrail vs mon-config : métriques vs audit d'API vs conformité), **IaC**
  (svc-cloudformation / svc-iac-concept), **intégration applicative** (app-sqs vs app-sns : file vs pub/sub).
  ~6-8 assets, mix qcm/scénario, concepts **déjà sur `main`** uniquement. Rendement décroissant assumé.
- **(C) Robustesse du pipeline (utile, sûr, non-doublon de contenu)** : vérifier que la GitHub Action de
  validation (PR #8 mergée) **s'exécute bien sur les PR de contenu ouvertes** (#7, #10, celle du 13). Si elle
  ne tourne pas dessus (branches créées avant l'Action, ou trigger mal configuré), l'ajuster. Éventuellement
  ajouter au `validate.py` un contrôle « tous les concepts ont ≥ N assets » ou un rapport de répartition des
  difficultés par domaine, pour objectiver les prochaines missions.

**Contraintes communes (B/C)** :
- **Dossier** : `content/aws-cloud-practitioner/` (AJOUT strict pour B, ne rien écraser).
- **Branche** : celle imposée par la config de session (`claude/...`), repartant de `main` à jour
  (`git fetch origin main && git checkout -B <branche> origin/main`).
- **Garde-fous** : contenu original, pas de braindump (§6.3) ; match ≥ 2 paires ; qcm `correct_index`
  valide ; swipe `is_true` booléen ; scénario = exactement 1 choix correct. Valider via `scripts/validate.py`.
  Aucun secret. PR draft.
- **Ne PAS toucher** aux concepts réseau/BdD/billing tant que #7 et #10 ne sont pas mergés (doublon).

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint
(§6.4). Tant que #7 et #10 ne sont pas mergées, rester à `in_progress`.

## Décisions produit en attente de Shai (non bloquantes)

1. **Ordre de merge des 3 PR de contenu** (#7, #10, PR du 13) et résolution des conflits d'append trivial.
2. **Statut certif → `needs_review`** une fois les 4 domaines sur `main`.
3. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
4. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche du blueprint ?
5. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint
   + docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
6. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration (Business Support+, arrêt
   d'Enterprise On-Ramp au 01/01/2027). Contenu aligné sur le modèle classique à 5 plans testé par
   CLF-C02 — conserver l'alignement examen ou anticiper la nouvelle nomenclature ?
7. **Ajouter une 2ᵉ certification** (OSCP ou AZ-900, dans les notes de la roadmap) — nécessite un
   arbitrage de Shai (garde-fou §6.2). Utile une fois la CCP en `needs_review`/`complete`.
