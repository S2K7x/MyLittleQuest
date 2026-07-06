# NEXT MISSION

## Générer le contenu Domain 3 — Lot D : autres catégories de services (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter, ne rien écraser)
**Branche à créer** : `claude/content-aws-clf-c02-domain-3-lot-d` (ou la branche `claude/...`
assignée à la session)

### Contexte

Avancement du Domaine 3 (Cloud Technology and Services, 34 %, découpé en lots) :
- **Lot A — Infrastructure globale + déploiement (Tasks 3.1 & 3.2)** : fait — 15 concepts, 25 assets.
- **Lot B — Compute & Storage (part de la Task 3.3)** : fait — 15 concepts, 28 assets.
- **Lot C — Networking & Databases (fin de la Task 3.3)** : fait (PR précédente) — 14 concepts, 28 assets.
- **Reste le Lot D (Task 3.4 — identifier les autres catégories de services AWS).**

État global de la certif : **73 concepts, 132 assets**. Domaines 1 (Cloud Concepts) et 2 (Security
& Compliance) complets ; Domaine 3 aux 3/4 (Lots A + B + C) ; Domaine 4 (Billing/Pricing/Support)
non commencé.

### Objectif — Lot D : autres catégories de services (Task 3.4 du blueprint)

Couvrir, au **niveau reconnaissance CCP**, les grandes familles de services non encore traitées.
Suggestion de découpage (~14-16 concepts, `domain` = `"Cloud Technology and Services"`) :

**Monitoring & observabilité** (préfixe d'id suggéré `-mon-`)
- Amazon CloudWatch (métriques, alarmes, logs, dashboards) — reconnaissance
- AWS CloudTrail (journalisation des appels d'API / gouvernance & audit) — reconnaissance
- AWS X-Ray (traçabilité applicative) — reconnaissance légère
- AWS Health / Personal Health Dashboard — optionnel, léger

**Intégration applicative** (préfixe `-app-`)
- Amazon SQS (file de messages, découplage) — reconnaissance
- Amazon SNS (publication/abonnement, notifications) — reconnaissance
- Amazon EventBridge (bus d'événements) — reconnaissance légère
- (optionnel) AWS Step Functions (orchestration de workflows) — léger

**Analytics** (préfixe `-ana-`)
- Amazon Athena (requêtes SQL sur S3) — reconnaissance
- AWS Glue (ETL managé) — reconnaissance légère
- Amazon Kinesis (streaming de données temps réel) — reconnaissance
- (optionnel) Amazon QuickSight (BI / dashboards) — léger

**ML / IA** (préfixe `-ml-`)
- Amazon SageMaker (plateforme ML managée) — reconnaissance
- Amazon Rekognition (vision / analyse d'images) — reconnaissance légère
- Amazon Comprehend (NLP) ou Amazon Polly / Transcribe / Translate — 1-2 exemples de services IA prêts à l'emploi

> Jauger le scope au niveau CCP : l'examen attend la **reconnaissance** de la catégorie et du cas
> d'usage, pas une expertise. Rester factuel et court, un concept = un service et son rôle.

### Contenu à générer (Lot D)

- **Concepts** (~14-16, en AJOUT dans `concepts.json`), chacun avec un `source_url` précis vers
  docs.aws.amazon.com (page exacte, vérifiée via **WebSearch** — WebFetch renvoie 403 sur AWS).
- **Assets** — mêmes minimums qu'aux lots précédents : QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6,
  + au moins 1 scénario et 1 match. Utiliser les nouveaux préfixes d'id ci-dessus (`-mon-`,
  `-app-`, `-ana-`, `-ml-`). Vérifier l'absence de collision avec les id existants (`-cloud-`,
  `-sec-`, `-infra-`, `-svc-`, `-comp-`, `-stor-`, `-net-`, `-db-`).
- **Mapping** : compléter `asset_concepts.json`, 1 mapping par asset, 0 orphelin, 0 concept sans asset.

### Outils réutilisables

Les scripts `gen_lot_c.py` (génération append-only) et surtout `validate.py` (schéma + intégrité
référentielle : 0 orphelin, 0 concept sans asset, 0 id dupliqué) écrits en session sont réutilisables
tels quels comme base : adapter les listes de concepts/assets/mappings, relancer la validation avant
la PR. **Piste toujours recommandée** : versionner `validate.py` dans `scripts/` et l'appeler depuis
une GitHub Action pour sécuriser toutes les PR (voir plus bas).

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis vers docs.aws.amazon.com. Pas de lien générique.
- Aucune reproduction de question d'examen réelle / braindump.
- Après le Lot D, le Domaine 3 sera couvert mais le **Domaine 4 reste à faire** → ne PAS marquer la
  certif `complete`. Rester `in_progress`.
- Aucun secret dans les commits. Ne pas toucher au code côté client / IndexedDB.
- Valider JSON + intégrité référentielle avant la PR.
- Travail en AJOUT strict : ne pas altérer les entrées existantes. Objectif : 0 ligne supprimée au
  diff Git sur les fichiers existants.

### Fin de mission attendue

PR `claude/...` → `main` (draft) avec résumé (nb concepts / assets par type), liste des sources
consultées, et note de coverage du Lot D vs la Task 3.4. À l'issue du Lot D, le Domaine 3 sera
complet : le noter dans le MISSION_LOG et proposer d'enchaîner sur le Domaine 4.

---

## Décisions produit en attente de Shai (non bloquantes, à trancher bientôt)

Reportées depuis les Domaines 1, 2 et les Lots A/B/C du Domaine 3 — elles ne bloquent pas la
génération mais méritent un arbitrage avant que le volume ne grossisse davantage (déjà 73 concepts /
132 assets) :

1. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ? Impact possible sur le schéma
   (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche
   (3.1…3.4) pour affiner le filtrage côté app ? De plus en plus pertinent maintenant que le
   Domaine 3 s'étale sur 4 lots (A + B + C + D).
3. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403). Coverage jugé sur la
   structure du blueprint + docs.aws citées. Suffisant, ou vérification manuelle du PDF souhaitée
   avant `needs_review`/`complete` ?

## Pistes alternatives (si tu préfères réorienter)

- **[Recommandé] Mettre en place une CI de validation** (GitHub Action lançant `validate.py` —
  schéma + intégrité référentielle des JSON — à chaque PR). De plus en plus utile : le contenu
  grossit (73 concepts, 132 assets) et une CI sécuriserait toutes les générations futures contre
  une régression de schéma ou un orphelin. Le script `validate.py` écrit ces dernières nuits est
  prêt à servir de base directe — il faudrait le versionner (ex : `scripts/validate.py`) et ajouter
  un workflow `.github/workflows/`. Petite mission autonome idéale pour une nuit « sans nouveau
  contenu ».
- **Traiter le Domaine 4 (Billing/Pricing/Support, 12 %) avant le Lot D** : plus petit, permet de
  compléter un domaine entier rapidement (Cost Explorer, AWS Budgets, Pricing Calculator, plans de
  support, TCO, consolidated billing via Organizations). À l'issue, il ne resterait que le Lot D
  pour finir toute la certif.
- **Enrichir les Domaines/Lots déjà couverts** : plus d'assets par concept (meilleure rotation
  SM-2), scénarios supplémentaires, montée en difficulté progressive.
