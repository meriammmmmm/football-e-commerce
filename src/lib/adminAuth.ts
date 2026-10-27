/**
 * Admin access for the mobile catalogue app.
 *
 * The admin can unlock in two ways:
 *   - with the shared PIN from `ADMIN_PIN` (fast, good for one person)
 *   - with an email and password (a real account, good for a team)
 *
 * Either way the browser never keeps the secret. It exchanges it once for a
 * signed session cookie that is validated on every request.
 *
 * This module deliberately avoids `next/headers` so it can also be used from
 * `proxy.ts`, which runs before the app.
 */

import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

export const ADMIN_SESSION_COOKIE = 'hb_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();
const scryptAsync = promisify(scrypt);

export type AdminRole = 'owner' | 'staff';

export type AdminIdentity =
  | { kind: 'pin'; role: AdminRole; name: string }
  | { kind: 'account'; id: string; email: string; name: string; role: AdminRole };

function adminPin(): string {
  return (process.env.ADMIN_PIN ?? '').trim();
}

function sessionSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET ?? '').trim() || adminPin();
}

export function isAdminConfigured(): boolean {
  return adminPin().length > 0;
}

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return atob(padded);
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time string comparison. */
function equalStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Checks a PIN against `ADMIN_PIN` without leaking how wrong it was. */
export async function pinMatches(candidate: string): Promise<boolean> {
  const expected = adminPin();
  if (!expected || !candidate) return false;
  const [candidateHash, expectedHash] = await Promise.all([sha256(candidate), sha256(expected)]);
  return equalStrings(candidateHash, expectedHash);
}

/** Hashes a password with scrypt and a random salt. */
export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

/** Checks a password against a stored scrypt hash. */
export async function verifyAdminPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'hex');
  if (expected.length !== 64) return false;

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(derived, expected);
}

export async function createAdminToken(identity: AdminIdentity): Promise<string> {
  const payload = base64UrlEncode(
    JSON.stringify({
      exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
      ...identity,
    }),
  );
  return `${payload}.${await hmac(payload)}`;
}

/** Reads the signed identity out of a session token, or null if it is invalid. */
export async function getAdminIdentity(token: string | undefined | null): Promise<AdminIdentity | null> {
  if (!token || !isAdminConfigured()) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = await hmac(payload);
  if (!equalStrings(signature, expected)) return null;

  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as {
      exp?: unknown;
      kind?: unknown;
      id?: unknown;
      email?: unknown;
      name?: unknown;
      role?: unknown;
    };

    if (typeof decoded.exp !== 'number' || Date.now() >= decoded.exp) return null;

    const role: AdminRole = decoded.role === 'owner' ? 'owner' : 'staff';

    if (decoded.kind === 'account') {
      if (typeof decoded.id !== 'string' || typeof decoded.email !== 'string') return null;
      return {
        kind: 'account',
        id: decoded.id,
        email: decoded.email,
        name: typeof decoded.name === 'string' && decoded.name ? decoded.name : decoded.email,
        role,
      };
    }

    if (decoded.kind === 'pin') {
      return { kind: 'pin', role: 'owner', name: typeof decoded.name === 'string' ? decoded.name : 'Owner' };
    }

    return null;
  } catch {
    return null;
  }
}

/** True when the session may manage staff accounts. */
export function canManageStaff(identity: AdminIdentity | null): boolean {
  if (!identity) return false;
  return identity.kind === 'pin' || identity.role === 'owner';
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  return (await getAdminIdentity(token)) !== null;
}
