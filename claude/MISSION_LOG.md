# MISSION LOG — Montée en difficulté (CLF-C02) : 10 assets de difficulté 3

**Date** : 2026-07-12 (session nocturne autonome)
**Branche** : claude/loving-curie-g34lhb
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **PR #11 ET PR #12 ont été MERGÉES** entre-temps → l'enrichissement SM-2 « remonter les planchers »
  est intégré à `main` (72 concepts / 177 assets / 177 mappings). **Le backlog de PR est repassé de 3 à 2.**
- **2 PR de contenu restent OUVERTES et non mergées** : **PR #7** (Lot C — Networking & Databases,
  14 concepts / 28 assets) et **PR #10** (Domaine 4 — Billing/Pricing/Support, 14 concepts / 28 assets).
  Elles apportent les 2 derniers pans du blueprint. **Décision de merge = point le plus utile pour Shai.**
- **Mission de la nuit exécutée** : montée en fin de courbe SM-2. Ajout de **10 assets de difficulté 3**
  (7 QCM + 3 scénarios) sur des concepts avancés **déjà sur `main`**, angle arbitrage/comparaison fine.
  **+10 assets, +10 mappings, 0 concept.** Non-doublon vis-à-vis de #7 et #10 (aucun concept réseau/BdD/
  billing touché). `python3 scripts/validate.py` → ✅ OK. **266 insertions, 0 suppression.**
- Nouveaux totaux sur cette branche : **72 concepts / 187 assets / 187 mappings.**

## Ce qui a été fait

La grande majorité des assets de `main` étaient en difficulté 1-2. Cette session ajoute une couche de
difficulté 3 (situations d'arbitrage, comparaisons fines entre services proches) sur les concepts les
plus avancés déjà présents sur `main`. Le format **scénario** — le plus sous-représenté (12 → **15**) —
a été privilégié. Contenu 100 % original, ancré sur le `core_explanation` de chaque concept, aucune
reproduction de question d'examen (§6.3).

Assets ajoutés (tous difficulté 3) :
- **scenario-comp-03** → comp-eks / comp-ecs / comp-fargate : « je veux Kubernetes sans gérer d'instances »
  → EKS + Fargate.
- **scenario-infra-03** → svc-outposts / infra-local-zones : résidence des données sur site → Outposts.
- **scenario-app-02** → app-eventbridge : routage d'événements par contenu + sources SaaS → EventBridge
  (vs SQS/SNS/Step Functions).
- **qcm-comp-09** → comp-eks / comp-ecs : Kubernetes standard sans réécriture → EKS (ECS = propriétaire).
- **qcm-comp-10** → comp-fargate : Fargate vs mode de lancement EC2 (modèle de gestion/facturation).
- **qcm-comp-11** → svc-outposts : faible latence locale + résidence des données.
- **qcm-infra-10** → infra-global-accelerator : IP statiques + routage réseau (vs cache CloudFront).
- **qcm-app-04** → app-eventbridge : routage par contenu + sources SaaS (distinction SNS/SQS).
- **qcm-ana-03** → ana-glue : Data Catalog (métadonnées) vs crawlers (schémas).
- **qcm-ml-02** → ml-sagemaker : modèle sur mesure vs services IA pré-entraînés.

## Certification / domaine traités

- **aws-cloud-practitioner** — Domaine 3 (Cloud Technology and Services) essentiellement, enrichissement
  transverse en difficulté.
- **10 assets créés** : qcm ×7, scénario ×3. **10 mappings** (0 orphelin). Ids sans collision (suites
  continuées par préfixe/type : `qcm-comp-09..11`, `qcm-infra-10`, `qcm-app-04`, `qcm-ana-03`,
  `qcm-ml-02`, `scenario-comp-03`, `scenario-infra-03`, `scenario-app-02`).

## Répartition des difficultés (rappel)

- Avant : quasi-totalité des assets en difficulté 1-2.
- Cette PR ajoute une première couche nette de difficulté 3 sur les concepts avancés. La couverture
  difficulté 3 reste extensible sur d'autres familles (storage, security) dans une prochaine session.

## Contrôle technique passé

- `python3 scripts/validate.py` : ✅ OK (schéma par format + intégrité référentielle : 72 / 187 / 187).
- Diff : **266 insertions, 0 suppression** (ajout strict, non-régression garantie).
- Aucun secret / credential dans le diff (contenu 100 % pédagogique).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/assets/{qcm,scenario}.json` (+10 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+10 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)
- `content/aws-cloud-practitioner/concepts.json` : **non modifié** (0 nouveau concept)

## Garde-fous vérifiés

- §6.1 Aucun nouveau concept → pas de nouveau `source_url` requis (les concepts ciblés existent déjà,
  chacun avec sa source). §6.2 Aucune certif hors roadmap. §6.3 Contenu original pédagogique, aucun
  braindump. §6.4 Statut certif inchangé (`in_progress`) tant que #7/#10 ne sont pas sur `main`.
  §6.5 Aucune touche côté client. §6.6 Aucun secret. §6.7 Branche + PR draft, pas de push sur `main`.

## Questions ouvertes pour Shai (par priorité)

1. **2 PR de contenu ouvertes à merger** : **PR #7** (Lot C — réseau/BdD) et **PR #10** (Domaine 4 —
   billing). Une fois les deux mergées, les 4 domaines du blueprint sont sur `main`. Ordre suggéré :
   #7 → #10. Conflits d'append JSON triviaux attendus (garder tous les blocs) ; **aucune collision d'id**
   avec cette PR (préfixes/suites distincts).
2. **Statut certif → `needs_review`** une fois #7 + #10 mergées (garde-fou §6.4 ; exam guide PDF
   inaccessible au fetcher). Non modifié cette session pour ne pas surestimer le coverage.
3. **Le pipeline produit plus vite que le merge.** L'enrichissement des planchers est fini ; cette
   session a fait de la montée en difficulté (non-doublon, sûre) mais ajoute une 3ᵉ PR au backlog.
   **Résorber le backlog (#7/#10) est probablement plus utile que de générer davantage.**
4. Décisions produit anciennes toujours ouvertes (langue FR/bilingue ; granularité du champ `domain` ;
   critère de `complete` ; plans de support AWS en restructuration — soulevé par PR #10) — inchangées.

## Lien PR

PR (draft) de cette session : https://github.com/S2K7x/MyLittleQuest/pull/13
Autres PR de contenu ouvertes : #7 (Lot C) et #10 (Domaine 4 — Billing).
