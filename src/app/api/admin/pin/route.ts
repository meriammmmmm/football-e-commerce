import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { canManageStaff, pinMatches } from '@/lib/adminAuth';
import { clearRateLimit, clientAddress, consumeRateLimit } from '@/lib/rateLimit';
import { hasStoredPin, setStoredPin, getStoredPinHash } from '@/lib/adminConfig';
import { isDatabaseConfigured } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/adminPasswords';

/** Checks PIN against DB hash first, then env var fallback. */
async function checkPin(candidate: string): Promise<boolean> {
  if (!candidate) return false;
  try {
    const storedHash = await getStoredPinHash();
    if (storedHash) return verifyAdminPassword(candidate, storedHash);
  } catch { /* DB unavailable */ }
  return pinMatches(candidate);
}

/**
 * GET /api/admin/pin
 * Returns whether a custom PIN has been saved to the database.
 * The actual PIN value is never returned.
 */
export async function GET() {
  const identity = await getRequestAdminIdentity();
  if (!identity || !canManageStaff(identity)) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  const custom = await hasStoredPin();
  const dbAvailable = isDatabaseConfigured();

  return Response.json({ custom, dbAvailable });
}

/**
 * PATCH /api/admin/pin
 * Lets an owner change the shared admin PIN.
 *
 * Body: { currentPin?: string; newPin: string }
 *
 * - `currentPin` is required when a PIN is already configured (env var or DB),
 *   so a rogue session cannot silently rotate the PIN.
 * - Only owner-role identities may call this endpoint.
 */
export async function PATCH(request: Request) {
  const address = clientAddress(request);
  const limit = consumeRateLimit(`pin:${address}`);

  if (!limit.allowed) {
    return Response.json(
      { error: `Too many attempts. Try again in ${Math.ceil(limit.retryInSeconds / 60)} minute(s).` },
      { status: 429 },
    );
  }

  const identity = await getRequestAdminIdentity();
  if (!identity || !canManageStaff(identity)) {
    return Response.json({ error: 'Only an owner can change the admin PIN.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { currentPin?: unknown; newPin?: unknown }
    | null;

  const currentPin = typeof body?.currentPin === 'string' ? body.currentPin.trim() : '';
  const newPin = typeof body?.newPin === 'string' ? body.newPin.trim() : '';

  if (!newPin || newPin.length < 4) {
    return Response.json({ error: 'The new PIN must be at least 4 characters.' }, { status: 400 });
  }
  if (newPin.length > 20) {
    return Response.json({ error: 'The PIN must be 20 characters or fewer.' }, { status: 400 });
  }

  // Verify the current PIN before allowing a change (prevents a hijacked
  // session from silently rotating the PIN).
  const pinIsConfigured = await import('@/lib/adminAuth').then((m) => m.isAdminConfigured());
  if (pinIsConfigured) {
    if (!currentPin) {
      return Response.json({ error: 'Enter your current PIN to confirm the change.' }, { status: 400 });
    }
    if (!(await checkPin(currentPin))) {
      return Response.json({ error: 'That current PIN is not correct.' }, { status: 401 });
    }
  }

  try {
    await setStoredPin(newPin);
    clearRateLimit(`pin:${address}`);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save the PIN.';
    return Response.json({ error: message }, { status: 503 });
  }
}
