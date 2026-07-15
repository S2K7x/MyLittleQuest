# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les PR ouvertes** (`mcp__github__list_pull_requests`) et **relire le git log de
`main`** (des PR peuvent être mergées entre deux sessions). Ne jamais refaire un lot déjà produit.

État au 2026-07-15 (après cette session) :

- **PR #7 (ouverte, draft)** — Lot C (Domaine 3 : Networking & Databases, 14 concepts / 28 assets).
- **PR #10 (ouverte, draft)** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets).
- **PR de cette session (ouverte, draft)** — rééquilibrage des formats : **+8 assets** (4 `match`, 4 `scenario`)
  sur des concepts déjà sur `main`, **0 nouveau concept**. `main` visé = 72 concepts / 206 assets / 206 mappings
  une fois mergée.

Les 3 PR appendent aux mêmes tableaux JSON → **conflits d'append triviaux** au merge (garder tous les blocs).
**Aucune collision d'id** (vérifié cette session : #7 = `*-net-*`/`*-db-*`, #10 = `*-cost-*`/`*-sup-*`, cette
session = `match-stor-02`/`match-comp-02`/`match-cloud-05`/`match-ml-01` + `scenario-comp-04`/`scenario-stor-03`/
`scenario-sec-05`/`scenario-cloud-04`). Lancer `python3 scripts/validate.py` avant chaque PR.

## ⚠️ Le backlog de contenu reste LE point de blocage — arbitrage de Shai vraiment souhaité

Le pipeline **produit plus vite que Shai ne merge**. Les chantiers de génération de fond sont terminés côté
production. Il reste **2 PR de contenu de domaine non mergées** (#7, #10), plus la petite PR de rééquilibrage de
cette nuit. **Générer davantage de contenu neuf a un rendement clairement décroissant** tant que ce backlog
n'est pas résorbé — c'est le constat répété depuis plusieurs nuits.

## Recommandation forte : résorber le backlog plutôt que générer

**(A) Résorber le backlog (fortement recommandé)** : merger **#7 → #10** (ordre de production, rebaser #10 ;
conflits d'append triviaux, garder tous les blocs).
- **Au moment de mettre à jour / rebaser la branche de #7**, la CI `validate` s'exécutera enfin sur cette PR
  (elle ne tournait pas car #7 est antérieure à la CI — voir historique). Le contenu de #7 **passe déjà
  `validate.py`** en local, donc pas de surprise attendue.
- Une fois #7 + #10 sur `main`, les **4 domaines du blueprint CCP sont couverts** → passer le statut certif à
  **`needs_review`** dans `certifications_roadmap.md` (garde-fou §6.4). La prochaine session partira d'une base
  propre et complète.

Cette décision de **merge** relève de Shai (§6.7 : une session nocturne ne merge jamais). Tant que #7 et #10 ne
sont pas mergées, **ne pas toucher** aux domaines réseau/BdD/billing (doublon garanti).

## Si Shai laisse tourner le pipeline malgré tout — options non-doublon restantes

Le rapport de couverture (`python3 scripts/validate.py`) chiffre les manques sur `main`. Après le rééquilibrage
de cette nuit, l'écart de formats s'est réduit mais reste réel :

- **(B) Poursuivre le rééquilibrage des formats.** Après cette session : `match` 18, `scenario` 23, encore
  derrière qcm (70), swipe (50), flashcard (45). On peut ajouter encore **~4-6 `match`/`scenario`** sur d'autres
  concepts **déjà sur `main`** non encore couverts par ces formats (ex. `mon-cloudwatch`/`mon-cloudtrail`/
  `mon-config` en match « service ↔ rôle » ; `comp-ecs`/`comp-eks`/`comp-fargate` en scénario d'arbitrage
  conteneurs ; `iam-identities` en match users/groups/roles/policies). Rester hors réseau/BdD/billing tant que
  #7/#10 non mergées. **Ids** : continuer la numérotation (`match-mon-02`, `scenario-comp-05`, etc.) en
  revérifiant les branches de #7/#10.
- **(C) Rampe « débutant » (difficulté 1).** La difficulté 1 (37 assets) reste mince face à la 2 (131). Quelques
  assets faciles supplémentaires sur les concepts fondamentaux (Cloud Concepts, sécurité de base) amélioreraient
  l'onboarding. Concepts déjà sur `main` uniquement.
- **(D) Durcir `validate.py` (décision de politique — nécessite l'aval de Shai).** Rendre bloquant le plancher
  « ≥ 2 assets par concept ». Ne pas l'imposer sans arbitrage.

**Contraintes communes (B/C)** :
- **Dossier** : `content/aws-cloud-practitioner/` (AJOUT strict, ne rien écraser ; diff 100 % additif).
- **Branche** : celle imposée par la config de session (`claude/...`), repartant de `main` à jour
  (`git fetch origin main && git checkout -B <branche> origin/main`).
- **Garde-fous** : contenu original, pas de braindump (§6.3) ; match ≥ 2 paires ; qcm `correct_index` valide ;
  swipe `is_true` booléen ; scénario = exactement 1 choix correct. Valider via `scripts/validate.py`. Vérifier
  l'absence de collision d'id avec `main` **et** les branches de #7/#10. Aucun secret. PR draft.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint (§6.4).
Tant que #7 et #10 ne sont pas mergées, rester à `in_progress`.

## Décisions produit en attente de Shai (non bloquantes)

1. **Ordre de merge des 2 PR de contenu de domaine** (#7 puis #10) et résolution des conflits d'append trivial.
2. **Statut certif → `needs_review`** une fois les 4 domaines sur `main`.
3. **Durcir `validate.py`** : rendre bloquant le plancher « ≥ 2 assets par concept » ? (aujourd'hui indicatif).
4. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
5. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche du blueprint ?
6. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint +
   docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
7. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration (Business Support+, arrêt d'Enterprise
   On-Ramp au 01/01/2027). Conserver l'alignement examen (5 plans classiques) ou anticiper la nouvelle
   nomenclature ?
8. **Ajouter une 2ᵉ certification** (OSCP ou AZ-900, notes de la roadmap) — nécessite un arbitrage de Shai
   (garde-fou §6.2). Utile une fois la CCP en `needs_review`/`complete`.
