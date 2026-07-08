# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les Pull Requests ouvertes** (API GitHub) pour ne pas refaire un lot déjà
produit. État au 2026-07-08 :

- **PR #7 (ouverte, draft)** — Lot C (Networking & Databases, 14 concepts / 28 assets). **Toujours
  non mergée.** Ne pas la régénérer.
- **PR Lot D (ouverte, draft)** — cette session : Domaine 3 Task 3.4 (monitoring, intégration,
  analytics, ML, dev tools ; 13 concepts / 28 assets). Ne pas la régénérer.
- La CI de validation (`scripts/validate.py` + `.github/workflows/validate-content.yml`) est sur
  `main`. **La lancer avant chaque PR.**

Si les PR #7 et Lot D sont mergées, `main` contiendra **86 concepts / 160 assets** et le **Domaine 3
sera entièrement couvert** (Tasks 3.1 → 3.4).

## Mission recommandée : Domaine 4 — Billing, Pricing, and Support (CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter en AJOUT strict, ne rien écraser)
**Branche à créer** : `claude/content-aws-clf-c02-domain-4-billing` (vérifier qu'elle n'existe pas
déjà sur origin avant de pousser).

### Pourquoi le Domaine 4 maintenant

Le Domaine 3 (34 %, le plus lourd) est traité en 4 lots (A→D). Il ne reste, pour un coverage complet
du blueprint CCP, que le **Domaine 4 (12 %)** — le plus petit, qui **boucle un domaine entier** et
rapproche la certif d'un statut `needs_review`. Les Domaines 1 (Cloud Concepts) et 2 (Security &
Compliance) sont déjà couverts.

### Pré-requis avant de commencer

1. Repartir de `main` À JOUR (`git fetch origin main && git checkout -B <branche> origin/main`).
2. **Vérifier l'état des PR #7 (Lot C) et Lot D** : si elles ne sont pas encore mergées, le prévenir
   dans la nouvelle PR (le Domaine 4 est indépendant côté id, mais mêmes tableaux JSON → conflit
   d'append trivial à l'intégration, comme pour Lot C/Lot D).
3. Lancer `python3 scripts/validate.py` en fin de travail (doit renvoyer OK).

### Objectif — Domaine 4 (~12-16 concepts), `domain` = `"Billing, Pricing, and Support"`

Découpage suggéré (à ajuster selon le blueprint) :

**Tarification & modèles de coût** : modèles de tarification AWS (pay-as-you-go, économies de volume,
payer moins en réservant), niveau gratuit (AWS Free Tier), tarification EC2 (rappel/lien vers
`comp-ec2-pricing` déjà existant — ne pas dupliquer), AWS Pricing Calculator (estimation de coût).

**Gestion & suivi des coûts** : AWS Cost Explorer (visualisation/analyse des coûts et tendances),
AWS Budgets (alertes de budget), AWS Cost and Usage Report (rapport détaillé), Billing Conductor
(léger, optionnel), tags de répartition des coûts (cost allocation tags).

**Facturation consolidée & organisation** : consolidated billing via AWS Organizations (regroupement
des factures, économies de volume partagées) — bien articuler avec le concept `aws-organizations-scp`
déjà existant (ne pas redéfinir Organizations, se concentrer sur l'angle facturation).

**Support & ressources** : plans de support AWS (Basic, Developer, Business, Enterprise On-Ramp,
Enterprise — différences clés : accès au support technique, temps de réponse, TAM), AWS Trusted
Advisor (rappel/angle coût — un concept `trusted-advisor-security` existe déjà côté sécurité, ici
traiter l'angle optimisation des coûts sans dupliquer), AWS Support Center, AWS Knowledge Center /
re:Post (léger), AWS Marketplace (achat de logiciels tiers, léger).

### Contenu à générer

- **Concepts** (~12-16, en AJOUT), `source_url` précis vers docs.aws.amazon.com **ou**
  aws.amazon.com/premiumsupport / aws.amazon.com/aws-cost-management (pages exactes vérifiées via
  **WebSearch** — WebFetch renvoie 403 sur les domaines AWS).
- **Assets** — minimums : QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6, + ≥ 1 scénario et ≥ 1 match. Préfixes
  d'id suggérés : `-bill-`, `-cost-`, `-sup-`. Vérifier l'absence de collision avec les id existants
  (`-cloud-`, `-sec-`, `-infra-`, `-svc-`, `-comp-`, `-stor-`, `-net-`, `-db-`, `-mon-`, `-app-`,
  `-ana-`, `-ml-`, `-dev-`).
- **Mapping** : compléter `asset_concepts.json`, 1 mapping par asset, 0 orphelin, 0 concept sans asset.

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis. Pas de lien générique.
- Aucune reproduction de question d'examen réelle / braindump.
- **Statut `complete` possible SEULEMENT après le Domaine 4**, et seulement si le coverage des
  4 domaines est explicitement comparé au blueprint et justifié (§6.4). Sinon → `needs_review`.
  Prévoir, en fin de Domaine 4, une **note de coverage domaine par domaine** dans la PR pour préparer
  la décision de Shai sur le statut.
- Aucun secret dans les commits. Ne pas toucher au code côté client / IndexedDB.
- Valider via `scripts/validate.py` avant la PR. Travail en AJOUT strict (0 suppression au diff).

### Fin de mission attendue

PR `claude/...` → `main` (draft) : résumé (nb concepts / assets par type), sources consultées, note
de coverage du Domaine 4 vs blueprint, et proposition de statut (`needs_review` si les 4 domaines
sont jugés couverts, sinon `in_progress`).

---

## Décisions produit en attente de Shai (non bloquantes)

1. **Ordre de merge Lot C (PR #7) / Lot D / Domaine 4** et résolution des conflits d'append JSON
   (triviaux). Idéalement merger dans l'ordre de production pour minimiser les rebases.
2. **Améliorer le handoff du pipeline** pour éviter les doublons (déjà partiellement résolu : ce
   `NEXT_MISSION.md` est écrit sur une branche mergée vers `main` via la PR de pilotage précédente).
3. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
4. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche ?
5. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur le
   blueprint + docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?

## Pistes alternatives (si Shai préfère réorienter)

- **Enrichir les lots existants** au lieu d'ouvrir le Domaine 4 : plus d'assets par concept (meilleure
  rotation SM-2), scénarios supplémentaires, montée en difficulté sur les concepts les plus lourds.
- **Ajouter une 2ᵉ certification** (OSCP ou AZ-900 évoquées dans la roadmap) — **nécessite d'abord un
  arbitrage de Shai** (garde-fou §6.2 : pas de certif hors `certifications_roadmap.md`).
