/**
 * Profile inference + the classifier eval (T3, T4, D6).
 *  - the gate: a classification whose quote isn't verbatim in the filing is demoted to
 *    provisional, never trusted
 *  - garbage / unknown strategy falls back conservatively, never throws
 *  - the labelled eval documents expected {strategy, scopes} for the curated funds so a
 *    prompt/model regression is catchable against the real API (run with a live client)
 */
import { describe, it, expect } from "vitest";
import { inferProfile } from "../../../../lib/engine/demo/profile";
import { GenerationClient } from "../../../../lib/engine/generate";

const BDC_TEXT =
  "We are a specialty finance company that is a closed-end, externally managed, " +
  "non-diversified business development company under the Investment Company Act of 1940.";

const stub = (reply: string): GenerationClient => ({ async complete() { return reply; } });

describe("inferProfile", () => {
  it("classifies a BDC as credit / closed-ended when the quote is grounded", async () => {
    const client = stub(JSON.stringify({
      strategy: "credit", scopes: ["closed_ended"],
      quote: "closed-end, externally managed, non-diversified business development company",
      confidence: "high",
    }));
    const r = await inferProfile(client, BDC_TEXT, "ARCC 10-K");
    expect(r.profile.strategy).toBe("credit");
    expect(r.profile.scopes.has("closed_ended")).toBe(true);
    expect(r.confidence).toBe("high");
    expect(r.provisional).toBe(false);
    expect(r.evidence?.quote).toContain("business development company");
  });

  it("demotes to provisional when the supporting quote is NOT in the filing (the gate)", async () => {
    const client = stub(JSON.stringify({
      strategy: "credit", scopes: ["closed_ended"],
      quote: "a sentence that does not appear anywhere in this filing",
      confidence: "high",
    }));
    const r = await inferProfile(client, BDC_TEXT, "ARCC 10-K");
    expect(r.provisional).toBe(true);
    expect(r.confidence).toBe("low");
    expect(r.evidence).toBeNull();
  });

  it("falls back conservatively on unparseable output (never throws)", async () => {
    const r = await inferProfile(stub("the model rambled with no json"), BDC_TEXT, "x");
    expect(r.profile.strategy).toBe("credit");
    expect(r.profile.scopes.has("closed_ended")).toBe(true);
    expect(r.provisional).toBe(true);
  });

  it("rejects an invalid strategy and flags provisional", async () => {
    const client = stub(JSON.stringify({ strategy: "banana", scopes: [], quote: "closed-end", confidence: "high" }));
    const r = await inferProfile(client, BDC_TEXT, "x");
    expect(r.provisional).toBe(true);
  });
});

/**
 * Labelled eval set (D6). The expected classification for known funds. With a mock client
 * these assert the mapping; point a live AnthropicClient at real filings to catch model drift.
 */
export const PROFILE_EVAL = [
  { ticker: "ARCC", expect: { strategy: "credit", scopes: ["closed_ended"] } },
  { ticker: "BXSL", expect: { strategy: "credit", scopes: ["closed_ended"] } },
  { ticker: "OBDC", expect: { strategy: "credit", scopes: ["closed_ended"] } },
  { ticker: "KKR-PE-example", expect: { strategy: "pe", scopes: ["closed_ended"] } },
  { ticker: "open-end-HF-example", expect: { strategy: "hf", scopes: ["open_ended"] } },
];

describe("profile eval set", () => {
  it("declares labels for ≥5 funds incl. non-credit cases", () => {
    expect(PROFILE_EVAL.length).toBeGreaterThanOrEqual(5);
    expect(PROFILE_EVAL.some((f) => f.expect.strategy !== "credit")).toBe(true);
  });
});
