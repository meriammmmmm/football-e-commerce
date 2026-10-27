import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, getAdminIdentity, type AdminIdentity } from '@/lib/adminAuth';

/** The identity behind the current request, or null when signed out. */
export async function getRequestAdminIdentity(): Promise<AdminIdentity | null> {
  const store = await cookies();
  return getAdminIdentity(store.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Server-side check for admin API routes. The proxy only redirects browsers, so
 * every write endpoint verifies the session cookie itself.
 */
export async function isAdminRequest(): Promise<boolean> {
  return (await getRequestAdminIdentity()) !== null;
}
