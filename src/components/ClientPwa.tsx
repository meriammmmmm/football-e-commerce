'use client';

import { useEffect } from 'react';

/**
 * Proactively unregisters the old shop service worker (scope "/").
 * The shop is no longer a PWA — only the admin is.
 * Without this, old visitors still have the shop SW cached which can
 * intercept navigation to /admin.
 */
export default function ClientPwa() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // Unregister any SW at scope "/" (the old shop SW)
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        // Only remove shop-scope SWs, never the admin one
        if (!reg.scope.includes('/admin')) {
          reg.unregister();
        }
      }
    });
  }, []);

  return null;
}
