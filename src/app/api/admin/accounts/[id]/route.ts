import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { canManageStaff } from '@/lib/adminAuth';
import { deleteAdminAccount, getAdminAccountById, setAdminAccountPassword } from '@/lib/adminAccounts';

/** Changes the password of an account. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identity = await getRequestAdminIdentity();

  if (!identity) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  const isSelf = identity.kind === 'account' && identity.id === id;
  if (!isSelf && !canManageStaff(identity)) {
    return Response.json({ error: 'You can only change your own password.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === 'string' ? body.password : '';

  if (password.length < 8) {
    return Response.json({ error: 'Use a password of at least 8 characters.' }, { status: 400 });
  }

  const account = await getAdminAccountById(id);
  if (!account) {
    return Response.json({ error: 'This account no longer exists.' }, { status: 404 });
  }

  try {
    await setAdminAccountPassword(id, password);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Admin password change failed:', error);
    return Response.json({ error: 'Could not change this password.' }, { status: 503 });
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
    if (owners.length <= 1) {
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
