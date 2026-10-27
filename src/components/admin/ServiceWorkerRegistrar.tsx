'use client';

import { useEffect } from 'react';

/** Registers the admin service worker so the app opens instantly and works offline. */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' }).catch(() => {
      // A missing service worker only costs offline support, so it stays silent.
    });
  }, []);

  return null;
}
