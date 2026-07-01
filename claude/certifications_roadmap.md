# Roadmap des certifications

Seules les certifications listées ici peuvent être traitées par le pipeline de génération
nocturne (voir `CLAUDE.md` section 6, garde-fou #2). Pour ajouter une certif, Shai édite ce
fichier directement, ou valide une proposition faite par Claude dans `NEXT_MISSION.md`.

## Statuts possibles

- `not_started` — dans la roadmap, aucun contenu généré
- `in_progress` — génération en cours, coverage partiel
- `needs_review` — Claude estime avoir couvert le blueprint mais demande une validation de Shai
- `complete` — coverage comparé et justifié contre l'exam guide officiel (voir CLAUDE.md §6.4)

## Liste

| Certification | Slug | Statut | Exam guide officiel |
|---|---|---|---|
| AWS Certified Cloud Practitioner (CLF-C02) | `aws-cloud-practitioner` | `in_progress` | https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf |

## Notes

- L'exam guide officiel est la référence pour juger du statut `complete`. Si AWS publie une
  nouvelle version du guide (changement de code d'examen, ex: CLF-C02 → CLF-C03), mettre à jour
  le lien et repasser le statut à `needs_review`.
- Prochaines certifs envisagées (non encore actives, à discuter avant ajout) : OSCP, AZ-900.
