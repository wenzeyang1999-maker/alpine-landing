/**
 * D5 answer integrity (codex #1). The extract route signs grounded answers so /generate can
 * prove they were server-issued; tampering with id/status/value/quote must break verification.
 */
import { describe, it, expect } from "vitest";
import { canonicalAnswer, signAnswer, verifyAnswer } from "../../../../lib/engine/demo/answer-sign";
import { ChapterAnswer } from "../../../../lib/engine/demo/extract-llm";

const ans = (over: Partial<ChapterAnswer> = {}): ChapterAnswer => ({
  questionId: "04.18.116", label: "Base management fee", subsection: "Fees", status: "answered",
  value: "1.5% of total assets", quote: "annual rate of 1.5%", confidence: "high",
  sourceLabel: "TEST", filingAnswerable: true, ...over,
});

describe("answer-sign (D5)", () => {
  it("canonical form binds id, status, value, quote", () => {
    expect(canonicalAnswer(ans())).toContain("04.18.116");
    expect(canonicalAnswer(ans())).toContain("1.5% of total assets");
    expect(canonicalAnswer(ans())).toContain("annual rate of 1.5%");
    // a different value yields a different canonical string
    expect(canonicalAnswer(ans({ value: "2%" }))).not.toBe(canonicalAnswer(ans()));
  });

  it("a freshly signed answer verifies", async () => {
    const a = ans();
    expect(await verifyAnswer(a, await signAnswer(a))).toBe(true);
  });

  it("a missing signature does not verify", async () => {
    expect(await verifyAnswer(ans(), undefined)).toBe(false);
    expect(await verifyAnswer(ans(), "")).toBe(false);
  });

  it("a tampered value breaks the signature", async () => {
    const a = ans();
    const sig = await signAnswer(a);
    expect(await verifyAnswer({ ...a, value: "0.1% (forged)" }, sig)).toBe(false);
  });

  it("a tampered quote breaks the signature", async () => {
    const a = ans();
    const sig = await signAnswer(a);
    expect(await verifyAnswer({ ...a, quote: "fabricated quote" }, sig)).toBe(false);
  });

  it("a forged signature does not verify", async () => {
    expect(await verifyAnswer(ans(), "deadbeefdeadbeefdeadbeefdeadbeef")).toBe(false);
  });
});
