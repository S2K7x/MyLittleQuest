# MISSION LOG — AWS CLF-C02, Domaine 3 (Lot C) : Networking & Databases

**Date** : 2026-07-06 (session nocturne autonome)
**Branche** : claude/content-aws-clf-c02-domain-3-lot-c
**Statut** : Terminée — PR ouverte vers main

## Ce qui a été fait

Troisième lot du **Domaine 3 — Cloud Technology and Services** (34 %, le plus lourd de l'examen),
correspondant au **Lot C** planifié : services **réseau** et **bases de données** cœur du CLF-C02
(fin de la Task 3.3). 14 nouveaux concepts (7 networking, 7 databases) et 28 nouveaux assets de jeu
(les 5 formats). Tout est en **AJOUT strict** : aucune valeur existante (Domaines 1, 2 et Lots A+B)
n'a été modifiée (vérifié : 0 ligne supprimée au diff Git, 706 insertions). Contenu en français,
termes AWS conservés en anglais. Chaque concept pointe vers une page exacte de docs.aws.amazon.com,
vérifiée via WebSearch (WebFetch renvoie 403 sur AWS).

## Certification / domaine traités

- **Certif** : `aws-cloud-practitioner` (reste `in_progress` — Domaine 3 encore partiel, Domaine 4 à venir)
- **Domaine** : Domain 3 — Cloud Technology and Services (Lot C : networking & databases, fin de la Task 3.3)
- **Concepts créés** : 14 (total certif : **73**)
- **Assets créés** : 28 → QCM ×8, flashcards ×8, swipe ×8, scénarios ×2, match ×2 (total : **132**)
- **Mapping** : 28 nouvelles entrées dans `asset_concepts.json` (total : **132**)

## Coverage du Lot C vs Task 3.3 (networking/databases)

**Networking (7 concepts)** : Amazon VPC (`net-vpc`), subnets & tables de routage (`net-subnets`),
Internet Gateway (`net-internet-gateway`), NAT Gateway (`net-nat-gateway`), Amazon Route 53
(`net-route53`), Elastic Load Balancing (`net-elb`), AWS PrivateLink / VPC endpoints
(`net-vpc-endpoints`). ✅

**Databases (7 concepts)** : Amazon RDS (`db-rds`), Amazon Aurora (`db-aurora`), Amazon DynamoDB
(`db-dynamodb`), Amazon ElastiCache (`db-elasticache`), Amazon Redshift (`db-redshift`),
Amazon DocumentDB (`db-documentdb`), Amazon Neptune (`db-neptune`). ✅

## Reste du Domaine 3 et suite (à planifier — voir NEXT_MISSION.md)

- **Lot D — Autres catégories de services (Task 3.4)** : monitoring & observabilité (CloudWatch,
  CloudTrail, X-Ray), intégration applicative (SQS, SNS, EventBridge), analytics (Athena, Glue,
  Kinesis), ML/IA (SageMaker, Rekognition, Comprehend), et éventuellement dev tools
  (CodeCommit/CodeBuild/CodePipeline). → fin du Domaine 3.
- Puis **Domaine 4 — Billing, Pricing, and Support** (12 %), non commencé : Cost Explorer,
  AWS Budgets, Pricing Calculator, plans de support, TCO, consolidated billing via Organizations.

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (+14 concepts)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+28 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+28 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Sources : chaque concept pointe vers une page exacte de docs.aws.amazon.com (vérifiées via
  WebSearch). Aucun lien générique. Liste complète ci-dessous.
- §6.2 Aucune nouvelle certif hors roadmap : uniquement `aws-cloud-practitioner`.
- §6.3 Aucune reproduction de question d'examen / braindump : toutes les questions sont originales
  et pédagogiques, inspirées du scope officiel (blueprint + docs AWS).
- §6.4 Certif **non** marquée `complete` : Domaine 3 partiel (Lots A+B+C, il reste le Lot D) +
  Domaine 4 non traité → reste `in_progress`.
- §6.5 Aucune touche côté client (IndexedDB / exports) — uniquement `content/`.
- §6.6 Aucun secret / credential dans les commits (scan effectué avant commit : rien détecté).
- §6.7 Aucun push direct sur `main` — branche + PR draft.

## Contrôles techniques passés

- JSON valide pour les 7 fichiers de contenu.
- Schéma respecté par format (QCM correct_index dans les bornes, scénario = exactement 1 choix
  correct, swipe is_true booléen, match ≥2 paires, flashcard front/back, base id/game_type/
  difficulty/payload). Validé par un script schéma + intégrité.
- Intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant, 0 concept sans asset,
  0 asset id dupliqué, 0 concept id dupliqué (132 assets ↔ 132 mappings).
- Non-régression : 0 ligne supprimée au diff Git — les 59 concepts et 104 assets existants sont
  préservés à l'identique.

## Sources docs.aws consultées (Lot C)

**Networking**
- Amazon VPC : /vpc/latest/userguide/what-is-amazon-vpc.html
- Subnets & routage : /vpc/latest/userguide/configure-subnets.html
- Internet Gateway : /vpc/latest/userguide/VPC_Internet_Gateway.html
- NAT Gateway : /vpc/latest/userguide/vpc-nat-gateway.html
- Amazon Route 53 : /Route53/latest/DeveloperGuide/Welcome.html
- Elastic Load Balancing : /elasticloadbalancing/latest/userguide/what-is-load-balancing.html
- AWS PrivateLink : /vpc/latest/privatelink/what-is-privatelink.html

**Databases**
- Amazon RDS : /AmazonRDS/latest/UserGuide/Welcome.html
- Amazon Aurora : /AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html
- Amazon DynamoDB : /amazondynamodb/latest/developerguide/Introduction.html
- Amazon ElastiCache : /AmazonElastiCache/latest/dg/WhatIs.html
- Amazon Redshift : /redshift/latest/mgmt/welcome.html
- Amazon DocumentDB : /documentdb/latest/devguide/what-is.html
- Amazon Neptune : /neptune/latest/userguide/intro.html

## Questions ouvertes pour Shai (à lire en priorité)

Les mêmes 3 décisions produit restent en attente (non bloquantes, reportées depuis les Domaines
1, 2 et les Lots A/B) — elles ne bloquent pas la génération mais méritent un arbitrage avant que le
volume ne grossisse davantage (on est déjà à **73 concepts / 132 assets**) :

1. **Langue du contenu** : FR uniquement (choix actuel) ou bilingue FR/EN à terme ? Impacte
   potentiellement le schéma (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (`"Cloud Technology and Services"`, choix
   actuel) ou sous-domaines par tâche (3.1/3.2/3.3/3.4) pour un filtrage plus fin côté app ?
   D'autant plus pertinent que le Domaine 3 s'étale maintenant sur 3 lots (A + B + C).
3. **Critère `complete`** : le PDF de l'exam guide reste inaccessible au fetcher (403). Le coverage
   est jugé sur la structure connue du blueprint + sources docs.aws citées. Suffit-il, ou veux-tu
   une vérification manuelle du PDF avant tout passage `needs_review`/`complete` ?

**Piste toujours ouverte** (voir NEXT_MISSION.md) : mettre en place une **CI de validation**
(GitHub Action lançant le script schéma + intégrité à chaque PR). Le script `validate.py` utilisé
cette nuit est prêt à être versionné (`scripts/validate.py`) — il ne manque qu'un workflow
`.github/workflows/`. De plus en plus utile maintenant qu'on est à 132 assets.

## Lien PR

PR (draft) : <à compléter après ouverture>
Branche `claude/content-aws-clf-c02-domain-3-lot-c` → `main`.
