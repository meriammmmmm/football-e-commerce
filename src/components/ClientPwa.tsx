'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function ClientPwa() {
  const pathname = usePathname();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/admin') || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});

    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone;
    const dismissed = window.localStorage.getItem('hb_client_install_dismissed') === '1';

    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      if (!dismissed && !standalone) setShow(true);
    };

    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    if (isIos && !dismissed) {
      setIos(true);
      const timer = window.setTimeout(() => setShow(true), 1200);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onInstallPrompt);
  }, [pathname]);

  if (!show || pathname.startsWith('/admin')) return null;

  const dismiss = () => {
    window.localStorage.setItem('hb_client_install_dismissed', '1');
    setShow(false);
  };

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Install Headbutt app"
      className="fixed inset-x-3 bottom-4 z-50 rounded-2xl border border-white/15 bg-[#0d1a2e]/95 p-4 text-white shadow-2xl backdrop-blur"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <button onClick={dismiss} aria-label="Dismiss" className="absolute right-3 top-3 rounded-full p-1 text-white/40">
        <X size={16} />
      </button>
      <p className="mb-1 text-xs font-black uppercase tracking-widest text-emerald-300/80">Install Headbutt</p>
      {ios ? (
        <ol className="space-y-2 text-sm font-semibold text-white/75">
          <li className="flex items-center gap-2"><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs text-emerald-300">1</span>Tap <Share size={14} /> Share</li>
          <li className="flex items-center gap-2"><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs text-emerald-300">2</span>Choose “Add to Home Screen”</li>
          <li className="flex items-center gap-2"><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs text-emerald-300">3</span>Tap “Add”</li>
        </ol>
      ) : (
        <button onClick={install} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-black text-[#081120]">
          <Download size={16} /> Add to Home Screen
        </button>
      )}
    </div>
  );
}
