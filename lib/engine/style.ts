/**
 * Alpine ODD house style — distilled from 15 real hand-authored reports.
 *
 * This is the "learned style" as an INSPECTABLE artifact, not a black box: a
 * phrasebook, register rules, entity convention, banned moves, and the
 * deterministic section scaffolds. The generation harness composes a system-prompt
 * fragment from STYLE_GUIDE + retrieves few-shot exemplars from the report corpus
 * (style transfer by example — see proposal). NO fine-tuning.
 *
 * Phrase frequencies below are real counts across the 15-report corpus.
 */

export type StyleIntent =
  | "manager_claim" // attributing a fact to the manager
  | "observation" // neutral analyst observation
  | "soft_recommendation" // preferred improvement, non-blocking
  | "strong_recommendation" // urged improvement
  | "monitoring_directive" // what investors should watch
  | "rating_rationale" // the sentence that justifies a chapter color
  | "positive_note"; // crediting a strength / remediation

/** The mined phrasebook. The generator uses these as canonical connectors. */
export const PHRASEBOOK: Record<StyleIntent, string[]> = {
  manager_claim: ["The Manager represented that", "The Manager confirmed that", "The Manager noted that"], // "The Manager represented" x175
  observation: ["We note that", "We observed that", "We understand that"], // "We note that" x369
  soft_recommendation: ["We would prefer to see", "We would also prefer to see"], // x91
  strong_recommendation: ["We would strongly prefer to see", "We strongly recommend"], // x25
  monitoring_directive: [
    "Investors are encouraged to monitor developments in this area.",
    "Investors are strongly encouraged to monitor developments in the above areas.",
  ], // x75 / x21
  rating_rationale: ["supports our {COLOR} rating for {CHAPTER}", "drives our {COLOR} rating for {CHAPTER}"], // x77 / x42
  positive_note: ["We are pleased to see that", "We note positively that"], // x21
};

/** Register / voice rules the system prompt enforces. */
export const REGISTER = {
  person: "first-person plural ('we'), institutional, measured",
  tense: "present for current state, past for events; attribute manager statements explicitly",
  hedging: "factual and specific; recommendations are softened ('we would prefer'), never imperative at the manager",
  quantify: "always quantify when the evidence allows (AUM $X.XM, 94.94% of NAV, by January 31, 2024)",
  evidenceFraming: "manager-sourced facts are attributed ('The Manager represented'); never assert unverified claims as fact",
};

/**
 * Entity-naming convention: define a short name on first mention, reuse thereafter.
 *   FullLegalName ("ShortName", the "Role")  e.g.  Carta Investor Services, Inc. ("Carta", the "Administrator")
 */
export function defineEntity(fullName: string, shortName: string, role: string): string {
  return `${fullName} ("${shortName}", the "${role}")`;
}

/** Hard banned moves — enforced in the prompt AND post-checked on output. */
export const BANNED = [
  // IP / first-party voice: the source corpus is Castle Hall's; Alpine output must
  // never emit the originating firm's name. Post-generation scrub is mandatory.
  "Castle Hall",
  "Castle Hall Alternatives",
  // generic AI-slop register that breaks the institutional voice
  "delve",
  "robust",
  "comprehensive",
  "in today's fast-paced",
  "it is important to note",
];

/** Post-generation guard: returns offending substrings found in generated prose. */
export function scrubViolations(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED.filter((b) => lower.indexOf(b.toLowerCase()) >= 0);
}

/**
 * The deterministic chapter-narrative scaffold. The model fills the bracketed
 * fact-woven slots; the connectors and the closing rating sentence are house-fixed.
 *   [grounded description of the control] →
 *   [comparison to best practice + recommendation, using PHRASEBOOK] →
 *   "<supports|drives> our <Color> rating for <Chapter>."
 */
export function ratingRationaleSentence(color: "Green" | "Amber" | "Red", chapter: string): string {
  const verb = color === "Red" ? "drives" : "supports";
  return `This ${verb} our ${color} rating for ${chapter}.`;
}

/** Risk / Material-Flag bullet shape: "<Category>: <specific finding>." (mined pattern). */
export function riskBullet(category: string, finding: string): string {
  return `${category}: ${finding}`;
}

/**
 * Few-shot exemplar bank entry. The corpus is chunked per chapter and tagged so the
 * generator can retrieve the nearest 2-3 real narratives as style+structure anchors.
 * LEAVE-ONE-OUT: never retrieve an exemplar from the report currently being graded.
 */
export type StyleExemplar = {
  reportId: string; // source report (for leave-one-out exclusion)
  chapterNum: number;
  strategy: string; // vc | pe | hf | credit | real_estate | secondaries | fof
  rating: "green" | "amber" | "red";
  fundType?: string; // closed_ended | open_ended | offshore | ...
  narrative: string; // the real chapter prose (exemplar)
};

/** Retrieve few-shot exemplars: same chapter, prefer same strategy+rating, exclude self. */
export function selectExemplars(
  bank: StyleExemplar[],
  opts: { chapterNum: number; strategy: string; rating: string; excludeReportId: string; k?: number },
): StyleExemplar[] {
  const k = opts.k ?? 3;
  const score = (e: StyleExemplar): number =>
    (e.chapterNum === opts.chapterNum ? 4 : 0) +
    (e.strategy === opts.strategy ? 2 : 0) +
    (e.rating === opts.rating ? 1 : 0);
  return bank
    .filter((e) => e.reportId !== opts.excludeReportId && e.chapterNum === opts.chapterNum)
    .map((e) => ({ e, s: score(e) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.e);
}
