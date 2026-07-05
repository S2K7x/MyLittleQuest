# NEXT MISSION

## Générer le contenu Domain 3 — Lot C : Networking & Databases (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter, ne rien écraser)
**Branche à créer** : `claude/content-aws-clf-c02-domain-3-lot-c` (ou la branche `claude/...`
assignée à la session)

### Contexte

Avancement du Domaine 3 (Cloud Technology and Services, 34 %, découpé en lots) :
- **Lot A — Infrastructure globale + déploiement (Tasks 3.1 & 3.2)** : fait — 15 concepts, 25 assets.
- **Lot B — Compute & Storage (part de la Task 3.3)** : fait (cette PR) — 15 concepts, 28 assets.
- Restent les lots C (networking & databases, fin de la Task 3.3) et D (autres catégories de
  services, Task 3.4).

État global de la certif : **59 concepts, 104 assets**. Domaines 1 (Cloud Concepts) et 2 (Security
& Compliance) complets ; Domaine 3 partiel (Lots A + B) ; Domaine 4 (Billing/Pricing/Support) non
commencé.

### Objectif — Lot C : Networking & Databases (fin de la Task 3.3)

Couvrir les services **réseau** et **bases de données** cœur du CLF-C02. Suggestion de découpage
des concepts (~13-16 concepts, `domain` = `"Cloud Technology and Services"`) :

**Networking**
- Amazon VPC (réseau virtuel isolé, subnets publics/privés) — reconnaissance niveau CCP
- Sous-réseaux (subnets), tables de routage, Internet Gateway / NAT Gateway — niveau reconnaissance
- Amazon Route 53 (DNS géré, routage) — reconnaissance
- Elastic Load Balancing (ELB : répartition de charge, types ALB/NLB au niveau reconnaissance)
  — lien avec Auto Scaling vu au Lot B
- (optionnel) VPC endpoints / PrivateLink — reconnaissance, à jauger selon le scope CCP

**Databases**
- Amazon RDS (bases relationnelles gérées, moteurs supportés) — reconnaissance
- Amazon Aurora (base relationnelle compatible MySQL/PostgreSQL, gérée) — reconnaissance
- Amazon DynamoDB (NoSQL clé-valeur, serverless, scalable) — reconnaissance
- Amazon ElastiCache (cache en mémoire, Redis/Memcached) — reconnaissance
- Amazon Redshift (entrepôt de données / data warehouse, analytique) — reconnaissance
- (optionnel) Amazon DocumentDB / Neptune / Keyspaces — reconnaissance très légère si pertinent

### Contenu à générer (Lot C)

- **Concepts** (~13-16, en AJOUT dans `concepts.json`), chacun avec un `source_url` précis vers
  docs.aws.amazon.com (page exacte, vérifiée via **WebSearch** — WebFetch renvoie 403 sur AWS).
- **Assets** — mêmes minimums qu'aux lots précédents : QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6,
  + au moins 1 scénario et 1 match. Préfixe d'id suggéré : `-net-` (networking) / `-db-`
  (databases). Vérifier l'absence de collision avec les id existants (`-cloud-`, `-sec-`,
  `-infra-`, `-svc-`, `-comp-`, `-stor-`).
- **Mapping** : compléter `asset_concepts.json`, 1 mapping par asset, 0 orphelin, 0 concept sans asset.

### Outils réutilisables de cette nuit

Les scripts `gen_lot_b.py` (génération append-only) et surtout `validate.py` (schéma + intégrité
référentielle) écrits en session sont directement réutilisables comme base : adapter les listes
de concepts/assets/mappings, relancer la validation avant la PR. **Piste alternative recommandée**
(voir plus bas) : intégrer `validate.py` dans une GitHub Action pour sécuriser toutes les PR.

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis vers docs.aws.amazon.com. Pas de lien générique.
- Aucune reproduction de question d'examen réelle / braindump.
- Ne pas marquer la certif `complete` (Domaine 3 encore partiel après Lot C + Domaine 4 restant).
- Aucun secret dans les commits. Ne pas toucher au code côté client / IndexedDB.
- Valider JSON + intégrité référentielle (0 orphelin, 0 concept sans asset, 0 id dupliqué) avant la PR.
- Travail en AJOUT strict : ne pas altérer les valeurs des entrées existantes (Domaines 1, 2, Lots
  A et B). Objectif : 0 ligne supprimée au diff Git sur les fichiers existants.

### Fin de mission attendue

PR `claude/...` → `main` (draft) avec résumé (nb concepts / assets par type), liste des sources
consultées, et note de coverage du Lot C vs la Task 3.3 (partie networking/databases).

---

## Décisions produit en attente de Shai (non bloquantes, à trancher bientôt)

Reportées depuis les Domaines 1, 2 et les Lots A/B du Domaine 3 — elles ne bloquent pas la
génération mais méritent un arbitrage avant que le volume ne grossisse davantage (déjà 59 concepts /
104 assets) :

1. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ? Impact possible sur le schéma
   (ajout d'un champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche
   (3.1…3.4) pour affiner le filtrage côté app ? De plus en plus pertinent maintenant que le
   Domaine 3 s'étale sur plusieurs lots (A + B, bientôt C + D).
3. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403). Coverage jugé sur la
   structure du blueprint + docs.aws citées. Suffisant, ou vérification manuelle du PDF souhaitée
   avant `needs_review`/`complete` ?

## Pistes alternatives (si tu préfères réorienter)

- **[Recommandé] Mettre en place une CI de validation** (GitHub Action lançant `validate.py` —
  schéma + intégrité référentielle des JSON — à chaque PR). De plus en plus utile : le contenu
  grossit (59 concepts, 104 assets) et une CI sécuriserait toutes les générations futures contre
  une régression de schéma ou un orphelin. Le script `validate.py` écrit cette nuit est prêt à
  servir de base directe — il faudrait juste le versionner (ex : `scripts/validate.py`) et ajouter
  un workflow `.github/workflows/`.
- **Traiter le Domaine 4 (Billing/Pricing/Support, 12 %) avant de finir le Domaine 3** : plus
  petit, permet de compléter un domaine entier rapidement (Cost Explorer, AWS Budgets, Pricing
  Calculator, plans de support, TCO, consolidated billing via Organizations).
- **Enrichir les Domaines/Lots déjà couverts** : plus d'assets par concept (meilleure rotation
  SM-2), scénarios supplémentaires, montée en difficulté progressive.
