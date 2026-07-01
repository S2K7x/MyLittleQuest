const DB_NAME = "mylittlequest";
const DB_VERSION = 1;

export const STORE_MASTERY = "user_concept_mastery";
export const STORE_SESSIONS = "user_game_sessions";

// v2 prévu : store `user_certifications` (checklist des certifs suivies par l'utilisateur,
// cf. CLAUDE.md section 4) — bump DB_VERSION et ajouter la création du store dans
// onupgradeneeded le moment venu.

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE_MASTERY)) {
        const store = db.createObjectStore(STORE_MASTERY, { keyPath: "concept_id" });
        store.createIndex("next_review_at", "next_review_at");
      }

      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        db.createObjectStore(STORE_SESSIONS, { keyPath: "session_id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export function getStore(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode
): IDBObjectStore {
  return db.transaction(storeName, mode).objectStore(storeName);
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
