'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Mail } from 'lucide-react';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];

function PinKeypad({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const press = (key: string) => {
    if (disabled) return;
    if (key === 'clear') {
      onChange('');
      return;
    }
    if (key === 'back') {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= 8) return;
    onChange(value + key);
  };

  return (
    <>
      <div className="mb-6 flex justify-center gap-2.5" aria-hidden="true">
        {Array.from({ length: Math.max(4, value.length) }).map((_, index) => (
          <span
            key={index}
            className={`h-3.5 w-3.5 rounded-full transition ${
              index < value.length ? 'bg-emerald-400' : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            disabled={disabled}
            className={`grid min-h-14 place-items-center rounded-2xl text-lg font-black transition active:scale-95 disabled:opacity-50 ${
              key === 'clear' || key === 'back'
                ? 'bg-white/5 text-sm uppercase tracking-wide text-white/60'
                : 'bg-[#162a45] text-white'
            }`}
          >
            {key === 'clear' ? 'Clear' : key === 'back' ? '←' : key}
          </button>
        ))}
      </div>
    </>
  );
}

const INPUT =
  'min-h-12 w-full rounded-xl border border-white/12 bg-[#162a45] px-4 text-base font-semibold text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/25';

export default function AdminLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'email' | 'pin'>('email');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupMode, setSetupMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/setup')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setNeedsSetup(Boolean(data.needsSetup));
        if (data.needsSetup) setSetupMode(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const signIn = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'That email and password do not match.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('No connection to the server.');
    } finally {
      setBusy(false);
    }
  };

  const createFirstAccount = async () => {
    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Use a password of at least 8 characters.');
      return;
    }
    if (!pin) {
      setError('Enter your admin PIN to confirm.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), password, pin }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'Could not create this account.');
        return;
      }

      setNeedsSetup(false);
      setSetupMode(false);
      await signIn();
    } catch {
      setError('No connection to the server.');
    } finally {
      setBusy(false);
    }
  };

  const unlockWithPin = async () => {
    if (!pin) {
      setError('Enter your PIN.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'That PIN is not correct.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('No connection to the server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-xs">
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/headbutt-logo.jpg"
            alt="Headbutt"
            className="mx-auto h-16 w-16 rounded-2xl object-cover ring-1 ring-white/10"
          />
          <h1 className="mt-4 text-xl font-black">Headbutt Admin</h1>
          <p className="mt-1 text-sm font-medium text-white/50">
            {setupMode ? 'Create your sign-in account' : 'Sign in to manage the catalogue'}
          </p>
        </div>

        {!setupMode && (
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-[#101f36] p-1">
            {(
              [
                { id: 'email', label: 'Email' },
                { id: 'pin', label: 'PIN' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setError(null);
                }}
                className={`min-h-11 rounded-xl text-sm font-black transition ${
                  tab === item.id ? 'bg-emerald-400 text-[#081120]' : 'text-white/55'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {setupMode ? (
          <div className="space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className={INPUT}
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={INPUT}
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password (8+ characters)"
              type="password"
              autoComplete="new-password"
              className={INPUT}
            />

            <p className="pt-2 text-center text-xs font-bold uppercase tracking-wider text-white/40">
              Confirm with your admin PIN
            </p>
            <PinKeypad value={pin} onChange={setPin} disabled={busy} />

            <button
              type="button"
              onClick={createFirstAccount}
              disabled={busy}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 text-base font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-50"
            >
              {busy && <Loader2 size={18} className="animate-spin" />}
              {busy ? 'Creating…' : 'Create my account'}
            </button>

            <button
              type="button"
              onClick={() => {
                setSetupMode(false);
                setTab('pin');
                setError(null);
              }}
              className="w-full pt-1 text-center text-xs font-bold text-emerald-300/80 underline underline-offset-4"
            >
              Use my PIN instead
            </button>
          </div>
        ) : tab === 'email' ? (
          <div className="space-y-3">
            <div className="relative">
              <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && signIn()}
                placeholder="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={`${INPUT} pl-11`}
              />
            </div>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && signIn()}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              className={INPUT}
            />

            <button
              type="button"
              onClick={signIn}
              disabled={busy}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 text-base font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-50"
            >
              {busy && <Loader2 size={18} className="animate-spin" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            {needsSetup && (
              <button
                type="button"
                onClick={() => {
                  setSetupMode(true);
                  setError(null);
                }}
                className="w-full pt-1 text-center text-xs font-bold text-emerald-300/80 underline underline-offset-4"
              >
                First time here? Create your account
              </button>
            )}
          </div>
        ) : (
          <div>
            <PinKeypad value={pin} onChange={setPin} disabled={busy} />

            <button
              type="button"
              onClick={unlockWithPin}
              disabled={busy || !pin}
              className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 text-base font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-50"
            >
              {busy && <Loader2 size={18} className="animate-spin" />}
              {busy ? 'Unlocking…' : 'Unlock'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
