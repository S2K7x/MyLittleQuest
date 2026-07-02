# MISSION LOG — AWS CLF-C02, Domaine 2 : Security and Compliance

**Date** : 2026-07-02 (session nocturne autonome)
**Branche** : claude/loving-curie-03d3jf
**Statut** : Terminée — PR ouverte vers main

## Ce qui a été fait

Deuxième lot de contenu pédagogique généré pour l'AWS Certified Cloud Practitioner (CLF-C02),
**Domaine 2 : Security and Compliance** (30 % de l'examen, le plus lourd). 17 nouveaux concepts
et 27 nouveaux assets de jeu (les 5 formats) couvrant les 3 tâches du domaine : 2.1 modèle de
responsabilité partagée, 2.2 sécurité/gouvernance/conformité, 2.3 gestion des accès (IAM). Le
contenu du Domaine 1 n'a pas été modifié : tout est en AJOUT. Contenu en français, termes AWS
conservés en anglais. Chaque concept pointe vers une page exacte de docs.aws.amazon.com.

## Certification / domaine traités

- **Certif** : `aws-cloud-practitioner` (reste `in_progress` — Domaines 3 et 4 à venir)
- **Domaine** : Domain 2 — Security and Compliance
- **Concepts créés** : 17 (total certif : 29)
- **Assets créés** : 27 → QCM ×9, flashcards ×7, swipe ×7, scénarios ×2, match ×2
- **Mapping** : 27 nouvelles entrées dans `asset_concepts.json` (total : 51)

## Coverage du Domaine 2 vs blueprint (3 tâches)

- **Task 2.1 — Shared Responsibility Model** : concept `shared-responsibility-model`
  (of vs in, variance IaaS/abstracted). ✅
- **Task 2.2 — Security, governance & compliance** : chiffrement au repos/en transit, AWS KMS,
  AWS Organizations + SCP, AWS Artifact, programmes de conformité, Trusted Advisor (checks
  sécurité), security groups vs NACL, Amazon GuardDuty, AWS Shield, AWS WAF, Amazon Inspector. ✅
- **Task 2.3 — Access management (IAM)** : identités IAM (users/groups/roles/policies), moindre
  privilège, MFA, rôles & identifiants temporaires, protection du compte root. ✅

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/concepts.json` (+17 concepts)
- `content/aws-cloud-practitioner/assets/{qcm,flashcard,swipe,scenario,match}.json` (+27 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+27 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)

## Garde-fous vérifiés

- §6.1 Sources : chaque concept pointe vers une page exacte de docs.aws.amazon.com (vérifiées
  via WebSearch — WebFetch renvoie 403 sur AWS). Aucun lien générique.
- §6.2 Aucune nouvelle certif hors roadmap : uniquement `aws-cloud-practitioner`.
- §6.3 Aucune reproduction de question d'examen / braindump : toutes les questions sont
  originales et pédagogiques, inspirées du scope officiel.
- §6.4 Certif **non** marquée `complete` : seuls Domaines 1 et 2 couverts → reste `in_progress`.
- §6.5 Aucune touche côté client (IndexedDB / exports) — uniquement `content/`.
- §6.6 Aucun secret / credential dans les commits (scan effectué avant commit).
- §6.7 Aucun push direct sur `main` — branche + PR.

## Contrôles techniques passés

- JSON valide pour les 7 fichiers de contenu.
- Schéma respecté par format (QCM correct_index valide, scénario = exactement 1 choix correct,
  swipe is_true booléen, match ≥2 paires, etc.).
- Intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant, 0 concept sans asset.

## Sources docs.aws consultées (Domaine 2)

- Shared responsibility : /whitepapers/latest/aws-risk-and-compliance/shared-responsibility-model.html
- IAM policies/identités : /IAM/latest/UserGuide/access_policies.html
- Moindre privilège : /IAM/latest/UserGuide/best-practices.html
- MFA : /IAM/latest/UserGuide/id_credentials_mfa.html
- Rôles / identifiants temporaires : /IAM/latest/UserGuide/id_credentials_temp.html
- Compte root : /IAM/latest/UserGuide/root-user-best-practices.html
- Chiffrement at rest/in transit : /whitepapers/latest/logical-separation/encrypting-data-at-rest-and--in-transit.html
- KMS : /kms/latest/developerguide/service-integration.html
- Organizations / SCP : /organizations/latest/userguide/orgs_manage_policies_scps.html
- AWS Artifact : /artifact/latest/ug/what-is-aws-artifact.html
- Programmes de conformité : /whitepapers/latest/aws-overview/security-and-compliance.html
- Trusted Advisor sécurité : /awssupport/latest/user/security-checks.html
- Security groups vs NACL : /whitepapers/latest/aws-best-practices-ddos-resiliency/security-groups-and-network-acls-bp5.html
- GuardDuty : /guardduty/latest/ug/what-is-guardduty.html
- Shield : /waf/latest/developerguide/shield-chapter.html
- WAF : /waf/latest/developerguide/what-is-aws-waf.html
- Inspector : /inspector/latest/user/what-is-inspector.html

## Questions ouvertes pour Shai (à lire en priorité)

Les mêmes 3 décisions produit qu'après le Domaine 1 restent en attente (non bloquantes) :

1. **Langue du contenu** : FR uniquement (choix actuel) ou bilingue FR/EN à terme ? Impacte
   potentiellement le schéma (champ de langue). Décision produit non tranchée dans CLAUDE.md.
2. **Granularité du champ `domain`** : nom du domaine (`"Security and Compliance"`, choix actuel)
   ou sous-domaines par tâche (2.1/2.2/2.3) pour un filtrage plus fin côté app ?
3. **Critère `complete`** : le PDF de l'exam guide reste inaccessible au fetcher (403). Le
   coverage est jugé sur la structure connue du blueprint + sources docs.aws citées. Suffit-il,
   ou veux-tu une vérification manuelle du PDF avant tout passage `needs_review`/`complete` ?

## Lien PR

PR #4 (draft) : https://github.com/S2K7x/MyLittleQuest/pull/4
Branche `claude/loving-curie-03d3jf` → `main`.
