# MISSION LOG — AWS CLF-C02, Domaine 3 (Lot A) : Infrastructure globale & déploiement

**Date** : 2026-07-04 (session nocturne autonome)
**Branche** : claude/loving-curie-dqlak6
**Statut** : Terminée — PR ouverte vers main

## Ce qui a été fait

Premier lot du **Domaine 3 — Cloud Technology and Services** (34 %, le plus lourd de l'examen),
correspondant au **Lot A** planifié : Tasks 3.1 (méthodes de déploiement / d'accès + connectivité
hybride) et 3.2 (infrastructure globale AWS). 15 nouveaux concepts et 25 nouveaux assets de jeu
(les 5 formats). Tout est en **AJOUT** : les Domaines 1 et 2 ne sont pas modifiés (vérifié
sémantiquement — seul le formatage JSON de certains fichiers existants a été normalisé, aucune
valeur existante altérée). Contenu en français, termes AWS conservés en anglais. Chaque concept
pointe vers une page exacte de docs.aws.amazon.com, vérifiée via WebSearch.

## Certification / domaine traités

- **Certif** : `aws-cloud-practitioner` (reste `in_progress` — Domaine 3 partiel, Domaine 4 à venir)
- **Domaine** : Domain 3 — Cloud Technology and Services (Lot A : Tasks 3.1 & 3.2)
- **Concepts créés** : 15 (total certif : 44)
- **Assets créés** : 25 → QCM ×7, flashcards ×7, swipe ×7, scénarios ×2, match ×2 (total : 76)
- **Mapping** : 25 nouvelles entrées dans `asset_concepts.json` (total : 76)

## Coverage du Lot A vs blueprint

- **Task 3.2 — AWS global infrastructure** : Régions (`infra-regions`), Availability Zones
  (`infra-availability-zones`), choix d'une Région (`infra-region-selection`), edge locations /
  Points of Presence (`infra-edge-locations`), Amazon CloudFront (`infra-cloudfront`), AWS Global
  Accelerator (`infra-global-accelerator`), AWS Local Zones (`infra-local-zones`). ✅
- **Task 3.1 — Méthodes de déploiement et d'accès** : AWS Management Console
  (`svc-management-console`), AWS CLI (`svc-aws-cli`), AWS SDKs (`svc-aws-sdk`), Infrastructure as
  Code (`svc-iac-concept`), AWS CloudFormation (`svc-cloudformation`) ; connectivité hybride :
  AWS Direct Connect (`svc-direct-connect`), AWS Site-to-Site VPN (`svc-site-to-site-vpn`),
  AWS Outposts (`svc-outposts`). ✅

## Reste du Domaine 3 (lots suivants, à planifier — voir NEXT_MISSION.md)

- **Lot B — Compute & Storage** : EC2, Lambda, ECS/EKS/Fargate, Elastic Beanstalk ; S3, EBS, EFS,
  S3 Glacier, Storage Gateway.
- **Lot C — Networking & Databases** : VPC, subnets, Route 53, ELB ; RDS, Aurora, DynamoDB,
  ElastiCache, Redshift.
- **Lot D — Autres catégories** : analytics, ML, dev tools, monitoring (CloudWatch, CloudTrail),
  intégration applicative (SQS, SNS).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (+15 concepts)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+25 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+25 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Sources : chaque concept pointe vers une page exacte de docs.aws.amazon.com (vérifiées via
  WebSearch — WebFetch renvoie 403 sur AWS). Aucun lien générique. Liste complète ci-dessous.
- §6.2 Aucune nouvelle certif hors roadmap : uniquement `aws-cloud-practitioner`.
- §6.3 Aucune reproduction de question d'examen / braindump : toutes les questions sont originales
  et pédagogiques, inspirées du scope officiel (blueprint + docs AWS).
- §6.4 Certif **non** marquée `complete` : Domaine 3 partiel (Lot A) + Domaine 4 non traité →
  reste `in_progress`.
- §6.5 Aucune touche côté client (IndexedDB / exports) — uniquement `content/`.
- §6.6 Aucun secret / credential dans les commits (scan effectué avant commit).
- §6.7 Aucun push direct sur `main` — branche + PR draft.

## Contrôles techniques passés

- JSON valide pour les 7 fichiers de contenu.
- Schéma respecté par format (QCM correct_index valide, scénario = exactement 1 choix correct,
  swipe is_true booléen, match ≥2 paires, flashcard front/back, etc.).
- Intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant, 0 concept sans asset,
  0 asset id dupliqué (76 assets ↔ 76 mappings).
- Non-régression : les 51 entrées existantes (Domaines 1+2) sont préservées à l'identique en
  valeur (comparaison sémantique du prefix), seul le formatage a été normalisé.

## Sources docs.aws consultées (Lot A)

- Régions : /global-infrastructure/latest/regions/aws-regions.html
- Availability Zones : /global-infrastructure/latest/regions/aws-availability-zones.html
- Edge locations / PoP : /whitepapers/latest/aws-fault-isolation-boundaries/points-of-presence.html
- CloudFront : /AmazonCloudFront/latest/DeveloperGuide/Introduction.html
- Global Accelerator : /global-accelerator/latest/dg/what-is-global-accelerator.html
- Local Zones : /local-zones/latest/ug/how-local-zones-work.html
- Management Console : /hands-on/latest/getting-started-with-aws-management-console/getting-started-with-aws-management-console.html
- AWS CLI : /cli/latest/userguide/cli-chap-welcome.html
- AWS SDKs : /sdkref/latest/guide/overview.html
- Infrastructure as Code : /whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html
- CloudFormation : /AWSCloudFormation/latest/UserGuide/Welcome.html
- Direct Connect : /directconnect/latest/UserGuide/Welcome.html
- Site-to-Site VPN : /vpn/latest/s2svpn/VPC_VPN.html
- Outposts : /outposts/latest/userguide/what-is-outposts.html

## Questions ouvertes pour Shai (à lire en priorité)

Les mêmes 3 décisions produit restent en attente (non bloquantes, reportées depuis les Domaines
1 et 2) — elles ne bloquent pas la génération mais méritent un arbitrage avant que le volume ne
grossisse davantage :

1. **Langue du contenu** : FR uniquement (choix actuel) ou bilingue FR/EN à terme ? Impacte
   potentiellement le schéma (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (`"Cloud Technology and Services"`, choix
   actuel) ou sous-domaines par tâche (3.1/3.2/3.3/3.4) pour un filtrage plus fin côté app ?
3. **Critère `complete`** : le PDF de l'exam guide reste inaccessible au fetcher (403). Le coverage
   est jugé sur la structure connue du blueprint + sources docs.aws citées. Suffit-il, ou veux-tu
   une vérification manuelle du PDF avant tout passage `needs_review`/`complete` ?

## Lien PR

PR (draft) : voir lien dans la description de la Pull Request ouverte pour la branche
`claude/loving-curie-dqlak6` → `main`.
