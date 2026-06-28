/**
 * Curated fixture integrity (T8). Schema checks run always; the verbatim-quote guard
 * runs against the cached source filing when present (skips in CI where the gitignored
 * corpus isn't on disk). A stale fixture — quote no longer in the filing, or a frameworkId
 * that drifted off the demo bank — fails here.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CURATED_CH4 } from "../../../../lib/engine/demo/fixtures/curated-ch4";
import { CH4_QUESTIONS } from "../../../../lib/engine/demo/ch4-questions";
import { assembleCh4 } from "../../../../lib/engine/demo/callguide";

const bankIds = new Set(CH4_QUESTIONS.map((q) => q.frameworkId as string));
const cachedPath = (cik: string) => join(process.cwd(), "lib/engine/.data/stage1/funds", cik, "tenk.norm.txt");
const anyCached = Object.values(CURATED_CH4).some((f) => existsSync(cachedPath(f.cik)));

describe("curated Ch4 fixtures", () => {
  it("every fixture has provenance and a valid profile", () => {
    for (const f of Object.values(CURATED_CH4)) {
      expect(f.provenance.schemaVersion).toBe("ch4.demo.v1");
      expect(f.provenance.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(f.profile.strategy).toBeTruthy();
    }
  });

  it("every fixture answer maps to a real demo-bank frameworkId (no drift)", () => {
    for (const f of Object.values(CURATED_CH4)) {
      for (const id of Object.keys(f.extraction)) {
        expect(bankIds.has(id), `${f.ticker}: ${id} not in demo bank`).toBe(true);
      }
    }
  });

  it("every curated fund assembles to a reconciled-to-164 guide with ≥4 grounded answers", () => {
    for (const f of Object.values(CURATED_CH4)) {
      const a = assembleCh4({
        profile: { strategy: f.profile.strategy, scopes: new Set(f.profile.scopes) },
        extraction: f.extraction,
      });
      expect(a.reconciledTo164, `${f.ticker} did not reconcile`).toBe(true);
      expect(a.counts.answered, `${f.ticker} grounded count`).toBeGreaterThanOrEqual(4);
    }
  });

  it.skipIf(!anyCached)(
    "every answered quote is still verbatim in its cached 10-K (the gate, retroactively)",
    () => {
      for (const f of Object.values(CURATED_CH4)) {
        const p = cachedPath(f.cik);
        if (!existsSync(p)) continue;
        const text = readFileSync(p, "utf8");
        for (const ans of Object.values(f.extraction)) {
          if (ans.status === "answered" && ans.quote) {
            expect(text.indexOf(ans.quote), `${f.ticker} stale quote: "${ans.quote}"`).toBeGreaterThanOrEqual(0);
          }
        }
      }
    },
  );
});
