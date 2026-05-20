/**
 * Allocator session — a STANDALONE module, fully isolated from the analyst
 * `alpine_session` (lib/auth-session.ts / lib/app-portal/auth-session.ts).
 *
 * Isolation guarantees:
 *  - cookie NAME   : `allocator_session`        (not `alpine_session`)
 *  - cookie DOMAIN : host-only (no Domain attr) (not `.alpinedd.com`)
 *  - signing SECRET: `ALLOCATOR_SESSION_SECRET`  (not `AUTH_SESSION_SECRET`)
 *
 * The signed payload encodes an expiry timestamp; `verifySession` rejects
 * expired tokens. The analyst sessions sign only the email and have no
 * server-side expiry — the allocator session must not inherit that flaw.
 *
 * Edge-safe: Web Crypto only, no Node APIs, no Supabase. Safe to import in
 * `middleware.ts`. Never import the password module (Node `crypto`) from here.
 */

const SESSION_COOKIE = "allocator_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Dev/test-only fallback so `npm run dev` and the test suite run without env
// setup. Production REQUIRES a real ALLOCATOR_SESSION_SECRET (deploy step 1) —
// getSecret() throws if it is missing when NODE_ENV === "production".
const DEV_FALLBACK_SECRET = "allocator-portal-dev-only-secret-do-not-use-in-prod";

function getSecret(): string {
  const explicit = process.env.ALLOCATOR_SESSION_SECRET;
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing ALLOCATOR_SESSION_SECRET — set it before deploying the allocator portal.",
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
 * Sign a session token for an allocator email.
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
 * Verify a session token. Returns the allocator email on success, or null if
 * the token is missing, malformed, tampered, signed with the wrong secret, or
 * expired. This is a cookie-validity check ONLY — it is NOT authorization.
 * Whether the allocator may see a given report is decided by lib/allocator/access.ts.
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

  // payload = `email|expiresAtMs`
  const sep = payload.lastIndexOf("|");
  if (sep <= 0) return null;
  const email = payload.slice(0, sep);
  const expiryStr = payload.slice(sep + 1);
  if (!email || !/^\d+$/.test(expiryStr)) return null;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() >= expiry) return null;

  return email;
}

export const ALLOCATOR_SESSION = {
  COOKIE_NAME: SESSION_COOKIE,
  MAX_AGE_SECONDS,
};

/**
 * Cookie options for the allocator session. No `domain` attribute is set, so
 * the browser scopes the cookie to the exact host that issued it (apex host
 * only) — it is never sent to `app.alpinedd.com`. This is the structural
 * credential-isolation guarantee between allocators and analysts.
 */
export function allocatorCookieOptions(isProd: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    // Intentionally NO `domain` — host-only cookie.
  };
}
