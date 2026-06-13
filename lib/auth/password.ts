/**
 * Analyst/admin password hashing — Node `crypto.scrypt`, no new dependency.
 * Same scheme as lib/investor/password.ts and lib/manager/password.ts.
 *
 * Node runtime ONLY. Never import from middleware (Edge runtime).
 */

import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SALT_BYTES = 16;
const SCRYPT_OPTS = { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 64 * 1024 * 1024 };

/** A real scrypt hash of a random string — used so login timing does not reveal
 *  whether an account exists (compare against this when the email is unknown). */
export const DUMMY_HASH = hashPassword(randomBytes(24).toString("hex"));

/** Hash a plaintext password. Returns `saltHex:hashHex`. */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** Verify a plaintext password against a stored `saltHex:hashHex` string. */
export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored || typeof stored !== "string") return false;
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  if (!/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex)) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  if (salt.length !== SALT_BYTES || expected.length !== SCRYPT_KEYLEN) return false;

  let actual: Buffer;
  try {
    actual = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  } catch {
    return false;
  }
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

/** Minimal password policy — at least 8 chars. */
export function isAcceptablePassword(password: unknown): { ok: true } | { ok: false; reason: string } {
  if (typeof password !== "string" || password.length < 8) {
    return { ok: false, reason: "Password must be at least 8 characters." };
  }
  return { ok: true };
}
