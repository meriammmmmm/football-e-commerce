'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // The admin app is a form on a phone. Smooth scrolling interferes with the
    // sticky bars and with the keyboard, so it is left out there.
    if (window.location.pathname.startsWith('/admin')) return;

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    const syncOverlayState = () => {
      if (document.body.dataset.searchOverlay === 'true') lenis.stop();
      else lenis.start();
    };
    const overlayObserver = new MutationObserver(syncOverlayState);
    overlayObserver.observe(document.body, { attributes: true, attributeFilter: ['data-search-overlay'] });
    syncOverlayState();
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);
    return () => {
      window.cancelAnimationFrame(frame);
      overlayObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
