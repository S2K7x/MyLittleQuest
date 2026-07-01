import { getStore, openDb, requestToPromise, STORE_SESSIONS } from "./schema";

export interface GameSession {
  session_id: string;
  cert_slug: string;
  started_at: string;
  ended_at: string | null;
  score: number;
  lives: number;
  assets_answered: number;
  assets_correct: number;
}

const POINTS_PER_CORRECT_ANSWER = 10;

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function putSession(session: GameSession): Promise<GameSession> {
  const db = await openDb();
  const store = getStore(db, STORE_SESSIONS, "readwrite");
  await requestToPromise(store.put(session));
  return session;
}

// Point d'entrée du module session : ne connaît que le score/les vies de la session en cours.
// Aucune notion de concept_id ou de mastery SM-2 ne doit y entrer (garde-fou d'étanchéité,
// CLAUDE.md §4).
export async function createSession(
  certSlug: string,
  startingLives: number
): Promise<GameSession> {
  const session: GameSession = {
    session_id: generateSessionId(),
    cert_slug: certSlug,
    started_at: new Date().toISOString(),
    ended_at: null,
    score: 0,
    lives: startingLives,
    assets_answered: 0,
    assets_correct: 0,
  };
  return putSession(session);
}

export async function getSession(sessionId: string): Promise<GameSession | null> {
  const db = await openDb();
  const store = getStore(db, STORE_SESSIONS, "readonly");
  const result = await requestToPromise(store.get(sessionId));
  return (result as GameSession | undefined) ?? null;
}

export async function recordSessionAnswer(
  sessionId: string,
  wasCorrect: boolean
): Promise<GameSession> {
  const session = await getSession(sessionId);
  if (!session) throw new Error(`Session introuvable: ${sessionId}`);

  const updated: GameSession = {
    ...session,
    score: session.score + (wasCorrect ? POINTS_PER_CORRECT_ANSWER : 0),
    lives: wasCorrect ? session.lives : Math.max(0, session.lives - 1),
    assets_answered: session.assets_answered + 1,
    assets_correct: session.assets_correct + (wasCorrect ? 1 : 0),
  };

  return putSession(updated);
}

export async function endSession(sessionId: string): Promise<GameSession> {
  const session = await getSession(sessionId);
  if (!session) throw new Error(`Session introuvable: ${sessionId}`);

  return putSession({ ...session, ended_at: new Date().toISOString() });
}
