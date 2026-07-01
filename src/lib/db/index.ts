export { openDb } from "./schema";
export { updateMasteryForAnswer, getAllMastery } from "./mastery";
export type { ConceptMastery } from "./mastery";
export { createSession, getSession, recordSessionAnswer, endSession } from "./session";
export type { GameSession } from "./session";

import { updateMasteryForAnswer } from "./mastery";
import { recordSessionAnswer, type GameSession } from "./session";

// Seul point d'appel qui déclenche les deux écritures IndexedDB pour une réponse. Les deux
// appels sont indépendants (Promise.all, pas d'ordre ni de lecture croisée) : la mastery SM-2
// ne dépend jamais du score, le score ne dépend jamais de la mastery (garde-fou d'étanchéité,
// CLAUDE.md §4). Les composants de jeu appellent uniquement cette fonction, jamais les modules
// mastery/session directement.
export async function recordAnswer(params: {
  sessionId: string;
  conceptIds: string[];
  wasCorrect: boolean;
}): Promise<{ session: GameSession }> {
  const { sessionId, conceptIds, wasCorrect } = params;

  const [session] = await Promise.all([
    recordSessionAnswer(sessionId, wasCorrect),
    updateMasteryForAnswer(conceptIds, wasCorrect),
  ]);

  return { session };
}
