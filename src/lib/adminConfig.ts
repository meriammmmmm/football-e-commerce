import 'server-only';

/**
 * Reads and writes the admin PIN that is stored in the database.
 *
 * When no DB-stored PIN exists, `pinMatches()` in `adminAuth.ts` falls back to
 * the `ADMIN_PIN` environment variable so the system keeps working even without
 * a database.
 */

import { ensureTables, getDb, isDatabaseConfigured } from '@/lib/db';
import { hashAdminPassword } from '@/lib/adminPasswords';

/** Returns the scrypt hash stored in `admin_config`, or null when none is set. */
export async function getStoredPinHash(): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    await ensureTables();
    const db = getDb();
    const result = await db.query(
      'SELECT pin_hash FROM admin_config WHERE id = 1 LIMIT 1',
    );
    return (result.rows[0]?.pin_hash as string | undefined) ?? null;
  } catch (error) {
    console.error('adminConfig read failed:', error);
    return null;
  }
}

/** Returns true when the owner has set a custom PIN via the app. */
export async function hasStoredPin(): Promise<boolean> {
  return (await getStoredPinHash()) !== null;
}

/**
 * Saves a new PIN to the database (scrypt-hashed).
 * Throws when the database is not configured.
 */
export async function setStoredPin(newPin: string): Promise<void> {
  if (!isDatabaseConfigured()) {
    throw new Error('No database is configured. Update ADMIN_PIN in your environment settings instead.');
  }

  const hash = await hashAdminPassword(newPin);

  await ensureTables();
  const db = getDb();
  await db.query(
    `INSERT INTO admin_config (id, pin_hash, updated_at)
     VALUES (1, $1, NOW())
     ON CONFLICT (id) DO UPDATE SET pin_hash = EXCLUDED.pin_hash, updated_at = NOW()`,
    [hash],
  );
}

/** Removes the DB-stored PIN so the env var fallback takes over again. */
export async function clearStoredPin(): Promise<void> {
  if (!isDatabaseConfigured()) return;

  try {
    await ensureTables();
    const db = getDb();
    await db.query('UPDATE admin_config SET pin_hash = NULL, updated_at = NOW() WHERE id = 1');
  } catch (error) {
    console.error('adminConfig clear failed:', error);
  }
}
