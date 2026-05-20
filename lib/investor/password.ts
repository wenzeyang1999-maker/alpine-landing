/**
 * Investor password hashing — Node `crypto.scrypt`, no new dependency.
 *
 * Node runtime ONLY. Never import this from middleware (Edge runtime) and
 * never re-export it through a barrel file that middleware imports.
 *
 * The scrypt params below are module constants so the seed-migration hash
 * (computed offline) and the runtime verify always agree.
 */

import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

// Scrypt parameters — must stay in lockstep with the seed migration's hash.
const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SALT_BYTES = 16;

// 128 * N * r bytes of working memory; raise maxmem so scrypt never throws.
const SCRYPT_OPTS = { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 64 * 1024 * 1024 };

/** Hash a plaintext password. Returns `saltHex:hashHex`. */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored `saltHex:hashHex` string.
 * Returns false (never throws) for any malformed input — constant-time
 * compare on the happy path.
 */
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
