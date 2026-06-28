/**
 * Alpine ODD Call Guide — FULL typed framework (starter scaffold).
 *
 * Source of truth: `Alpine_ODD_Call_Guide` PDF (2026-06-23, "Manager Call Guide").
 * 2 acts, 8 chapters, ~901 base questions across titled sub-sections, plus a
 * strategy appendix that is a COMPUTED per-strategy view over the base questions
 * (NOT a separate bank — see `deriveStrategyAppendix`).
 *
 * Status: STARTER. The complete Chapter → Sub-section skeleton for all 8 chapters
 * is present (every sub-section title + its question count from the guide). Real
 * question text is filled in representatively per chapter to establish the metadata
 * pattern; the remaining questions are transcribed during the P0-FRAMEWORK task.
 * Search `TODO(P0-FRAMEWORK)` for the gaps.
 *
 * This file is intentionally SEPARATE from the live `framework.ts` stub so it does
 * not break the running manager portal during the migration.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ActId = "manager" | "fund";

export const ACTS: Record<ActId, { label: string; chapters: number[]; blurb: string }> = {
  manager: {
    label: "The Manager",
    chapters: [1, 2, 3],
    blurb:
      "An assessment of the institution behind the fund: who owns it, how it is governed, what regulatory and compliance posture it maintains, and how it has built its technology and resilience.",
  },
  fund: {
    label: "The Fund",
    chapters: [4, 5, 6, 7, 8],
    blurb:
      "An assessment of the vehicle and its operating discipline: how the fund is structured, who supports it, how investments are processed and reconciled, how positions are valued, and how the manager keeps investors informed.",
  },
};

/** Declared fund mandate. Drives the strategy appendix view. */
export type StrategyCode =
  | "vc"
  | "pe"
  | "hf"
  | "credit"
  | "real_estate"
  | "real_assets"
  | "secondaries"
  | "fof";

/**
 * Applicability tags. A question/sub-section is in scope only when the manager's
 * profile satisfies its `appliesWhen`. These are the parenthetical scopes the
 * guide uses inline, e.g. "(small managers)", "(Offshore Funds)", "(HF only)".
 */
export type ScopeTag =
  | "small_manager"
  | "offshore_fund"
  | "lp_llc_fund"
  | "hf"
  | "closed_ended"
  | "open_ended"
  | "private_debt"
  | "direct_lending"
  | "equity_hedge"
  | "real_estate"
  | "eu_aifmd"
  | "pre_launch"
  | "master_feeder"
  | "american_waterfall"
  | "external_managers"
  | "internal_affiliated"
  | "fund_of_funds";

export type QuestionKind =
  | "text"
  | "textarea"
  | "choice"
  | "multi_choice"
  | "upload" // "Obtain X chart" — manager provides a document
  | "screenshare"; // "view via screenshare or soft copy" — analyst-verified live

/**
 * Condition tree for `appliesWhen` and `dependsOn`. Kept deliberately small and
 * explicit (no DSL) so the applicability evaluator (P0-APPLICABILITY) is trivial
 * to unit-test.
 */
export type Condition =
  | { kind: "always" }
  | { kind: "scope"; tag: ScopeTag }
  | { kind: "strategy"; in: StrategyCode[] }
  | { kind: "answer"; questionId: string; predicate: AnswerPredicate }
  | { kind: "all"; of: Condition[] }
  | { kind: "any"; of: Condition[] };

/** Predicate over a prior answer — powers conditional follow-ups ("If >25%", "If yes"). */
export type AnswerPredicate =
  | { op: "equals"; value: string }
  | { op: "notEquals"; value: string }
  | { op: "gt"; value: number } // numeric / percentage answers
  | { op: "gte"; value: number }
  | { op: "truthy" } // any non-empty answer
  | { op: "isYes" };

export type Question = {
  /** Stable id, e.g. "01.04.20" = chapter.subsection.localNumber. Never renumber. */
  id: string;
  chapterNum: number;
  subsectionId: string; // e.g. "01.04"
  prompt: string;
  helper?: string;
  kind: QuestionKind;
  required?: boolean;
  choices?: string[];
  /** "Obtain X" / "Screenshare Y" — routes to a manager upload + SourceRef in the engine. */
  evidenceRequest?: boolean;
  /** Analyst-fill entity tokens shown as XXXX in the guide; engine fills from docs or routes to analyst. */
  placeholders?: string[];
  /** Type-scoping — question only applies when the manager profile matches. Default: always. */
  appliesWhen?: Condition;
  /** Conditional follow-up gating — only ask when a prior answer matches. */
  dependsOn?: { questionId: string; predicate: AnswerPredicate };
  /**
   * Strategies under which this question is re-surfaced in the appendix. Empty/undefined
   * means it is a core question not emphasised by any strategy view. This is what
   * `deriveStrategyAppendix` reads — the appendix is COMPUTED from these tags.
   */
  strategies?: StrategyCode[];
};

export type SubSection = {
  id: string; // "01.04"
  chapterNum: number;
  num: number; // 1-based within chapter
  title: string;
  /** Sub-section-level scope (applies to all its questions unless overridden). */
  appliesWhen?: Condition;
  questions: Question[];
};

export type Chapter = {
  num: number;
  act: ActId;
  title: string;
  /** Authoritative count from the guide cover/divider page, for transcription QA. */
  questionCount: number;
  subsectionCount: number;
  subsections: SubSection[];
};

export const FRAMEWORK_VERSION = "v3.2026.06"; // full call guide (supersedes the v2 stub)

// ─────────────────────────────────────────────────────────────────────────────
// Strategy registry (appendix). Counts are appendix re-counts (a question shared
// across N strategies counts N times); the unique base total is ~901.
// ─────────────────────────────────────────────────────────────────────────────

export const STRATEGIES: Record<
  StrategyCode,
  { code: string; label: string; appendixCount: number; blurb: string }
> = {
  vc: {
    code: "VC",
    label: "Venture Capital",
    appendixCount: 41,
    blurb:
      "Early and growth equity in privately held companies. Questions probe portfolio construction discipline, follow-on reserve management, valuation of preferred stock and SAFEs, and exit timing.",
  },
  pe: {
    code: "PE",
    label: "Private Equity",
    appendixCount: 58,
    blurb:
      "Buyout and growth equity at scale. Questions probe sponsor capability, leverage discipline, deal pipeline conversion, value creation plans, and exit benchmarking.",
  },
  hf: {
    code: "HF",
    label: "Hedge Fund",
    appendixCount: 72,
    blurb:
      "Liquid alternatives across long/short, macro, event-driven, relative value. Questions probe gross and net exposure, prime broker arrangements, short book operations, and pre-trade compliance.",
  },
  credit: {
    code: "Credit",
    label: "Credit",
    appendixCount: 24,
    blurb:
      "Direct lending, distressed, structured credit, BDCs. Questions probe origination sourcing, covenant monitoring, loan modification governance, and impairment policy.",
  },
  real_estate: {
    code: "RealEstate",
    label: "Real Estate",
    appendixCount: 2,
    blurb:
      "Equity and debt in real property. Questions probe appraisal methodology, cap rate assumptions, joint venture governance, and tenant concentration.",
  },
  real_assets: {
    code: "RealAssets",
    label: "Real Assets",
    appendixCount: 0,
    blurb:
      "Infrastructure, energy, mineral rights, natural resources. No additional strategy-specific questions are required at this time; coverage is fully addressed by the eight core chapters.",
  },
  secondaries: {
    code: "Secondaries",
    label: "Secondaries",
    appendixCount: 29,
    blurb:
      "Direct and LP secondary purchases. Questions probe pricing reference points, NAV reliance, transaction structuring, and stapled commitment governance.",
  },
  fof: {
    code: "FoF",
    label: "Fund of Funds",
    appendixCount: 66,
    blurb:
      "Allocations to underlying GPs. Questions probe underlying manager selection, ongoing monitoring, look-through valuation, and terms negotiation.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Complete sub-section skeleton (ALL 8 chapters). Titles + counts are verbatim
// from the guide. `questions: []` sub-sections are awaiting transcription.
// Representative questions are filled in for chapter 1 to establish the pattern.
// ─────────────────────────────────────────────────────────────────────────────

const sub = (
  id: string,
  chapterNum: number,
  num: number,
  title: string,
  questions: Question[] = [],
  appliesWhen?: Condition,
): SubSection => ({ id, chapterNum, num, title, questions, ...(appliesWhen ? { appliesWhen } : {}) });

export const CHAPTERS: Chapter[] = [
  // ── CH01 — Manager, Ownership and Governance · 23 sub-sections · 143 q ──────
  {
    num: 1,
    act: "manager",
    title: "Manager, Ownership and Governance",
    questionCount: 143,
    subsectionCount: 23,
    subsections: [
      sub("01.01", 1, 1, "Manager and Advisory Entities", [
        { id: "01.01.01", chapterNum: 1, subsectionId: "01.01", prompt: "Management Company name", kind: "text", required: true },
        { id: "01.01.02", chapterNum: 1, subsectionId: "01.01", prompt: "Management company affiliates", kind: "textarea", required: true },
        { id: "01.01.03", chapterNum: 1, subsectionId: "01.01", prompt: "Date of commencement of operations", kind: "text", required: true },
        { id: "01.01.04", chapterNum: 1, subsectionId: "01.01", prompt: "Has the Manager yet to commence operations?", kind: "choice", choices: ["Yes", "No"] },
        { id: "01.01.07", chapterNum: 1, subsectionId: "01.01", prompt: "Obtain a corporate structure chart for the Management Company", kind: "upload", evidenceRequest: true },
        {
          id: "01.01.09", chapterNum: 1, subsectionId: "01.01",
          prompt: "If there's external ownership, is XXX involved in the day-to-day management of the business?",
          kind: "textarea", placeholders: ["external owner"],
          dependsOn: { questionId: "01.09.52", predicate: { op: "truthy" } },
        },
      ]),
      sub("01.02", 1, 2, "Other Affiliates and Related Parties", [
        {
          id: "01.02.11", chapterNum: 1, subsectionId: "01.02",
          prompt: "We noted an affiliated broker-dealer XXXXX, does it serve in a distribution capacity related to the firm's funds or does it engage in execution services?",
          kind: "textarea", placeholders: ["affiliated broker-dealer"],
        },
      ]),
      sub("01.03", 1, 3, "Office Locations"),
      sub("01.04", 1, 4, "Assets Under Management (Firm Level)", [
        { id: "01.04.23", chapterNum: 1, subsectionId: "01.04", prompt: "What percentage of Manager capital is held by the largest external investor?", kind: "text" },
        {
          id: "01.04.24", chapterNum: 1, subsectionId: "01.04",
          prompt: "If >25%, provide details on type of investor / nature of relationship.",
          kind: "textarea",
          dependsOn: { questionId: "01.04.23", predicate: { op: "gt", value: 25 } },
        },
      ]),
      sub("01.05", 1, 5, "Fund launches and closures"),
      sub("01.06", 1, 6, "Financial Viability (small managers)", [], { kind: "scope", tag: "small_manager" }),
      sub("01.07", 1, 7, "Breakeven AUM (small managers)", [], { kind: "scope", tag: "small_manager" }),
      sub("01.08", 1, 8, "Insider Investment"),
      sub("01.09", 1, 9, "Ownership"),
      sub("01.10", 1, 10, "Change in Ownership"),
      sub("01.11", 1, 11, "Continuity and Succession"),
      sub("01.12", 1, 12, "General Staffing", [
        { id: "01.12.68", chapterNum: 1, subsectionId: "01.12", prompt: "Obtain the firm's HR organizational chart.", kind: "upload", evidenceRequest: true },
      ]),
      sub("01.13", 1, 13, "Terms and Conditions of Employment"),
      sub("01.14", 1, 14, "Employee Background Checks"),
      sub("01.15", 1, 15, "Significant Staff Turnover"),
      sub("01.16", 1, 16, "Compensation"),
      sub("01.17", 1, 17, "Back Office Key Personnel"),
      sub("01.18", 1, 18, "External Business Interests"),
      sub("01.19", 1, 19, "Other Related Party Transactions and Conflicts of Interest"),
      sub("01.20", 1, 20, "Board of Directors (Offshore Funds)", [
        { id: "01.20.113", chapterNum: 1, subsectionId: "01.20", prompt: "Obtain copies of the directors' biographies.", kind: "upload", evidenceRequest: true },
        { id: "01.20.130", chapterNum: 1, subsectionId: "01.20", prompt: "Screenshare sample board agenda.", kind: "screenshare", evidenceRequest: true },
      ], { kind: "scope", tag: "offshore_fund" }),
      sub("01.21", 1, 21, "Advisory Board / LPAC (LP / LLC funds)", [], { kind: "scope", tag: "lp_llc_fund" }),
      sub("01.22", 1, 22, "Trade Allocation"),
      sub("01.23", 1, 23, "Controls Report (ISAE 3402 / SSAE No. 16) and Internal Audit"),
    ],
  },

  // ── CH02 — Legal, Regulatory and Compliance · 18 sub-sections · 129 q ───────
  {
    num: 2,
    act: "manager",
    title: "Legal, Regulatory and Compliance",
    questionCount: 129,
    subsectionCount: 18,
    subsections: [
      sub("02.01", 2, 1, "Other Affiliates and Related Parties"),
      sub("02.02", 2, 2, "General Staffing"),
      sub("02.03", 2, 3, "Employee Background Checks"),
      sub("02.04", 2, 4, "Regulatory Oversight", [
        {
          id: "02.04.17", chapterNum: 2, subsectionId: "02.04",
          prompt: "Is the management company (or any subsidiaries or affiliates) subject to regulatory oversight by which agency?",
          kind: "multi_choice",
          choices: ["SEC", "NFA", "CFTC", "FCA", "FSA", "BaFin", "FINMA", "AMF", "OSC", "SFC", "MAS", "FSC", "Japan FSA", "APRA", "ASIC", "Other", "Not subject"],
        },
        { id: "02.04.25", chapterNum: 2, subsectionId: "02.04", prompt: "(EU) Is the Manager subject to AIFMD?", kind: "choice", choices: ["Yes", "No"], appliesWhen: { kind: "scope", tag: "eu_aifmd" } },
      ]),
      sub("02.05", 2, 5, "Compliance Officer", [
        { id: "02.05.37", chapterNum: 2, subsectionId: "02.05", prompt: "Does XXXX perform regulatory mock audits or compliance reviews?", kind: "textarea", placeholders: ["compliance consultant"] },
      ]),
      sub("02.06", 2, 6, "Compliance Manual", [
        { id: "02.06.41", chapterNum: 2, subsectionId: "02.06", prompt: "Are you able to provide the latest version of the compliance manual either in soft copy or via screenshare?", kind: "screenshare", evidenceRequest: true },
      ]),
      sub("02.07", 2, 7, "Personal Trading"),
      sub("02.08", 2, 8, "Trading Errors"),
      sub("02.09", 2, 9, "Soft Dollars", [], undefined),
      sub("02.10", 2, 10, "Expert Network Use"),
      sub("02.11", 2, 11, "Alt Data"),
      sub("02.12", 2, 12, "Anti-Money Laundering"),
      sub("02.13", 2, 13, "Claims and Actions", [
        { id: "02.13.111", chapterNum: 2, subsectionId: "02.13", prompt: "(HF only) Does the policy include an extension for Loss Mitigation Costs that could be invoked to rectify the net negative cost of any potential trade errors?", kind: "textarea", appliesWhen: { kind: "scope", tag: "hf" }, strategies: ["hf"] },
      ]),
      sub("02.14", 2, 14, "MNPI"),
      sub("02.15", 2, 15, "External Business Interests"),
      sub("02.16", 2, 16, "Other Related Party Transactions and Conflicts of Interest"),
      sub("02.17", 2, 17, "Pre-Trade Compliance"),
      sub("02.18", 2, 18, "Trade Allocation"),
    ],
  },

  // ── CH03 — Technology, Cybersecurity and Resilience · 10 sub-sections · 77 q ─
  {
    num: 3,
    act: "manager",
    title: "Technology, Cybersecurity and Resilience",
    questionCount: 77,
    subsectionCount: 10,
    subsections: [
      sub("03.01", 3, 1, "Office Locations"),
      sub("03.02", 3, 2, "IT Resources & Support"),
      sub("03.03", 3, 3, "IT Infrastructure and Security (Physical Hardware and Data)"),
      sub("03.04", 3, 4, "Cyber Security Overview", [
        { id: "03.04.25", chapterNum: 3, subsectionId: "03.04", prompt: "Does the firm follow a third-party cyber security framework like NIST, ISACA, SANS, or ISO 27K?", kind: "choice", choices: ["Yes", "No"] },
        { id: "03.04.26", chapterNum: 3, subsectionId: "03.04", prompt: "Which framework?", kind: "multi_choice", choices: ["NIST", "ISACA", "SANS", "ISO 27K", "regulator", "other"], dependsOn: { questionId: "03.04.25", predicate: { op: "isYes" } } },
      ]),
      sub("03.05", 3, 5, "Training"),
      sub("03.06", 3, 6, "Access Control", [
        { id: "03.06.40", chapterNum: 3, subsectionId: "03.06", prompt: "If the firm relies on proprietary technology, systems or processes to generate its investment returns (e.g. black box algorithm), how are such programs protected against unauthorized access or copying?", kind: "textarea", strategies: ["hf"] },
      ]),
      sub("03.07", 3, 7, "Network Security"),
      sub("03.08", 3, 8, "Disaster Recovery / Business Interruption"),
      sub("03.09", 3, 9, "Systems Overview"),
      sub("03.10", 3, 10, "Controls Report (ISAE 3402 / SSAE No. 16) and Internal Audit"),
    ],
  },

  // ── CH04 — Fund Structure, Terms and Alignment · 22 sub-sections · 164 q ────
  // FULLY TRANSCRIBED from Alpine_ODD_Call_Guide(4).pdf (questions 1–164). IDs are
  // "04.<subsection>.<globalNumber>" where globalNumber is the guide's 1–164 numbering.
  {
    num: 4,
    act: "fund",
    title: "Fund Structure, Terms and Alignment",
    questionCount: 164,
    subsectionCount: 22,
    subsections: [
      sub("04.01", 4, 1, "Managed Accounts", [
        { id: "04.01.01", chapterNum: 4, subsectionId: "04.01", prompt: "Do you advise any separately managed account structures?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.01.02", chapterNum: 4, subsectionId: "04.01", prompt: "Broadly across the firm, what is the total number of SMAs you currently advise?", kind: "text", dependsOn: { questionId: "04.01.01", predicate: { op: "isYes" } } },
        { id: "04.01.03", chapterNum: 4, subsectionId: "04.01", prompt: "Are they run pari passu to the firm's strategies?", kind: "choice", choices: ["Yes", "No"], dependsOn: { questionId: "04.01.01", predicate: { op: "isYes" } } },
        { id: "04.01.04", chapterNum: 4, subsectionId: "04.01", prompt: "Do SMAs have similar service providers as commingled products (PB / counterparty / administrator / etc.)?", kind: "textarea", dependsOn: { questionId: "04.01.01", predicate: { op: "isYes" } } },
        { id: "04.01.05", chapterNum: 4, subsectionId: "04.01", prompt: "How much in AUM do the SMAs represent?", kind: "text", dependsOn: { questionId: "04.01.01", predicate: { op: "isYes" } } },
        { id: "04.01.06", chapterNum: 4, subsectionId: "04.01", prompt: "What is the minimum ticket size you will consider for an SMA?", kind: "text", dependsOn: { questionId: "04.01.01", predicate: { op: "isYes" } } },
      ]),
      sub("04.02", 4, 2, "Advisory Contracts", [
        { id: "04.02.07", chapterNum: 4, subsectionId: "04.02", prompt: "Do you have any sub-advisory arrangements?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.02.08", chapterNum: 4, subsectionId: "04.02", prompt: "How much AUM is under sub-advisory arrangements?", kind: "text", dependsOn: { questionId: "04.02.07", predicate: { op: "isYes" } } },
      ]),
      sub("04.03", 4, 3, "Fund launches and closures", [
        { id: "04.03.09", chapterNum: 4, subsectionId: "04.03", prompt: "When?", kind: "text" },
        { id: "04.03.10", chapterNum: 4, subsectionId: "04.03", prompt: "Why did you liquidate the fund?", kind: "textarea" },
        { id: "04.03.11", chapterNum: 4, subsectionId: "04.03", prompt: "What was the AUM at disclosure?", kind: "text" },
        { id: "04.03.12", chapterNum: 4, subsectionId: "04.03", prompt: "What strategy does the fund follow / timeline for launch?", kind: "textarea" },
      ]),
      sub("04.04", 4, 4, "Insider Investment", [
        { id: "04.04.13", chapterNum: 4, subsectionId: "04.04", prompt: "Are GP commitments usually 2% of capital commitments? (Closed-Ended)", kind: "textarea", appliesWhen: { kind: "scope", tag: "closed_ended" } },
        { id: "04.04.14", chapterNum: 4, subsectionId: "04.04", prompt: "Are 100% of GP commitments funded in cash or via a reduction in management fees?", kind: "textarea" },
        { id: "04.04.15", chapterNum: 4, subsectionId: "04.04", prompt: "Have principals invested a material amount of their personal net worth alongside investors in the firm's products?", kind: "textarea" },
        { id: "04.04.16", chapterNum: 4, subsectionId: "04.04", prompt: "Does insider capital invest pari passu to external investors apart from the absence of management and incentive fees?", kind: "textarea" },
        { id: "04.04.17", chapterNum: 4, subsectionId: "04.04", prompt: "Do the principals make any personal co-investments alongside the fund's main portfolio (e.g. investments in private equity deals)?", kind: "textarea", strategies: ["vc", "pe"] },
        { id: "04.04.18", chapterNum: 4, subsectionId: "04.04", prompt: "How are assets allocated between the fund and the co-investment vehicle?", kind: "textarea", dependsOn: { questionId: "04.04.17", predicate: { op: "truthy" } } },
        { id: "04.04.19", chapterNum: 4, subsectionId: "04.04", prompt: "Who oversees the allocations?", kind: "textarea", dependsOn: { questionId: "04.04.17", predicate: { op: "truthy" } } },
      ]),
      sub("04.05", 4, 5, "Ownership", [
        { id: "04.05.20", chapterNum: 4, subsectionId: "04.05", prompt: "Confirm size of investment and product.", kind: "textarea" },
        { id: "04.05.21", chapterNum: 4, subsectionId: "04.05", prompt: "Has this investment been partially or fully redeemed?", kind: "textarea", dependsOn: { questionId: "04.05.20", predicate: { op: "truthy" } } },
        { id: "04.05.22", chapterNum: 4, subsectionId: "04.05", prompt: "If subject to a lock up, when does the lock up expire, and when could the seed investor withdraw their capital?", kind: "textarea", dependsOn: { questionId: "04.05.20", predicate: { op: "truthy" } } },
      ]),
      sub("04.06", 4, 6, "Legal Structure (Fund)", [
        { id: "04.06.23", chapterNum: 4, subsectionId: "04.06", prompt: "Obtain a copy of the Fund(s)' organizational chart.", kind: "upload", evidenceRequest: true },
        { id: "04.06.24", chapterNum: 4, subsectionId: "04.06", prompt: "Fund Name(s)?", kind: "text", required: true },
        { id: "04.06.25", chapterNum: 4, subsectionId: "04.06", prompt: "Fund domicile (place of incorporation or formation)?", kind: "text", required: true },
        { id: "04.06.26", chapterNum: 4, subsectionId: "04.06", prompt: "Fund corporate form (limited company, LLC, LLP, partnership, etc.)?", kind: "text", required: true },
        { id: "04.06.27", chapterNum: 4, subsectionId: "04.06", prompt: "Date of incorporation / formation?", kind: "text" },
        { id: "04.06.28", chapterNum: 4, subsectionId: "04.06", prompt: "Date of commencement of operations?", kind: "text" },
        { id: "04.06.29", chapterNum: 4, subsectionId: "04.06", prompt: "Trading entity name (master fund, if applicable)?", kind: "text" },
        { id: "04.06.30", chapterNum: 4, subsectionId: "04.06", prompt: "Type of fund structure (Standalone offshore / parallel onshore LP / Master-Feeder / Mini master / Other)?", kind: "textarea" },
        { id: "04.06.31", chapterNum: 4, subsectionId: "04.06", prompt: "Has the fund structure been changed since inception? Describe any restructuring or reorganization.", kind: "textarea" },
        { id: "04.06.32", chapterNum: 4, subsectionId: "04.06", prompt: "Do the fund and/or master fund have any subsidiaries or trading affiliates (i.e. SPVs)?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.06.33", chapterNum: 4, subsectionId: "04.06", prompt: "If yes, describe — Why, Who, Audit, Administrator, Date.", kind: "textarea", dependsOn: { questionId: "04.06.32", predicate: { op: "isYes" } } },
        { id: "04.06.34", chapterNum: 4, subsectionId: "04.06", prompt: "Do the fund and/or master fund engage in any inter-entity lending or other financing transactions with related parties, such as affiliates of the management company?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.06.35", chapterNum: 4, subsectionId: "04.06", prompt: "If yes, describe.", kind: "textarea", dependsOn: { questionId: "04.06.34", predicate: { op: "isYes" } } },
      ]),
      sub("04.07", 4, 7, "Stock Exchange Listing (Offshore Funds)", [
        { id: "04.07.36", chapterNum: 4, subsectionId: "04.07", prompt: "Is the fund subject to a stock exchange listing (e.g. Irish stock exchange)?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.07.37", chapterNum: 4, subsectionId: "04.07", prompt: "Has the fund ever been delisted or otherwise been subject to sanctions, complaints or unusual correspondence from the stock exchange?", kind: "textarea", dependsOn: { questionId: "04.07.36", predicate: { op: "isYes" } } },
      ], { kind: "scope", tag: "offshore_fund" }),
      sub("04.08", 4, 8, "Cross Class Liabilities", [
        { id: "04.08.38", chapterNum: 4, subsectionId: "04.08", prompt: "Discuss any existence of potential for cross class liabilities and, if any, mitigating factors (e.g. segregated cell company).", kind: "textarea" },
        { id: "04.08.39", chapterNum: 4, subsectionId: "04.08", prompt: "Does the Fund have multiple series which have different portfolio allocations?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.08.40", chapterNum: 4, subsectionId: "04.08", prompt: "Is the Fund part of an umbrella structure?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.08.41", chapterNum: 4, subsectionId: "04.08", prompt: "Is the fund a segregated cell company or similar?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.08.42", chapterNum: 4, subsectionId: "04.08", prompt: "Does the Fund's PPM include language regarding cross class liabilities?", kind: "choice", choices: ["Yes", "No"] },
      ]),
      sub("04.09", 4, 9, "AUM + Shareholder / Limited Partner Concentration", [
        { id: "04.09.43", chapterNum: 4, subsectionId: "04.09", prompt: "Q1 2022 / Q1 2023 AUM Fund and Master Fund?", kind: "textarea" },
        { id: "04.09.44", chapterNum: 4, subsectionId: "04.09", prompt: "Would you attribute the increase in AUM to positive performance, positive inflows, or a combination?", kind: "textarea" },
        { id: "04.09.45", chapterNum: 4, subsectionId: "04.09", prompt: "What is AUM of the fund currently as at (exact date)?", kind: "text" },
        { id: "04.09.46", chapterNum: 4, subsectionId: "04.09", prompt: "What is current performance of the fund year to date?", kind: "text" },
        { id: "04.09.47", chapterNum: 4, subsectionId: "04.09", prompt: "What percentage of Fund / Master Fund capital is held by the largest external investor?", kind: "text" },
        { id: "04.09.48", chapterNum: 4, subsectionId: "04.09", prompt: "If >25%, provide details on type of investors / nature of relationship.", kind: "textarea", dependsOn: { questionId: "04.09.47", predicate: { op: "gt", value: 25 } } },
        { id: "04.09.49", chapterNum: 4, subsectionId: "04.09", prompt: "What percentage of Fund / Master Fund capital is held by the top 5 largest external investors?", kind: "text" },
        { id: "04.09.50", chapterNum: 4, subsectionId: "04.09", prompt: "If >50%, provide details on type of investors / nature of relationship.", kind: "textarea", dependsOn: { questionId: "04.09.49", predicate: { op: "gt", value: 50 } } },
        { id: "04.09.51", chapterNum: 4, subsectionId: "04.09", prompt: "If a gate is in place, can the gating provision be triggered by a single investor?", kind: "textarea" },
        { id: "04.09.52", chapterNum: 4, subsectionId: "04.09", prompt: "Pro-rata vs stacked?", kind: "textarea" },
        { id: "04.09.53", chapterNum: 4, subsectionId: "04.09", prompt: "If the fund is structured as a master-feeder, do any investors invest directly in the master fund?", kind: "textarea", appliesWhen: { kind: "scope", tag: "master_feeder" } },
      ]),
      sub("04.10", 4, 10, "Administrator", [
        { id: "04.10.54", chapterNum: 4, subsectionId: "04.10", prompt: "Are fees associated with outsourced middle-back office services charged 100% to the Fund, or absorbed by the management company?", kind: "textarea" },
      ]),
      sub("04.11", 4, 11, "Share Classes", [
        { id: "04.11.55", chapterNum: 4, subsectionId: "04.11", prompt: "Obtain understanding of all different classes of shares / limited partnership interests in issue (different fees / redemption periods / currencies / other)?", kind: "textarea" },
        { id: "04.11.56", chapterNum: 4, subsectionId: "04.11", prompt: "Are there any share classes in issue that are not described in the Prospectus?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.11.57", chapterNum: 4, subsectionId: "04.11", prompt: "Does the Manager / GP have preferred liquidity through a separate share class / type of LP interest?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.11.58", chapterNum: 4, subsectionId: "04.11", prompt: "(If Master-Feeder) Do any investors invest directly in the Master Fund?", kind: "textarea", appliesWhen: { kind: "scope", tag: "master_feeder" } },
        { id: "04.11.59", chapterNum: 4, subsectionId: "04.11", prompt: "Confirm no share classes / series of interests created at the Master Fund level have better terms than the Fund.", kind: "textarea" },
        { id: "04.11.60", chapterNum: 4, subsectionId: "04.11", prompt: "Do share classes / series within the Fund have different liquidity terms?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.11.61", chapterNum: 4, subsectionId: "04.11", prompt: "Do shares / interests in the Fund have voting rights?", kind: "choice", choices: ["Yes", "No"] },
      ]),
      sub("04.12", 4, 12, "Closed-Ended Fund Terms (Contributions)", [
        { id: "04.12.62", chapterNum: 4, subsectionId: "04.12", prompt: "When is (was) the fund's initial close?", kind: "text" },
        { id: "04.12.63", chapterNum: 4, subsectionId: "04.12", prompt: "When is (was) the fund's final close?", kind: "text" },
        { id: "04.12.64", chapterNum: 4, subsectionId: "04.12", prompt: "What is the fund's target raise?", kind: "text" },
        { id: "04.12.65", chapterNum: 4, subsectionId: "04.12", prompt: "What is the GP's commitment to the fund?", kind: "text" },
        { id: "04.12.66", chapterNum: 4, subsectionId: "04.12", prompt: "What is the fund's term (legal life of the fund)?", kind: "text" },
        { id: "04.12.67", chapterNum: 4, subsectionId: "04.12", prompt: "Describe conditions on which the fund's term may be extended.", kind: "textarea" },
        { id: "04.12.68", chapterNum: 4, subsectionId: "04.12", prompt: "What is the fund's commitment period?", kind: "text" },
        { id: "04.12.69", chapterNum: 4, subsectionId: "04.12", prompt: "Describe conditions on which the fund's commitment period may be extended.", kind: "textarea" },
        { id: "04.12.70", chapterNum: 4, subsectionId: "04.12", prompt: "What is the fund's investment period (the period during which the fund is permitted to acquire new investments)?", kind: "text" },
        { id: "04.12.71", chapterNum: 4, subsectionId: "04.12", prompt: "Is recycling permitted?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.12.72", chapterNum: 4, subsectionId: "04.12", prompt: "Under what circumstances can the Manager launch a successor fund?", kind: "textarea" },
        { id: "04.12.73", chapterNum: 4, subsectionId: "04.12", prompt: "Has the firm ever made any in-kind distributions in prior vintages other than in cash?", kind: "textarea" },
      ], { kind: "scope", tag: "closed_ended" }),
      sub("04.13", 4, 13, "Subscriptions", [
        { id: "04.13.74", chapterNum: 4, subsectionId: "04.13", prompt: "Is the fund currently open, selectively open (soft close) or closed (hard closed) to new subscriptions?", kind: "textarea" },
        { id: "04.13.75", chapterNum: 4, subsectionId: "04.13", prompt: "Is there any intention to soft or hard close the fund?", kind: "textarea" },
        { id: "04.13.76", chapterNum: 4, subsectionId: "04.13", prompt: "What is the fund's capacity?", kind: "text" },
        { id: "04.13.77", chapterNum: 4, subsectionId: "04.13", prompt: "(Pre-launch) What is the Fund's target raise?", kind: "text", appliesWhen: { kind: "scope", tag: "pre_launch" } },
        { id: "04.13.78", chapterNum: 4, subsectionId: "04.13", prompt: "(Pre-launch) What is the Fund's minimum / maximum (cap) size?", kind: "text", appliesWhen: { kind: "scope", tag: "pre_launch" } },
      ]),
      sub("04.14", 4, 14, "Redemptions (Open-ended only)", [
        { id: "04.14.79", chapterNum: 4, subsectionId: "04.14", prompt: "Is a key person clause included in the offering document?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.80", chapterNum: 4, subsectionId: "04.14", prompt: "Does the key person provision waive all applicable liquidity restrictions if enacted?", kind: "textarea", dependsOn: { questionId: "04.14.79", predicate: { op: "isYes" } } },
        { id: "04.14.81", chapterNum: 4, subsectionId: "04.14", prompt: "If there are parallel (onshore / offshore) funds, is the key person clause consistent across all products?", kind: "textarea" },
        { id: "04.14.82", chapterNum: 4, subsectionId: "04.14", prompt: "Does the other feeder and any other product(s) or account(s) investing in this strategy have identical liquidity terms?", kind: "textarea" },
        { id: "04.14.83", chapterNum: 4, subsectionId: "04.14", prompt: "Has the fund ever permitted investors special dealing dates to allow investors to redeem their investments?", kind: "textarea" },
        { id: "04.14.84", chapterNum: 4, subsectionId: "04.14", prompt: "Identify restrictions to redemption provisions: Lock up provision?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.85", chapterNum: 4, subsectionId: "04.14", prompt: "Is the hard lockup provision greater than one year?", kind: "choice", choices: ["Yes", "No"], dependsOn: { questionId: "04.14.84", predicate: { op: "isYes" } } },
        { id: "04.14.86", chapterNum: 4, subsectionId: "04.14", prompt: "Early redemption penalty?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.87", chapterNum: 4, subsectionId: "04.14", prompt: "Is this charged in all / some / no instances?", kind: "textarea", dependsOn: { questionId: "04.14.86", predicate: { op: "isYes" } } },
        { id: "04.14.88", chapterNum: 4, subsectionId: "04.14", prompt: "Is the redemption penalty paid to the manager or retained by the fund?", kind: "textarea", dependsOn: { questionId: "04.14.86", predicate: { op: "isYes" } } },
        { id: "04.14.89", chapterNum: 4, subsectionId: "04.14", prompt: "Redemption gate or any similar provision?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.90", chapterNum: 4, subsectionId: "04.14", prompt: "Has the redemption gate ever been imposed?", kind: "choice", choices: ["Yes", "No"], dependsOn: { questionId: "04.14.89", predicate: { op: "isYes" } } },
        { id: "04.14.91", chapterNum: 4, subsectionId: "04.14", prompt: "Does the gating provision have a stacked or level structure?", kind: "textarea", dependsOn: { questionId: "04.14.89", predicate: { op: "isYes" } } },
        { id: "04.14.92", chapterNum: 4, subsectionId: "04.14", prompt: "(If applicable) Can the Master Fund level gate be triggered even if one of the underlying feeder funds has not individually exceeded the gating threshold?", kind: "textarea", appliesWhen: { kind: "scope", tag: "master_feeder" } },
        { id: "04.14.93", chapterNum: 4, subsectionId: "04.14", prompt: "Is there a limit on the number of times the gate can be imposed (sunset / clean up provision) before redemption proceeds will be paid in full?", kind: "textarea", dependsOn: { questionId: "04.14.89", predicate: { op: "isYes" } } },
        { id: "04.14.94", chapterNum: 4, subsectionId: "04.14", prompt: "Note per the offering document reserves for contingent and other liabilities?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.95", chapterNum: 4, subsectionId: "04.14", prompt: "Has / will the reserve for contingent and other liabilities be implemented?", kind: "textarea", dependsOn: { questionId: "04.14.94", predicate: { op: "isYes" } } },
        { id: "04.14.96", chapterNum: 4, subsectionId: "04.14", prompt: "Hold back of redemption proceeds (e.g. paid following the completion of the fund's annual audit)?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.97", chapterNum: 4, subsectionId: "04.14", prompt: "Is the audit holdback greater than 5%?", kind: "choice", choices: ["Yes", "No"], dependsOn: { questionId: "04.14.96", predicate: { op: "isYes" } } },
        { id: "04.14.98", chapterNum: 4, subsectionId: "04.14", prompt: "What percentage is applied in practice (if different from disclosed)?", kind: "text", dependsOn: { questionId: "04.14.96", predicate: { op: "isYes" } } },
        { id: "04.14.99", chapterNum: 4, subsectionId: "04.14", prompt: "Is this percentage imposed to redeeming investors under all circumstances?", kind: "textarea", dependsOn: { questionId: "04.14.96", predicate: { op: "isYes" } } },
        { id: "04.14.100", chapterNum: 4, subsectionId: "04.14", prompt: "Possibility to create a liquidating account / trust?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.14.101", chapterNum: 4, subsectionId: "04.14", prompt: "Has such an account been implemented?", kind: "choice", choices: ["Yes", "No"], dependsOn: { questionId: "04.14.100", predicate: { op: "isYes" } } },
        { id: "04.14.102", chapterNum: 4, subsectionId: "04.14", prompt: "Is it the Manager's intention to use such an account?", kind: "textarea", dependsOn: { questionId: "04.14.100", predicate: { op: "isYes" } } },
        { id: "04.14.103", chapterNum: 4, subsectionId: "04.14", prompt: "Has the fund (or any other products) ever paid any redemption in kind (securities rather than cash)?", kind: "textarea" },
        { id: "04.14.104", chapterNum: 4, subsectionId: "04.14", prompt: "Has the fund (or any other products) ever suspended redemptions or calculation of the NAV?", kind: "textarea" },
        { id: "04.14.105", chapterNum: 4, subsectionId: "04.14", prompt: "Has the fund (or any other products) ever performed an involuntary return of capital?", kind: "textarea" },
      ], { kind: "scope", tag: "open_ended" }),
      sub("04.15", 4, 15, "Closed-Ended Redemption Terms", [
        { id: "04.15.106", chapterNum: 4, subsectionId: "04.15", prompt: "Does the Fund have a claw back provision? (American waterfall)", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.15.107", chapterNum: 4, subsectionId: "04.15", prompt: "Is the claw back provision guaranteed by the GP on a joint or several basis?", kind: "textarea", dependsOn: { questionId: "04.15.106", predicate: { op: "isYes" } } },
        { id: "04.15.108", chapterNum: 4, subsectionId: "04.15", prompt: "Was there any carry claw back situations in any of the firm's earlier vintages / prior funds?", kind: "textarea" },
      ], { kind: "scope", tag: "closed_ended" }),
      sub("04.16", 4, 16, "Side Pocket Terms", [
        { id: "04.16.109", chapterNum: 4, subsectionId: "04.16", prompt: "Does the offering documentation allow for the creation of side pocket / designated investments?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.16.110", chapterNum: 4, subsectionId: "04.16", prompt: "Are side pockets created at the time of investment or subsequent to acquisition?", kind: "textarea", dependsOn: { questionId: "04.16.109", predicate: { op: "isYes" } } },
        { id: "04.16.111", chapterNum: 4, subsectionId: "04.16", prompt: "Is a performance fee charged on unrealized appreciation or only on realization of the side pocket investment?", kind: "textarea", dependsOn: { questionId: "04.16.109", predicate: { op: "isYes" } } },
        { id: "04.16.112", chapterNum: 4, subsectionId: "04.16", prompt: "Does the offering documentation limit the maximum amount of fund capital that can be allocated to side pockets?", kind: "textarea", dependsOn: { questionId: "04.16.109", predicate: { op: "isYes" } } },
        { id: "04.16.113", chapterNum: 4, subsectionId: "04.16", prompt: "Does the offering documentation provide the ability for shareholders/LPs to opt out of side pocket investments?", kind: "textarea", dependsOn: { questionId: "04.16.109", predicate: { op: "isYes" } } },
      ]),
      sub("04.17", 4, 17, "Side Letters", [
        { id: "04.17.114", chapterNum: 4, subsectionId: "04.17", prompt: "So no side letters related to enhanced transparency, preferential liquidity or reduced fees?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.17.115", chapterNum: 4, subsectionId: "04.17", prompt: "If side letters include alternate liquidity provisions, what percentage of fund capital is covered by such side letter provisions?", kind: "text", dependsOn: { questionId: "04.17.114", predicate: { op: "truthy" } } },
      ]),
      sub("04.18", 4, 18, "Management and Incentive Fee", [
        { id: "04.18.116", chapterNum: 4, subsectionId: "04.18", prompt: "What is the management fee percentage charged to the funds?", kind: "text", required: true },
        { id: "04.18.117", chapterNum: 4, subsectionId: "04.18", prompt: "What is the incentive fee / allocation charged to the funds?", kind: "text", required: true },
        { id: "04.18.118", chapterNum: 4, subsectionId: "04.18", prompt: "What is the incentive fee / allocation crystallization period (annual / semi / quarterly / monthly / other)?", kind: "textarea" },
        { id: "04.18.119", chapterNum: 4, subsectionId: "04.18", prompt: "Identify any modifications to the high-water mark. Discuss rationale for unusual modifications.", kind: "textarea" },
      ]),
      sub("04.19", 4, 19, "Management Fee and Distribution Waterfall (Closed-Ended)", [
        { id: "04.19.120", chapterNum: 4, subsectionId: "04.19", prompt: "Please confirm whether the Fund's Prospectus allows for the use of placement agents.", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.19.121", chapterNum: 4, subsectionId: "04.19", prompt: "Can you confirm whether placement agents are used in practice?", kind: "textarea" },
        { id: "04.19.122", chapterNum: 4, subsectionId: "04.19", prompt: "Who pays them?", kind: "textarea", dependsOn: { questionId: "04.19.120", predicate: { op: "isYes" } } },
        { id: "04.19.123", chapterNum: 4, subsectionId: "04.19", prompt: "What is the management fee percentage charged to the funds?", kind: "text" },
        { id: "04.19.124", chapterNum: 4, subsectionId: "04.19", prompt: "Is the management fee charged on called or committed capital?", kind: "textarea" },
        { id: "04.19.125", chapterNum: 4, subsectionId: "04.19", prompt: "What is the fund's carried interest?", kind: "text" },
        { id: "04.19.126", chapterNum: 4, subsectionId: "04.19", prompt: "What is the fund's preferred return (\"hurdle\")?", kind: "text" },
        { id: "04.19.127", chapterNum: 4, subsectionId: "04.19", prompt: "Describe the fund's waterfall / distribution.", kind: "textarea" },
        { id: "04.19.128", chapterNum: 4, subsectionId: "04.19", prompt: "Does the fund have an American or European style distribution waterfall?", kind: "textarea" },
        { id: "04.19.129", chapterNum: 4, subsectionId: "04.19", prompt: "Describe the fund's 1st distribution (typically a return of capital to investors).", kind: "textarea" },
        { id: "04.19.130", chapterNum: 4, subsectionId: "04.19", prompt: "Describe the fund's 2nd distribution (typically a priority return to investors).", kind: "textarea" },
        { id: "04.19.131", chapterNum: 4, subsectionId: "04.19", prompt: "Describe the fund's 3rd distribution (typically a GP catch-up).", kind: "textarea" },
        { id: "04.19.132", chapterNum: 4, subsectionId: "04.19", prompt: "Describe the fund's 4th distribution (typically a split between the fund and manager).", kind: "textarea" },
        { id: "04.19.133", chapterNum: 4, subsectionId: "04.19", prompt: "Describe any deviations from the typical distribution waterfall outlined above.", kind: "textarea" },
        { id: "04.19.134", chapterNum: 4, subsectionId: "04.19", prompt: "Discuss the fund's claw back / look back terms.", kind: "textarea" },
        { id: "04.19.135", chapterNum: 4, subsectionId: "04.19", prompt: "Does the GP maintain sufficient reserves (i.e. minimum 30% of carry payments) in escrow to cover potential claw back liabilities?", kind: "textarea" },
      ], { kind: "scope", tag: "closed_ended" }),
      sub("04.20", 4, 20, "Other Fees and Expenses", [
        { id: "04.20.136", chapterNum: 4, subsectionId: "04.20", prompt: "Investment Research and data expenses (data feeds, consultants, publications, etc.) — charged to fund or absorbed by firm?", kind: "textarea" },
        { id: "04.20.137", chapterNum: 4, subsectionId: "04.20", prompt: "Research related travel fees — charged or absorbed?", kind: "textarea" },
        { id: "04.20.138", chapterNum: 4, subsectionId: "04.20", prompt: "Do research-related travel fees relate to specific positions or general attendance of industry conferences?", kind: "textarea" },
        { id: "04.20.139", chapterNum: 4, subsectionId: "04.20", prompt: "System expenses (including accounting and proprietary systems) — charged or absorbed?", kind: "textarea" },
        { id: "04.20.140", chapterNum: 4, subsectionId: "04.20", prompt: "Compliance consulting costs — charged or absorbed?", kind: "textarea" },
        { id: "04.20.141", chapterNum: 4, subsectionId: "04.20", prompt: "Deal origination expenses — charged or absorbed?", kind: "textarea" },
        { id: "04.20.142", chapterNum: 4, subsectionId: "04.20", prompt: "Describe management company overhead costs charged to the fund (Salaries / Back office expenses / Rent / Wholly owned service providers).", kind: "textarea" },
        { id: "04.20.143", chapterNum: 4, subsectionId: "04.20", prompt: "If the Manager has a wholly owned service provider, are funds charged the market rate?", kind: "textarea" },
        { id: "04.20.144", chapterNum: 4, subsectionId: "04.20", prompt: "(American waterfall) Could you confirm whether the firm has signed guarantees or maintains sufficient reserves in escrow to cover any potential claw back liabilities?", kind: "textarea", appliesWhen: { kind: "scope", tag: "american_waterfall" } },
        { id: "04.20.145", chapterNum: 4, subsectionId: "04.20", prompt: "If so, what proportion of carry payments is the escrow?", kind: "text", dependsOn: { questionId: "04.20.144", predicate: { op: "truthy" } } },
        { id: "04.20.146", chapterNum: 4, subsectionId: "04.20", prompt: "(Closed-Ended) Due diligence of specific investment opportunities (consummated and unconsummated deals) — charged or absorbed?", kind: "textarea", appliesWhen: { kind: "scope", tag: "closed_ended" } },
        { id: "04.20.147", chapterNum: 4, subsectionId: "04.20", prompt: "Has the fund established an expense cap for items charged to the fund?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.20.148", chapterNum: 4, subsectionId: "04.20", prompt: "Is it formalized in the offering document?", kind: "textarea", dependsOn: { questionId: "04.20.147", predicate: { op: "isYes" } } },
        { id: "04.20.149", chapterNum: 4, subsectionId: "04.20", prompt: "Has the fund ever exceeded the expense cap?", kind: "choice", choices: ["Yes", "No"], dependsOn: { questionId: "04.20.147", predicate: { op: "isYes" } } },
        { id: "04.20.150", chapterNum: 4, subsectionId: "04.20", prompt: "If yes, what were the consequences?", kind: "textarea", dependsOn: { questionId: "04.20.149", predicate: { op: "isYes" } } },
        { id: "04.20.151", chapterNum: 4, subsectionId: "04.20", prompt: "Does the Fund or Manager charge \"monitoring\" fees?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.20.152", chapterNum: 4, subsectionId: "04.20", prompt: "If so, is acceleration of monitoring fees permitted?", kind: "textarea", dependsOn: { questionId: "04.20.151", predicate: { op: "isYes" } } },
        { id: "04.20.153", chapterNum: 4, subsectionId: "04.20", prompt: "Please confirm whether the Manager's expense allocation practices have changed over the past twelve months.", kind: "textarea" },
        { id: "04.20.154", chapterNum: 4, subsectionId: "04.20", prompt: "Does any aspect of the fund's strategy generate additional revenues or fees for the management company, its associates, affiliates or related parties (e.g. origination fees for loan, breakup fees, etc.)?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.20.155", chapterNum: 4, subsectionId: "04.20", prompt: "Are such revenues remitted to the Fund or the management company?", kind: "textarea", dependsOn: { questionId: "04.20.154", predicate: { op: "isYes" } } },
        { id: "04.20.156", chapterNum: 4, subsectionId: "04.20", prompt: "Confirm type of additional revenues or fees: Monitoring fees / Advisory fees / Broken deal fees / Directors fees / Consulting expenses of operating partners / Closing / recap fees.", kind: "textarea", dependsOn: { questionId: "04.20.154", predicate: { op: "isYes" } } },
        { id: "04.20.157", chapterNum: 4, subsectionId: "04.20", prompt: "Does the Fund have a management fee offset provision?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.20.158", chapterNum: 4, subsectionId: "04.20", prompt: "Does the management fee offset provision encompass all additional revenue items paid to the management company, its affiliates or related parties (focusing on the acceleration of monitoring fees upon termination of consulting agreement with portfolio company)?", kind: "textarea", dependsOn: { questionId: "04.20.157", predicate: { op: "isYes" } } },
        { id: "04.20.159", chapterNum: 4, subsectionId: "04.20", prompt: "What is the Fund's non-investment related expense ratio? (current year / previous year)", kind: "text" },
        { id: "04.20.160", chapterNum: 4, subsectionId: "04.20", prompt: "Does the Fund's expense ratio for the most recent year exceed 50 basis points?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.20.161", chapterNum: 4, subsectionId: "04.20", prompt: "Has the expense ratio increased from the prior year?", kind: "choice", choices: ["Yes", "No"] },
        { id: "04.20.162", chapterNum: 4, subsectionId: "04.20", prompt: "Do \"other\" operating expenses excluding audit and administration fees charged to the Fund exceed $2 million?", kind: "choice", choices: ["Yes", "No"] },
      ]),
      sub("04.21", 4, 21, "Investments in Other Funds (FoF / Internal Affiliated)", [
        { id: "04.21.163", chapterNum: 4, subsectionId: "04.21", prompt: "Are fees rebated to avoid double counting of management or performance fees?", kind: "textarea", appliesWhen: { kind: "scope", tag: "internal_affiliated" } },
      ]),
      sub("04.22", 4, 22, "Fund of Fund Portfolios", [
        { id: "04.22.164", chapterNum: 4, subsectionId: "04.22", prompt: "If yes, are fees rebated to the fund for that investment (no double dipping)?", kind: "textarea" },
      ], { kind: "scope", tag: "fund_of_funds" }),
    ],
  },

  // ── CH05 — Service Providers and Oversight · 14 sub-sections · 54 q ─────────
  {
    num: 5,
    act: "fund",
    title: "Service Providers and Oversight",
    questionCount: 54,
    subsectionCount: 14,
    subsections: [
      sub("05.01", 5, 1, "Administrator", [
        { id: "05.01.01", chapterNum: 5, subsectionId: "05.01", prompt: "Identify the appointed administrator.", kind: "text", required: true },
        { id: "05.01.16", chapterNum: 5, subsectionId: "05.01", prompt: "Are we able to view the Admin agreement either in soft copy or via screenshare?", kind: "screenshare", evidenceRequest: true },
      ]),
      sub("05.02", 5, 2, "Auditor"),
      sub("05.03", 5, 3, "Custodied Assets"),
      sub("05.04", 5, 4, "Non-Custodied Assets"),
      sub("05.05", 5, 5, "Cash Controls / Asset Transfer"),
      sub("05.06", 5, 6, "Systems Overview"),
      sub("05.07", 5, 7, "Valuation Committee"),
      sub("05.08", 5, 8, "Broker Quotes"),
      sub("05.09", 5, 9, "Private Securities / Fair Valuation Techniques"),
      sub("05.10", 5, 10, "Auditor (Valuation procedures)"),
      sub("05.11", 5, 11, "NAV Accounting and Final NAV (HF)", [], { kind: "scope", tag: "hf" }),
      sub("05.12", 5, 12, "NAV Accounting (Closed-Ended)", [], { kind: "scope", tag: "closed_ended" }),
      sub("05.13", 5, 13, "Audit and Audit Opinion"),
      sub("05.14", 5, 14, "Process Controls (ODD)", [], { kind: "strategy", in: ["secondaries", "fof"] }),
    ],
  },

  // ── CH06 — Investment Operations and Controls · 26 sub-sections · 232 q ─────
  {
    num: 6,
    act: "fund",
    title: "Investment Operations and Controls",
    questionCount: 232,
    subsectionCount: 26,
    subsections: [
      sub("06.01", 6, 1, "Trading Errors"),
      sub("06.02", 6, 2, "Investment Strategy Overview", [
        { id: "06.02.13", chapterNum: 6, subsectionId: "06.02", prompt: "(Equity hedge strategies only) Provide a breakdown of the portfolio's long / short, gross / net exposure as of the most recent quarter end.", kind: "textarea", appliesWhen: { kind: "scope", tag: "equity_hedge" }, strategies: ["hf"] },
      ]),
      sub("06.03", 6, 3, "Liquidity"),
      sub("06.04", 6, 4, "Side Pocket Investments"),
      sub("06.05", 6, 5, "Investments in Other Funds (FoF / Internal Affiliated)"),
      sub("06.06", 6, 6, "Fund of Fund Portfolios", [], { kind: "scope", tag: "fund_of_funds" }),
      sub("06.07", 6, 7, "Private Equity (Investment Strategy)", [], { kind: "strategy", in: ["pe", "vc"] }),
      sub("06.08", 6, 8, "Custodied Assets", [
        { id: "06.08.55", chapterNum: 6, subsectionId: "06.08", prompt: "(Private Debt Strategy) Are 100% of the loans held directly in the name of the Fund (Master Fund)?", kind: "choice", choices: ["Yes", "No"], appliesWhen: { kind: "scope", tag: "private_debt" }, strategies: ["credit"] },
      ]),
      sub("06.09", 6, 9, "Non-Custodied Assets"),
      sub("06.10", 6, 10, "Lines of Credit"),
      sub("06.11", 6, 11, "ISDA"),
      sub("06.12", 6, 12, "Counterparty Risk Management"),
      sub("06.13", 6, 13, "Treasury and Cash Management / Asset Transfers"),
      sub("06.14", 6, 14, "Cash Controls / Asset Transfer"),
      sub("06.15", 6, 15, "Systems Overview"),
      sub("06.16", 6, 16, "Trading Volume"),
      sub("06.17", 6, 17, "Trading Execution"),
      sub("06.18", 6, 18, "Order Management"),
      sub("06.19", 6, 19, "Front Office Confirmation"),
      sub("06.20", 6, 20, "Back Office Trade Confirmation"),
      sub("06.21", 6, 21, "Fund of Fund / Commingled Vehicle Trade Execution", [], { kind: "scope", tag: "fund_of_funds" }),
      sub("06.22", 6, 22, "Private Equity Deal Execution", [], { kind: "strategy", in: ["pe", "vc"] }),
      sub("06.23", 6, 23, "Portfolio Reconciliation (HF)", [], { kind: "scope", tag: "hf" }),
      sub("06.24", 6, 24, "Trade Allocation"),
      sub("06.25", 6, 25, "Operational Due Diligence (Secondaries / FoFs) — ODD Team", [], { kind: "strategy", in: ["secondaries", "fof"] }),
      sub("06.26", 6, 26, "Process Controls (ODD)", [], { kind: "strategy", in: ["secondaries", "fof"] }),
    ],
  },

  // ── CH07 — Valuation and Investor Reporting · 14 sub-sections · 88 q ────────
  {
    num: 7,
    act: "fund",
    title: "Valuation and Investor Reporting",
    questionCount: 88,
    subsectionCount: 14,
    subsections: [
      sub("07.01", 7, 1, "Valuation Overview", [
        { id: "07.01.01", chapterNum: 7, subsectionId: "07.01", prompt: "Indicate the approximate percentage of portfolio NAV exposed to different methods if valuation policies vary dependent on security type (front office >5% = FLAG).", kind: "textarea" },
      ]),
      sub("07.02", 7, 2, "Valuation Policy"),
      sub("07.03", 7, 3, "Valuation Committee"),
      sub("07.04", 7, 4, "Valuation Source Breakdown"),
      sub("07.05", 7, 5, "Pricing Services and Feeds"),
      sub("07.06", 7, 6, "Broker Quotes"),
      sub("07.07", 7, 7, "Pricing Models"),
      sub("07.08", 7, 8, "Private Securities / Fair Valuation Techniques", [
        { id: "07.08.48", chapterNum: 7, subsectionId: "07.08", prompt: "(Real estate) Do the valuation agents visit the real estate properties as part of their pricing process (validate asset existence)?", kind: "choice", choices: ["Yes", "No"], appliesWhen: { kind: "scope", tag: "real_estate" }, strategies: ["real_estate"] },
      ]),
      sub("07.09", 7, 9, "Other Pricing Controls"),
      sub("07.10", 7, 10, "Fund of Fund Pricing Controls", [], { kind: "scope", tag: "fund_of_funds" }),
      sub("07.11", 7, 11, "Estimated NAV (HF)", [], { kind: "scope", tag: "hf" }),
      sub("07.12", 7, 12, "NAV Accounting and Final NAV (HF)", [], { kind: "scope", tag: "hf" }),
      sub("07.13", 7, 13, "NAV Accounting (Closed-Ended)", [], { kind: "scope", tag: "closed_ended" }),
      sub("07.14", 7, 14, "Audit and Audit Opinion"),
    ],
  },

  // ── CH08 — Manager Transparency and LP Communications · 9 sub-sections · 14 q
  {
    num: 8,
    act: "fund",
    title: "Manager Transparency and LP Communications",
    questionCount: 14,
    subsectionCount: 9,
    subsections: [
      sub("08.01", 8, 1, "Side Letters"),
      sub("08.02", 8, 2, "Other Fees and Expenses"),
      sub("08.03", 8, 3, "Fund launches and closures"),
      sub("08.04", 8, 4, "Regulatory Oversight"),
      sub("08.05", 8, 5, "Anti-Money Laundering"),
      sub("08.06", 8, 6, "Estimated NAV (HF)", [], { kind: "scope", tag: "hf" }),
      sub("08.07", 8, 7, "NAV Accounting and Final NAV (HF)", [], { kind: "scope", tag: "hf" }),
      sub("08.08", 8, 8, "NAV Accounting (Closed-Ended)", [], { kind: "scope", tag: "closed_ended" }),
      sub("08.09", 8, 9, "Audit and Audit Opinion"),
    ],
  },
];

// TODO(P0-FRAMEWORK): transcribe the remaining ~840 questions from the PDF into the
// `questions: []` sub-sections above. Each chapter divider page states the
// authoritative count (see `Chapter.questionCount`) — use it as a transcription
// checksum. Strategy appendix pages (51-69) are the cross-reference for which
// questions carry which `strategies` tag.

// ─────────────────────────────────────────────────────────────────────────────
// Verification Procedures — referenced in the guide (Ch01 q131, Ch05 q52) as
// "Verification procedures included at the end of this guide?" but NOT present in
// the 2026-06-23 PDF (the document ends with the FoF appendix, page 69).
// Seeds the report's Scope & Verification section + the E4 regulator cross-checks.
// ─────────────────────────────────────────────────────────────────────────────

export type VerificationStep = {
  id: string;
  item: string; // what is independently verified
  method: string; // how (regulator pull, administrator confirmation, document inspection)
  sourceKind: "regulator" | "administrator" | "auditor" | "document" | "counterparty";
};

/** STUB — awaiting the verification-procedures section from the analyst. */
export const VERIFICATION_PROCEDURES: VerificationStep[] = [
  // TODO(P0-FRAMEWORK): obtain the verification-procedures appendix from the analyst
  // and populate. Expected items (inferred from the guide's evidence-request prompts):
  // - Regulator registration & disclosures (SEC IAPD/Form ADV, FCA register …) → E4
  // - Administrator appointment & service scope (Admin agreement)
  // - Auditor appointment (audited financial statements, audit opinion)
  // - Asset existence (custodian confirmations / administrator existence testing)
  // - Board / director independence (director biographies)
];

// ─────────────────────────────────────────────────────────────────────────────
// Derived views
// ─────────────────────────────────────────────────────────────────────────────

/** Flat list of every question across all chapters. */
export function allQuestions(): Question[] {
  return CHAPTERS.flatMap((c) => c.subsections.flatMap((s) => s.questions));
}

/**
 * The strategy appendix is COMPUTED, not stored: the per-strategy view is the set
 * of questions tagged for that strategy, grouped by chapter → sub-section, exactly
 * as the guide's appendix renders them. (Real Assets returns [] — "fully addressed
 * by the eight core chapters".)
 */
export function deriveStrategyAppendix(strategy: StrategyCode): Question[] {
  return allQuestions().filter((q) => q.strategies?.includes(strategy));
}

/** Manager profile that drives applicability (type-scoping). */
export type ManagerProfile = {
  strategy: StrategyCode;
  scopes: Set<ScopeTag>;
};

/**
 * Evaluate a condition against a manager profile + prior answers. This is the core
 * of the P0-APPLICABILITY task: prune inapplicable branches BEFORE extraction so a
 * given manager only sees their applicable subset (tractable readiness flow + cost).
 */
export function evalCondition(
  cond: Condition | undefined,
  profile: ManagerProfile,
  answers: Record<string, string>,
): boolean {
  if (!cond) return true;
  switch (cond.kind) {
    case "always":
      return true;
    case "scope":
      return profile.scopes.has(cond.tag);
    case "strategy":
      return cond.in.includes(profile.strategy);
    case "answer":
      return matchPredicate(answers[cond.questionId], cond.predicate);
    case "all":
      return cond.of.every((c) => evalCondition(c, profile, answers));
    case "any":
      return cond.of.some((c) => evalCondition(c, profile, answers));
  }
}

function matchPredicate(raw: string | undefined, p: AnswerPredicate): boolean {
  const v = raw?.trim() ?? "";
  switch (p.op) {
    case "truthy":
      return v.length > 0;
    case "isYes":
      return /^yes/i.test(v);
    case "equals":
      return v === p.value;
    case "notEquals":
      return v !== p.value;
    case "gt":
      return parseFloat(v) > p.value;
    case "gte":
      return parseFloat(v) >= p.value;
  }
}

/** The applicable question set for a given manager (core chapters, scoped + pruned). */
export function applicableQuestions(
  profile: ManagerProfile,
  answers: Record<string, string> = {},
): Question[] {
  const out: Question[] = [];
  for (const chapter of CHAPTERS) {
    for (const s of chapter.subsections) {
      if (!evalCondition(s.appliesWhen, profile, answers)) continue;
      for (const q of s.questions) {
        if (!evalCondition(q.appliesWhen, profile, answers)) continue;
        if (q.dependsOn && !matchPredicate(answers[q.dependsOn.questionId], q.dependsOn.predicate)) continue;
        out.push(q);
      }
    }
  }
  return out;
}
