/**
 * A small in-memory rate limiter for the admin sign-in endpoints.
 *
 * It is not a substitute for a distributed limiter, but it stops a phone or a
 * script from guessing the admin PIN by hammering the sign-in route.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryInSeconds: number;
}

/** Counts one attempt and reports whether it is allowed. */
export function consumeRateLimit(
  key: string,
  limit = 8,
  windowMs = 15 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(bucketKey);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryInSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryInSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, remaining: limit - bucket.count, retryInSeconds: 0 };
}

/** Clears the counter after a successful sign-in. */
export function clearRateLimit(key: string): void {
  buckets.delete(key);
}

/** The caller's address, used as the rate limit key. */
export function clientAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
