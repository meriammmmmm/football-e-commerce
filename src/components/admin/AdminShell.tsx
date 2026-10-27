'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { LayoutGrid, Loader2, LogOut, PlusCircle, ShoppingBag, UserCircle, Users } from 'lucide-react';
import { canManageStaff, type AdminIdentity } from '@/lib/adminAuth';

const NAV_ITEMS = [
  { href: '/admin', label: 'Add', icon: PlusCircle },
  { href: '/admin/products', label: 'Catalogue', icon: LayoutGrid },
  { href: '/admin/customers', label: 'Customers', icon: ShoppingBag },
];

export default function AdminShell({
  children,
  identity,
}: {
  children: ReactNode;
  identity: AdminIdentity | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/admin/session', { method: 'DELETE' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const items = canManageStaff(identity)
    ? [...NAV_ITEMS, { href: '/admin/staff', label: 'Staff', icon: Users }]
    : NAV_ITEMS;

  const who = identity
    ? identity.kind === 'account'
      ? identity.name || identity.email
      : 'Owner (PIN)'
    : '';

  const isPinOnly = identity?.kind === 'pin';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d1a2e]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300/80">
              Headbutt Admin
            </p>
            <p className="truncate text-xs font-semibold text-white/50">{who}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Profile link — always visible */}
            <Link
              href="/admin/profile"
              className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                pathname === '/admin/profile'
                  ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/15 text-white/60'
              }`}
              title="My profile"
            >
              <UserCircle size={18} />
            </Link>

            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-xs font-black text-white/75 transition active:scale-95 disabled:opacity-50"
            >
              {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
              Sign out
            </button>
          </div>
        </div>

        {/* Banner: prompt PIN-only owners to set up their profile */}
        {isPinOnly && pathname !== '/admin/profile' && (
          <div className="mx-auto mt-3 max-w-md">
            <Link
              href="/admin/profile"
              className="flex items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/8 px-4 py-2.5 transition hover:bg-emerald-400/12"
            >
              <div>
                <p className="text-xs font-black text-emerald-200">Set up your profile →</p>
                <p className="text-[11px] text-emerald-300/60">
                  Add your name, email and password to sign in without the PIN.
                </p>
              </div>
              <UserCircle size={20} className="shrink-0 text-emerald-300/60" />
            </Link>
          </div>
        )}
      </header>

      <main className="pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0d1a2e]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-md">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider transition ${
                  active ? 'text-emerald-300' : 'text-white/45'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.6 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

