'use client';

import { useState } from 'react';
import { AlertCircle, Check, Loader2, Trash2, UserPlus } from 'lucide-react';
import type { AdminIdentity } from '@/lib/adminAuth';

interface Account {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'staff';
  source: 'env' | 'app';
  createdAt: string;
  lastLoginAt?: string;
}

const INPUT =
  'min-h-12 w-full rounded-xl border border-white/12 bg-[#162a45] px-4 text-base font-semibold text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/25';

export default function StaffPanel({
  identity,
  initialAccounts,
}: {
  identity: AdminIdentity | null;
  initialAccounts: Account[];
}) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const createAccount = async () => {
    setError(null);
    setMessage(null);
    setCreating(true);

    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), password }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string; account?: Account } | null;
      if (!response.ok || !data?.account) {
        setError(data?.error ?? 'Could not create this account.');
        return;
      }

      setAccounts((current) => [...current, data.account!]);
      setName('');
      setEmail('');
      setPassword('');
      setMessage('Account created. Share the password with them privately.');
    } catch {
      setError('No connection to the server.');
    } finally {
      setCreating(false);
    }
  };

  const removeAccount = async (account: Account) => {
    if (!window.confirm(`Remove ${account.email}? They will no longer be able to sign in.`)) return;

    setBusyId(account.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/accounts/${account.id}`, { method: 'DELETE' });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'Could not remove this account.');
        return;
      }
      setAccounts((current) => current.filter((item) => item.id !== account.id));
    } catch {
      setError('No connection to the server.');
    } finally {
      setBusyId(null);
    }
  };

  const changeOwnPassword = async () => {
    if (identity?.kind !== 'account') return;

    setError(null);
    setMessage(null);
    setSavingPassword(true);

    try {
      const response = await fetch(`/api/admin/accounts/${identity.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'Could not change the password.');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password updated.');
    } catch {
      setError('No connection to the server.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
          <Check size={17} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#101f36] p-4">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">People</h2>

        {accounts.length === 0 ? (
          <p className="mt-3 text-sm font-semibold text-white/50">No accounts yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#162a45] p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">
                    {account.name}
                    {account.role === 'owner' && (
                      <span className="ml-2 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        Owner
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs font-semibold text-white/45">{account.email}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/35">
                    {account.lastLoginAt
                      ? `Last signed in ${new Date(account.lastLoginAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}`
                      : 'Has not signed in yet'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeAccount(account)}
                  disabled={busyId === account.id || identity?.kind === 'account' && identity.id === account.id}
                  aria-label={`Remove ${account.email}`}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-400/25 text-red-300/80 transition active:scale-95 disabled:opacity-30"
                >
                  {busyId === account.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101f36] p-4">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">Add someone</h2>
        <p className="mt-1 text-xs font-medium text-white/45">
          They sign in with this email and password on their phone.
        </p>

        <div className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            autoComplete="off"
            className={INPUT}
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            type="email"
            inputMode="email"
            autoComplete="off"
            className={INPUT}
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Temporary password (8+ characters)"
            type="text"
            autoComplete="off"
            className={INPUT}
          />

          <button
            type="button"
            onClick={createAccount}
            disabled={creating}
            className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-base font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-50"
          >
            {creating ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {creating ? 'Creating…' : 'Add account'}
          </button>
        </div>
      </section>

      {identity?.kind === 'account' && (
        <section className="rounded-2xl border border-white/10 bg-[#101f36] p-4">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">
            Your password
          </h2>

          <div className="mt-4 space-y-3">
            <input
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Current password"
              type="password"
              autoComplete="current-password"
              className={INPUT}
            />
            <input
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password (8+ characters)"
              type="password"
              autoComplete="new-password"
              className={INPUT}
            />

            <button
              type="button"
              onClick={changeOwnPassword}
              disabled={savingPassword || !newPassword}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-black text-white/85 transition active:scale-[0.98] disabled:opacity-50"
            >
              {savingPassword && <Loader2 size={18} className="animate-spin" />}
              Change my password
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
