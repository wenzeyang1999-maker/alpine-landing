/**
 * Exemplar-bank ingestion — turn the report corpus into a tagged, retrievable
 * few-shot bank (style transfer by example; see style.ts + the generation proposal).
 *
 * The reports use a consistent structure: chapter narratives live under
 *   ### Chapter <N>: <Title>
 * and each carries its rating in prose ("supports our Green rating for ...").
 * This parser extracts one StyleExemplar per chapter. It is PURE (takes markdown
 * strings) so it is hermetically testable; a thin loader reads the corpus dir.
 *
 * The corpus is the user's proprietary data — keep the generated bank OUT of the
 * repo (gitignore the output). This module ships the parser, not the prose.
 */
import { StyleExemplar } from "./style";

export type ReportMeta = { reportId: string; strategy: string; fundType?: string };

const COLOR: Record<string, "green" | "amber" | "red"> = { green: "green", amber: "amber", red: "red" };
const CHAPTER_HEAD = /^###\s+Chapter\s+(\d+)\s*:/;
const ANY_HEAD = /^#{2,3}\s+/;
const RATING_SENTENCE = /(?:supports?|drives?)\s+our\s+(Green|Amber|Red)\s+rating/i;

/** Parse one report's markdown into per-chapter exemplars (one per `### Chapter N:`). */
export function parseReportToExemplars(markdown: string, meta: ReportMeta): StyleExemplar[] {
  const lines = markdown.split(/\r?\n/);
  const out: StyleExemplar[] = [];
  let num = 0;
  let buf: string[] = [];
  let active = false;

  const flush = () => {
    if (!active) return;
    const narrative = buf.join("\n").trim();
    if (narrative.length > 0) {
      out.push({
        reportId: meta.reportId,
        chapterNum: num,
        strategy: meta.strategy,
        fundType: meta.fundType,
        rating: extractRating(narrative),
        narrative,
      });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = CHAPTER_HEAD.exec(line);
    if (m) {
      flush();
      num = parseInt(m[1], 10);
      buf = [];
      active = true;
      continue;
    }
    if (active) {
      // A new non-chapter heading (## Reference Data, ## Legal Notice) ends the section.
      if (ANY_HEAD.test(line) && !CHAPTER_HEAD.test(line)) {
        flush();
        active = false;
        buf = [];
        continue;
      }
      buf.push(line);
    }
  }
  flush();
  return out;
}

/** Rating from the in-prose rationale sentence; defaults to green (the modal) if absent. */
function extractRating(text: string): "green" | "amber" | "red" {
  const m = RATING_SENTENCE.exec(text);
  if (m) return COLOR[m[1].toLowerCase()] ?? "green";
  return "green";
}

/** Build the full bank from already-read reports (pure; loader feeds this). */
export function buildExemplarBank(inputs: { markdown: string; meta: ReportMeta }[]): StyleExemplar[] {
  const bank: StyleExemplar[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const ex = parseReportToExemplars(inputs[i].markdown, inputs[i].meta);
    for (let j = 0; j < ex.length; j++) bank.push(ex[j]);
  }
  return bank;
}

/**
 * Best-guess strategy/fund-type tags for the 15-report corpus, keyed by report id
 * (filename without _ODD_Report.md). VERIFY these — they're inferred from names.
 * The loader script reads each .md file and pairs it with this manifest.
 */
export const STRATEGY_MANIFEST: Record<string, { strategy: string; fundType?: string }> = {
  Summit_Venture_Capital_I_L_P: { strategy: "vc", fundType: "closed_ended" },
  Veridian_Alpha_Fund: { strategy: "hf", fundType: "open_ended" },
  Calder_Global_Emerging_Markets_Fund: { strategy: "hf", fundType: "open_ended" },
  Aegis_Insurance_Credit_Opportunity_Fund_IV_LP: { strategy: "credit", fundType: "closed_ended" },
  Oakridge_Global_Credit_Plus_Fund_L_P: { strategy: "credit" },
  Meridian_Equinox_Credit_Fund_Limited: { strategy: "credit", fundType: "offshore" },
  Stonehaven_Credit_Partners_VII_Luxembourg_Feeder_SCSp_SICAV_RAIF: { strategy: "credit", fundType: "closed_ended" },
  Emberstone_Real_Estate_Fund_III_L_P: { strategy: "real_estate", fundType: "closed_ended" },
  Lyra_European_Real_Estate_Fund_VI_SLP: { strategy: "real_estate", fundType: "closed_ended" },
  Pinnacle_Institutional_Real_Estate_Trust: { strategy: "real_estate" },
  Northbridge_Industrial_Partnership: { strategy: "real_assets", fundType: "closed_ended" },
  Helios_Beteiligungs_II_GmbH_Co_KG: { strategy: "pe", fundType: "closed_ended" },
  Redwood_Capital_Associates_U_S_L_P: { strategy: "pe", fundType: "closed_ended" },
  Brookhaven_Offshore_IX_LP: { strategy: "hf", fundType: "offshore" },
  Ironwood_Offshore_Fund_Ltd: { strategy: "hf", fundType: "offshore" },
};
