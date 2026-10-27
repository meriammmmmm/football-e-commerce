/* Headbutt Admin service worker — v2
   Caches the full app shell on install so the admin opens instantly
   and works fully offline. API calls always go to the network. */

const CACHE = 'headbutt-admin-v3';

// Pages that form the app shell
const SHELL = [
  '/admin',
  '/admin/login',
  '/admin/products',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Cache shell pages best-effort — a missing page won't block install
      await Promise.allSettled(SHELL.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Remove old cache versions
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Always go network-first for API calls — data must be fresh
  if (url.pathname.startsWith('/api/')) return;

  // For same-origin navigation requests: network first, fall back to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE);
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? caches.match('/admin/login') ?? Response.error();
        }),
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images): cache first, then network
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(CACHE);
          cache.put(request, response.clone());
        }
        return response;
      })(),
    );
  }
});
