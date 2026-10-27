import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminToken,
  getAdminIdentity,
  isAdminConfigured,
  pinMatches,
  type AdminIdentity,
} from '@/lib/adminAuth';
import {
  getAdminAccountByEmail,
  normalizeAdminEmail,
  syncEnvOwnerAccount,
  touchAdminAccountLogin,
} from '@/lib/adminAccounts';
import { verifyAdminPassword } from '@/lib/adminPasswords';
import { clearRateLimit, clientAddress, consumeRateLimit } from '@/lib/rateLimit';

async function startSession(identity: AdminIdentity): Promise<string> {
  const token = await createAdminToken(identity);
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return token;
}

/** Reports who is signed in. */
export async function GET() {
  const store = await cookies();
  const identity = await getAdminIdentity(store.get(ADMIN_SESSION_COOKIE)?.value);
  return Response.json({ authenticated: Boolean(identity), identity });
}

/**
 * Signs in with either the shared PIN or an email and password.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { pin?: unknown; email?: unknown; password?: unknown }
    | null;

  const address = clientAddress(request);
  const limit = consumeRateLimit(`session:${address}`);

  if (!limit.allowed) {
    return Response.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(limit.retryInSeconds / 60)} minute(s).`,
      },
      { status: 429 },
    );
  }

  const email = typeof body?.email === 'string' ? normalizeAdminEmail(body.email) : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (email && password) {
    await syncEnvOwnerAccount();

    const account = await getAdminAccountByEmail(email);
    if (!account || !(await verifyAdminPassword(password, account.passwordHash))) {
      return Response.json({ error: 'That email and password do not match.' }, { status: 401 });
    }

    await touchAdminAccountLogin(account.id);
    clearRateLimit(`session:${address}`);
    const identity: AdminIdentity = {
      kind: 'account',
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
    };
    const token = await startSession(identity);
    return Response.json({ ok: true, identity, token });
  }

  const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';

  if (pin) {
    if (!isAdminConfigured()) {
      return Response.json(
        { error: 'Admin access is not set up on this server yet. Add ADMIN_PIN to the environment.' },
        { status: 503 },
      );
    }

    if (!(await pinMatches(pin))) {
      return Response.json({ error: 'That PIN is not correct.' }, { status: 401 });
    }

    clearRateLimit(`session:${address}`);
    const identity: AdminIdentity = { kind: 'pin', role: 'owner', name: 'Owner' };
    const token = await startSession(identity);
    return Response.json({ ok: true, identity, token });
  }

  return Response.json({ error: 'Enter your email and password.' }, { status: 400 });
}

/** Ends the admin session. */
export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  return Response.json({ ok: true });
}
