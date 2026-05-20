const SESSION_COOKIE = "alpine_session";

let _warnedFallback = false;

function getSecret(): string {
  const explicit = process.env.AUTH_SESSION_SECRET;
  if (explicit) return explicit;
  const fallback = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!fallback) throw new Error("Missing AUTH_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY");
  if (!_warnedFallback && process.env.NODE_ENV === "production") {
    _warnedFallback = true;
    console.warn(
      "[auth-session] AUTH_SESSION_SECRET not set; falling back to SUPABASE_SERVICE_ROLE_KEY. " +
      "Rotating the Supabase key will invalidate every active admin session. " +
      "Set AUTH_SESSION_SECRET in your env to decouple.",
    );
  }
  return fallback;
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

export async function signSession(email: string): Promise<string> {
  const payload = email.trim().toLowerCase();
  const sig = await hmac(payload);
  return `${payload}|${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const idx = token.lastIndexOf("|");
  if (idx <= 0) return null;
  const email = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = await hmac(email);
  if (sig.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < sig.length; i++) mismatch |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (mismatch !== 0) return null;
  return email;
}

export const SESSION = {
  COOKIE_NAME: SESSION_COOKIE,
  MAX_AGE_SECONDS: 60 * 60 * 24 * 7,
};

export function cookieOptions(isProd: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: SESSION.MAX_AGE_SECONDS,
    // domain undefined in dev (browser scopes to host); in prod set to .alpinedd.com to share across subdomains
    ...(isProd ? { domain: ".alpinedd.com" } : {}),
  };
}

// Re-export the single source of truth (lib/app-allowlist.ts) so callers in
// app-portal don't need to know which file owns the list.
export { APP_ADMIN_ALLOWLIST, isAppAdmin } from "@/lib/app-allowlist";
import { isAppAdmin as _isAppAdmin } from "@/lib/app-allowlist";

/**
 * Server-side gate for API routes. Reads the signed session cookie off the
 * incoming Request, verifies the HMAC, and checks the email is in the admin
 * allowlist. Returns the admin email or null; callers should respond 401 on null.
 */
export async function getAppAdminEmail(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  const email = await verifySession(decodeURIComponent(match[1]));
  if (!_isAppAdmin(email)) return null;
  return email;
}
