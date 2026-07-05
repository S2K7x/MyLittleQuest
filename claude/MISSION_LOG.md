# MISSION LOG — AWS CLF-C02, Domaine 3 (Lot B) : Compute & Storage

**Date** : 2026-07-05 (session nocturne autonome)
**Branche** : claude/content-aws-clf-c02-domain-3-lot-b
**Statut** : Terminée — PR ouverte vers main

## Ce qui a été fait

Deuxième lot du **Domaine 3 — Cloud Technology and Services** (34 %, le plus lourd de l'examen),
correspondant au **Lot B** planifié : services **compute** et **storage** cœur du CLF-C02
(partie de la Task 3.3). 15 nouveaux concepts (8 compute, 7 storage) et 28 nouveaux assets de jeu
(les 5 formats). Tout est en **AJOUT strict** : aucune valeur existante (Domaines 1, 2 et Lot A)
n'a été modifiée (vérifié : 0 ligne supprimée au diff Git). Contenu en français, termes AWS
conservés en anglais. Chaque concept pointe vers une page exacte de docs.aws.amazon.com,
vérifiée via WebSearch (WebFetch renvoie 403 sur AWS).

## Certification / domaine traités

- **Certif** : `aws-cloud-practitioner` (reste `in_progress` — Domaine 3 encore partiel, Domaine 4 à venir)
- **Domaine** : Domain 3 — Cloud Technology and Services (Lot B : compute & storage, part de la Task 3.3)
- **Concepts créés** : 15 (total certif : 59)
- **Assets créés** : 28 → QCM ×8, flashcards ×8, swipe ×8, scénarios ×2, match ×2 (total : 104)
- **Mapping** : 28 nouvelles entrées dans `asset_concepts.json` (total : 104)

## Coverage du Lot B vs Task 3.3 (compute/storage)

**Compute (8 concepts)** : Amazon EC2 instances & familles (`comp-ec2`), modèles de tarification
EC2 On-Demand/Reserved/Spot/Savings Plans (`comp-ec2-pricing`), EC2 Auto Scaling
(`comp-auto-scaling`), AWS Lambda / serverless (`comp-lambda`), Amazon ECS (`comp-ecs`),
Amazon EKS (`comp-eks`), AWS Fargate (`comp-fargate`), AWS Elastic Beanstalk /PaaS
(`comp-elastic-beanstalk`). ✅

**Storage (7 concepts)** : Amazon S3 stockage objet & durabilité (`stor-s3`), classes de stockage
S3 (`stor-s3-storage-classes`), classes d'archivage S3 Glacier (`stor-s3-glacier`), Amazon EBS
stockage bloc (`stor-ebs`), Amazon EFS système de fichiers partagé (`stor-efs`), AWS Storage
Gateway / hybride (`stor-storage-gateway`), AWS Backup / sauvegarde centralisée (`stor-aws-backup`). ✅

## Reste du Domaine 3 (lots suivants, à planifier — voir NEXT_MISSION.md)

- **Lot C — Networking & Databases** : VPC, subnets, Route 53, ELB ; RDS, Aurora, DynamoDB,
  ElastiCache, Redshift.
- **Lot D — Autres catégories** : analytics, ML, dev tools, monitoring (CloudWatch, CloudTrail),
  intégration applicative (SQS, SNS).
- Puis **Domaine 4 — Billing, Pricing, and Support** (12 %), non commencé.

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (+15 concepts)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+28 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+28 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Sources : chaque concept pointe vers une page exacte de docs.aws.amazon.com (vérifiées via
  WebSearch). Aucun lien générique. Liste complète ci-dessous.
- §6.2 Aucune nouvelle certif hors roadmap : uniquement `aws-cloud-practitioner`.
- §6.3 Aucune reproduction de question d'examen / braindump : toutes les questions sont originales
  et pédagogiques, inspirées du scope officiel (blueprint + docs AWS).
- §6.4 Certif **non** marquée `complete` : Domaine 3 partiel (Lots A+B) + Domaine 4 non traité →
  reste `in_progress`.
- §6.5 Aucune touche côté client (IndexedDB / exports) — uniquement `content/`.
- §6.6 Aucun secret / credential dans les commits (scan effectué avant commit : rien détecté).
- §6.7 Aucun push direct sur `main` — branche + PR draft.

## Contrôles techniques passés

- JSON valide pour les 7 fichiers de contenu.
- Schéma respecté par format (QCM correct_index dans les bornes, scénario = exactement 1 choix
  correct, swipe is_true booléen, match ≥2 paires, flashcard front/back, base id/game_type/
  difficulty/payload).
- Intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant, 0 concept sans asset,
  0 asset id dupliqué, 0 concept id dupliqué (104 assets ↔ 104 mappings).
- Non-régression : 0 ligne supprimée au diff Git (707 insertions, 0 suppression) — les 44 concepts
  et 76 assets existants sont préservés à l'identique.

## Sources docs.aws consultées (Lot B)

- Amazon EC2 : /AWSEC2/latest/UserGuide/concepts.html
- Tarification EC2 : /AWSEC2/latest/UserGuide/instance-purchasing-options.html
- EC2 Auto Scaling : /autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html
- AWS Lambda : /lambda/latest/dg/welcome.html
- Amazon ECS : /AmazonECS/latest/developerguide/Welcome.html
- Amazon EKS : /eks/latest/userguide/what-is-eks.html
- AWS Fargate : /AmazonECS/latest/developerguide/AWS_Fargate.html
- Elastic Beanstalk : /elasticbeanstalk/latest/dg/Welcome.html
- Amazon S3 : /AmazonS3/latest/userguide/Welcome.html
- Classes de stockage S3 : /AmazonS3/latest/userguide/storage-class-intro.html
- S3 Glacier : /AmazonS3/latest/userguide/glacier-storage-classes.html
- Amazon EBS : /ebs/latest/userguide/what-is-ebs.html
- Amazon EFS : /efs/latest/ug/whatisefs.html
- Storage Gateway : /storagegateway/latest/vgw/WhatIsStorageGateway.html
- AWS Backup : /aws-backup/latest/devguide/whatisbackup.html

## Questions ouvertes pour Shai (à lire en priorité)

Les mêmes 3 décisions produit restent en attente (non bloquantes, reportées depuis les Domaines
1, 2 et le Lot A) — elles ne bloquent pas la génération mais méritent un arbitrage avant que le
volume ne grossisse davantage (on est déjà à 59 concepts / 104 assets) :

1. **Langue du contenu** : FR uniquement (choix actuel) ou bilingue FR/EN à terme ? Impacte
   potentiellement le schéma (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (`"Cloud Technology and Services"`, choix
   actuel) ou sous-domaines par tâche (3.1/3.2/3.3/3.4) pour un filtrage plus fin côté app ?
   D'autant plus pertinent que le Domaine 3 s'étale maintenant sur plusieurs lots (A + B).
3. **Critère `complete`** : le PDF de l'exam guide reste inaccessible au fetcher (403). Le coverage
   est jugé sur la structure connue du blueprint + sources docs.aws citées. Suffit-il, ou veux-tu
   une vérification manuelle du PDF avant tout passage `needs_review`/`complete` ?

**Nouvelle piste à trancher** (voir NEXT_MISSION.md) : mettre en place une **CI de validation**
(GitHub Action lançant le script schéma + intégrité à chaque PR) devient de plus en plus utile
maintenant que le contenu grossit. Le script `validate.py` de cette nuit peut servir de base.

## Lien PR

PR (draft) : voir le lien ajouté ci-dessous après ouverture.
Branche `claude/content-aws-clf-c02-domain-3-lot-b` → `main`.
