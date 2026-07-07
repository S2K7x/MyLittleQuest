# MISSION LOG — CI de validation du contenu (+ signalement doublon Lot C)

**Date** : 2026-07-07 (session nocturne autonome)
**Branche** : claude/ci-validation-content
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes) — doublon détecté dans le pipeline

La mission de cette nuit (lue dans `NEXT_MISSION.md` sur `main`) était de générer le **Lot C
(Networking & Databases)**. **Ce lot a DÉJÀ été fait par une session précédente : la PR #7 est
ouverte** (draft) et contient exactement ce contenu (14 concepts, 28 assets, networking + databases).

**Pourquoi le doublon ?** La session qui a produit le Lot C a mis à jour `NEXT_MISSION.md` (→ « Lot D »)
**à l'intérieur de la PR #7, qui n'est pas encore mergée**. Tant que la PR #7 n'est pas mergée dans
`main`, le `NEXT_MISSION.md` de `main` continue de pointer vers le Lot C → chaque nouvelle session
nocturne relance la même mission. J'ai généré le même Lot C localement puis, en tentant de pousser,
j'ai découvert la collision de branche (la branche `claude/content-aws-clf-c02-domain-3-lot-c` existe
déjà sur origin avec la PR #7). **Je n'ai pas écrasé la PR #7 ni ouvert de PR de contenu en double.**

**Décision demandée à Shai** : merger (ou fermer) la **PR #7**. Le merge débloque le pipeline —
`NEXT_MISSION` passera alors au Lot D et le doublon nocturne cessera.

## Ce que cette session a livré à la place (utile et sans conflit avec la PR #7)

Plutôt que de dupliquer la PR #7, j'ai livré la **piste recommandée** des sessions précédentes : la
**CI de validation du contenu**, qui manque à la PR #7 et sécurisera toutes les générations futures.

- `scripts/validate.py` : validation JSON — schéma par format (qcm/flashcard/swipe/scenario/match)
  + intégrité référentielle (0 orphelin, 0 concept sans asset, 0 id dupliqué, 0 mapping dupliqué).
  Bibliothèque standard uniquement, code retour 0/1.
- `.github/workflows/validate-content.yml` : GitHub Action lançant `validate.py` sur chaque PR et
  push touchant `content/**`. Échec du job = échec de la PR.

Ces fichiers ne touchent **que** `scripts/` et `.github/` (aucun chevauchement avec les fichiers de
contenu de la PR #7), le diff est donc propre et non conflictuel.

## Certification / domaine traités

- **Aucun contenu pédagogique généré dans cette session** (le Lot C existe déjà en PR #7).
- État de la certif `aws-cloud-practitioner` sur `main` : 59 concepts, 104 assets (Domaines 1, 2 et
  Lots A+B du Domaine 3). Après merge de la PR #7 : 73 concepts, 132 assets.

## Contrôle technique passé

- `python3 scripts/validate.py` sur le contenu actuel de `main` (59 concepts / 104 assets / 104
  mappings) : ✅ OK (schéma + intégrité référentielle).

## Fichiers créés / modifiés

- `scripts/validate.py` (nouveau — validateur réutilisable)
- `.github/workflows/validate-content.yml` (nouveau — CI de validation)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.2 Aucune nouvelle certif hors roadmap. §6.5 Aucune touche côté client (IndexedDB / exports).
- §6.6 Aucun secret / credential (scan effectué : rien). §6.7 Aucun push sur `main` — branche + PR draft.
- §6.3/§6.1 sans objet cette nuit (aucun contenu généré). Statut certif inchangé (`in_progress`).

## Questions ouvertes pour Shai (par priorité)

1. **Merger ou fermer la PR #7 (Lot C)** — débloque le pipeline et arrête le doublon nocturne. **(bloquant pour la suite)**
2. **Améliorer le handoff du pipeline** pour éviter que ce doublon se reproduise. Options possibles
   (à trancher) : (a) merger les PR de contenu plus vite ; (b) faire écrire `NEXT_MISSION.md`
   directement sur `main` par un petit commit séparé plutôt que dans la PR de contenu ; (c) qu'une
   session vérifie les PR ouvertes (via l'API GitHub) avant de (re)lancer une mission.
3. Les 3 décisions produit toujours en attente (langue FR vs bilingue ; granularité du champ
   `domain` ; critère de `complete` avec exam guide PDF inaccessible) — inchangées.

## Lien PR

PR (draft) de cette session : https://github.com/S2K7x/MyLittleQuest/pull/8
Branche `claude/ci-validation-content` → `main`.
PR du Lot C (déjà ouverte, à arbitrer) : https://github.com/S2K7x/MyLittleQuest/pull/7
