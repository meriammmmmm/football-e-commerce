export const dynamic = 'force-dynamic';

import { countAdminAccounts } from '@/lib/adminAccounts';
import { isAdminConfigured } from '@/lib/adminAuth';

/**
 * Tells the login screen whether the app still needs its first account.
 * It only reveals whether setup is pending, never any account details.
 */
export async function GET() {
  const count = await countAdminAccounts();
  return Response.json({
    needsSetup: count === 0,
    adminConfigured: isAdminConfigured(),
  });
}
