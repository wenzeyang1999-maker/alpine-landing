import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import { signSession, verifySession } from "@/lib/investor/auth-session";

const SECRET = process.env.INVESTOR_SESSION_SECRET as string;

// Mirror the module's HMAC (HMAC-SHA256, hex, first 32 chars) with Node crypto
// so the tests can construct expired / wrong-secret tokens.
function sign(payload: string, secret = SECRET): string {
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 32);
}
function makeToken(email: string, expiresAt: number, secret = SECRET): string {
  const payload = `${email}|${expiresAt}`;
  return `${payload}|${sign(payload, secret)}`;
}

describe("investor auth-session", () => {
  it("verifies a freshly signed token and normalizes the email", async () => {
    const token = await signSession("Demo@Alpine.com");
    expect(await verifySession(token)).toBe("demo@alpine.com");
  });

  it("rejects a token with a tampered signature", async () => {
    const token = await signSession("a@b.com");
    const last = token.slice(-1);
    const tampered = token.slice(0, -1) + (last === "0" ? "1" : "0");
    expect(await verifySession(tampered)).toBeNull();
  });

  it("rejects missing / malformed tokens", async () => {
    expect(await verifySession(undefined)).toBeNull();
    expect(await verifySession(null)).toBeNull();
    expect(await verifySession("")).toBeNull();
    expect(await verifySession("no-delimiter")).toBeNull();
    expect(await verifySession("a@b.com|")).toBeNull();
  });

  it("rejects a token signed with the wrong secret", async () => {
    const token = makeToken("a@b.com", Date.now() + 60_000, "a-totally-different-secret");
    expect(await verifySession(token)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const token = makeToken("a@b.com", Date.now() - 1_000);
    expect(await verifySession(token)).toBeNull();
  });

  it("accepts a correctly signed, not-yet-expired token", async () => {
    const token = makeToken("a@b.com", Date.now() + 60_000);
    expect(await verifySession(token)).toBe("a@b.com");
  });
});
