# NEXT MISSION

## Générer le contenu Domain 3 — Lot B : Compute & Storage (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter, ne rien écraser)
**Branche à créer** : `claude/content-aws-clf-c02-domain-3-lot-b` (ou la branche `claude/...`
assignée à la session)

### Contexte

Avancement du Domaine 3 (Cloud Technology and Services, 34 %, découpé en lots) :
- **Lot A — Infrastructure globale + déploiement (Tasks 3.1 & 3.2)** : fait (cette PR) —
  15 concepts, 25 assets.
- Restent les lots B, C, D, qui correspondent surtout à la Task 3.3 (compute, storage, networking,
  databases) et 3.4 (autres catégories de services).

État global de la certif : 44 concepts, 76 assets. Domaines 1 (Cloud Concepts) et 2 (Security &
Compliance) complets ; Domaine 3 partiel (Lot A) ; Domaine 4 (Billing/Pricing) non commencé.

### Objectif — Lot B : Compute & Storage (partie de la Task 3.3)

Couvrir les services **compute** et **storage** cœur du CLF-C02. Suggestion de découpage des
concepts (~13-16 concepts, `domain` = `"Cloud Technology and Services"`) :

**Compute**
- Amazon EC2 (instances, notion de types d'instances, familles) — reconnaissance
- Modèles de tarification EC2 (On-Demand, Reserved, Spot, Savings Plans) — niveau CCP
- AWS Lambda (serverless, event-driven, pas de serveur à gérer)
- Conteneurs : Amazon ECS, Amazon EKS, AWS Fargate (reconnaissance : orchestration vs serverless)
- AWS Elastic Beanstalk (PaaS, déploiement d'application géré)
- Auto Scaling (mise à l'échelle automatique) — lien avec l'élasticité vue au Domaine 1

**Storage**
- Amazon S3 (object storage, buckets, durabilité) + classes de stockage S3 (niveau CCP)
- Amazon S3 Glacier / archivage (Instant Retrieval, Flexible Retrieval, Deep Archive)
- Amazon EBS (block storage attaché aux instances EC2)
- Amazon EFS (système de fichiers partagé, élastique)
- AWS Storage Gateway (hybride) — reconnaissance
- (optionnel) AWS Backup — reconnaissance

### Contenu à générer (Lot B)

- **Concepts** (~13-16, en AJOUT dans `concepts.json`), chacun avec un `source_url` précis vers
  docs.aws.amazon.com (page exacte, vérifiée via **WebSearch** — WebFetch renvoie 403 sur AWS).
- **Assets** — les mêmes minimums qu'aux lots précédents : QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6,
  + au moins 1 scénario et 1 match. Préfixe d'id suggéré : `-comp-` / `-stor-` (ou réutiliser
  `-svc-` en veillant à l'unicité). Vérifier l'absence de collision avec les id existants
  (`-cloud-`, `-sec-`, `-infra-`, `-svc-`).
- **Mapping** : compléter `asset_concepts.json`, 1 mapping par asset, 0 orphelin.

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis vers docs.aws.amazon.com. Pas de lien générique.
- Aucune reproduction de question d'examen réelle / braindump.
- Ne pas marquer la certif `complete` (Domaine 3 encore partiel + Domaine 4 restant).
- Aucun secret dans les commits. Ne pas toucher au code côté client / IndexedDB.
- Valider JSON + intégrité référentielle (0 orphelin, 0 concept sans asset, 0 id dupliqué) avant
  la PR. Les scripts `gen`/`validate` de cette nuit sont reproductibles (append-only + contrôles),
  réutilisables comme base.
- Travail en AJOUT strict : ne pas altérer les valeurs des entrées existantes (Domaines 1, 2 et
  Lot A). Le formatage JSON peut être normalisé, mais vérifier que le prefix existant reste égal
  en valeur.

### Fin de mission attendue

PR `claude/...` → `main` (draft) avec résumé (nb concepts / assets par type), liste des sources
consultées, et note de coverage du Lot B vs la Task 3.3 (partie compute/storage).

---

## Décisions produit en attente de Shai (non bloquantes, à trancher bientôt)

Reportées depuis les Domaines 1, 2 et le Lot A du Domaine 3 — elles ne bloquent pas la génération
mais méritent un arbitrage avant que le volume ne grossisse davantage :

1. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ? Impact possible sur le schéma
   (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche
   (3.1…3.4) pour affiner le filtrage côté app ? Devient plus pertinent maintenant que le Domaine 3
   s'étale sur plusieurs lots.
3. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403). Coverage jugé sur la
   structure du blueprint + docs.aws citées. Suffisant, ou vérification manuelle du PDF souhaitée
   avant `needs_review`/`complete` ?

## Pistes alternatives (si tu préfères réorienter)

- **Mettre en place une validation automatisée CI** (GitHub Action lançant le script de contrôle
  schéma + intégrité référentielle des JSON à chaque PR). De plus en plus utile : le contenu
  grossit (44 concepts, 76 assets) et une CI sécuriserait toutes les générations futures. Le script
  `validate.py` écrit cette nuit peut servir de base directe.
- **Traiter le Domaine 4 (Billing/Pricing, 12 %) avant de finir le Domaine 3** : plus petit, permet
  de compléter un domaine entier rapidement (Cost Explorer, AWS Budgets, Pricing Calculator, plans
  de support, TCO, consolidated billing via Organizations).
- **Enrichir les Domaines déjà couverts** : plus d'assets par concept (meilleure rotation SM-2),
  scénarios supplémentaires, montée en difficulté progressive.
