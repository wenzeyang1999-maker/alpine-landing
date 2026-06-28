/**
 * Flag predicates (deliverable a). Proves the deterministic flag pass fires the right
 * standardized paragraphs from call-guide answers — and, critically, does NOT invent
 * flags from missing answers (a BDC fires almost nothing the LP samples fire).
 */
import { describe, it, expect } from "vitest";
import { evaluateCh4Flags } from "../../../lib/engine/ch4-flag-predicates";

describe("evaluateCh4Flags", () => {
  it("a listed BDC fires few flags (subsidiaries only)", () => {
    const fired = evaluateCh4Flags({
      "04.06.32": "Yes — consolidated CLO subsidiaries",
      "04.18.116": "1.5% of total assets",
      "04.18.117": "17.5%",
    }).map((f) => f.id);
    expect(fired).toContain("subsidiaries");
    expect(fired).not.toContain("no-key-person"); // not an open-ended fund — no answer, no flag
    expect(fired).not.toContain("side-pocket");
    expect(fired).not.toContain("mgmt-fee-over-2"); // 1.5% < 2
    expect(fired).not.toContain("incentive-over-20"); // 17.5% < 20
  });

  it("an open-ended LP fires the redemption/side-pocket/fee flags", () => {
    const fired = evaluateCh4Flags({
      "04.14.79": "No", // no key person → flag
      "04.14.89": "Yes", "04.14.93": "No", // gate, no sunset → two flags
      "04.16.109": "Yes", "04.16.112": "No", "04.16.113": "No", // side pockets, no cap, no opt-out
      "04.18.117": "25%", // incentive > 20
      "04.20.136": "Charged to the fund",
    }).map((f) => f.id);
    expect(fired).toEqual(expect.arrayContaining([
      "no-key-person", "gating", "gate-no-sunset", "side-pocket", "side-pocket-no-cap", "side-pocket-no-optout", "incentive-over-20", "exp-research-data",
    ]));
  });

  it("never invents a flag from an empty answer set", () => {
    expect(evaluateCh4Flags({})).toEqual([]);
  });
});
