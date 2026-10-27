export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, canManageStaff, getAdminIdentity } from '@/lib/adminAuth';
import { listAdminAccounts } from '@/lib/adminAccounts';
import { hasStoredPin } from '@/lib/adminConfig';
import StaffPanel from '@/components/admin/StaffPanel';

export default async function StaffPage() {
  const store = await cookies();
  const identity = await getAdminIdentity(store.get(ADMIN_SESSION_COOKIE)?.value);

  if (!canManageStaff(identity)) {
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <header className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">Staff</p>
          <h1 className="mt-1 text-2xl font-black">Only the owner can do this</h1>
        </header>
        <p className="rounded-2xl border border-white/10 bg-[#101f36] p-5 text-sm font-semibold text-white/60">
          Sign in with an owner account, or unlock with the admin PIN, to manage who can access the
          catalogue.
        </p>
      </div>
    );
  }

  const accounts = await listAdminAccounts();
  const pinCustom = await hasStoredPin();

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">Staff</p>
        <h1 className="mt-1 text-2xl font-black">Who can sign in</h1>
        <p className="mt-1 text-sm font-medium text-white/45">
          Each person uses their own email and password.
        </p>
      </header>

      <StaffPanel
        identity={identity}
        pinCustom={pinCustom}
        initialAccounts={accounts.map((account) => ({
          id: account.id,
          email: account.email,
          name: account.name,
          role: account.role,
          source: account.source,
          createdAt: account.createdAt,
          lastLoginAt: account.lastLoginAt,
        }))}
      />
    </div>
  );
}
