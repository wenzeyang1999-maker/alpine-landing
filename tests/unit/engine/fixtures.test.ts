import { describe, it, expect } from "vitest";
import { validateODDReport, lintODDReport } from "@/lib/engine/contract";
import { proposeOverall } from "@/lib/engine/rubric";
import { TRELLIS_REPORT } from "@/lib/engine/fixtures/trellis.fixture";
import { VERIDIAN_REPORT } from "@/lib/engine/fixtures/veridian.fixture";
import { CALDER_REPORT } from "@/lib/engine/fixtures/calder.fixture";

const chapterPattern = (r: typeof TRELLIS_REPORT) => r.chapters.map((c) => ({ num: c.num, rating: c.rating }));

describe("corpus fixtures — contract holds all three rating extremes", () => {
  it("all three real reports are structurally valid", () => {
    expect(validateODDReport(TRELLIS_REPORT)).toEqual([]);
    expect(validateODDReport(VERIDIAN_REPORT)).toEqual([]);
    expect(validateODDReport(CALDER_REPORT)).toEqual([]);
  });

  it("Veridian (Reject): valuation/asset-existence red; analyst escalated to Reject", () => {
    expect(VERIDIAN_REPORT.overall.rating).toBe("red"); // real verdict
    // Engine PROPOSES WatchList + mustConfirm for an asset-safety red; analyst escalated.
    const p = proposeOverall(chapterPattern(VERIDIAN_REPORT));
    expect(p.rating).toBe("yellow");
    expect(p.mustConfirm).toBe(true);
    // Overall is red (not green), so no asset-safety lint warning fires.
    expect(lintODDReport(VERIDIAN_REPORT)).toEqual([]);
  });

  it("Calder (WatchList): single non-asset-safety red; engine proposes Accept, analyst escalated", () => {
    expect(CALDER_REPORT.overall.rating).toBe("yellow"); // real verdict
    const p = proposeOverall(chapterPattern(CALDER_REPORT));
    expect(p.rating).toBe("green"); // engine's modal proposal
    expect(p.mustConfirm).toBe(true); // ...but flagged for analyst confirmation
    expect(lintODDReport(CALDER_REPORT)).toEqual([]);
  });

  it("Trellis (WatchList): two non-asset-safety reds, overall yellow — no lint noise", () => {
    expect(TRELLIS_REPORT.overall.rating).toBe("yellow");
    expect(lintODDReport(TRELLIS_REPORT)).toEqual([]);
  });
});
