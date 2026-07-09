# NEXT MISSION

## ⚠️ D'ABORD : vérifier les PR ouvertes avant toute génération (éviter les doublons)

Avant de générer, **lister les Pull Requests ouvertes** (API GitHub) pour ne pas refaire un lot déjà
produit. État au 2026-07-09 :

- **PR #7 (ouverte, draft)** — Lot C (Networking & Databases, 14 concepts / 28 assets). **Toujours
  non mergée.** Ne pas la régénérer.
- **PR Domaine 4 (ouverte, draft, cette session)** — Billing, Pricing, and Support (14 concepts /
  28 assets), branche `claude/loving-curie-d74pqn`. Ne pas la régénérer.
- Le **Lot D (PR #9) est mergé dans `main`** (monitoring, intégration, analytics, ML, dev tools).
- La CI de validation (`scripts/validate.py` + `.github/workflows/validate-content.yml`) tourne à
  chaque PR. **Lancer `python3 scripts/validate.py` avant chaque PR de toute façon.**

**État du coverage CLF-C02** : une fois PR #7 (Lot C) + PR Domaine 4 mergées, **les 4 domaines du
blueprint auront du contenu**. La certif deviendra candidate au statut `needs_review`.

## Contexte : le Domaine 4 vient de boucler le dernier domaine du blueprint

Le blueprint CLF-C02 est maintenant couvert domaine par domaine (voir la note de coverage dans
`MISSION_LOG.md`). **Il n'y a plus de domaine entier à ouvrir.** La suite naturelle n'est donc plus
« générer un nouveau domaine » mais : (a) faire converger l'intégration (merges + statut certif),
(b) densifier le contenu existant, ou (c) ouvrir une 2ᵉ certification — **ce dernier point exige un
arbitrage de Shai** (garde-fou §6.2).

## Mission recommandée : densification du contenu (meilleure rotation SM-2)

Tant que Shai n'a pas tranché sur l'ajout d'une 2ᵉ certification, la mission la plus utile SANS
nouvelle décision produit est d'**enrichir les concepts existants de CLF-C02 en assets**, pour une
meilleure rotation SM-2 (aujourd'hui la plupart des concepts n'ont qu'1 à 2 assets).

**Certification cible** : `aws-cloud-practitioner` (AJOUT strict, ne rien écraser).
**Branche** : nouvelle branche `claude/...` neuve (repartir de `main` à jour ; **attention** : si
PR #7 et/ou Domaine 4 ne sont pas encore mergées, prévenir dans la PR du conflit d'append JSON).

### Objectif (réalisable en une session)

Choisir **8 à 12 concepts existants les plus lourds / les plus examinés** (ex. `shared-responsibility-model`,
`stor-s3-storage-classes`, `comp-ec2-pricing`, `cost-explorer` vs `cost-budgets`, `well-architected-pillars`,
`infra-regions`/`infra-availability-zones`, `iam-roles-temp-credentials`) et leur ajouter **1 à 2 assets
supplémentaires chacun** dans des formats variés (privilégier swipe + scénario pour la profondeur).

- Cibles indicatives : **QCM ≥ 6, swipe ≥ 6, flashcards ≥ 4, scénarios ≥ 3, match ≥ 2** (ajuster).
- **Réutiliser les préfixes d'id existants** du concept concerné, en incrémentant le suffixe
  numérique (ex. `swipe-stor-02`, `scenario-sec-02`) — **vérifier l'absence de collision** avec les
  id déjà présents avant d'écrire.
- Compléter `asset_concepts.json` : 1 mapping par nouvel asset, 0 orphelin.
- Aucune reformulation de question d'examen réelle / braindump ; angles pédagogiques originaux,
  montée en difficulté (`difficulty` 2-3) pour compléter les assets d'entrée de gamme existants.
- `python3 scripts/validate.py` doit renvoyer OK avant la PR.

### Garde-fous (rappel, priment sur la mission)

- Pas de nouveau concept sans `source_url` précis (mais ici on ajoute surtout des **assets** sur des
  concepts déjà sourcés — si un asset introduit un point factuel nouveau, re-vérifier la source).
- Aucune certif hors `certifications_roadmap.md`. Aucun braindump. Aucun secret dans les commits.
- Ne pas toucher au code côté client / IndexedDB. Travail en AJOUT strict (0 suppression au diff).
- Ne pas basculer le statut certif à `complete` (garde-fou §6.4).

### Fin de mission attendue

PR `claude/...` → `main` (draft) : nb d'assets ajoutés par type, concepts densifiés, note sur l'état
des merges (PR #7 / Domaine 4), validate OK.

---

## Décisions en attente de Shai (certaines bloquent la suite stratégique)

1. **Ordre de merge PR #7 (Lot C) ↔ PR Domaine 4** + résolution du conflit d'append JSON (trivial,
   garder les deux blocs). Idéalement merger dans l'ordre de production.
2. **Statut certif → `needs_review`** une fois les 4 domaines sur `main` (après merges). Le fichier
   `certifications_roadmap.md` n'a volontairement pas été modifié cette session.
3. **Plans de support AWS** : restructuration AWS en cours (Business Support+, arrêt d'Enterprise
   On-Ramp au 01/01/2027). Contenu actuel aligné sur le modèle classique testé par CLF-C02.
   Conserver cet alignement examen, ou anticiper la nouvelle nomenclature ?
4. **Ajout d'une 2ᵉ certification** (OSCP ou AZ-900 évoquées dans la roadmap) — **décision requise**
   (§6.2). C'est la piste la plus structurante une fois CLF-C02 en `needs_review`.
5. Décisions produit anciennes toujours ouvertes : langue FR vs bilingue ; granularité du champ
   `domain` (nom de domaine vs sous-domaines par tâche) ; critère de `complete` avec exam guide PDF
   inaccessible au fetcher.

## Pistes alternatives (si Shai préfère réorienter)

- **Convergence d'intégration d'abord** : merger PR #7 puis Domaine 4, rebaser, passer la certif en
  `needs_review`, avant toute nouvelle génération — pour repartir d'un `main` propre et complet.
- **Ouvrir AZ-900 ou OSCP** (après arbitrage §6.2) : première certif non-AWS, l'occasion de valider
  que la structure de contenu et le pipeline se généralisent bien à un autre référentiel.
- **Scénarios transverses avancés** (mapping multi-concepts) reliant plusieurs domaines (ex. coût +
  sécurité + architecture) pour exploiter le many-to-many d'`asset_concepts.json`.
