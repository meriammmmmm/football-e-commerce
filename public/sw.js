const CACHE_NAME = 'headbutt-client-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Keep the storefront network-first. This service worker exists primarily to
// make the site installable; dynamic catalogue and checkout data must stay
// fresh and must never be served from a stale cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
