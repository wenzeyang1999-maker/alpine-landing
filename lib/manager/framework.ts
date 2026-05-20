// Alpine Manager Portal — DDQ framework definition
// Mirrors the 8-chapter structure used on the LP-side (Framework.tsx).
// Each question is intentionally concise; in production these come from a
// strategy-aware question generator. Sample questions here are representative
// of what a real DDQ would contain.

export type Act = "Manager" | "Fund" | "Controls";

export type QuestionKind =
  | "text" // single-line text input
  | "textarea" // multi-line text
  | "choice" // single-select radio
  | "multi_choice" // multi-select checkboxes
  | "upload"; // document upload

export type Question = {
  id: string;
  prompt: string;
  helper?: string;
  kind: QuestionKind;
  required?: boolean;
  choices?: string[];
};

export type Chapter = {
  num: number;
  numLabel: string; // "01" … "08"
  title: string;
  act: Act;
  description: string;
  questions: Question[];
};

export const FRAMEWORK_VERSION = "v1.2026.05";

export const CHAPTERS: Chapter[] = [
  {
    num: 1,
    numLabel: "01",
    title: "Manager, Ownership & Governance",
    act: "Manager",
    description:
      "Management company, AUM, insider investment, ownership & succession, human resources.",
    questions: [
      {
        id: "01-legal-name",
        prompt: "What is the legal name of the management company?",
        kind: "text",
        required: true,
      },
      {
        id: "01-founded",
        prompt: "When was the firm founded?",
        helper: "Year and month (e.g. June 2018).",
        kind: "text",
        required: true,
      },
      {
        id: "01-ownership",
        prompt:
          "List all principals or entities holding > 5% ownership of the management company, with ownership %.",
        kind: "textarea",
        required: true,
      },
      {
        id: "01-key-person-departures",
        prompt:
          "Has the firm experienced any senior personnel departures in the last 24 months?",
        kind: "choice",
        choices: ["No departures", "One departure", "Two or more departures"],
        required: true,
      },
      {
        id: "01-succession",
        prompt:
          "Describe the firm's succession plan if a founding partner becomes unavailable.",
        kind: "textarea",
        required: true,
      },
      {
        id: "01-org-chart",
        prompt: "Upload the current organizational chart.",
        helper: "PDF preferred. Should show reporting lines and ownership.",
        kind: "upload",
      },
    ],
  },
  {
    num: 2,
    numLabel: "02",
    title: "Legal, Regulatory & Compliance",
    act: "Manager",
    description:
      "Regulatory oversight, compliance infrastructure and policies, claims, actions, conflicts.",
    questions: [
      {
        id: "02-regulator",
        prompt: "Primary regulator and registration number.",
        kind: "text",
        required: true,
      },
      {
        id: "02-cco",
        prompt: "Is there a dedicated Chief Compliance Officer?",
        kind: "choice",
        choices: ["Yes, dedicated CCO", "Shared / part-time CCO", "No dedicated CCO"],
        required: true,
      },
      {
        id: "02-disclosures",
        prompt:
          "List any current or past 5-year regulatory actions, fines, or disciplinary disclosures (Form ADV Part 2).",
        kind: "textarea",
        required: true,
      },
      {
        id: "02-compliance-manual",
        prompt: "Upload the current compliance manual.",
        kind: "upload",
      },
    ],
  },
  {
    num: 3,
    numLabel: "03",
    title: "Technology, Cybersecurity & Resilience",
    act: "Manager",
    description:
      "IT overview, cybersecurity controls, business continuity, incident response.",
    questions: [
      {
        id: "03-it-overview",
        prompt: "Describe your IT environment (on-prem, cloud, hybrid; primary providers).",
        kind: "textarea",
        required: true,
      },
      {
        id: "03-security-frameworks",
        prompt: "Which security frameworks does the firm operate under?",
        kind: "multi_choice",
        choices: ["SOC 2 Type II", "ISO 27001", "NIST CSF", "None"],
        required: true,
      },
      {
        id: "03-mfa",
        prompt: "Is multi-factor authentication enforced for all employees and systems?",
        kind: "choice",
        choices: ["Yes, all systems", "Some systems only", "No"],
        required: true,
      },
      {
        id: "03-bcp",
        prompt: "Upload the current Business Continuity Plan.",
        kind: "upload",
      },
    ],
  },
  {
    num: 4,
    numLabel: "04",
    title: "Fund Structure, Terms & Alignment",
    act: "Fund",
    description:
      "Legal structure, key terms, fee structure, corporate governance, investment strategy.",
    questions: [
      {
        id: "04-vehicle",
        prompt: "Fund vehicle type and domicile.",
        helper: "e.g. Delaware LP + Cayman Islands feeder.",
        kind: "text",
        required: true,
      },
      {
        id: "04-fees",
        prompt: "Management fee and performance fee (with hurdle, if applicable).",
        kind: "textarea",
        required: true,
      },
      {
        id: "04-gp-commit",
        prompt: "Total GP commitment (USD) and percentage of fund size.",
        kind: "text",
        required: true,
      },
      {
        id: "04-lpa",
        prompt: "Upload the current Limited Partnership Agreement (LPA).",
        kind: "upload",
      },
    ],
  },
  {
    num: 5,
    numLabel: "05",
    title: "Service Providers & Oversight",
    act: "Fund",
    description:
      "Administrator, auditor, banker, custodian, prime broker — engaged and verified.",
    questions: [
      {
        id: "05-administrator",
        prompt: "Fund administrator and engagement date.",
        kind: "text",
        required: true,
      },
      {
        id: "05-auditor",
        prompt: "Fund auditor and most recent audit opinion type.",
        kind: "text",
        required: true,
      },
      {
        id: "05-prime-broker",
        prompt: "Prime broker / custodian arrangements.",
        kind: "textarea",
      },
      {
        id: "05-engagement-letters",
        prompt: "Upload current engagement letters from administrator and auditor.",
        kind: "upload",
      },
    ],
  },
  {
    num: 6,
    numLabel: "06",
    title: "Investment Operations & Portfolio Controls",
    act: "Controls",
    description:
      "Portfolio management systems, decision process, allocation, cash tracking and controls.",
    questions: [
      {
        id: "06-pms",
        prompt: "Portfolio management system(s) used.",
        kind: "text",
        required: true,
      },
      {
        id: "06-decision-process",
        prompt: "Describe the investment decision process (IC structure, voting, dissent).",
        kind: "textarea",
        required: true,
      },
      {
        id: "06-cash-controls",
        prompt: "Are wire transfer approvals subject to dual-control?",
        kind: "choice",
        choices: ["Yes, dual-control on all wires", "Above a threshold only", "No"],
        required: true,
      },
    ],
  },
  {
    num: 7,
    numLabel: "07",
    title: "Valuation, Asset Existence & Reporting",
    act: "Controls",
    description:
      "Valuation controls, asset existence verification, investor reporting, financial controls.",
    questions: [
      {
        id: "07-valuation-committee",
        prompt: "Is there an independent valuation committee?",
        kind: "choice",
        choices: [
          "Yes, independent (no investment team)",
          "Mixed (investment + non-investment)",
          "No formal committee",
        ],
        required: true,
      },
      {
        id: "07-pricing-sources",
        prompt: "Primary pricing sources for portfolio holdings.",
        kind: "textarea",
        required: true,
      },
      {
        id: "07-reporting-cadence",
        prompt: "Investor reporting cadence and contents.",
        kind: "textarea",
        required: true,
      },
    ],
  },
  {
    num: 8,
    numLabel: "08",
    title: "Manager Transparency & LP Communications",
    act: "Controls",
    description:
      "Diligence cooperation, administrator cooperation, disclosure quality.",
    questions: [
      {
        id: "08-disclosure-policy",
        prompt: "Describe your LP disclosure policy for material events.",
        kind: "textarea",
        required: true,
      },
      {
        id: "08-side-letters",
        prompt:
          "Are any side letters in place? If yes, summarize the most-favored-nation (MFN) treatment.",
        kind: "textarea",
      },
      {
        id: "08-investor-portal",
        prompt: "Investor portal used (if any).",
        kind: "text",
      },
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
  Fund: "#10B981",
  Controls: "#F59E0B",
};
