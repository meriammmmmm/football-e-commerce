export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, getAdminIdentity } from '@/lib/adminAuth';
import { getAdminAccountById } from '@/lib/adminAccounts';
import ProfileSetupForm from '@/components/admin/ProfileSetupForm';

export default async function ProfilePage() {
  const store = await cookies();
  const identity = await getAdminIdentity(store.get(ADMIN_SESSION_COOKIE)?.value);

  // Load current values if signed in as an account (editing)
  const account =
    identity?.kind === 'account' ? await getAdminAccountById(identity.id) : null;

  const isFirstSetup = identity?.kind === 'pin';

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">
          {isFirstSetup ? 'Owner setup' : 'My profile'}
        </p>
        <h1 className="mt-1 text-2xl font-black">
          {isFirstSetup ? 'Create your account' : 'Edit your profile'}
        </h1>
        <p className="mt-1 text-sm font-medium text-white/45">
          {isFirstSetup
            ? 'Set up your name, email and password so you can sign in without the PIN next time.'
            : 'Update your name, email or password.'}
        </p>
      </header>

      <ProfileSetupForm
        currentName={account?.name ?? ''}
        currentEmail={account?.email ?? ''}
        accountId={account?.id}
      />
    </div>
  );
}
