# MISSION LOG — Montée en difficulté 3 étendue (CLF-C02) : sécurité, stockage, Cloud Concepts

**Date** : 2026-07-13 (session nocturne autonome)
**Branche** : claude/loving-curie-mr770h
**Statut** : Terminée — PR ouverte vers main (draft)

## ⚠️ À LIRE EN PREMIER (10 secondes)

- **Le backlog de PR de contenu est le vrai point de blocage.** Le pipeline produit plus vite que Shai
  ne merge. **3 PR de contenu restent OUVERTES et non mergées** :
  - **PR #7** — Lot C (Domaine 3 : Networking & Databases, 14 concepts / 28 assets).
  - **PR #10** — Domaine 4 (Billing, Pricing & Support, 14 concepts / 28 assets).
  - **PR de cette session** — 11 assets de difficulté 3 (0 concept).
  Une fois **#7 + #10** mergées, les **4 domaines du blueprint CCP sont sur `main`** → basculer la certif
  en **`needs_review`** (garde-fou §6.4). Ordre de merge suggéré : **#7 → #10 → PR de cette session**
  (rebaser chaque suivante). Conflits d'append JSON triviaux attendus (garder tous les blocs).
  **Aucune collision d'id** entre ces PR (préfixes/suites distincts).
- **Mission de la nuit exécutée** : 2ᵉ couche de difficulté 3, sur les familles **non couvertes** par la
  session du 2026-07-12 (qui avait traité compute/edge/event-driven). Ajout de **11 assets de difficulté 3**
  (7 QCM + 4 scénarios) sur des concepts **déjà sur `main`** (domaines 1 Cloud Concepts, 2 Sécurité,
  3 Storage), angle arbitrage/comparaison fine. **Non-doublon vis-à-vis de #7 et #10** (aucun concept
  réseau/BdD/billing touché). **+11 assets, +11 mappings, 0 concept.** `validate.py` → ✅ OK.
  **307 insertions, 0 suppression.**
- Nouveaux totaux sur cette branche (base = `main`) : **72 concepts / 198 assets / 198 mappings.**

## Ce qui a été fait

La couverture difficulté 3 posée le 2026-07-12 se limitait au compute avancé / edge / event-driven / ML.
Cette session l'étend aux trois familles restantes citées dans le `NEXT_MISSION` précédent : **Sécurité**
(Domaine 2, 30 % du blueprint — priorité), **Storage** (Domaine 3) et **Cloud Concepts** (Domaine 1).
Contenu 100 % original, ancré sur le `core_explanation` de chaque concept déjà présent sur `main`, aucune
reproduction de question d'examen (§6.3). Le format **scénario** (le plus sous-représenté, 15 → **19**) a
été privilégié autant que possible.

Assets ajoutés (tous difficulté 3) :

**Scénarios (4)**
- **scenario-sec-03** → iam-roles-temp-credentials / iam-identities / iam-least-privilege : app EC2 qui
  doit lire S3 → rôle IAM (identifiants temporaires) plutôt que clé permanente stockée sur l'instance.
- **scenario-sec-04** → shared-responsibility-model : qui applique les correctifs OS ? EC2 (IaaS, client)
  vs RDS (managé, AWS) — la frontière se déplace selon le service.
- **scenario-stor-02** → stor-s3-glacier / stor-s3-storage-classes : archive 7 ans, quasi jamais lue,
  récupération en heures OK, coût mini → S3 Glacier Deep Archive (vs Standard / Standard-IA / Instant).
- **scenario-cloud-03** → well-architected-pillars / well-architected-framework : instance unique « pour
  économiser » sur charge critique = arbitrage coût ↔ fiabilité → rééquilibrer vers la fiabilité (multi-AZ).

**QCM (7)**
- **qcm-sec-14** → aws-organizations-scp / iam-least-privilege : SCP = plafond, n'accorde jamais ;
  action hors SCP refusée même si la policy IAM l'autorise.
- **qcm-sec-15** → aws-kms / encryption-at-rest-in-transit : maîtrise des clés + HSM → KMS (vs WAF /
  GuardDuty / Artifact, hors sujet).
- **qcm-sec-16** → security-groups-vs-nacl : SG (instance, stateful, allow) vs NACL (sous-réseau,
  stateless, allow+deny).
- **qcm-stor-06** → stor-efs / stor-ebs / stor-s3 : système de fichiers partagé multi-AZ en NFS → EFS.
- **qcm-stor-07** → stor-aws-backup / stor-ebs : sauvegarde centralisée multi-services via backup plans
  → AWS Backup (vs scripts manuels).
- **qcm-cloud-12** → cloud-adoption-framework : compétences / conduite du changement → perspective People
  du CAF.
- **qcm-cloud-13** → cloud-deployment-models : datacenter conservé + extension AWS → déploiement hybride.

## Certification / domaine traités

- **aws-cloud-practitioner** — enrichissement transverse en difficulté : Domaine 1 (Cloud Concepts),
  Domaine 2 (Security and Compliance), Domaine 3 (Storage).
- **11 assets créés** : qcm ×7, scénario ×4. **11 mappings** (0 orphelin). Ids sans collision (suites
  continuées par préfixe/type : `qcm-sec-14..16`, `qcm-stor-06..07`, `qcm-cloud-12..13`,
  `scenario-sec-03..04`, `scenario-stor-02`, `scenario-cloud-03`).

## Répartition des difficultés (rappel)

- La couverture difficulté 3 s'étend désormais aux 3 domaines majeurs (sécurité, stockage, cloud concepts),
  en plus du compute/edge/event-driven traité le 2026-07-12. Format scénario passé de 15 à 19.
- Reste extensible : monitoring/observabilité, IaC/CloudFormation, analytics — mais rendement décroissant ;
  le point le plus utile est désormais **le merge du backlog** (#7, #10), pas plus de génération.

## Contrôle technique passé

- `python3 scripts/validate.py` : ✅ OK (schéma par format + intégrité référentielle : 72 / 198 / 198).
- Diff : **307 insertions, 0 suppression** (ajout strict, non-régression garantie).
- Aucun secret / credential dans le diff (contenu 100 % pédagogique).

## Fichiers créés / modifiés

- `content/aws-cloud-practitioner/assets/{qcm,scenario}.json` (+11 assets)
- `content/aws-cloud-practitioner/asset_concepts.json` (+11 mappings)
- `claude/MISSION_LOG.md` (ce fichier), `claude/NEXT_MISSION.md` (mission suivante)
- `content/aws-cloud-practitioner/concepts.json` : **non modifié** (0 nouveau concept)

## Garde-fous vérifiés

- §6.1 Aucun nouveau concept → pas de nouveau `source_url` requis (les concepts ciblés existent déjà,
  chacun avec sa source). §6.2 Aucune certif hors roadmap. §6.3 Contenu original pédagogique, aucun
  braindump. §6.4 Statut certif inchangé (`in_progress`) tant que #7/#10 ne sont pas sur `main`.
  §6.5 Aucune touche côté client. §6.6 Aucun secret. §6.7 Branche + PR draft, pas de push sur `main`.

## Questions ouvertes pour Shai (par priorité)

1. **Résorber le backlog est le point le plus utile.** 3 PR de contenu ouvertes : **#7** (Lot C —
   réseau/BdD), **#10** (Domaine 4 — billing) et **la PR de cette session** (difficulté 3). Ordre suggéré :
   **#7 → #10 → cette PR**. Une fois #7 + #10 sur `main`, les 4 domaines du blueprint sont couverts.
2. **Statut certif → `needs_review`** une fois #7 + #10 mergées (garde-fou §6.4 ; exam guide PDF
   inaccessible au fetcher). Non modifié cette session pour ne pas surestimer le coverage.
3. **Le pipeline produit plus vite que le merge.** L'enrichissement des planchers est fini, la couverture
   difficulté 3 est désormais large. Générer davantage a un rendement décroissant tant que le backlog n'est
   pas résorbé.
4. Décisions produit anciennes toujours ouvertes (langue FR/bilingue ; granularité du champ `domain` ;
   critère de `complete` ; plans de support AWS en restructuration — soulevé par PR #10) — inchangées.

## Lien PR

PR (draft) de cette session : voir le lien ajouté dans le commit de finalisation / la PR ouverte vers `main`.
Autres PR de contenu ouvertes : #7 (Lot C) et #10 (Domaine 4 — Billing).
