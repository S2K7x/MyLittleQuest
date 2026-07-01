import { getStore, openDb, requestToPromise, STORE_MASTERY } from "./schema";

export interface ConceptMastery {
  concept_id: string;
  easiness: number;
  interval: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string;
}

function initialMastery(conceptId: string): ConceptMastery {
  const now = new Date().toISOString();
  return {
    concept_id: conceptId,
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
    next_review_at: now,
    last_reviewed_at: now,
  };
}

// Algorithme SM-2 standard. quality va de 0 (échec total) à 5 (parfait) ; on dérive une
// valeur simple à partir du booléen de correction de la réponse en session de jeu.
function applySm2(mastery: ConceptMastery, quality: number): ConceptMastery {
  const now = new Date();

  let { easiness, interval, repetitions } = mastery;

  easiness = Math.max(
    1.3,
    easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easiness);
  }

  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    concept_id: mastery.concept_id,
    easiness,
    interval,
    repetitions,
    next_review_at: nextReviewAt.toISOString(),
    last_reviewed_at: now.toISOString(),
  };
}

async function getMastery(conceptId: string): Promise<ConceptMastery | null> {
  const db = await openDb();
  const store = getStore(db, STORE_MASTERY, "readonly");
  const result = await requestToPromise(store.get(conceptId));
  return (result as ConceptMastery | undefined) ?? null;
}

async function putMastery(mastery: ConceptMastery): Promise<void> {
  const db = await openDb();
  const store = getStore(db, STORE_MASTERY, "readwrite");
  await requestToPromise(store.put(mastery));
}

// Point d'entrée unique du module mastery : met à jour la SM-2 de chaque concept lié à
// l'asset répondu. Ne prend en paramètre que ce qui concerne la connaissance réelle —
// aucune notion de score/vies/session ne doit y entrer (garde-fou d'étanchéité, CLAUDE.md §4).
export async function updateMasteryForAnswer(
  conceptIds: string[],
  wasCorrect: boolean
): Promise<void> {
  const quality = wasCorrect ? 4 : 1;

  await Promise.all(
    conceptIds.map(async (conceptId) => {
      const existing = await getMastery(conceptId);
      const updated = applySm2(existing ?? initialMastery(conceptId), quality);
      await putMastery(updated);
    })
  );
}

export async function getAllMastery(): Promise<ConceptMastery[]> {
  const db = await openDb();
  const store = getStore(db, STORE_MASTERY, "readonly");
  const result = await requestToPromise(store.getAll());
  return result as ConceptMastery[];
}
