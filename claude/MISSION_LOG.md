# MISSION LOG — AWS CLF-C02, Domaine 1 : Cloud Concepts

**Date** : 2026-07-01 (session nocturne autonome)
**Branche** : claude/loving-curie-urbnd2
**Statut** : Terminée — PR ouverte vers main

## Ce qui a été fait

Premier lot de contenu pédagogique réel généré pour l'AWS Certified Cloud Practitioner
(CLF-C02), **Domaine 1 : Cloud Concepts** (24 % de l'examen). 12 concepts et 24 assets de jeu
couvrant les 4 tâches du domaine (1.1 avantages du cloud, 1.2 principes de conception /
Well-Architected, 1.3 migration / CAF + 7 R, 1.4 économie du cloud). Les 5 formats de jeu du
schéma sont désormais tous alimentés, ce qui valide le pipeline de génération de bout en bout.
Contenu rédigé en français, termes techniques AWS conservés en anglais.

## Certification / domaine traités

- **Certif** : `aws-cloud-practitioner` (statut passé de `not_started` à `in_progress`)
- **Domaine** : Domain 1 — Cloud Concepts
- **Concepts créés** : 12 (chacun avec un `source_url` précis vers docs.aws.amazon.com)
- **Assets créés** : 24 → QCM ×6, flashcards ×7, swipe ×7, scénarios ×2, match ×2
- **Mapping** : 24 entrées dans `asset_concepts.json` ; chaque concept est exercé par ≥1 asset

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (12 concepts)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json`
- `content/aws-cloud-practitioner/asset_concepts.json`
- `content/aws-cloud-practitioner/certification.json` (status → `in_progress`)
- `claude/certifications_roadmap.md` (statut CLF-C02 → `in_progress`)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Sources : chaque concept pointe vers une page exacte de docs.aws.amazon.com (six
  avantages, types de cloud, piliers Well-Architected, CAF, stratégies de migration 7 R,
  cost optimization, right-sizing). Aucun lien générique.
- §6.3 Aucune reproduction de question d'examen : toutes les questions sont originales et
  pédagogiques, inspirées du scope officiel, aucun braindump consulté.
- §6.4 Certif **non** marquée `complete` : seul le Domaine 1 est couvert → `in_progress`.
- §6.6 Aucun secret / credential dans les commits (scan effectué avant commit).

## Contrôles techniques passés

- JSON valide pour les 7 fichiers de contenu.
- Intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant, 0 concept sans asset.

## Questions ouvertes pour Shai (à lire en priorité)

1. **Langue du contenu** : j'ai rédigé le contenu pédagogique en **français** (cohérent avec
   CLAUDE.md, les commits et les libellés d'exemple de NEXT_MISSION). À confirmer : le contenu
   doit-il rester FR, ou viser un bilingue FR/EN à terme ? Décision produit non tranchée dans
   CLAUDE.md — je n'ai pas voulu deviner. Impact potentiel sur le schéma (champ de langue ?).
2. **Champ `domain` des concepts** : j'ai utilisé `"Cloud Concepts"` (nom exact du domaine dans
   `certification.json`) plutôt qu'un sous-domaine plus fin. Confirme que ce niveau de
   granularité convient pour le filtrage côté app, ou faut-il des sous-domaines (Task 1.1…1.4) ?
3. **Exam guide PDF inaccessible** : le PDF officiel AWS (et les pages docs.aws en WebFetch)
   renvoient 403 au fetcher. J'ai contourné via WebSearch (même contenu docs.aws, sources
   vérifiées et citées). Le coverage vs blueprint repose donc sur la structure connue du
   Domaine 1, pas sur une lecture ligne à ligne du PDF. À garder en tête pour juger `complete`.

## Lien PR

Voir la Pull Request ouverte depuis la branche `claude/loving-curie-urbnd2` vers `main`
(lien ajouté à l'ouverture).
