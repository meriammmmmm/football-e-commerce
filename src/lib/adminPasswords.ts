import 'server-only';

import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

/**
 * Password hashing for the admin accounts.
 *
 * This file uses Node's crypto module, so it must never reach a browser
 * bundle. The `server-only` import makes the build fail if a client component
 * ever imports it.
 */

const scryptAsync = promisify(scrypt);

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
