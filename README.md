# MyLittleQuest

Apprends des certifications informatiques en jouant. Gratuit, mobile-first, multi-certification.

## L'idée

Plutôt que de bachoter des QCM ennuyeux, MyLittleQuest transforme la préparation aux
certifications en plusieurs styles de jeu courts et adaptés mobile : QCM, flashcards,
scénarios de mise en situation, swipe vrai/faux, et association de paires.

Le contenu (questions, scénarios, flashcards...) est généré et mis à jour en continu à partir
de sources officielles (documentation, exam guides), via une routine automatisée qui ouvre une
Pull Request pour chaque nouveau lot de contenu — jamais de publication sans review.

## Stack

- **Next.js** + **Vercel** — frontend PWA mobile-first
- **Contenu** : fichiers JSON versionnés dans `content/`, pas de base de données externe
- **Progression** : stockée localement dans le navigateur (IndexedDB), jamais envoyée à un
  serveur. Export/import JSON manuel disponible pour sauvegarder sa progression.

## Comment ça apprend de toi

Chaque concept est suivi individuellement avec un algorithme de répétition espacée (SM-2) :
les notions mal maîtrisées reviennent plus souvent, celles acquises s'espacent. Le score/vies
de chaque session de jeu reste séparé — c'est l'aspect fun et immédiat, indépendant de ce que
le système sait réellement de ta maîtrise.

## Certifications disponibles

Voir [`claude/certifications_roadmap.md`](./claude/certifications_roadmap.md) pour la liste à
jour et leur statut (en cours / complet / à revoir).

## Contribuer / Génération de contenu

Le contenu pédagogique est généré par une routine Claude Code qui tourne sur cron, documentée
dans [`CLAUDE.md`](./CLAUDE.md). Chaque génération passe par une Pull Request reviewée
manuellement avant merge sur `main` — voir les garde-fous en section 6 de `CLAUDE.md`.

## Avertissement vie privée

Ta progression (scores, niveau de maîtrise, certifications suivies) est stockée uniquement
dans ton navigateur. Changer de navigateur, vider le cache, ou utiliser un autre appareil
signifie repartir de zéro, sauf si tu as exporté ta progression au préalable.
