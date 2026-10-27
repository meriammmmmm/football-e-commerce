// This service worker self-destructs.
// The shop no longer uses a PWA — only the admin (/admin) is an app.
// This unregisters any previously installed shop service worker.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() => self.clients.matchAll()).then((clients) => {
      clients.forEach((client) => client.navigate(client.url));
    })
  );
});
