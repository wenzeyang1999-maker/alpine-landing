import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/investor/password";

describe("investor password", () => {
  it("verifies a correct password", () => {
    const stored = hashPassword("correct horse battery");
    expect(verifyPassword("correct horse battery", stored)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const stored = hashPassword("correct horse battery");
    expect(verifyPassword("wrong password", stored)).toBe(false);
  });

  it("rejects malformed stored hashes without throwing", () => {
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", null)).toBe(false);
    expect(verifyPassword("x", undefined)).toBe(false);
    expect(verifyPassword("x", "no-colon-here")).toBe(false);
    expect(verifyPassword("x", "nothex:nothex")).toBe(false);
    expect(verifyPassword("x", "abcd:efab")).toBe(false); // valid hex, wrong lengths
  });

  it("produces a unique salt per hash (same password hashes differ)", () => {
    expect(hashPassword("identical")).not.toBe(hashPassword("identical"));
  });
});
