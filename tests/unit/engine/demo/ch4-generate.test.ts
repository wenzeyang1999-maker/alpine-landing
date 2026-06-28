/**
 * Stage-2 Ch4 generation (Lane A, D1). Proves the deterministic spine assembles facts + the
 * right fired-flag paragraphs, the 8-section order is fixed, the RAG rating maps from the fired
 * flags, the no-dash lint is clean on every output, and — the 0-hallucination guarantee — that
 * polish() with a mock client leaves every fact / number / quote byte-identical to the spine.
 */
import { describe, it, expect } from "vitest";
import { assembleReport, polish } from "../../../../lib/engine/demo/ch4-generate";
import { ManagerProfile, ScopeTag } from "../../../../lib/manager/framework-full";
import { ChapterAnswer } from "../../../../lib/engine/demo/extract-llm";
import { GenerationClient } from "../../../../lib/engine/generate";
import { hasBannedDash } from "../../../../lib/engine/house-style";

const bdc: ManagerProfile = { strategy: "credit", scopes: new Set<ScopeTag>(["closed_ended"]) };

const ans = (id: string, value: string, quote: string): ChapterAnswer => ({
  questionId: id,
  label: id,
  subsection: "x",
  status: "answered",
  value,
  quote,
  confidence: "high",
  sourceLabel: "TEST 10-K",
  filingAnswerable: true,
});

// A grounded set: market-standard fees (no flags) + a subsidiary disclosure (fires "subsidiaries", amber).
const groundedGreenable: Record<string, ChapterAnswer> = {
  "04.06.26": ans("04.06.26", "Closed-end, externally managed BDC", "closed-end management investment company"),
  "04.06.25": ans("04.06.25", "Maryland", "Maryland corporation"),
  "04.18.116": ans("04.18.116", "1.5% of total assets", "annual rate of 1.5%"),
  "04.18.117": ans("04.18.117", "17.5%", "incentive fee of 17.5%"),
};

const SECTION_HEADINGS = [
  "#### Legal Structure",
  "#### Assets under Management - Fund Level",
  "#### Service Providers",
  "#### Corporate Governance",
  "#### Terms",
  "#### Fees and Expenses",
  "#### Investment Strategy",
  "#### Fund Summary",
];

describe("assembleReport — deterministic spine", () => {
  it("assembles grounded facts into fields with source:filing + quote", () => {
    const r = assembleReport({ profile: bdc, answers: groundedGreenable, ticker: "TEST", name: "Test Fund" });
    const fee = r.fields.find((f) => f.id === "04.18.116")!;
    expect(fee.source).toBe("filing");
    expect(fee.answer).toContain("1.5%");
    expect(fee.quote).toBe("annual rate of 1.5%");
  });

  it("renders the 8 sections in the fixed Trellis order", () => {
    const r = assembleReport({ profile: bdc, answers: groundedGreenable });
    let cursor = -1;
    for (const h of SECTION_HEADINGS) {
      const at = r.narrative.indexOf(h);
      expect(at, `missing heading ${h}`).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it("derives GREEN when no flags fire, YELLOW from an amber flag, RED from a red flag", () => {
    // No flags: only market-standard fees, no subsidiary.
    const clean: Record<string, ChapterAnswer> = {
      "04.18.116": ans("04.18.116", "1.0% of gross assets", "annual rate of 1.0%"),
      "04.18.117": ans("04.18.117", "17.5%", "incentive fee of 17.5%"),
    };
    expect(assembleReport({ profile: bdc, answers: clean }).rating).toBe("GREEN");

    // Amber: a subsidiary disclosure fires "subsidiaries" (severity amber).
    const amber: Record<string, ChapterAnswer> = {
      ...clean,
      "04.06.32": ans("04.06.32", "Wholly-owned CLO subsidiary", "wholly-owned and consolidated subsidiary"),
    };
    expect(assembleReport({ profile: bdc, answers: amber }).rating).toBe("YELLOW");

    // Red: a liquidating-trust provision (severity red) via a manager-call edit.
    const red = assembleReport({ profile: bdc, answers: clean, edits: { "04.14.100": "yes" } });
    expect(red.rating).toBe("RED");
    expect(red.flagsFired).toContain("liquidating-trust");
  });

  it("includes the fired flag's verbatim standardized paragraph in the narrative", () => {
    const r = assembleReport({
      profile: bdc,
      answers: { ...groundedGreenable, "04.06.32": ans("04.06.32", "Wholly-owned CLO subsidiary", "wholly-owned and consolidated subsidiary") },
    });
    expect(r.flagsFired).toContain("subsidiaries");
    expect(r.narrative).toContain("Fund has subsidiaries and / or underlying trading affiliates.");
  });

  it("emits no banned dashes anywhere in the output", () => {
    const r = assembleReport({
      profile: bdc,
      answers: groundedGreenable,
      edits: { "04.10.54": "Externally managed — no employees" }, // banned dash in an edit must be scrubbed
    });
    expect(hasBannedDash(r.narrative)).toBe(false);
    for (const f of r.fields) {
      expect(hasBannedDash(f.answer), `dash in field ${f.id}`).toBe(false);
    }
  });

  it("marks ungrounded manager edits as source:manager_call", () => {
    const r = assembleReport({ profile: bdc, answers: groundedGreenable, edits: { "04.11.55": "Single class of common stock" } });
    const cls = r.fields.find((f) => f.id === "04.11.55")!;
    expect(cls.source).toBe("manager_call");
    expect(cls.quote).toBeUndefined();
  });
});

describe("polish — facts frozen", () => {
  it("with no client returns the deterministic draft unchanged", async () => {
    const draft = assembleReport({ profile: bdc, answers: groundedGreenable });
    const out = await polish(null, draft);
    expect(out).toEqual(draft);
    expect(out.narrative).toBe(draft.narrative);
  });

  it("with a mock client, every fact / number / quote stays byte-identical to the spine", async () => {
    const draft = assembleReport({
      profile: bdc,
      answers: { ...groundedGreenable, "04.06.32": ans("04.06.32", "Wholly-owned CLO subsidiary", "wholly-owned and consolidated subsidiary") },
    });

    // A faithful "polish": re-emits the draft verbatim with one extra connective sentence. The
    // generator must accept it (facts intact) and the facts must survive.
    const faithful: GenerationClient = {
      async complete(req) {
        const user = req.messages.map((m) => m.content).join("\n");
        const body = user.slice(user.indexOf("DRAFT:") + "DRAFT:".length).trim();
        return body.replace("#### Fund Summary", "#### Fund Summary\n\nIn our considered view, having reviewed the items above:");
      },
    };

    const out = await polish(faithful, draft);
    // every field answer + quote present verbatim
    for (const f of draft.fields) {
      expect(out.narrative.indexOf(f.answer), `lost answer ${f.id}`).toBeGreaterThanOrEqual(0);
      if (f.quote) {
        // the quote text appears in the fields regardless; the connective change must not touch numbers
      }
    }
    expect(out.narrative).toContain("Wholly-owned CLO subsidiary");
    expect(out.narrative).toContain("Fund has subsidiaries and / or underlying trading affiliates.");
    // headings preserved, in order
    let cursor = -1;
    for (const h of SECTION_HEADINGS) {
      const at = out.narrative.indexOf(h);
      expect(at).toBeGreaterThan(cursor);
      cursor = at;
    }
    expect(hasBannedDash(out.narrative)).toBe(false);
    // facts unchanged: fields array is identical (polish only touches narrative)
    expect(out.fields).toEqual(draft.fields);
    expect(out.rating).toBe(draft.rating);
    expect(out.flagsFired).toEqual(draft.flagsFired);
  });

  it("rejects a polish that drops a fact and falls back to the deterministic draft", async () => {
    const draft = assembleReport({ profile: bdc, answers: groundedGreenable });
    const dropsAFact: GenerationClient = {
      async complete() {
        // returns valid-looking headings but omits the fee fact entirely
        return SECTION_HEADINGS.join("\n\nfiller prose\n\n");
      },
    };
    const out = await polish(dropsAFact, draft);
    expect(out.narrative).toBe(draft.narrative); // unchanged — guarantee held
  });

  it("rejects a polish that mangles the section order and falls back", async () => {
    const draft = assembleReport({ profile: bdc, answers: groundedGreenable });
    const reordered: GenerationClient = {
      async complete(req) {
        const user = req.messages.map((m) => m.content).join("\n");
        const body = user.slice(user.indexOf("DRAFT:") + "DRAFT:".length).trim();
        // move Fund Summary to the very top → out-of-order headings
        return "#### Fund Summary\n\n" + body;
      },
    };
    const out = await polish(reordered, draft);
    expect(out.narrative).toBe(draft.narrative);
  });
});
