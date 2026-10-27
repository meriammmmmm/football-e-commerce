export const dynamic = 'force-dynamic';

import { countAdminAccounts } from '@/lib/adminAccounts';
import { isAdminConfigured } from '@/lib/adminAuth';
import { isDatabaseConfigured } from '@/lib/db';

/**
 * Tells the login screen whether the app still needs its first account.
 * It only reveals whether setup is pending, never any account details.
 */
export async function GET() {
  const databaseConfigured = isDatabaseConfigured();
  const count = await countAdminAccounts();
  return Response.json({
    // A database-less local environment can still use the shared PIN. Do not
    // send it into account setup, because creating an account requires the
    // persistent database used by the deployed admin app.
    needsSetup: databaseConfigured && count === 0,
    adminConfigured: isAdminConfigured(),
    databaseConfigured,
  });
}
