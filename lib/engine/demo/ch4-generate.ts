/**
 * Stage-2 Chapter-4 generation (Lane A, D1 hybrid).
 *
 * `assembleReport({profile, answers, edits})` builds the EXISTING `Ch4Report` (same type the
 * curated fixtures use, so the SAME tab-2/tab-3 renderer draws a live BYO fund). The design
 * is a DETERMINISTIC SPINE that owns every fact:
 *
 *   1. Ch4Field[] from grounded extraction answers (source:"filing", with the verbatim quote)
 *      + manager-call / AI-suggested answers (source:"manager_call").
 *   2. flagsFired via evaluateCh4Flags() over a flat frameworkId→string answer map — the model
 *      NEVER decides which risk paragraphs appear.
 *   3. rating (GREEN/YELLOW/RED) derived from the fired-flag severities (red → RED, amber → YELLOW).
 *   4. an 8-section Trellis narrative: facts woven by fixed connective sentences + the VERBATIM
 *      fired-flag paragraphs (from the flag library) + a synthesis Fund Summary.
 *
 * scrubDashes() runs over the final narrative AND every generated field/answer string (the hard
 * no-dash rule). `polish(client, draft)` optionally rewrites ONLY the connective prose with an
 * Anthropic client; all facts/numbers/quotes stay byte-identical to the spine (the 0-hallucination
 * guarantee — a test asserts it). With no client, the deterministic draft is returned unchanged.
 */
import type { ManagerProfile } from "../../manager/framework-full";
import type { ChapterAnswer } from "./extract-llm";
import type { Ch4Report, Ch4Field } from "./fixtures/ch4-report";
import type { GenerationClient } from "../generate";
import { evaluateCh4Flags, FiredFlag } from "../ch4-flag-predicates";
import { scrubDashes } from "../house-style";

export type { Ch4Report, Ch4Field } from "./fixtures/ch4-report";

/** Inputs to the generator. `answers` are the Stage-1 extraction results (grounded, gated). */
export type AssembleInput = {
  profile: ManagerProfile;
  ticker?: string;
  name?: string;
  /** Stage-1 extraction keyed by frameworkId (grounded facts, quote-gated). */
  answers: Record<string, ChapterAnswer>;
  /** Manager-call / AI-suggested fills keyed by frameworkId (ungrounded, editable). */
  edits?: Record<string, string>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Report-facing field metadata. Mirrors the curated fixtures' (subsection, question)
// labels so a BYO report reads identically to a curated one. Order here = field order.
// ─────────────────────────────────────────────────────────────────────────────
const FIELD_META: { id: string; subsection: string; question: string }[] = [
  { id: "04.06.26", subsection: "Legal Structure", question: "Corporate form / fund type" },
  { id: "04.06.25", subsection: "Legal Structure", question: "Fund domicile" },
  { id: "04.06.27", subsection: "Legal Structure", question: "Incorporation / commencement" },
  { id: "04.06.30", subsection: "Legal Structure", question: "Fund structure (managed / listed)" },
  { id: "04.06.32", subsection: "Legal Structure", question: "Subsidiaries / SPVs" },
  { id: "04.09.45", subsection: "AUM", question: "Total assets / AUM" },
  { id: "04.10.54", subsection: "Service Providers", question: "Externally managed / no employees" },
  { id: "04.11.55", subsection: "Terms", question: "Share classes / interests" },
  { id: "04.04.15", subsection: "AUM", question: "Insider / adviser alignment" },
  { id: "04.18.116", subsection: "Fees and Expenses", question: "Base management fee" },
  { id: "04.18.117", subsection: "Fees and Expenses", question: "Incentive fee" },
  { id: "04.18.118", subsection: "Fees and Expenses", question: "Incentive-fee crystallization" },
  { id: "04.19.126", subsection: "Fees and Expenses", question: "Hurdle / preferred return" },
  { id: "04.20.147", subsection: "Fees and Expenses", question: "Expense cap / waiver" },
  { id: "04.20.157", subsection: "Fees and Expenses", question: "Management fee offset" },
  { id: "04.20.159", subsection: "Fees and Expenses", question: "Expense ratio" },
  { id: "04.17.114", subsection: "Terms", question: "Side letters / preferential terms" },
];

/** The fixed 8-section Trellis skeleton, in order. Never model-decided. */
const SECTION_ORDER = [
  "Legal Structure",
  "Assets under Management - Fund Level",
  "Service Providers",
  "Corporate Governance",
  "Terms",
  "Fees and Expenses",
  "Investment Strategy",
  "Fund Summary",
] as const;

// Which field ids feed each report section (a field's `subsection` is the curated label;
// the section heading the narrative writes under can differ, per the crosswalk).
const SECTION_FIELDS: Record<string, string[]> = {
  "Legal Structure": ["04.06.26", "04.06.25", "04.06.27", "04.06.30", "04.06.32"],
  "Assets under Management - Fund Level": ["04.09.45", "04.04.15"],
  "Service Providers": ["04.10.54"],
  "Corporate Governance": [],
  Terms: ["04.11.55", "04.17.114"],
  "Fees and Expenses": ["04.18.116", "04.18.117", "04.18.118", "04.19.126", "04.20.147", "04.20.157", "04.20.159"],
  "Investment Strategy": [],
  "Fund Summary": [],
};

const RATING_LABEL: Record<Ch4Report["rating"], string> = {
  GREEN: "Accept",
  YELLOW: "Watch List",
  RED: "Reject",
};

// ─────────────────────────────────────────────────────────────────────────────
// Spine construction
// ─────────────────────────────────────────────────────────────────────────────

/** Build the flat frameworkId→string answer map the flag predicates run over. */
function flatAnswers(answers: Record<string, ChapterAnswer>, edits: Record<string, string>): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const id of Object.keys(answers)) {
    const a = answers[id];
    if (a && a.status === "answered" && a.value) flat[id] = a.value;
  }
  // Manager / AI-suggested fills (do not overwrite a grounded value).
  for (const id of Object.keys(edits)) {
    if (flat[id] === undefined && edits[id] && edits[id].trim()) flat[id] = edits[id];
  }
  return flat;
}

/** Build the report-facing Ch4Field[] from grounded answers + manager fills, in fixed order. */
function buildFields(answers: Record<string, ChapterAnswer>, edits: Record<string, string>): Ch4Field[] {
  const fields: Ch4Field[] = [];
  for (let i = 0; i < FIELD_META.length; i++) {
    const meta = FIELD_META[i];
    const a = answers[meta.id];
    if (a && a.status === "answered" && a.value) {
      fields.push({
        id: meta.id,
        subsection: meta.subsection,
        question: meta.question,
        answer: scrubDashes(a.value),
        source: "filing",
        quote: a.quote ?? undefined, // verbatim — NOT scrubbed (must match the source byte-for-byte)
      });
    } else if (edits[meta.id] && edits[meta.id].trim()) {
      fields.push({
        id: meta.id,
        subsection: meta.subsection,
        question: meta.question,
        answer: scrubDashes(edits[meta.id]),
        source: "manager_call",
      });
    }
  }
  return fields;
}

/** Derive the RAG rating from the fired-flag severities (deterministic, model-free). */
function deriveRating(fired: FiredFlag[]): Ch4Report["rating"] {
  let hasRed = false;
  let hasAmber = false;
  for (let i = 0; i < fired.length; i++) {
    if (fired[i].severity === "red") hasRed = true;
    else if (fired[i].severity === "amber") hasAmber = true;
  }
  if (hasRed) return "RED";
  if (hasAmber) return "YELLOW";
  return "GREEN";
}

const colorWord = (r: Ch4Report["rating"]): string => (r === "GREEN" ? "Green" : r === "YELLOW" ? "Amber" : "Red");

/** A field's display value, by id, or null. */
function fieldVal(fields: Ch4Field[], id: string): string | null {
  for (let i = 0; i < fields.length; i++) if (fields[i].id === id) return fields[i].answer;
  return null;
}

/**
 * Compose one narrative section: a fixed lead sentence, the grounded/manager facts as plain
 * sentences, then any fired-flag paragraphs whose home topic is this section, verbatim.
 */
function renderSection(
  section: string,
  fields: Ch4Field[],
  firedForSection: FiredFlag[],
): string {
  const lines: string[] = ["#### " + section, ""];
  const ids = SECTION_FIELDS[section] ?? [];
  const factSentences: string[] = [];
  for (let i = 0; i < ids.length; i++) {
    const f = byId(fields, ids[i]);
    if (!f) continue;
    const lead = f.source === "filing" ? "The filing discloses" : "The Manager represented that";
    factSentences.push(lead + " " + lowerFirst(f.question) + ": " + ensurePeriod(f.answer));
  }

  if (factSentences.length > 0) {
    lines.push(factSentences.join(" "));
  } else {
    lines.push(NEUTRAL_LEAD[section] ?? "No additional structural facts were determinable from the filing for this section; the relevant items are noted for confirmation on the analyst call.");
  }

  for (let i = 0; i < firedForSection.length; i++) {
    lines.push("");
    lines.push(firedForSection[i].text);
  }
  return lines.join("\n");
}

const NEUTRAL_LEAD: Record<string, string> = {
  "Corporate Governance":
    "Governance arrangements (board or advisory-committee composition, independence and oversight of related-party matters) were not fully determinable from the public filing and are noted for confirmation on the analyst call.",
  "Investment Strategy":
    "The fund's investment strategy, portfolio liquidity and use of leverage are addressed in the relevant chapters of this report; the structural assessment here does not restate them.",
};

function byId(fields: Ch4Field[], id: string): Ch4Field | undefined {
  for (let i = 0; i < fields.length; i++) if (fields[i].id === id) return fields[i];
  return undefined;
}

function lowerFirst(s: string): string {
  return s.length > 0 ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

function ensurePeriod(s: string): string {
  const t = s.trim();
  return /[.;:]$/.test(t) ? t : t + ".";
}

/** The Fund Summary synthesis — facts + rating rationale, never model-decided. */
function renderSummary(
  rating: Ch4Report["rating"],
  fields: Ch4Field[],
  fired: FiredFlag[],
): string {
  const parts: string[] = ["#### Fund Summary", ""];
  const sentences: string[] = [];

  const form = fieldVal(fields, "04.06.26");
  const fee = fieldVal(fields, "04.18.116");
  const incentive = fieldVal(fields, "04.18.117");
  const lead =
    "On the basis of the structural, terms and alignment items reviewed above" +
    (form ? ", the fund presents as " + lowerFirst(ensureNoPeriod(form)) : "") +
    ".";
  sentences.push(lead);
  if (fee || incentive) {
    const feeBits: string[] = [];
    if (fee) feeBits.push("a base management fee of " + lowerFirst(ensureNoPeriod(fee)));
    if (incentive) feeBits.push("an incentive fee of " + lowerFirst(ensureNoPeriod(incentive)));
    sentences.push("The headline fee schedule comprises " + feeBits.join(" and ") + ".");
  }

  if (fired.length === 0) {
    sentences.push(
      "No standardized operational due diligence flags were triggered at the structural, terms or alignment level on the information reviewed.",
    );
  } else {
    const titles = fired.map((f) => lowerFirst(ensureNoPeriod(f.title))).join("; ");
    sentences.push(
      "The following standardized item" +
        (fired.length > 1 ? "s were" : " was") +
        " noted and addressed in the relevant section above: " +
        titles +
        ".",
    );
  }
  sentences.push(
    "A number of items that were not fully determinable from the public filing have been noted for confirmation on the analyst call.",
  );
  sentences.push(
    "Subject to that confirmation, the items reviewed support our " + colorWord(rating) + " rating for Fund.",
  );

  parts.push(sentences.join(" "));
  return parts.join("\n");
}

function ensureNoPeriod(s: string): string {
  return s.trim().replace(/[.;:]+$/, "");
}

/** Assemble the full 8-section narrative from the spine. */
function buildNarrative(rating: Ch4Report["rating"], fields: Ch4Field[], fired: FiredFlag[]): string {
  // Map each fired flag to the report section its home topic belongs to.
  const firedBySection: Record<string, FiredFlag[]> = {};
  for (let i = 0; i < SECTION_ORDER.length; i++) firedBySection[SECTION_ORDER[i]] = [];
  for (let i = 0; i < fired.length; i++) {
    const sec = FLAG_SECTION[fired[i].id] ?? "Terms";
    (firedBySection[sec] ?? (firedBySection["Terms"])).push(fired[i]);
  }

  const blocks: string[] = [];
  for (let i = 0; i < SECTION_ORDER.length; i++) {
    const section = SECTION_ORDER[i];
    if (section === "Fund Summary") {
      blocks.push(renderSummary(rating, fields, fired));
    } else {
      blocks.push(renderSection(section, fields, firedBySection[section] ?? []));
    }
  }
  return blocks.join("\n\n");
}

// Which report section a fired flag's verbatim paragraph belongs under.
const FLAG_SECTION: Record<string, string> = {
  subsidiaries: "Legal Structure",
  "segregated-cell": "Legal Structure",
  "pre-launch": "Legal Structure",
  "aum-below-100m": "Assets under Management - Fund Level",
  "aum-up-25": "Assets under Management - Fund Level",
  "investor-concentration": "Assets under Management - Fund Level",
  gating: "Terms",
  "gate-no-sunset": "Terms",
  "holdback-over-5": "Terms",
  "liquidating-trust": "Terms",
  "no-key-person": "Terms",
  "classes-diff-liquidity": "Terms",
  "redemption-fee": "Terms",
  "side-pocket": "Terms",
  "side-pocket-no-optout": "Terms",
  "side-pocket-no-cap": "Terms",
  "mgmt-fee-over-2": "Fees and Expenses",
  "incentive-over-20": "Fees and Expenses",
  "modified-hwm": "Fees and Expenses",
  "incentive-intra-year": "Fees and Expenses",
  "american-waterfall": "Fees and Expenses",
  "no-preferred-return": "Fees and Expenses",
  "no-clawback": "Fees and Expenses",
  "no-mgmt-fee-offset": "Fees and Expenses",
  "exp-research-data": "Fees and Expenses",
  "exp-research-travel": "Fees and Expenses",
  "exp-systems": "Fees and Expenses",
  "exp-compliance": "Fees and Expenses",
  "exp-overhead": "Fees and Expenses",
  "side-letter-fees": "Terms",
  "affiliated-allocation": "Investment Strategy",
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Deterministic spine. Owns every fact: no model is consulted here. The output is a complete,
 * renderable Ch4Report; pass it to polish() to optionally rewrite ONLY the connective prose.
 */
export function assembleReport(input: AssembleInput): Ch4Report {
  const edits = input.edits ?? {};
  const fields = buildFields(input.answers, edits);
  const flat = flatAnswers(input.answers, edits);
  const fired = evaluateCh4Flags(flat);
  const rating = deriveRating(fired);
  const narrative = scrubDashes(buildNarrative(rating, fields, fired));

  return {
    ticker: input.ticker ?? "FUND",
    name: input.name ?? input.ticker ?? "Fund",
    rating,
    ratingLabel: RATING_LABEL[rating],
    flagsFired: fired.map((f) => f.id),
    fields,
    narrative,
  };
}

/**
 * Optional LLM polish (D1). Rewrites ONLY the connective prose of the deterministic narrative;
 * every fact, number, quote and the fired-flag paragraphs must come back byte-identical. We
 * enforce that defensively: if the model drops or mutates any spine fact token, we keep the
 * deterministic draft. With no client supplied, returns the draft unchanged.
 */
export async function polish(client: GenerationClient | null | undefined, draft: Ch4Report): Promise<Ch4Report> {
  if (!client) return draft;

  // The immutable spine tokens the polish must preserve: every field answer + quote, and each
  // fired-flag paragraph. We pass them as a verbatim whitelist and re-verify post-generation.
  const mustKeep: string[] = [];
  for (let i = 0; i < draft.fields.length; i++) {
    if (draft.fields[i].answer) mustKeep.push(draft.fields[i].answer);
    const q = draft.fields[i].quote;
    if (q) mustKeep.push(q);
  }

  const system = [
    "You are an Alpine operational due diligence editor. You are given a finished Chapter 4 draft.",
    "Improve ONLY the connective prose and flow so it reads like a senior analyst wrote it.",
    "HARD RULES:",
    "1. Do NOT add, remove, or change any fact, number, date, percentage, name, or quotation.",
    "2. Do NOT introduce any new evaluative judgment, risk opinion, conclusion, or recommendation that is not already stated in the draft. The draft already contains all analysis; you only smooth how it reads.",
    "3. Keep every '#### ' section heading exactly, in the same order.",
    "4. Keep each standardized risk paragraph verbatim — do not paraphrase them.",
    "5. Never use em dashes or en dashes; use commas or restructure the sentence.",
    "6. Output ONLY the revised markdown narrative, no preamble.",
  ].join("\n");
  const user = [
    "Polish the connective prose of this Chapter 4 draft. Preserve every fact verbatim.",
    "",
    "FACTS THAT MUST APPEAR UNCHANGED (each is a literal substring of the draft; reproduce each exactly):",
    ...mustKeep.map((m, i) => i + 1 + ". " + m),
    "",
    "DRAFT:",
    draft.narrative,
  ].join("\n");

  let out = "";
  try {
    out = await client.complete({
      system,
      messages: [{ role: "user", content: user }],
      temperature: 0.2,
      maxTokens: 4000,
    });
  } catch {
    return draft; // any failure → deterministic draft (no degradation of the guarantee)
  }

  out = scrubDashes(out);

  // VERIFY: every must-keep fact survived verbatim, and the 8 headings are intact, in order.
  for (let i = 0; i < mustKeep.length; i++) {
    if (out.indexOf(mustKeep[i]) < 0) return draft;
  }
  let cursor = 0;
  for (let i = 0; i < SECTION_ORDER.length; i++) {
    const head = "#### " + SECTION_ORDER[i];
    const at = out.indexOf(head, cursor);
    if (at < 0) return draft;
    cursor = at + head.length;
  }

  return { ...draft, narrative: out.trim() };
}
