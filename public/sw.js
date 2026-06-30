const CACHE_NAME = "mlq-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Réseau d'abord — pas d'offline-first pour l'instant, juste l'installabilité PWA
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => Response.error())
  );
});
