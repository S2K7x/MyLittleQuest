# NEXT MISSION

## Générer le contenu Domain 2 — Security and Compliance (AWS CLF-C02)

**Certification cible** : AWS Certified Cloud Practitioner (CLF-C02)
**Dossier** : `content/aws-cloud-practitioner/` (compléter, ne pas écraser le Domaine 1)
**Branche à créer** : `claude/content-aws-clf-c02-domain-2`

### Contexte

Le Domaine 1 (Cloud Concepts, 24 %) a été généré et validé : 12 concepts + 24 assets couvrant
les 5 formats de jeu, pipeline confirmé de bout en bout. La certif est en `in_progress`. Le
Domaine 2 est le **plus lourd de l'examen (30 %)** — c'est la suite la plus rentable.

### Objectif

Couvrir le **Domain 2 : Security and Compliance** du CLF-C02, structuré en 3 tâches :
- Task 2.1: Understand the AWS Shared Responsibility Model
- Task 2.2: Understand AWS Cloud security, governance, and compliance concepts
- Task 2.3: Identify AWS access management capabilities

### Contenu à générer

**Concepts** (~12-15 dans `concepts.json`, en AJOUT au Domaine 1)
- Modèle de responsabilité partagée (security *of* the cloud vs security *in* the cloud)
- IAM : utilisateurs, groupes, rôles, policies, principe du moindre privilège, MFA
- Compte root : bonnes pratiques de protection
- Chiffrement au repos / en transit, AWS KMS (notions de base)
- AWS Organizations, SCP (service control policies) — notions
- Compliance : AWS Artifact, programmes de conformité, AWS Trusted Advisor (checks sécurité)
- Sécurité réseau de base : security groups vs NACL (niveau CCP)
- Services de sécurité : Amazon GuardDuty, AWS Shield, AWS WAF, Amazon Inspector (niveau
  reconnaissance, pas de détail d'implémentation)
- `domain` = `"Security and Compliance"` (nom exact dans certification.json)

**Assets** — au moins 4 formats parmi les 5, mêmes minimums que le Domaine 1 :
- QCM ≥ 6, flashcards ≥ 6, swipe ≥ 6, + scénario(s) et/ou match

**Mapping** : compléter `asset_concepts.json` (ne pas casser les entrées du Domaine 1).

### Garde-fous (rappel, priment sur la mission)

- Chaque concept avec un `source_url` précis vers docs.aws.amazon.com (page exacte). Utiliser
  **WebSearch** (domaine autorisé `docs.aws.amazon.com`) : WebFetch renvoie 403 sur AWS.
- Aucune reproduction de question d'examen réelle / braindump.
- Ne pas marquer la certif `complete` (il restera les Domaines 3 et 4).
- Aucun secret dans les commits.

### Fin de mission attendue

PR `claude/content-aws-clf-c02-domain-2` → `main` avec résumé (nb concepts / assets par type),
liste des sources consultées, et note de coverage du Domaine 2 vs les 3 tâches du blueprint.

---

## Décisions produit en attente de Shai (non bloquantes, mais à trancher bientôt)

Ces points sont documentés dans `MISSION_LOG.md`. Ils ne bloquent pas la génération du
Domaine 2, mais méritent un arbitrage avant d'aller plus loin :

1. **Langue du contenu** : FR uniquement (choix actuel) ou bilingue FR/EN ? Impacte
   éventuellement le schéma (champ de langue).
2. **Granularité du champ `domain`** : nom du domaine (actuel) ou sous-domaines par tâche ?
3. **Statut `complete`** : le PDF de l'exam guide est inaccessible au fetcher (403) ; le
   coverage est jugé sur la structure connue du blueprint + sources docs.aws. Suffisant pour
   toi, ou veux-tu une vérification manuelle du PDF avant tout passage en `complete` ?

## Pistes alternatives (si tu préfères réorienter)

- **Enrichir le Domaine 1** plutôt qu'avancer : ajouter scénarios/match supplémentaires,
  monter le nombre d'assets par concept pour une meilleure rotation SM-2.
- **Mettre en place une validation automatisée** (script CI de contrôle de schéma + intégrité
  référentielle des JSON de contenu) pour sécuriser toutes les futures générations — utile
  avant que le volume de contenu ne grossisse.
