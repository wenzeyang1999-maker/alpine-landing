/**
 * House-style hard rule: NO em/en dashes in generated narrative or the reusable flag text.
 * This test fails if a banned dash creeps back into any narrative, field, or flag paragraph.
 */
import { describe, it, expect } from "vitest";
import { scrubDashes, hasBannedDash, BANNED_DASH } from "../../../lib/engine/house-style";
import { CH4_REPORTS } from "../../../lib/engine/demo/fixtures/ch4-report";
import { CH4_FLAGS } from "../../../lib/engine/ch4-flag-library";
import { REPORT_FLAGS } from "../../../lib/engine/report-flag-library";

describe("house-style: no dashes", () => {
  it("scrubDashes removes every banned dash glyph", () => {
    const dirty = "alpha — beta – gamma ― delta − epsilon ‒ zeta";
    expect(hasBannedDash(scrubDashes(dirty))).toBe(false);
    expect(scrubDashes("two parts — a and b — each")).not.toMatch(BANNED_DASH);
  });

  it("no Ch4 narrative, field answer, or quote contains a banned dash", () => {
    for (const r of Object.values(CH4_REPORTS)) {
      expect(hasBannedDash(r.narrative), `${r.ticker} narrative`).toBe(false);
      for (const f of r.fields) {
        expect(hasBannedDash(f.answer), `${r.ticker} ${f.id} answer`).toBe(false);
        if (f.quote) expect(hasBannedDash(f.quote), `${r.ticker} ${f.id} quote`).toBe(false);
      }
    }
  });

  it("no flag-library paragraph contains a banned dash", () => {
    for (const f of CH4_FLAGS) expect(hasBannedDash(f.text), `ch4 flag ${f.id}`).toBe(false);
    for (const f of REPORT_FLAGS) expect(hasBannedDash(f.text), `flag ${f.id}`).toBe(false);
  });
});
