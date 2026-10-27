import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { canManageStaff, isAdminConfigured, pinMatches } from '@/lib/adminAuth';
import { clearRateLimit, clientAddress, consumeRateLimit } from '@/lib/rateLimit';
import { countAdminAccounts, createAdminAccount, listAdminAccounts, normalizeAdminEmail, toPublicAccount } from '@/lib/adminAccounts';
import { verifyAdminPassword } from '@/lib/adminPasswords';
import { getStoredPinHash } from '@/lib/adminConfig';

/** Checks PIN against DB hash first, then env var fallback. */
async function checkPin(candidate: string): Promise<boolean> {
  if (!candidate) return false;
  try {
    const storedHash = await getStoredPinHash();
    if (storedHash) return verifyAdminPassword(candidate, storedHash);
  } catch { /* DB unavailable */ }
  return pinMatches(candidate);
}

/** Lists the staff accounts that can sign in to the admin app. */
export async function GET() {
  const identity = await getRequestAdminIdentity();
  if (!identity || !canManageStaff(identity)) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  const accounts = await listAdminAccounts();
  return Response.json({ accounts: accounts.map(toPublicAccount) });
}

/**
 * Creates a staff account.
 *
 * The very first account can be created with the admin PIN, which is how the
 * owner sets up their email sign-in. After that, only an owner can add people.
 */
export async function POST(request: Request) {
  const address = clientAddress(request);
  const limit = consumeRateLimit(`accounts:${address}`);

  if (!limit.allowed) {
    return Response.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(limit.retryInSeconds / 60)} minute(s).`,
      },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; name?: unknown; password?: unknown; pin?: unknown }
    | null;

  const email = typeof body?.email === 'string' ? normalizeAdminEmail(body.email) : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (!name || name.length < 2) {
    return Response.json({ error: 'Enter the name of this person.' }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: 'Use a password of at least 8 characters.' }, { status: 400 });
  }

  const existingAccounts = await countAdminAccounts();
  const identity = await getRequestAdminIdentity();

  if (existingAccounts === 0) {
    // First account: the PIN proves this is the owner setting things up.
    // Unlocking with the PIN already counts as that proof.
    const unlockedWithPin = identity?.kind === 'pin';
    const pinGiven = pin.length > 0;

    if (!unlockedWithPin && !pinGiven) {
      return Response.json({ error: 'Enter your admin PIN to confirm.' }, { status: 400 });
    }
    if (!unlockedWithPin) {
      if (!isAdminConfigured()) {
        return Response.json(
          { error: 'Admin access is not set up on this server yet. Add ADMIN_PIN to the environment.' },
          { status: 503 },
        );
      }
      if (!(await checkPin(pin))) {
        return Response.json(
          { error: 'That PIN is not correct. Check the ADMIN_PIN in the server settings.' },
          { status: 401 },
        );
      }
    }
    clearRateLimit(`accounts:${address}`);
  } else if (!canManageStaff(identity)) {
    return Response.json({ error: 'Only the owner can add staff accounts.' }, { status: 401 });
  } else {
    // An authorised owner must never be locked out by the attempt counter.
    clearRateLimit(`accounts:${address}`);
  }

  try {
    const account = await createAdminAccount({ email, name, password, source: 'app' });
    return Response.json({ account: toPublicAccount(account) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return Response.json({ error: 'An account already exists for this email.' }, { status: 409 });
    }
    const detail = error instanceof Error ? error.message : String(error);
    console.error('Admin account creation failed:', detail);
    return Response.json({ error: `Could not create this account: ${detail}` }, { status: 503 });
  }
}
