export type Act = "Manager" | "Fund" | "Controls";

export type QuestionKind =
  | "text"
  | "textarea"
  | "choice"
  | "multi_choice"
  | "upload";

export type Question = {
  id: string;
  prompt: string;
  helper?: string;
  kind: QuestionKind;
  required?: boolean;
  choices?: string[];
  subtopic?: string;
};

export type Chapter = {
  num: number;
  numLabel: string;
  title: string;
  act: Act;
  description: string;
  questions: Question[];
};

export const FRAMEWORK_VERSION = "v2.2026.05";

export const CHAPTERS: Chapter[] = [
  // ── Chapter 01 ────────────────────────────────────────────────
  {
    num: 1,
    numLabel: "01",
    title: "Manager, Ownership & Governance",
    act: "Manager",
    description: "Management company, AUM, insider investment, ownership & succession, human resources.",
    questions: [
      // 1.1 Ownership Structure
      { id: "01-legal-name",    prompt: "Management Company name",                                                    kind: "text",     required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-affiliates",    prompt: "Management company affiliates",                                              kind: "textarea", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-primary-office",prompt: "Primary office location",                                                    kind: "text",     required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-founded",       prompt: "Date of commencement of operations",                                       kind: "textarea", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-ownership",     prompt: "List all principals or entities holding > 5% ownership, with ownership %.",  kind: "textarea", required: true, subtopic: "1.1 Ownership Structure" },
      // 1.2 Personnel & Succession
      { id: "01-departures", prompt: "Has the firm experienced any senior personnel departures in the last 24 months?",
        kind: "choice", required: true, choices: ["No departures", "One departure", "Two or more departures"],        subtopic: "1.2 Personnel & Succession" },
      { id: "01-succession",    prompt: "Describe the firm's succession plan if a founding partner becomes unavailable.", kind: "textarea", required: true, subtopic: "1.2 Personnel & Succession" },
      { id: "01-org-chart",     prompt: "Upload the current organizational chart.",                                   kind: "upload",                   subtopic: "1.2 Personnel & Succession",
        helper: "PDF preferred. Should show reporting lines and ownership." },
      // 1.3 Governance & Board Oversight
      { id: "01-board-members", prompt: "Identify the members of the Board (name, title).",                          kind: "textarea", required: true, subtopic: "1.3 Governance & Board Oversight" },
    ],
  },

  // ── Chapter 02 ────────────────────────────────────────────────
  {
    num: 2,
    numLabel: "02",
    title: "Legal, Regulatory & Compliance",
    act: "Manager",
    description: "Regulatory oversight, compliance infrastructure and policies, claims, actions, conflicts.",
    questions: [
      // 2.1 Registration & Oversight
      { id: "02-regulator",  prompt: "Primary regulator and registration number.",             kind: "text",     required: true, subtopic: "2.1 Registration & Oversight" },
      { id: "02-cco-type",   prompt: "Is there a dedicated Chief Compliance Officer?",
        kind: "choice", required: true, choices: ["Yes, dedicated CCO", "Shared / part-time CCO", "No dedicated CCO"], subtopic: "2.1 Registration & Oversight" },
      // 2.2 Compliance Program
      { id: "02-cco-name",             prompt: "Identify the firm's compliance officer",                                                   kind: "text",     required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-key-personnel",        prompt: "Previous work experience of key personnel.",                                               kind: "textarea", required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-disclosures",          prompt: "List any current or past 5-year regulatory actions, fines, or disciplinary disclosures.", kind: "textarea", required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-compliance-manual",    prompt: "Upload the current compliance manual.",                                                    kind: "upload",                   subtopic: "2.2 Compliance Program" },
    ],
  },

  // ── Chapter 03 ────────────────────────────────────────────────
  {
    num: 3,
    numLabel: "03",
    title: "Technology, Cybersecurity & Resilience",
    act: "Manager",
    description: "IT overview, cybersecurity controls, business continuity, incident response.",
    questions: [
      { id: "03-it-environment",      prompt: "Describe your IT environment (on-prem, cloud, hybrid; primary providers).",  kind: "textarea",    required: true },
      { id: "03-security-frameworks", prompt: "Which security frameworks does the firm operate under?",
        kind: "multi_choice", required: true, choices: ["SOC 2 Type II", "ISO 27001", "NIST CSF", "None"] },
      { id: "03-mfa",                 prompt: "Is multi-factor authentication enforced for all employees and systems?",
        kind: "choice", required: true, choices: ["Yes, all systems", "Some systems only", "No"] },
      { id: "03-bcp",                 prompt: "Upload the current Business Continuity Plan.",                               kind: "upload" },
    ],
  },

  // ── Chapter 04 ────────────────────────────────────────────────
  {
    num: 4,
    numLabel: "04",
    title: "Fund Structure, Terms & Alignment",
    act: "Fund",
    description: "Legal structure, key terms, fee structure, corporate governance, investment strategy.",
    questions: [
      // 4.1 Legal Structure & Domicile
      { id: "04-fund-name", prompt: "Fund Name(s)",                                               kind: "text",     required: true, subtopic: "4.1 Legal Structure & Domicile" },
      { id: "04-vehicle",   prompt: "Fund vehicle type and domicile.",                            kind: "text",     required: true, subtopic: "4.1 Legal Structure & Domicile",
        helper: "e.g. Ontario Trust + Delaware LP feeder." },
      { id: "04-lpa",       prompt: "Upload the current Offering Memorandum or LPA.",             kind: "upload",                   subtopic: "4.1 Legal Structure & Domicile" },
      // 4.2 Key Economic Terms
      { id: "04-fees",                  prompt: "Management fee percentage",                                                          kind: "textarea", required: true, subtopic: "4.2 Key Economic Terms" },
      { id: "04-fee-terms",             prompt: "Management fee and performance fee (with hurdle and carry, if applicable).",         kind: "textarea", required: true, subtopic: "4.2 Key Economic Terms" },
      { id: "04-gp-commitment",         prompt: "Total GP commitment (USD) and percentage of fund size.",                            kind: "text",     required: true, subtopic: "4.2 Key Economic Terms" },
      { id: "04-cross-class-liabilities", prompt: "Does the PPM include language regarding cross-class liabilities?",               kind: "textarea", required: true, subtopic: "4.2 Key Economic Terms" },
    ],
  },

  // ── Chapter 05 ────────────────────────────────────────────────
  {
    num: 5,
    numLabel: "05",
    title: "Service Providers & Oversight",
    act: "Fund",
    description: "Administrator, auditor, banker, custodian, prime broker — engaged and verified.",
    questions: [
      // 5.1 Fund Administration
      { id: "05-administrator",      prompt: "Fund administrator and engagement date.",                             kind: "text",     required: true, subtopic: "5.1 Fund Administration" },
      { id: "05-engagement-letters", prompt: "Upload current engagement letters from administrator and auditor.",   kind: "upload",                   subtopic: "5.1 Fund Administration" },
      // 5.2 Custodian & Prime Broker
      { id: "05-prime-broker",       prompt: "Prime broker / custodian arrangements.",                             kind: "textarea",                 subtopic: "5.2 Custodian & Prime Broker" },
      // 5.3 Auditor
      { id: "05-auditor",            prompt: "Appointed audit firm",                                               kind: "text",     required: true, subtopic: "5.3 Auditor" },
      { id: "05-auditor-opinion",    prompt: "Fund auditor and most recent audit opinion type.",                   kind: "text",     required: true, subtopic: "5.3 Auditor" },
    ],
  },

  // ── Chapter 06 ────────────────────────────────────────────────
  {
    num: 6,
    numLabel: "06",
    title: "Investment Operations & Portfolio Controls",
    act: "Controls",
    description: "Portfolio management systems, decision process, allocation, cash tracking and controls.",
    questions: [
      // 6.1 Investment Process & Approval
      { id: "06-pms",                prompt: "Portfolio management system(s) used.",                               kind: "text",     required: true, subtopic: "6.1 Investment Process & Approval" },
      { id: "06-external-allocation", prompt: "Does the fund allocate to external managers and/or internal affiliated funds?", kind: "textarea", required: true, subtopic: "6.1 Investment Process & Approval" },
      { id: "06-investment-process", prompt: "Describe the investment decision process (IC structure, voting, dissent).", kind: "textarea", required: true, subtopic: "6.1 Investment Process & Approval" },
      // 6.2 Cash & Wire Controls
      { id: "06-wire-control", prompt: "Are wire transfer approvals subject to dual-control?",
        kind: "choice", required: true, choices: ["Yes, dual-control on all wires", "Above a threshold only", "No"], subtopic: "6.2 Cash & Wire Controls" },
    ],
  },

  // ── Chapter 07 ────────────────────────────────────────────────
  {
    num: 7,
    numLabel: "07",
    title: "Valuation, Asset Existence & Reporting",
    act: "Controls",
    description: "Valuation controls, asset existence verification, investor reporting, financial controls.",
    questions: [
      // 7.1 NAV Calculation Process
      { id: "07-valuation-committee",    prompt: "Is there an independent valuation committee?",
        kind: "choice", required: true, choices: ["Yes, independent (no investment team)", "Mixed (investment + non-investment)", "No formal committee"],
        subtopic: "7.1 NAV Calculation Process" },
      { id: "07-financial-distribution", prompt: "Who distributes audited financial statements",                   kind: "textarea", required: true, subtopic: "7.1 NAV Calculation Process" },
      // 7.2 Valuation Policy
      { id: "07-pricing-sources",        prompt: "Primary pricing sources for portfolio holdings.",                kind: "textarea", required: true, subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-providers",    prompt: "Other service providers involved in valuation process?",         kind: "textarea",                 subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-members",      prompt: "Key management members",                                         kind: "textarea", required: true, subtopic: "7.2 Valuation Policy" },
      { id: "07-reporting-cadence",      prompt: "Investor reporting cadence and contents.",                       kind: "textarea", required: true, subtopic: "7.2 Valuation Policy" },
    ],
  },

  // ── Chapter 08 ────────────────────────────────────────────────
  {
    num: 8,
    numLabel: "08",
    title: "Manager Transparency & LP Communications",
    act: "Controls",
    description: "Diligence cooperation, administrator cooperation, disclosure quality.",
    questions: [
      { id: "08-disclosure-policy", prompt: "Describe your LP disclosure policy for material events.",          kind: "textarea", required: true },
      { id: "08-side-letters",      prompt: "Are any side letters in place? If yes, summarize MFN treatment.", kind: "textarea"               },
      { id: "08-investor-portal",   prompt: "Investor portal used (if any).",                                  kind: "text"                   },
    ],
  },
];

export function totalQuestions(): number {
  return CHAPTERS.reduce((acc, c) => acc + c.questions.length, 0);
}

export function chapterByNum(num: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.num === num);
}

export const ACT_COLOR: Record<Act, string> = {
  Manager: "#7B2CBF",
  Fund:    "#10B981",
  Controls:"#F59E0B",
};
