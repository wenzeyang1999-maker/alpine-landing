/**
 * Integrity guard for the synthetic ODD report fixtures.
 *
 * Every report carries a header comment of the form
 *   Overall rating: X (N flags, A RED chapters, B YELLOW chapters)
 * and those counts drift from the chapters they describe. Cordova and
 * Ridgeline Resort both claimed 4 YELLOW chapters while carrying 5, and the
 * flag counts matched neither the risk observations nor anything else.
 *
 * A prospect reads the summary before the chapters, so a wrong count is the
 * first thing that fails a credibility check. This asserts the header, the
 * chapter ratings, and the risk-observation list agree.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "lib/app-portal");

interface Report {
  file: string;
  declaredFlags: number | null;
  declaredRed: number | null;
  declaredYellow: number | null;
  actualRed: number;
  actualYellow: number;
  observationIds: string[];
}

// `rating: "YELLOW"` appears once per chapter in the TOPIC_DATA object.
const RATING_RE = /\brating:\s*"(GREEN|YELLOW|RED)"/g;
// Header: Overall rating: YELLOW (13 flags, 0 RED chapters, 5 YELLOW chapters)
const HEADER_RE =
  /Overall rating:\s*\w+\s*\((\d+)\s*flags?,\s*(\d+)\s*RED chapters?,\s*(\d+)\s*YELLOW chapters?\)/;
const OBS_ID_RE = /\{\s*id:\s*"([A-Z]{2,3}-\d{3})"/g;

function loadReports(): Report[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith("-data.ts"))
    .map((file) => {
      const src = readFileSync(join(DIR, file), "utf8");
      const header = src.match(HEADER_RE);
      const ratings = [...src.matchAll(RATING_RE)].map((m) => m[1]);
      const observationIds = [...src.matchAll(OBS_ID_RE)].map((m) => m[1]);
      return {
        file,
        declaredFlags: header ? Number(header[1]) : null,
        declaredRed: header ? Number(header[2]) : null,
        declaredYellow: header ? Number(header[3]) : null,
        actualRed: ratings.filter((r) => r === "RED").length,
        actualYellow: ratings.filter((r) => r === "YELLOW").length,
        observationIds,
      };
    })
    .filter((r) => r.declaredYellow !== null);
}

const reports = loadReports();

describe("report header counts match the chapters they describe", () => {
  it("finds report fixtures to check", () => {
    expect(reports.length).toBeGreaterThan(0);
  });

  for (const r of reports) {
    it(`${r.file}: declared YELLOW chapter count matches the chapter ratings`, () => {
      expect(r.declaredYellow).toBe(r.actualYellow);
    });

    it(`${r.file}: declared RED chapter count matches the chapter ratings`, () => {
      expect(r.declaredRed).toBe(r.actualRed);
    });

    // The leading "N flags" number is deliberately not asserted: it is a
    // dev-facing comment whose definition differs across fixtures (some count
    // risk observations, some count yellow dataPoints), so there is no
    // canonical value to check against without inventing one.

    it(`${r.file}: risk observation ids are unique`, () => {
      expect(new Set(r.observationIds).size).toBe(r.observationIds.length);
    });
  }
});

describe("no fictional entity collides with the report author", () => {
  // "Alpine" authors every report, so a fictional fund, investor, or service
  // provider carrying the name reads as an undisclosed conflict of interest.
  // Granite's 22% holder was called "Alpine Pension Investors" until this was
  // caught. Match only entity-shaped names, so ordinary prose such as
  // "Alpine Analysis" or "Alpine notes" does not trip it.
  const ENTITY_WORD =
    /Alpine (?:Pension|Capital|Partners|Investors|Advisors|Advisers|Management|Asset|Holdings|Trust|Ventures|Equity|Credit|Realty|Securities|Group)\b/g;

  for (const file of readdirSync(DIR).filter((f) => f.endsWith("-data.ts"))) {
    it(`${file}: no fictional "Alpine ..." entity`, () => {
      const src = readFileSync(join(DIR, file), "utf8");
      expect([...src.matchAll(ENTITY_WORD)].map((m) => m[0])).toEqual([]);
    });
  }
});
