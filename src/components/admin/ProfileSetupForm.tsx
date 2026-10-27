'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, UserCircle } from 'lucide-react';

const INPUT =
  'min-h-12 w-full rounded-xl border border-white/12 bg-[#162a45] px-4 text-base font-semibold text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/25';

export default function ProfileSetupForm({
  /** Pass the current account values when editing an existing account */
  currentName = '',
  currentEmail = '',
  accountId,
}: {
  currentName?: string;
  currentEmail?: string;
  /** If set, we PATCH the existing account instead of creating a new one */
  accountId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(accountId);

  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const save = async () => {
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Enter your name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isEdit && !password) {
      setError('Choose a password for your account.');
      return;
    }

    setSaving(true);
    try {
      let response: Response;

      if (isEdit) {
        // PATCH name/email on existing account — send password only if changed
        response = await fetch(`/api/admin/accounts/${accountId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            ...(password ? { password } : {}),
          }),
        });
      } else {
        // POST — create the owner's account for the first time
        response = await fetch('/api/admin/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role: 'owner',
          }),
        });
      }

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'Could not save your profile.');
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1200);
    } catch {
      setError('No connection to the server.');
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15">
          <Check size={26} className="text-emerald-300" />
        </div>
        <p className="text-base font-black text-white">Profile saved!</p>
        <p className="text-sm text-white/50">Taking you back…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-white/45">
            Your name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            autoComplete="name"
            className={INPUT}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-white/45">
            Email address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={INPUT}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-white/45">
            {isEdit ? 'New password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEdit ? 'Leave blank to keep current' : 'At least 8 characters'}
            type="password"
            autoComplete="new-password"
            className={INPUT}
          />
        </div>

        {password && (
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-white/45">
              Confirm password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              type="password"
              autoComplete="new-password"
              className={INPUT}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-base font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <UserCircle size={18} />}
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create my account'}
      </button>
    </div>
  );
}
