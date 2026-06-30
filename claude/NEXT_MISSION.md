# NEXT MISSION

## Générer le contenu Domain 1 — Cloud Concepts (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/`
**Branche à créer** : `claude/content-aws-clf-c02-domain-1`

### Objectif

Valider le pipeline de génération de bout en bout en produisant un premier lot de contenu réel
pour le **Domain 1 : Cloud Concepts** (24% du CLF-C02 — premier domaine listé dans l'exam
guide officiel). Ce domaine est choisi pour son scope délimité et sa richesse documentaire.

### Source officielle

Exam guide CLF-C02 (PDF officiel AWS) :
https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf

Lire l'exam guide pour identifier les sous-domaines et leurs objectifs de connaissance exacts.

### Contenu à générer

**Concepts** (~10 dans `content/aws-cloud-practitioner/concepts.json`)
- Couvrir les quatre tâches du Domain 1 :
  - Task 1.1: Define the benefits of the AWS Cloud
  - Task 1.2: Identify design principles of the AWS Cloud
  - Task 1.3: Understand the benefits of and strategies for migration to the AWS Cloud
  - Task 1.4: Understand concepts of cloud economics
- Chaque concept **doit** avoir un `source_url` pointant vers la page exacte de la documentation
  AWS (docs.aws.amazon.com/…, jamais un lien générique)
- Difficulté de 1 à 3 selon la complexité du concept

**Assets** (au moins 3 formats parmi les 5)
- `assets/qcm.json` : minimum 5 QCM couvrant les concepts générés
- `assets/flashcard.json` : minimum 5 flashcards sur les définitions clés (ex: IaaS, PaaS, SaaS,
  CapEx vs OpEx, modèle de responsabilité partagée, avantages du cloud)
- `assets/swipe.json` : minimum 5 assertions vrai/faux
- `assets/scenario.json` et `assets/match.json` : optionnels si le temps le permet

**Mapping** (`content/aws-cloud-practitioner/asset_concepts.json`)
- Chaque asset mappé vers ses concept_ids correspondants

### Garde-fous à vérifier avant la PR

- Aucun concept sans `source_url` précis (CLAUDE.md §6.1)
- Aucune question inspirée d'un braindump ou d'une question d'examen réelle (CLAUDE.md §6.3)
- Ne pas marquer la certif `complete` — statut à passer à `in_progress` dans certifications_roadmap.md
- Aucun secret dans les commits (CLAUDE.md §6.6)

### Fin de mission attendue

PR `claude/content-aws-clf-c02-domain-1` → `main` avec :
- Résumé du contenu généré (nb concepts, nb assets par type)
- Liste des sources consultées
- Estimation du coverage du Domain 1 par rapport à l'exam guide
- Signalement de toute ambiguïté de schéma rencontrée
