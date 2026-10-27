'use client';

import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';

/**
 * Shows a one-time banner on iOS Safari telling the user how to add the app
 * to their home screen. Dismissed state is remembered in localStorage.
 *
 * On Android / desktop / already-installed → renders nothing.
 */
export default function InstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on iOS Safari when NOT already installed as a PWA
    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(navigator as unknown as { standalone?: boolean }).standalone;

    const dismissed = localStorage.getItem('hb_install_dismissed') === '1';

    if (isIos && !dismissed) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('hb_install_dismissed', '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app"
      className="fixed inset-x-3 bottom-4 z-50 rounded-2xl border border-white/15 bg-[#0d1a2e]/95 p-4 shadow-2xl backdrop-blur"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-full p-1 text-white/40 active:text-white"
      >
        <X size={16} />
      </button>

      <p className="text-xs font-black uppercase tracking-widest text-emerald-300/80 mb-1">
        Install the app
      </p>
      <p className="text-sm font-semibold text-white/80 mb-3">
        Add Headbutt Admin to your home screen for a full-screen app experience.
      </p>

      <ol className="space-y-2 text-sm text-white/60">
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-black text-emerald-300">
            1
          </span>
          Tap the
          <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
            <Share size={12} />
            Share
          </span>
          button below
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-black text-emerald-300">
            2
          </span>
          Scroll down and tap{' '}
          <span className="font-bold text-white">"Add to Home Screen"</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-black text-emerald-300">
            3
          </span>
          Tap <span className="font-bold text-white">"Add"</span> — done! ✅
        </li>
      </ol>
    </div>
  );
}
