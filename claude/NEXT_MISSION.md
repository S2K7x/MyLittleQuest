# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les PR ouvertes** (`mcp__github__list_pull_requests`) et **relire le git log de
`main`** (des PR ont été mergées entre deux sessions — c'est arrivé avec #14 le 2026-07-13→14). Ne jamais
refaire un lot déjà produit.

État au 2026-07-14 (après cette session) :

- **PR #7 (ouverte, draft)** — Lot C (Domaine 3 : Networking & Databases, 14 concepts / 28 assets).
- **PR #10 (ouverte, draft)** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets).
- **PR de cette session (ouverte, draft)** — outillage : rapport de couverture dans `validate.py`, **0 contenu**.
- **PR #14** — **MERGÉE** (difficulté 3 étendue). `main` = 72 concepts / 198 assets / 198 mappings.

Les PR #7 et #10 appendent aux mêmes tableaux JSON → **conflits d'append triviaux** au merge (garder tous les
blocs). **Aucune collision d'id.** Lancer `python3 scripts/validate.py` avant chaque PR.

## ⚠️ Le backlog de contenu reste LE point de blocage — arbitrage de Shai vraiment souhaité

Le pipeline **produit plus vite que Shai ne merge**. Les chantiers de génération sont terminés côté production
(planchers SM-2 mergés ; difficulté 3 large et mergée via #14). Il reste **2 PR de contenu non mergées**
(#7, #10). **Générer davantage a un rendement clairement décroissant** tant que ce backlog n'est pas résorbé.

## Recommandation forte : résorber le backlog plutôt que générer

**(A) Résorber le backlog (fortement recommandé)** : merger **#7 → #10** (ordre de production, rebaser #10 ;
conflits d'append triviaux, garder tous les blocs).
- **Au moment de mettre à jour la branche de #7**, la CI `validate` s'exécutera enfin sur cette PR (elle ne
  tournait pas car #7 est antérieure à la CI — voir MISSION_LOG). Le contenu de #7 **passe déjà `validate.py`
  en local** (73/132/132), donc pas de surprise attendue.
- Une fois #7 + #10 sur `main`, les **4 domaines du blueprint CCP sont couverts** → passer le statut certif à
  **`needs_review`** dans `certifications_roadmap.md` (garde-fou §6.4). La prochaine session partira d'une base
  propre et complète.

Cette décision de **merge** relève de Shai (§6.7 : une session nocturne ne merge jamais). Tant que #7 et #10 ne
sont pas mergées, **ne pas toucher** aux domaines réseau/BdD/billing (doublon garanti).

## Si Shai laisse tourner le pipeline malgré tout — options non-doublon, désormais objectivées par le rapport

Le rapport de couverture ajouté cette nuit (`python3 scripts/validate.py`) chiffre les manques sur `main` :

- **(B) Rééquilibrer les formats sous-représentés.** `match` (14) et `scenario` (19) sont loin derrière qcm (70),
  swipe (50), flashcard (45). Ajouter ~6-10 assets **`match`/`scenario`** sur des concepts **déjà sur `main`**
  (hors réseau/BdD/billing tant que #7/#10 non mergées) rééquilibre l'expérience de jeu sans nouveau concept.
  Angle comparaison/arbitrage, contenu 100 % original (§6.3).
- **(C) Rampe « débutant » (difficulté 1).** La difficulté 1 (37 assets) est mince face à la 2 (123). Quelques
  assets faciles supplémentaires sur les concepts fondamentaux (Cloud Concepts, Sécurité de base) amélioreraient
  l'onboarding. Concepts déjà sur `main` uniquement.
- **(D) Durcir `validate.py` (décision de politique — nécessite l'aval de Shai, cf. MISSION_LOG Q3).** Le rapport
  liste déjà les concepts à < 2 assets ; le transformer en **échec bloquant** garantirait un plancher de
  couverture par concept. Ne pas l'imposer sans arbitrage.

**Contraintes communes (B/C)** :
- **Dossier** : `content/aws-cloud-practitioner/` (AJOUT strict, ne rien écraser).
- **Branche** : celle imposée par la config de session (`claude/...`), repartant de `main` à jour
  (`git fetch origin main && git checkout -B <branche> origin/main`).
- **Garde-fous** : contenu original, pas de braindump (§6.3) ; match ≥ 2 paires ; qcm `correct_index` valide ;
  swipe `is_true` booléen ; scénario = exactement 1 choix correct. Valider via `scripts/validate.py`. Aucun
  secret. PR draft. **Ne PAS toucher** aux domaines réseau/BdD/billing tant que #7 et #10 ne sont pas mergés.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint (§6.4).
Tant que #7 et #10 ne sont pas mergées, rester à `in_progress`.

## Décisions produit en attente de Shai (non bloquantes)

1. **Ordre de merge des 2 PR de contenu** (#7 puis #10) et résolution des conflits d'append trivial.
2. **Statut certif → `needs_review`** une fois les 4 domaines sur `main`.
3. **Durcir `validate.py`** : rendre bloquant le plancher « ≥ 2 assets par concept » ? (aujourd'hui indicatif).
4. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
5. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche du blueprint ?
6. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint +
   docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
7. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration (Business Support+, arrêt d'Enterprise
   On-Ramp au 01/01/2027). Contenu aligné sur le modèle classique à 5 plans testé par CLF-C02 — conserver
   l'alignement examen ou anticiper la nouvelle nomenclature ?
8. **Ajouter une 2ᵉ certification** (OSCP ou AZ-900, notes de la roadmap) — nécessite un arbitrage de Shai
   (garde-fou §6.2). Utile une fois la CCP en `needs_review`/`complete`.
