/**
 * Manager portal session — a STANDALONE module, fully isolated from the
 * analyst (`alpine_session`) and investor (`investor_session`) cookies.
 *
 * Isolation guarantees:
 *  - cookie NAME   : `manager_session`        (distinct)
 *  - cookie DOMAIN : host-only (no Domain attr)
 *  - signing SECRET: `MANAGER_SESSION_SECRET` (distinct)
 *
 * The signed payload encodes an expiry timestamp; `verifySession` rejects
 * expired tokens.
 *
 * Edge-safe: Web Crypto only, no Node APIs, no Supabase. Safe to import from
 * `middleware.ts`. Never import `lib/manager/password.ts` (Node `crypto`).
 */

const SESSION_COOKIE = "manager_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const DEV_FALLBACK_SECRET = "manager-portal-dev-only-secret-do-not-use-in-prod";

function getSecret(): string {
  const explicit = process.env.MANAGER_SESSION_SECRET;
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing MANAGER_SESSION_SECRET — set it before deploying the manager portal.",
    );
  }
  return DEV_FALLBACK_SECRET;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(sig).slice(0, 32);
}

/**
 * Sign a session token for a manager email.
 * Token format: `email|expiresAtMs|signature`, signature = HMAC(`email|expiresAtMs`).
 */
export async function signSession(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${normalized}|${expiresAt}`;
  const sig = await hmac(payload);
  return `${payload}|${sig}`;
}

/**
 * Verify a session token. Returns the manager email on success, or null if
 * missing / malformed / tampered / wrong secret / expired. This is a
 * cookie-validity check ONLY — it is NOT authorization. Whether the manager
 * may access a given firm or generate invites is decided by
 * lib/manager/access.ts.
 */
export async function verifySession(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const lastPipe = token.lastIndexOf("|");
  if (lastPipe <= 0) return null;
  const payload = token.slice(0, lastPipe);
  const sig = token.slice(lastPipe + 1);

  const expected = await hmac(payload);
  if (sig.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < sig.length; i++) mismatch |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (mismatch !== 0) return null;

  const sep = payload.lastIndexOf("|");
  if (sep <= 0) return null;
  const email = payload.slice(0, sep);
  const expiryStr = payload.slice(sep + 1);
  if (!email || !/^\d+$/.test(expiryStr)) return null;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() >= expiry) return null;

  return email;
}

export const MANAGER_SESSION = {
  COOKIE_NAME: SESSION_COOKIE,
  MAX_AGE_SECONDS,
};

/**
 * Cookie options for the manager session. No `domain` attribute is set, so
 * the browser scopes the cookie to the exact host that issued it.
 */
export function managerCookieOptions(isProd: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
