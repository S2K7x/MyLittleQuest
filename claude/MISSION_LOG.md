# MISSION LOG — Domaine 4 (CLF-C02) : Billing, Pricing, and Support

**Date** : 2026-07-09 (session nocturne autonome)
**Branche** : claude/loving-curie-d74pqn
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **Domaine 4 généré et validé** : 14 concepts + 28 assets, en **ajout strict** (691 insertions, 0
  suppression au diff). `python3 scripts/validate.py` → ✅ OK (86 concepts / 160 assets / 160 mappings).
- **Le Domaine 4 boucle le dernier domaine du blueprint CCP.** Les 4 domaines ont désormais du
  contenu — MAIS voir le point coverage ci-dessous : **le Lot C (PR #7) n'est toujours pas mergé**,
  donc sur `main` le Domaine 3 reste incomplet (réseau + bases de données manquants).
- **Branche utilisée : `claude/loving-curie-d74pqn`** (imposée par la configuration de session),
  et non `claude/content-aws-clf-c02-domain-4-billing` proposée dans l'ancien NEXT_MISSION.md. Le
  nom diffère mais le contenu est exactement celui prévu par la mission.
- **2 décisions attendent Shai** (détail plus bas) : (1) ordre de merge PR #7 / Domaine 4 + conflit
  d'append JSON trivial ; (2) restructuration des plans de support AWS (voir §« Décision produit »).

## Ce qui a été fait

Génération complète du **Domaine 4 — Billing, Pricing, and Support** (12 % du blueprint CLF-C02),
`domain` = `Billing, Pricing, and Support`. Chaque concept a un `source_url` précis vers une page
exacte de docs.aws.amazon.com (vérifiée via **WebSearch**, WebFetch renvoyant 403 sur AWS).

- **Tarification & modèles de coût (4)** : fondamentaux de la tarification AWS (pay-as-you-go +
  3 leviers d'économie), AWS Free Tier (3 types d'offres), AWS Pricing Calculator (estimation avant
  déploiement), facturation consolidée via AWS Organizations (angle facturation, sans redéfinir
  Organizations/SCP déjà couvert). EC2 pricing NON dupliqué (renvoi au concept `comp-ec2-pricing`).
- **Gestion & suivi des coûts (6)** : console Billing and Cost Management, Cost Explorer (analyse),
  AWS Budgets (alertes de seuil), Cost and Usage Report (donnée brute la plus détaillée), cost
  allocation tags (user: / aws:), Cost Anomaly Detection (détection ML des écarts inattendus).
  Distinctions pédagogiques appuyées : Cost Explorer (rétrospectif) vs Budgets (proactif) vs CUR
  (granularité maximale) vs Anomaly Detection (écarts non anticipés).
- **Support & ressources (4)** : plans de support AWS (Basic → Enterprise, TAM dédié au niveau
  Enterprise), Trusted Advisor sous l'angle optimisation des coûts (5 catégories ; le concept
  sécurité `trusted-advisor-security` existant n'est PAS dupliqué), AWS Marketplace, AWS Support
  Center + ressources d'auto-assistance (re:Post, Knowledge Center).

## Certification / domaine traités

- **aws-cloud-practitioner**, Domaine 4 (Billing, Pricing, and Support) — domaine bouclé.
- Assets créés : **QCM ×8, flashcards ×8, swipe ×8, scénarios ×2, match ×2** = 28 assets, 28 mappings
  (1 par asset, 0 orphelin, 0 concept sans asset ; les 14 concepts sont couverts par ≥ 1 asset).
- Préfixes d'id introduits : `-bill-`, `-cost-`, `-sup-` (aucune collision avec les préfixes
  existants `-cloud-`, `-sec-`, `-infra-`, `-svc-`, `-comp-`, `-stor-`, `-mon-`, `-app-`, `-ana-`,
  `-ml-`, `-dev-`, ni avec `-net-`/`-db-` du Lot C non mergé).
- Totaux certif sur cette branche (base = `main`, qui contient déjà le Lot D mais **pas** le Lot C) :
  **86 concepts, 160 assets, 160 mappings**.

## Note de coverage — Domaine par domaine vs blueprint CLF-C02

| Domaine blueprint | Poids | Concepts (état `main` + cette branche) | Couvert ? |
|---|---|---|---|
| 1. Cloud Concepts | 24 % | 12 | Oui |
| 2. Security and Compliance | 30 % | 17 | Oui |
| 3. Cloud Technology and Services | 34 % | 43 (+14 du Lot C **encore dans PR #7 non mergée**) | Oui *après merge PR #7* |
| 4. Billing, Pricing, and Support | 12 % | 14 (cette PR) | Oui |

**Recommandation de statut** : garder `aws-cloud-practitioner` en **`in_progress`** tant que la
PR #7 (Lot C) n'est pas mergée, car sur `main` le Domaine 3 est incomplet (réseau + bases de données
absents). **Une fois PR #7 + cette PR mergées**, les 4 domaines sont couverts → basculer vers
**`needs_review`** (garde-fou §6.4 : pas de `complete` sans comparaison explicite au PDF de l'exam
guide, PDF inaccessible au fetcher — arbitrage Shai). Le fichier `certifications_roadmap.md` **n'a
pas été modifié** cette session pour ne pas surestimer le coverage avant merge.

## Sources consultées (docs.aws.amazon.com, page exacte vérifiée via WebSearch)

- Fondamentaux tarification : `whitepapers/latest/how-aws-pricing-works/key-principles.html`
- Free Tier : `awsaccountbilling/latest/aboutv2/free-tier.html`
- Pricing Calculator : `pricing-calculator/latest/userguide/what-is-pricing-calculator.html`
- Facturation consolidée : `awsaccountbilling/latest/aboutv2/consolidated-billing.html`
- Console Billing : `awsaccountbilling/latest/aboutv2/billing-what-is.html`
- Cost Explorer : `cost-management/latest/userguide/ce-what-is.html`
- AWS Budgets : `cost-management/latest/userguide/budgets-managing-costs.html`
- Cost and Usage Report : `cur/latest/userguide/what-is-cur.html`
- Cost allocation tags : `awsaccountbilling/latest/aboutv2/cost-alloc-tags.html`
- Cost Anomaly Detection : `cost-management/latest/userguide/getting-started-ad.html`
- Plans de support : `awssupport/latest/user/aws-support-plans.html`
- Trusted Advisor : `awssupport/latest/user/trusted-advisor.html`
- AWS Marketplace : `marketplace/latest/userguide/what-is-marketplace.html`
- Support Center : `awssupport/latest/user/getting-started.html`

## Contrôle technique passé

- `python3 scripts/validate.py` : ✅ OK (schéma par format + intégrité référentielle).
- Diff : **691 insertions, 0 suppression** (ajout strict, non-régression garantie).
- Aucun secret / credential dans le diff (scan effectué).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (+14)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+28)
- `content/aws-cloud-practitioner/asset_concepts.json` (+28)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Chaque concept a un `source_url` précis et vérifié. §6.2 Aucune certif hors roadmap.
- §6.3 Contenu original pédagogique, aucun braindump. §6.4 Statut certif **inchangé** (`in_progress`)
  — coverage complet dépend du merge de la PR #7 (voir note de coverage). Pas de passage `complete`.
- §6.5 Aucune touche côté client (IndexedDB/exports). §6.6 Aucun secret. §6.7 Branche + PR draft,
  pas de push sur `main`.

## Décision produit signalée (nouvelle, importante) — plans de support AWS

Pendant la recherche, la doc AWS montre une **restructuration en cours des plans de support**
(introduction de « Business Support+ », « Unified Operations », et **arrêt annoncé d'Enterprise
On-Ramp au 1er janvier 2027**). Le blueprint **CLF-C02 teste encore le modèle classique à 5 plans**
(Basic, Developer, Business, Enterprise On-Ramp, Enterprise). **Choix retenu** : enseigner le modèle
classique aligné sur l'examen CLF-C02, en citant la page officielle des plans de support.
**Question pour Shai** : conserver l'alignement examen (actuel), ou anticiper la nouvelle
nomenclature ? À revoir si AWS publie une révision de l'exam guide.

## Questions ouvertes pour Shai (par priorité)

1. **Ordre de merge PR #7 (Lot C) ↔ cette PR (Domaine 4)** : conflit d'append JSON trivial attendu
   (les deux ajoutent en fin des mêmes tableaux ; garder les deux blocs). Idéalement merger dans
   l'ordre de production (Lot C puis Domaine 4) pour minimiser les rebases.
2. **Statut certif** : passer à `needs_review` une fois PR #7 + Domaine 4 mergés (voir note coverage).
3. **Plans de support** : alignement examen vs nouvelle nomenclature AWS (voir §ci-dessus).
4. Décisions produit toujours en attente (langue FR vs bilingue ; granularité du champ `domain` ;
   critère de `complete` avec exam guide PDF inaccessible au fetcher) — inchangées.

## Lien PR

PR (draft) de cette session : https://github.com/S2K7x/MyLittleQuest/pull/10
Branche `claude/loving-curie-d74pqn` → `main`.
PR du Lot C (toujours ouverte, à arbitrer) : https://github.com/S2K7x/MyLittleQuest/pull/7
