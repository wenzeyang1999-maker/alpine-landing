// Demo portal tokens and their fund config. Shared by the public manager
// portal page and the token-scoped /api/portal/* routes so "is this a known
// token" is answered the same way everywhere.

export const DEMO_PORTAL_CONFIG: Record<string, { fund_name: string; document_types: string[] }> = {
  "demo-ridgeline-token": {
    fund_name: "Ridgeline Capital Partners",
    document_types: [
      "Due Diligence Questionnaire (DDQ)",
      "Compliance Manual",
      "Form ADV Part 2A",
      "Audited Financial Statements",
      "Valuation Policy",
      "Business Continuity Plan (BCP)",
      "Organizational Chart",
      "Expert Network Policy",
      "IC Charter",
      "Private Placement Memorandum",
      "Penetration Test Summary",
      "Incident Response Plan",
      "IC Meeting Minutes",
      "CompliySci Configuration Overview",
    ],
  },
  "demo-trellis-token": {
    fund_name: "Trellis Capital IV, L.P.",
    document_types: [
      "ILPA Due Diligence Questionnaire (DDQ)",
      "Form ADV Part 1 / ERA Filing",
      "Limited Partnership Agreement (LPA)",
      "Private Placement Memorandum (PPM)",
      "Subscription Agreement Template",
      "Audited Financial Statements FY2024",
      "Audited Financial Statements FY2023",
      "Valuation Policy",
      "Compliance Binder",
      "Fund Administrator Service Description",
    ],
  },
  "demo-aurora-token": {
    fund_name: "Aurora Ventures IV, L.P.",
    document_types: [
      "ILPA DDQ 2.0 — Aurora Capital Management",
      "Form ADV ERA — Annual Filing",
      "Limited Partnership Agreement (LPA)",
      "Private Placement Memorandum (PPM)",
      "Compliance Manual + Code of Ethics",
      "Valuation Policy",
      "Audited Financial Statements FY2025",
      "Firm Overview & Team Biographies",
    ],
  },
};

// Default checklist shown to real (onboarded) customers, whose portals do not
// yet have a per-fund configured list.
export const DEFAULT_DOC_TYPES: string[] = [
  "Due Diligence Questionnaire (DDQ)",
  "Form ADV Part 2A",
  "Limited Partnership Agreement (LPA)",
  "Private Placement Memorandum",
  "Audited Financial Statements",
  "Valuation Policy",
  "Compliance Manual",
  "Organizational Chart",
  "Business Continuity Plan (BCP)",
];

export function isDemoPortalToken(token: string): boolean {
  return token in DEMO_PORTAL_CONFIG;
}
