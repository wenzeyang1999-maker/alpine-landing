/**
 * Demo access gate (T10, DD9) — a STANDALONE, server-enforced password gate for
 * /demo/valuation, isolated from the manager/analyst/investor sessions.
 *
 *  - cookie NAME   : `alpine_demo`            (distinct)
 *  - signing SECRET: `DEMO_ACCESS_SECRET`     (distinct)
 *  - password      : `DEMO_ACCESS_PASSWORD`   (the shared demo password)
 *
 * Enforced on BOTH the page and the API routes (not just the UI), so the fixtures and
 * the live extractor are not reachable by URL. Edge-safe: Web Crypto only, importable
 * from middleware.
 */

export const DEMO_COOKIE = "alpine_demo";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h — long enough for a demo session, short enough to expire

const DEV_SECRET = "alpine-demo-dev-only-secret";
const DEV_PASSWORD = "mercer-demo";

function secret(): string {
  const s = process.env.DEMO_ACCESS_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("Missing DEMO_ACCESS_SECRET");
  return DEV_SECRET;
}

function expectedPassword(): string {
  return process.env.DEMO_ACCESS_PASSWORD || (process.env.NODE_ENV === "production" ? "" : DEV_PASSWORD);
}

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return hex(sig).slice(0, 32);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

/** True if the submitted password matches (constant-time). Empty config in prod → always false. */
export function checkPassword(input: string): boolean {
  const expected = expectedPassword();
  if (!expected) return false;
  return constantTimeEqual(input, expected);
}

/**
 * D5 answer integrity: sign an arbitrary value with the demo HMAC secret. The extract route
 * signs each grounded answer so the generate route can prove it was server-issued (the
 * quote-gate guarantee survives the stateless client round-trip; a tampered/forged "grounded"
 * answer fails verification and is demoted to a non-grounded fill).
 */
export async function signValue(message: string): Promise<string> {
  return hmac(message);
}

/** Verify a value signature minted by signValue (constant-time). */
export async function verifyValue(message: string, sig: string | undefined | null): Promise<boolean> {
  if (!sig) return false;
  return constantTimeEqual(sig, await hmac(message));
}

/** Mint a signed access token: `demo|expiresAtMs|sig`. */
export async function signDemoToken(): Promise<string> {
  const payload = `demo|${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${payload}|${await hmac(payload)}`;
}

/** Validate a token from the cookie. */
export async function verifyDemoToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const last = token.lastIndexOf("|");
  if (last <= 0) return false;
  const payload = token.slice(0, last);
  const sig = token.slice(last + 1);
  if (!constantTimeEqual(sig, await hmac(payload))) return false;
  const expiry = Number(payload.split("|")[1]);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

/** Read one cookie value out of a raw Cookie header. */
function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

/** Route-level gate: verify the demo cookie on an incoming request. */
export async function isGatedRequestOk(req: Request): Promise<boolean> {
  return verifyDemoToken(readCookie(req.headers.get("cookie"), DEMO_COOKIE));
}

export function demoCookieOptions(isProd: boolean) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
