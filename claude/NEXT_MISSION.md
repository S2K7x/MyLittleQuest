# NEXT MISSION

## Générer le contenu Domain 3 — Cloud Technology and Services (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter, ne pas écraser les Domaines 1 et 2)
**Branche à créer** : `claude/content-aws-clf-c02-domain-3` (ou la branche `claude/...` assignée
à la session)

### Contexte

- Domaine 1 (Cloud Concepts, 24 %) : 12 concepts + 24 assets — fait, PR #2.
- Domaine 2 (Security and Compliance, 30 %) : 17 concepts + 27 assets — fait (cette PR).
- Reste : **Domaine 3 (34 %, le plus lourd de l'examen)** et Domaine 4 (Billing/Pricing, 12 %).

Le Domaine 3 est le plus gros en volume et couvre les services cœur d'AWS. Il est probablement
trop vaste pour une seule session : découper par familles de services (voir ci-dessous) et en
traiter une ou deux par nuit.

### Objectif

Couvrir le **Domain 3 : Cloud Technology and Services** du CLF-C02, structuré en 4 tâches :
- Task 3.1 : Define methods of deploying and operating in the AWS Cloud (modes de déploiement,
  accès : Console, CLI, SDK, IaC ; connectivité : VPN, Direct Connect ; on-prem : Outposts…)
- Task 3.2 : Define the AWS global infrastructure (Régions, Availability Zones, edge locations,
  CloudFront, points of presence)
- Task 3.3 : Identify AWS compute, storage, networking, and database services
- Task 3.4 : Identify AWS services for common categories (analytics, ML, dev tools, monitoring…)

### Découpage suggéré (1 session = 1 lot cohérent)

**Lot A — Infrastructure globale + déploiement (Tasks 3.1 & 3.2)** ← recommandé pour la prochaine session
- Régions, Availability Zones, Edge locations / Points of Presence
- Amazon CloudFront (CDN), AWS Global Accelerator (niveau reconnaissance)
- Méthodes d'accès : Management Console, AWS CLI, SDK, Infrastructure as a Code (CloudFormation)
- Connectivité hybride : AWS VPN, AWS Direct Connect (notions), AWS Outposts (reconnaissance)
- ~12-15 concepts, `domain` = `"Cloud Technology and Services"`

Lots suivants (à planifier après le lot A) :
- **Lot B — Compute & Storage** : EC2, Lambda, ECS/EKS/Fargate (reconnaissance), Elastic
  Beanstalk ; S3, EBS, EFS, S3 Glacier, Storage Gateway.
- **Lot C — Networking & Databases** : VPC, subnets, Route 53, ELB ; RDS, Aurora, DynamoDB,
  ElastiCache, Redshift.
- **Lot D — Autres catégories** : analytics, ML, dev tools, monitoring (CloudWatch, CloudTrail),
  intégration applicative (SQS, SNS).

### Contenu à générer (lot A)

- **Concepts** (~12-15 dans `concepts.json`, en AJOUT) — chacun avec un `source_url` précis vers
  docs.aws.amazon.com (page exacte).
- **Assets** — au moins 4 des 5 formats, mêmes minimums : QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6,
  + scénario(s) et/ou match. En AJOUT aux fichiers existants (préfixe d'id suggéré : `-infra-`
  ou `-svc-` pour éviter toute collision avec `-cloud-` et `-sec-`).
- **Mapping** : compléter `asset_concepts.json`, ne rien casser.

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis vers docs.aws.amazon.com. Utiliser **WebSearch**
  (WebFetch renvoie 403 sur AWS).
- Aucune reproduction de question d'examen réelle / braindump.
- Ne pas marquer la certif `complete` (Domaines 3 partiel + 4 restants).
- Aucun secret dans les commits. Ne pas toucher au code côté client / IndexedDB.
- Valider JSON + intégrité référentielle (0 orphelin, 0 concept sans asset) avant la PR — le
  script de contrôle utilisé cette nuit est reproductible (parcours concepts/assets/mapping).

### Fin de mission attendue

PR `claude/...` → `main` (draft) avec résumé (nb concepts / assets par type), liste des sources
consultées, et note de coverage du lot traité vs les tâches du blueprint.

---

## Décisions produit en attente de Shai (non bloquantes, à trancher bientôt)

Reportées depuis les Domaines 1 et 2, elles ne bloquent pas la génération mais méritent un
arbitrage avant que le volume ne grossisse :

1. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ? Impact possible sur le
   schéma (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche
   (3.1…3.4) pour affiner le filtrage côté app ?
3. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403). Coverage jugé sur la
   structure du blueprint + docs.aws citées. Suffisant, ou vérification manuelle du PDF
   souhaitée avant `needs_review`/`complete` ?

## Pistes alternatives (si tu préfères réorienter)

- **Mettre en place une validation automatisée CI** (script de contrôle de schéma + intégrité
  référentielle des JSON, branché en GitHub Action) pour sécuriser toutes les futures
  générations. De plus en plus utile maintenant que le contenu grossit (29 concepts, 41 assets).
- **Enrichir les Domaines 1 & 2** : plus d'assets par concept (meilleure rotation SM-2),
  scénarios supplémentaires, montée en difficulté progressive.
- **Traiter le Domaine 4 (Billing/Pricing, 12 %)** avant le Domaine 3 : plus petit, permet de
  compléter un domaine entier rapidement (Cost Explorer, Budgets, Pricing Calculator, plans de
  support, TCO, consolidated billing via Organizations).
