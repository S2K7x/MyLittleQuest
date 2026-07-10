# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les Pull Requests ouvertes** (API GitHub / `mcp__github__list_pull_requests`)
pour ne pas refaire un lot déjà produit. **Ce garde-fou a déjà évité un doublon** : la session du
2026-07-10 a constaté que le Domaine 4 était déjà fait (PR #10) et a fait autre chose.

État des PR de contenu ouvertes au 2026-07-10 :

- **PR #7 (ouverte, draft)** — Lot C (Networking & Databases, 14 concepts / 28 assets). Non mergée.
- **PR #10 (ouverte, draft)** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets). Non mergée.
- **PR de cette session (ouverte, draft)** — Enrichissement SM-2 (+34 assets, 0 concept). Non mergée.

Les trois appendent aux mêmes tableaux JSON → **conflits d'append triviaux** à l'intégration (garder
tous les blocs). **Aucune collision d'id** entre les trois. Lancer `python3 scripts/validate.py`
avant chaque PR (doit renvoyer OK).

## ⚠️ Le pipeline produit plus vite que le merge — décision de Shai souhaitée

3 PR de contenu s'accumulent non mergées. **Générer encore plus de contenu aggrave le backlog et les
conflits d'append.** Deux voies possibles, à trancher par Shai :

- **(A) Résorber le backlog** : merger #7 → #10 → PR d'enrichissement (ordre de production), puis
  passer le statut certif à `needs_review`. Après ça, la prochaine session aura une base propre.
- **(B) Continuer à enrichir sans nouveau domaine** (voir mission recommandée ci-dessous) : sûr et
  utile, mais ajoute une 4ᵉ PR au backlog.

## Mission recommandée (si Shai ne tranche pas et laisse tourner le pipeline)

**Poursuivre l'enrichissement SM-2** — même logique que la session du 2026-07-10, cible suivante :

**Cible** : les **11 concepts de `main` qui n'ont que 2 assets** (les faire passer à 3, +1 asset chacun,
soit ~11 assets). Puis, si le budget de session le permet, ajouter **1-2 scénarios** sur les concepts
transverses les plus riches (le scénario est le format le plus sous-représenté : 8 sur 132 avant
enrichissement, et 0 ajouté cette session).

- **Dossier** : `content/aws-cloud-practitioner/` (AJOUT strict, ne rien écraser).
- **Branche** : celle imposée par la config de session (`claude/...`). Vérifier qu'elle part de `main`
  à jour (`git fetch origin main && git checkout -B <branche> origin/main`).
- **Pré-requis** : identifier les 11 concepts à 2 assets via un petit script (comme dans la session
  précédente), lire leur `core_explanation`, écrire des assets **complémentaires** (type différent des
  existants). Continuer les suites d'id par préfixe/type (pas de collision).
- **Rappels garde-fous** : assets sans `source_url` (c'est un champ concept, §6.1) ; contenu original,
  pas de braindump (§6.3) ; match ≥ 2 paires ; qcm `correct_index` valide ; swipe `is_true` booléen ;
  scénario = exactement 1 choix correct. Valider via `scripts/validate.py`. Aucun secret. PR draft.

**Statut `complete` interdit** tant que les 4 domaines ne sont pas sur `main` ET comparés au blueprint
(§6.4). Tant que #7 et #10 ne sont pas mergées, rester à `in_progress`.

## Pistes alternatives (si Shai préfère réorienter)

- **Résorber le backlog de PR** (voie A ci-dessus) plutôt que de générer davantage — probablement le
  plus utile à court terme.
- **Montée en difficulté** : la majorité des assets sont en difficulté 1-2. Ajouter des QCM/scénarios
  de difficulté 3 sur les concepts les plus avancés (svc-outposts, comp-eks, réseau/BdD une fois le
  Lot C mergé) pour étoffer la fin de courbe SM-2.
- **Ajouter une 2ᵉ certification** (OSCP ou AZ-900, évoquées dans la roadmap) — **nécessite d'abord un
  arbitrage de Shai** (garde-fou §6.2 : pas de certif hors `certifications_roadmap.md`).

## Décisions produit en attente de Shai (non bloquantes, inchangées)

1. **Ordre de merge des 3 PR de contenu** (#7, #10, enrichissement) et résolution des conflits d'append.
2. **Statut certif → `needs_review`** une fois les 4 domaines sur `main`.
3. **Langue du contenu** : FR uniquement (actuel) ou bilingue FR/EN ?
4. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche ?
5. **Critère `complete`** : exam guide PDF inaccessible au fetcher (403) ; coverage jugé sur blueprint
   + docs.aws. Suffisant, ou vérification manuelle du PDF par Shai souhaitée ?
6. **Plans de support AWS** (soulevé par PR #10) : doc en restructuration (Business Support+, arrêt
   d'Enterprise On-Ramp au 01/01/2027). Contenu aligné sur le modèle classique à 5 plans testé par
   CLF-C02 — conserver l'alignement examen ou anticiper la nouvelle nomenclature ?
