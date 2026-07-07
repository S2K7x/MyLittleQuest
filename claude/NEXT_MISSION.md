# NEXT MISSION

## ⚠️ D'ABORD : le Lot C est déjà fait (PR #7) — NE PAS le régénérer

Avant toute génération de contenu, **vérifier les Pull Requests ouvertes** (API GitHub) pour ne pas
refaire un lot déjà produit. Au 2026-07-07 :
- **PR #7 (ouverte, draft)** contient déjà le **Lot C — Networking & Databases** (14 concepts, 28
  assets). **Ne pas le régénérer.** Idéalement, Shai merge la PR #7 ; sinon, considérer le Lot C
  comme fait et passer directement au Lot D.
- Une CI de validation (`scripts/validate.py` + `.github/workflows/validate-content.yml`) a été
  ajoutée par la session du 2026-07-07 (PR séparée). L'utiliser avant chaque PR.

## Mission : Domaine 3 — Lot D : Autres catégories de services (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter en AJOUT strict, ne rien écraser)
**Branche à créer** : `claude/content-aws-clf-c02-domain-3-lot-d` (nom descriptif ; vérifier qu'elle
n'existe pas déjà sur origin avant de pousser).

### Pré-requis avant de commencer

1. Repartir de `main` À JOUR (`git fetch origin main && git checkout -B <branche> origin/main`).
2. Si la PR #7 est mergée, `main` contient déjà le Lot C (73 concepts) : générer le Lot D en ajout
   par-dessus. Si la PR #7 n'est PAS encore mergée, prévenir dans la PR que le Lot D suppose le Lot C
   (risque de conflit à l'intégration) — ou attendre le merge de la PR #7.
3. Lancer `python3 scripts/validate.py` en fin de travail (doit renvoyer OK).

### Objectif — Lot D (Task 3.4) : services hors compute/storage/network/db

~12-16 concepts, `domain` = `"Cloud Technology and Services"`. Découpage suggéré :

**Monitoring & gouvernance** : Amazon CloudWatch (métriques, alarmes, logs), AWS CloudTrail (audit
des appels API — bien distinguer de CloudWatch), AWS Config (conformité, léger), AWS Health Dashboard
(léger).

**Intégration applicative / messagerie** : Amazon SQS (files de messages), Amazon SNS (pub/sub,
notifications), Amazon EventBridge (bus d'événements, léger).

**Analytics & Big Data** : Amazon Athena (SQL sur S3), Amazon Kinesis (streaming, léger), AWS Glue
(ETL managé, léger).

**IA / Machine Learning (reconnaissance CCP)** : Amazon SageMaker (plateforme ML managée), services
IA applicatifs (Rekognition, Comprehend, Polly, Translate…) — 1 concept groupé.

**Dev tools (optionnel selon budget)** : CodeCommit / CodeBuild / CodeDeploy / CodePipeline — 1
concept groupé, léger.

### Contenu à générer (Lot D)

- **Concepts** (~12-16, en AJOUT), chacun avec un `source_url` précis vers docs.aws.amazon.com (page
  exacte, vérifiée via **WebSearch** — WebFetch renvoie 403 sur AWS).
- **Assets** — minimums : QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6, + ≥ 1 scénario et ≥ 1 match. Préfixes
  d'id suggérés : `-mon-`, `-app-`, `-ana-`, `-ml-`. Vérifier l'absence de collision avec les id
  existants (`-cloud-`, `-sec-`, `-infra-`, `-svc-`, `-comp-`, `-stor-`, `-net-`, `-db-`).
- **Mapping** : compléter `asset_concepts.json`, 1 mapping par asset, 0 orphelin, 0 concept sans asset.

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis vers docs.aws.amazon.com. Pas de lien générique.
- Aucune reproduction de question d'examen réelle / braindump.
- Ne pas marquer la certif `complete` tant que le Domaine 4 n'est pas traité et justifié.
- Aucun secret dans les commits. Ne pas toucher au code côté client / IndexedDB.
- Valider via `scripts/validate.py` avant la PR. Travail en AJOUT strict (0 suppression au diff).

### Fin de mission attendue

PR `claude/...` → `main` (draft) : résumé (nb concepts / assets par type), sources consultées, note
de coverage du Lot D vs la Task 3.4.

---

## Décisions produit en attente de Shai (non bloquantes)

1. **Merger/fermer la PR #7 (Lot C)** et **améliorer le handoff du pipeline** pour éviter les doublons
   (voir `MISSION_LOG.md`).
2. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
3. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche (3.1…3.4) ?
4. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur le
   blueprint + docs.aws. Suffisant, ou vérification manuelle du PDF souhaitée ?

## Pistes alternatives

- **Traiter le Domaine 4 (Billing/Pricing/Support, 12 %) avant le Lot D** : plus petit, boucle un
  domaine entier (Cost Explorer, AWS Budgets, Pricing Calculator, plans de support, TCO,
  consolidated billing via Organizations).
- **Enrichir les lots déjà couverts** : plus d'assets par concept (meilleure rotation SM-2),
  scénarios supplémentaires, montée en difficulté.
