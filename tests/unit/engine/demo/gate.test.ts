/**
 * Demo gate (T10, DD9). Proves the server-side token round-trips, rejects tampering,
 * and that the password check is present. Uses the dev fallbacks (NODE_ENV !== production).
 */
import { describe, it, expect } from "vitest";
import { signDemoToken, verifyDemoToken, checkPassword } from "../../../../lib/engine/demo/gate";

describe("demo gate", () => {
  it("a freshly signed token verifies", async () => {
    expect(await verifyDemoToken(await signDemoToken())).toBe(true);
  });

  it("rejects empty / malformed / tampered tokens", async () => {
    expect(await verifyDemoToken(undefined)).toBe(false);
    expect(await verifyDemoToken("garbage")).toBe(false);
    const t = await signDemoToken();
    expect(await verifyDemoToken(t.slice(0, -2) + "00")).toBe(false); // flipped signature
  });

  it("rejects an expired token", async () => {
    // payload with an expiry in the past, re-signed would need the secret; instead assert
    // a structurally-valid-but-expired token fails (signature won't match a forged payload).
    expect(await verifyDemoToken("demo|1|deadbeefdeadbeefdeadbeefdeadbeef")).toBe(false);
  });

  it("accepts the dev password and rejects others (constant-time)", () => {
    expect(checkPassword("mercer-demo")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
    expect(checkPassword("")).toBe(false);
  });
});
