import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { canManageStaff } from '@/lib/adminAuth';
import { deleteAdminAccount, getAdminAccountById, setAdminAccountPassword } from '@/lib/adminAccounts';
import { ensureTables, getDb } from '@/lib/db';
import { normalizeAdminEmail } from '@/lib/adminAccounts';

/** Updates name, email and/or password for an account. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identity = await getRequestAdminIdentity();

  if (!identity) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  const isSelf = identity.kind === 'account' && identity.id === id;
  // PIN-signed-in owners can edit any account; account holders can edit themselves.
  const isOwnerPin = identity.kind === 'pin';
  if (!isSelf && !canManageStaff(identity) && !isOwnerPin) {
    return Response.json({ error: 'You can only edit your own account.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  } | null;

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? normalizeAdminEmail(body.email) : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (name && name.length < 2) {
    return Response.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password && password.length < 8) {
    return Response.json({ error: 'Use a password of at least 8 characters.' }, { status: 400 });
  }
  if (!name && !email && !password) {
    return Response.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const account = await getAdminAccountById(id);
  if (!account) {
    return Response.json({ error: 'This account no longer exists.' }, { status: 404 });
  }

  try {
    await ensureTables();
    const db = getDb();

    if (name || email) {
      await db.query(
        `UPDATE admin_users SET
           name = COALESCE(NULLIF($2, ''), name),
           email = COALESCE(NULLIF($3, ''), email)
         WHERE id = $1`,
        [id, name || null, email || null],
      );
    }

    if (password) {
      const { setAdminAccountPassword } = await import('@/lib/adminAccounts');
      await setAdminAccountPassword(id, password);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Admin profile update failed:', error);
    return Response.json({ error: 'Could not update this account.' }, { status: 503 });
  }
}

/** Removes a staff account. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identity = await getRequestAdminIdentity();

  if (!identity || !canManageStaff(identity)) {
    return Response.json({ error: 'Only the owner can remove staff accounts.' }, { status: 401 });
  }

  const account = await getAdminAccountById(id);
  if (!account) {
    return Response.json({ error: 'This account no longer exists.' }, { status: 404 });
  }

  if (identity.kind === 'account' && identity.id === id) {
    return Response.json({ error: 'You cannot remove the account you are signed in with.' }, { status: 400 });
  }

  if (account.role === 'owner') {
    const { listAdminAccounts } = await import('@/lib/adminAccounts');
    const owners = (await listAdminAccounts()).filter((item) => item.role === 'owner');
    // The PIN is the master key, so it may always remove the last owner and
    // leave the app ready for a fresh account.
    if (owners.length <= 1 && identity.kind !== 'pin') {
      return Response.json({ error: 'Keep at least one owner account.' }, { status: 400 });
    }
  }

  try {
    await deleteAdminAccount(id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Admin account removal failed:', error);
    return Response.json({ error: 'Could not remove this account.' }, { status: 503 });
  }
}
