import { describe, it, expect } from "vitest";
import { parseReportToExemplars, buildExemplarBank } from "@/lib/engine/exemplars";

// Synthetic report snippet mirroring the real structure — no corpus prose committed.
const SAMPLE = `# Sample Fund

## Operational Review

### Chapter 1: Manager, Ownership & Governance

The Manager represented that it has seven employees. We note that the firm has a
short operating history. This supports our Green rating for Manager.

### Chapter 7: Valuation, Asset Existence & Investor Reporting

Unlisted assets represented 94% of NAV priced internally. These observations
drive our Red rating for Valuation Controls.

## Reference Data

Field | Value
`;

describe("exemplar parser", () => {
  it("extracts one exemplar per chapter with chapterNum, rating, and prose", () => {
    const ex = parseReportToExemplars(SAMPLE, { reportId: "sample", strategy: "vc" });
    expect(ex).toHaveLength(2);

    expect(ex[0].chapterNum).toBe(1);
    expect(ex[0].rating).toBe("green");
    expect(ex[0].narrative).toContain("seven employees");
    expect(ex[0].narrative).not.toContain("## Reference Data"); // section boundary respected

    expect(ex[1].chapterNum).toBe(7);
    expect(ex[1].rating).toBe("red");
    expect(ex[1].strategy).toBe("vc");
  });

  it("stops a chapter at the next non-chapter heading (no bleed into Reference Data)", () => {
    const ex = parseReportToExemplars(SAMPLE, { reportId: "sample", strategy: "vc" });
    expect(ex[1].narrative).not.toContain("Field | Value");
  });

  it("buildExemplarBank flattens multiple reports and preserves reportId for leave-one-out", () => {
    const bank = buildExemplarBank([
      { markdown: SAMPLE, meta: { reportId: "r1", strategy: "vc" } },
      { markdown: SAMPLE, meta: { reportId: "r2", strategy: "credit" } },
    ]);
    expect(bank).toHaveLength(4);
    expect(new Set(bank.map((e) => e.reportId))).toEqual(new Set(["r1", "r2"]));
  });
});
