# MISSION LOG — Rééquilibrage des formats sous-représentés (match / scenario), CLF-C02

**Date** : 2026-07-15 (session nocturne autonome)
**Branche** : claude/loving-curie-1yxmkn
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **Le backlog de contenu n'a PAS bougé : #7 et #10 sont TOUJOURS ouvertes et non mergées.**
  - **PR #7** — Lot C (Domaine 3 : Networking & Databases, 14 concepts / 28 assets).
  - **PR #10** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets).
  Une fois **#7 + #10** mergées, les **4 domaines du blueprint CCP sont sur `main`** → basculer la certif
  en **`needs_review`** (garde-fou §6.4). Ordre suggéré : **#7 → #10** (rebaser #10 ; conflits d'append JSON
  triviaux, garder tous les blocs). **Aucune collision d'id** — vérifié cette session (voir ci-dessous).
- **La décision de merge appartient à Shai** (une session nocturne ne merge jamais, §6.7). Générer du contenu
  neuf sur les domaines réseau/BdD/billing resterait un doublon garanti tant que #7/#10 ne sont pas sur `main`.
- **Mission de cette nuit : option (B) du `NEXT_MISSION` précédent — rééquilibrer les formats sous-représentés**,
  sans nouveau concept, uniquement sur des concepts **déjà sur `main`**. Choix assumé, non-doublon, sans
  décision produit requise. **8 assets ajoutés** (4 `match` + 4 `scenario`). `validate.py` → ✅ 72 / 206 / 206.

## Ce qui a été fait

Ajout de **8 assets** sur des concepts fondamentaux **déjà présents sur `main`** (aucun concept créé, donc pas
de nouveau `source_url` requis au sens §6.1). Contenu **100 % original**, ancré sur les `core_explanation` et
les `source_url` officiels des concepts ciblés (pas de braindump, §6.3).

**4 `match`** (le format le moins couvert : 14 → 18) :
- `match-stor-02` — classes de stockage S3 ↔ cas d'usage (Standard, Standard-IA, Intelligent-Tiering, Glacier
  Flexible/Deep Archive). Concepts : `stor-s3-storage-classes`, `stor-s3-glacier`.
- `match-comp-02` — modèles de tarification EC2 ↔ cas d'usage (On-Demand, Reserved, Savings Plans, Spot,
  Dedicated Hosts). Concept : `comp-ec2-pricing`.
- `match-cloud-05` — les 6 piliers Well-Architected ↔ description. Concept : `well-architected-pillars`.
- `match-ml-01` — services d'IA applicative ↔ fonction (Rekognition, Comprehend, Polly, Transcribe, Translate,
  Lex). Concept : `ml-ai-services`.

**4 `scenario`** (2ᵉ format le moins couvert : 19 → 23), exactement 1 choix correct chacun :
- `scenario-comp-04` — quel modèle d'achat EC2 pour une charge stable sur 3 ans → Savings Plans / Reserved.
  Concept : `comp-ec2-pricing`.
- `scenario-stor-03` — quelle classe S3 pour des accès imprévisibles sans frais de récupération →
  Intelligent-Tiering. Concept : `stor-s3-storage-classes`.
- `scenario-sec-05` — remédier une policy `s3:*`/`Resource:*` trop permissive → `s3:GetObject` sur le bucket
  précis (moindre privilège). Concepts : `iam-least-privilege`, `iam-identities`.
- `scenario-cloud-04` — instances à ~10 % CPU en permanence → right-sizing d'abord (pas Spot ni RI).
  Concepts : `cloud-right-sizing`, `cloud-economics-tco`.

**8 mappings** correspondants dans `asset_concepts.json` (1 par asset ; 0 orphelin, 0 concept inexistant).

## Anti-doublon / anti-collision (vérifié)

- **Aucun concept réseau/BdD/billing touché** : tous les concepts ciblés sont déjà sur `main` (compute, storage,
  Cloud Concepts, sécurité IAM, ML). Les domaines de #7 et #10 sont laissés strictement intacts.
- **Ids vérifiés contre les branches de #7 et #10** avant génération : #7 ajoute `*-net-01`/`*-db-01`, #10 ajoute
  `*-cost-01`/`*-sup-01`. Mes ids (`match-stor-02`, `match-comp-02`, `match-cloud-05`, `match-ml-01`,
  `scenario-comp-04`, `scenario-stor-03`, `scenario-sec-05`, `scenario-cloud-04`) **ne collisionnent avec
  aucune des deux PR** ni avec `main`. Au merge de #7/#10, conflit d'append trivial (garder tous les blocs).

## Certification / domaine traités

- **CLF-C02** uniquement. Domaines touchés (assets seulement, aucun concept) : Cloud Technology and Services
  (storage, compute, ML), Cloud Concepts (Well-Architected, coûts), Security and Compliance (IAM).
- **0 concept créé**, **+8 assets**, **+8 mappings**. Certif **inchangée à `in_progress`** (garde-fou §6.4 :
  le Domaine 3 reste incomplet sur `main` tant que #7 n'est pas mergée).

## Contrôle technique passé

- `python3 scripts/validate.py` → ✅ OK (exit 0) : **72 concepts / 206 assets / 206 mappings**, schéma par
  format (match ≥ 2 paires, scénario = exactement 1 choix correct) + intégrité référentielle.
- Diff **100 % additif** (`git diff --numstat` : 0 suppression sur les 3 fichiers de contenu) → non-régression.
- Rapport de couverture après ajout : `match` 14 → 18, `scenario` 19 → 23. **0 concept à couverture faible**.
- Aucun secret / credential dans le diff (contenu pédagogique JSON uniquement).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/assets/match.json` (+4 assets)
- `content/aws-cloud-practitioner/assets/scenario.json` (+4 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+8 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante).
- `content/aws-cloud-practitioner/concepts.json` : **non modifié**. `scripts/validate.py`,
  `.github/workflows/*` : **non modifiés**.

## Garde-fous vérifiés

- §6.1 Aucun nouveau concept → pas de `source_url` requis ; contenu néanmoins ancré sur les sources officielles
  des concepts existants. §6.2 Aucune certif hors roadmap (seule CLF-C02 touchée). §6.3 Contenu original,
  aucun braindump. §6.4 Statut certif **inchangé** (`in_progress`) tant que #7/#10 ne sont pas sur `main`.
  §6.5 Aucune touche côté client / IndexedDB. §6.6 Aucun secret. §6.7 Branche `claude/...` + PR draft, pas de
  push sur `main`.

## Questions ouvertes pour Shai (par priorité)

1. **Résorber le backlog reste de loin le plus utile.** 2 PR ouvertes : **#7** (réseau/BdD) puis **#10**
   (billing). En mettant à jour / rebasant la branche de #7 au moment du merge, la CI `validate` s'y exécutera
   enfin (elle passe déjà en local). Une fois #7 + #10 sur `main`, les 4 domaines du blueprint sont couverts.
2. **Statut certif → `needs_review`** une fois #7 + #10 mergées (garde-fou §6.4 ; exam guide PDF inaccessible
   au fetcher). Non modifié cette session pour ne pas surestimer le coverage.
3. **Faut-il durcir `validate.py` ?** (plancher « ≥ 2 assets par concept » bloquant) — décision de politique,
   non imposée seul. À trancher par Shai.
4. Décisions produit anciennes toujours ouvertes (langue FR/bilingue ; granularité du champ `domain` ; critère
   de `complete` ; plans de support AWS en restructuration ; ajout d'une 2ᵉ certif OSCP/AZ-900 §6.2) — inchangées.

## Lien PR

PR (draft) de cette session : https://github.com/S2K7x/MyLittleQuest/pull/16
Autres PR de contenu ouvertes : **#7** (Lot C — réseau/BdD) et **#10** (Domaine 4 — Billing).
