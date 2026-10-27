import { ensureTables, getDb, isDatabaseConfigured } from '@/lib/db';
import { hashAdminPassword, type AdminRole } from '@/lib/adminAuth';

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  source: 'env' | 'app';
  createdAt: string;
  lastLoginAt?: string;
}

interface AdminRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  source: string;
  created_at: string | Date;
  last_login_at: string | Date | null;
}

function rowToAccount(row: AdminRow): AdminAccount {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role === 'owner' ? 'owner' : 'staff',
    source: row.source === 'env' ? 'env' : 'app',
    createdAt: new Date(row.created_at).toISOString(),
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at).toISOString() : undefined,
  };
}

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Strips the password hash so an account can be sent to the browser. */
export function toPublicAccount(account: AdminAccount) {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    source: account.source,
    createdAt: account.createdAt,
    lastLoginAt: account.lastLoginAt,
  };
}

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    await ensureTables();
    const db = getDb();
    const result = await db.query('SELECT * FROM admin_users ORDER BY created_at ASC');
    return result.rows.map(rowToAccount);
  } catch (error) {
    console.error('Admin account read failed:', error);
    return [];
  }
}

export async function getAdminAccountByEmail(email: string): Promise<(AdminAccount & { passwordHash: string }) | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    await ensureTables();
    const db = getDb();
    const result = await db.query('SELECT * FROM admin_users WHERE email = $1 LIMIT 1', [
      normalizeAdminEmail(email),
    ]);
    const row = result.rows[0];
    if (!row) return null;
    return { ...rowToAccount(row), passwordHash: row.password_hash };
  } catch (error) {
    console.error('Admin account read failed:', error);
    return null;
  }
}

export async function getAdminAccountById(id: string): Promise<(AdminAccount & { passwordHash: string }) | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    await ensureTables();
    const db = getDb();
    const result = await db.query('SELECT * FROM admin_users WHERE id = $1 LIMIT 1', [id]);
    const row = result.rows[0];
    if (!row) return null;
    return { ...rowToAccount(row), passwordHash: row.password_hash };
  } catch (error) {
    console.error('Admin account read failed:', error);
    return null;
  }
}

export async function countAdminAccounts(): Promise<number> {
  const accounts = await listAdminAccounts();
  return accounts.length;
}

/**
 * Creates a staff account. The first account created this way becomes the
 * owner, because there is nobody else who could change it later.
 */
export async function createAdminAccount(input: {
  email: string;
  name: string;
  password: string;
  role?: AdminRole;
  source?: 'env' | 'app';
}): Promise<AdminAccount> {
  await ensureTables();
  const db = getDb();
  const email = normalizeAdminEmail(input.email);
  const existing = await db.query('SELECT id FROM admin_users WHERE email = $1 LIMIT 1', [email]);

  if (existing.rows.length > 0) {
    throw new Error('An account already exists for this email.');
  }

  const isFirst = Number((await db.query('SELECT COUNT(*)::int AS count FROM admin_users')).rows[0]?.count ?? 0) === 0;
  const id = `adm_${crypto.randomUUID().slice(0, 8)}`;
  const role: AdminRole = input.role ?? (isFirst ? 'owner' : 'staff');

  await db.query(
    `INSERT INTO admin_users (id, email, name, password_hash, role, source)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, email, input.name.trim(), await hashAdminPassword(input.password), role, input.source ?? 'app'],
  );

  const created = await getAdminAccountById(id);
  if (!created) throw new Error('The account was saved but could not be read back.');
  return created;
}

/** Sets a new password for an account. */
export async function setAdminAccountPassword(id: string, password: string): Promise<boolean> {
  await ensureTables();
  const db = getDb();
  const result = await db.query(
    'UPDATE admin_users SET password_hash = $2 WHERE id = $1 RETURNING id',
    [id, await hashAdminPassword(password)],
  );
  return result.rows.length > 0;
}

export async function deleteAdminAccount(id: string): Promise<boolean> {
  await ensureTables();
  const db = getDb();
  const result = await db.query('DELETE FROM admin_users WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

export async function touchAdminAccountLogin(id: string): Promise<void> {
  if (!isDatabaseConfigured()) return;

  try {
    await ensureTables();
    const db = getDb();
    await db.query('UPDATE admin_users SET last_login_at = NOW() WHERE id = $1', [id]);
  } catch (error) {
    console.error('Admin login stamp failed:', error);
  }
}

/**
 * Keeps the account in `ADMIN_EMAIL` / `ADMIN_PASSWORD` in step with the
 * environment, so the owner account can be recovered from the Vercel settings.
 */
export async function syncEnvOwnerAccount(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? '').trim();
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (!email || !password || !isDatabaseConfigured()) return;

  await ensureTables();
  const db = getDb();
  const existing = await db.query('SELECT * FROM admin_users WHERE email = $1 LIMIT 1', [
    normalizeAdminEmail(email),
  ]);

  if (existing.rows.length === 0) {
    await db.query(
      `INSERT INTO admin_users (id, email, name, password_hash, role, source)
       VALUES ($1, $2, $3, $4, 'owner', 'env')
       ON CONFLICT (email) DO NOTHING`,
      [
        `adm_${crypto.randomUUID().slice(0, 8)}`,
        normalizeAdminEmail(email),
        (process.env.ADMIN_NAME ?? 'Owner').trim(),
        await hashAdminPassword(password),
      ],
    );
    return;
  }

  const row = existing.rows[0] as AdminRow;
  if (row.source !== 'env') return;

  await db.query('UPDATE admin_users SET password_hash = $2, role = $3 WHERE id = $1', [
    row.id,
    await hashAdminPassword(password),
    'owner',
  ]);
}
