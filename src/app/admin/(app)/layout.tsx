export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, getAdminIdentity } from '@/lib/adminAuth';
import AdminShell from '@/components/admin/AdminShell';

export default async function AuthedAdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const identity = await getAdminIdentity(store.get(ADMIN_SESSION_COOKIE)?.value);

  if (!identity) {
    redirect('/admin/login');
  }

  return <AdminShell identity={identity}>{children}</AdminShell>;
}
