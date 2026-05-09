// Tiny in-memory sliding-window rate limiter, keyed by IP.
//
// IMPORTANT: this is per-instance and resets on cold start. It is intended as a
// minimum-viable defense for single-instance / preview deployments. For
// multi-instance production (Vercel serverless, Fly multi-region, etc.) swap
// the backing Map for Vercel KV or Upstash Redis with the same interface.

type LimitOpts = { limit?: number; windowMs?: number };

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 60 minutes

const hits = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  opts: LimitOpts = {}
): { ok: boolean; retryAfterSeconds?: number } {
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();
  const cutoff = now - windowMs;

  const stamps = (hits.get(ip) ?? []).filter((t) => t > cutoff);

  if (stamps.length >= limit) {
    const oldest = stamps[0];
    const retryAfterMs = Math.max(0, oldest + windowMs - now);
    hits.set(ip, stamps);
    return { ok: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  stamps.push(now);
  hits.set(ip, stamps);
  return { ok: true };
}
