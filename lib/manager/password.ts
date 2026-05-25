/**
 * Manager portal password hashing — Node `crypto.scrypt`, no new dependency.
 *
 * Node runtime ONLY. Never import this from middleware (Edge runtime).
 *
 * Parameters are module constants and must stay in lockstep with anything
 * that computes hashes offline (e.g. seed migrations).
 */

import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SALT_BYTES = 16;
const SCRYPT_OPTS = { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 64 * 1024 * 1024 };

/** Hash a plaintext password. Returns `saltHex:hashHex`. */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * Constant-time compare of a plaintext attempt against a stored `saltHex:hashHex`.
 * Returns false on any parse error or mismatch.
 */
export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const sep = stored.indexOf(":");
  if (sep <= 0) return false;
  const saltHex = stored.slice(0, sep);
  const hashHex = stored.slice(sep + 1);
  let salt: Buffer;
  let stored_hash: Buffer;
  try {
    salt = Buffer.from(saltHex, "hex");
    stored_hash = Buffer.from(hashHex, "hex");
  } catch {
    return false;
  }
  if (salt.length !== SALT_BYTES || stored_hash.length !== SCRYPT_KEYLEN) return false;
  const attempt = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  return timingSafeEqual(attempt, stored_hash);
}

/** Minimum policy enforced server-side on signup + reset. */
export function isAcceptablePassword(pw: string): { ok: true } | { ok: false; reason: string } {
  if (typeof pw !== "string") return { ok: false, reason: "Password is required." };
  if (pw.length < 8) return { ok: false, reason: "Password must be at least 8 characters." };
  if (pw.length > 256) return { ok: false, reason: "Password is too long." };
  return { ok: true };
}
