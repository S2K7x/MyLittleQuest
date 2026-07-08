# MISSION LOG — Domaine 3 Lot D (CLF-C02) : monitoring, intégration, analytics, ML, dev tools

**Date** : 2026-07-08 (session nocturne autonome)
**Branche** : claude/content-aws-clf-c02-domain-3-lot-d
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **Lot D généré et validé** : 13 concepts + 28 assets, en **ajout strict** (690 insertions, 0 suppression au diff).
  `python3 scripts/validate.py` → ✅ OK (72 concepts / 132 assets / 132 mappings).
- **La PR #7 (Lot C — Networking & Databases) est TOUJOURS ouverte et non mergée.** Le Lot D a donc
  été généré **par-dessus `main` (qui ne contient PAS encore le Lot C)**, pas par-dessus le Lot C.
  Les deux lots sont **indépendants** (préfixes d'id disjoints : Lot C `-net-`/`-db-`, Lot D
  `-mon-`/`-app-`/`-ana-`/`-ml-`/`-dev-`). Aucune collision d'id. **Mais** ils ajoutent tous deux à
  la fin des mêmes tableaux JSON → **conflit Git textuel attendu à l'intégration** si les deux PR
  sont mergées. Résolution triviale (garder les deux blocs). **Décision demandée à Shai** : merger
  la PR #7 **puis** rebaser cette PR sur `main`, ou l'inverse — l'ordre de merge détermine qui
  résout le conflit d'append.

## Ce qui a été fait

Quatrième lot du **Domaine 3 — Cloud Technology and Services** (34 %), Task 3.4 : les familles de
services hors compute/storage/network/db. 13 concepts (`domain` = `Cloud Technology and Services`),
chacun avec un `source_url` précis vers docs.aws.amazon.com (page « what is » vérifiée via WebSearch,
WebFetch renvoyant 403 sur AWS).

- **Monitoring & gouvernance (4)** : CloudWatch, CloudTrail, AWS Config, AWS Health Dashboard.
  Distinction pédagogique appuyée CloudWatch (santé/perf) vs CloudTrail (audit des appels d'API) vs
  Config (conformité de configuration) vs Health Dashboard (incidents AWS).
- **Intégration applicative (3)** : SQS (file point à point), SNS (pub/sub fan-out), EventBridge (bus
  d'événements). Distinction SQS vs SNS travaillée.
- **Analytics (3)** : Athena (SQL serverless sur S3), Kinesis (streaming temps réel), Glue (ETL +
  Data Catalog).
- **IA / ML (2)** : SageMaker (construire ses propres modèles) et 1 concept groupé « services d'IA
  applicative » (Rekognition, Comprehend, Polly, Translate, Transcribe, Lex — pré-entraînés par API).
- **Dev tools (1)** : chaîne CI/CD (CodePipeline orchestrant CodeBuild / CodeDeploy).

## Certification / domaine traités

- **aws-cloud-practitioner**, Domaine 3 (Cloud Technology and Services), Task 3.4.
- Assets créés : **QCM ×8, flashcards ×8, swipe ×8, scénarios ×2, match ×2** = 28 assets, 28 mappings
  (1 par asset, 0 orphelin, 0 concept sans asset, tous les 13 concepts couverts par ≥ 1 asset).
- Totaux certif sur cette branche (base = `main`, sans le Lot C) : **72 concepts, 132 assets**.
  Après merge cumulé Lot C (PR #7) + Lot D : 86 concepts, 160 assets.

## Sources consultées (docs.aws.amazon.com, page exacte vérifiée via WebSearch)

- CloudWatch : `AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html`
- CloudTrail : `awscloudtrail/latest/userguide/cloudtrail-user-guide.html`
- Config : `config/latest/developerguide/WhatIsConfig.html`
- Health : `health/latest/ug/what-is-aws-health.html`
- SQS : `AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html`
- SNS : `sns/latest/dg/welcome.html`
- EventBridge : `eventbridge/latest/userguide/eb-what-is.html`
- Athena : `athena/latest/ug/what-is.html`
- Kinesis : `streams/latest/dev/introduction.html`
- Glue : `glue/latest/dg/what-is-glue.html`
- SageMaker : `sagemaker/latest/dg/whatis.html`
- Services IA (groupé) : `whitepapers/latest/aws-overview/machine-learning.html`
- CI/CD CodePipeline : `codepipeline/latest/userguide/welcome.html`

## Contrôle technique passé

- `python3 scripts/validate.py` : ✅ OK (schéma par format + intégrité référentielle).
- Diff : **690 insertions, 0 suppression** (ajout strict, non-régression garantie).
- Aucun secret / credential dans le diff (scan effectué).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (+13)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+28)
- `content/aws-cloud-practitioner/asset_concepts.json` (+28)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Chaque concept a un `source_url` précis et vérifié. §6.2 Aucune certif hors roadmap.
- §6.3 Contenu original pédagogique, aucun braindump. §6.4 Statut certif inchangé (`in_progress`) —
  Domaine 3 quasi bouclé mais Domaine 4 non commencé, pas de passage `complete`.
- §6.5 Aucune touche côté client (IndexedDB/exports). §6.6 Aucun secret. §6.7 Branche + PR draft, pas
  de push sur `main`.

## Questions ouvertes pour Shai (par priorité)

1. **Merger la PR #7 (Lot C) puis rebaser cette PR (ou l'inverse)** — un conflit d'append JSON est
   attendu entre les deux (voir encadré en tête). Trivial à résoudre, mais à trancher.
2. **Domaine 3 quasi complet** : après Lot C + Lot D, il reste surtout le **Domaine 4 (Billing,
   Pricing & Support, 12 %)** pour viser un coverage complet du blueprint CCP. Proposé comme
   prochaine mission (voir `NEXT_MISSION.md`).
3. Les 3 décisions produit toujours en attente (langue FR vs bilingue ; granularité du champ
   `domain` ; critère de `complete` avec exam guide PDF inaccessible au fetcher) — inchangées.

## Lien PR

PR (draft) de cette session : voir la PR ouverte pour la branche
`claude/content-aws-clf-c02-domain-3-lot-d` → `main` (lien ajouté au commit de pilotage).
PR du Lot C (toujours ouverte, à arbitrer) : https://github.com/S2K7x/MyLittleQuest/pull/7
