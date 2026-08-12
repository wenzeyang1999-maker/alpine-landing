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

// Pretty slugs for demo portals: /portal/trellis resolves to the same portal
// as /portal/demo-trellis-token. These are the URLs shown in the analyst-side
// "Document Request" card and are what a prospect sees on screen.
export const DEMO_SLUG_TO_TOKEN: Record<string, string> = {
  trellis: "demo-trellis-token",
  ridgeline: "demo-ridgeline-token",
  aurora: "demo-aurora-token",
};

export function canonicalPortalToken(tokenOrSlug: string): string {
  return DEMO_SLUG_TO_TOKEN[tokenOrSlug] ?? tokenOrSlug;
}

// Seeded demo documents, shared by the portal page (client fallback when the
// DB has no rows for a demo token) and the manager workspace Documents panel
// (so the workspace shows the same submission the portal shows).
export interface DemoPortalDoc {
  id: string;
  filename: string;
  file_size: number | null;
  page_count: number | null;
  uploaded_at: string;
}

export const TRELLIS_MOCK_DOCS: DemoPortalDoc[] = [
  { id: "t01", filename: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf",               file_size: 3_200_000, page_count: 52, uploaded_at: "2026-04-01T09:10:00Z" },
  { id: "t02", filename: "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",   file_size: 980_000,  page_count: 18, uploaded_at: "2026-04-01T09:12:00Z" },
  { id: "t03", filename: "Trellis-Capital-IV-LPA.pdf",                         file_size: 2_100_000, page_count: 38, uploaded_at: "2026-04-01T09:15:00Z" },
  { id: "t04", filename: "Trellis-Capital-IV-PPM.pdf",                         file_size: 1_750_000, page_count: 30, uploaded_at: "2026-04-01T09:17:00Z" },
  { id: "t05", filename: "trellis_subscription_agreement.pdf",                 file_size: 640_000,  page_count: 12, uploaded_at: "2026-04-01T09:19:00Z" },
  { id: "t06", filename: "Trellis-Capital-III-Audited-FS-FY2024.pdf",          file_size: 4_200_000, page_count: 68, uploaded_at: "2026-04-01T09:22:00Z" },
  { id: "t07", filename: "Trellis-Capital-III-Audited-FS-FY2023.pdf",          file_size: 3_900_000, page_count: 64, uploaded_at: "2026-04-01T09:24:00Z" },
  { id: "t08", filename: "Trellis-Capital-Valuation-Policy.pdf",               file_size: 420_000,  page_count: 8,  uploaded_at: "2026-04-01T09:26:00Z" },
  { id: "t09", filename: "Summit-Advisory-Compliance-Binder-2025.pdf",         file_size: 1_100_000, page_count: 22, uploaded_at: "2026-04-01T09:28:00Z" },
  { id: "t10", filename: "Apex-Fund-Services-Service-Description-FundIII.pdf", file_size: 560_000,  page_count: 10, uploaded_at: "2026-04-01T09:30:00Z" },
];

export const AURORA_MOCK_DOCS: DemoPortalDoc[] = [
  { id: "a01", filename: "aurora-ilpa-ddq-2026.pdf",           file_size: 2_800_000, page_count: 48, uploaded_at: "2026-04-08T09:10:00Z" },
  { id: "a02", filename: "aurora-form-adv-era-2026.pdf",        file_size: 840_000,  page_count: 15, uploaded_at: "2026-04-08T09:12:00Z" },
  { id: "a03", filename: "aurora-lpa-fund-iv.pdf",              file_size: 1_950_000, page_count: 34, uploaded_at: "2026-04-08T09:15:00Z" },
  { id: "a04", filename: "aurora-ppm-fund-iv.pdf",              file_size: 1_620_000, page_count: 28, uploaded_at: "2026-04-08T09:17:00Z" },
  { id: "a05", filename: "aurora-compliance-manual-2026.pdf",   file_size: 1_100_000, page_count: 20, uploaded_at: "2026-04-08T09:19:00Z" },
  { id: "a06", filename: "aurora-valuation-policy.pdf",         file_size: 390_000,  page_count: 7,  uploaded_at: "2026-04-08T09:21:00Z" },
  { id: "a07", filename: "aurora-financials-fy2025.pdf",        file_size: 3_800_000, page_count: 62, uploaded_at: "2026-04-08T09:24:00Z" },
  { id: "a08", filename: "aurora-firm-overview.pdf",            file_size: 720_000,  page_count: 14, uploaded_at: "2026-04-08T09:26:00Z" },
  { id: "a09", filename: "aurora-wisp-2025.pdf",                file_size: 480_000,  page_count: 9,  uploaded_at: "2026-04-18T10:05:00Z" },
  { id: "a10", filename: "aurora-incident-response-plan.pdf",   file_size: 310_000,  page_count: 6,  uploaded_at: "2026-04-18T10:07:00Z" },
  { id: "a11", filename: "aurora-bcp-2025.pdf",                 file_size: 290_000,  page_count: 5,  uploaded_at: "2026-04-18T10:09:00Z" },
  { id: "a12", filename: "aurora-admin-agreement-meridian.pdf", file_size: 650_000,  page_count: 11, uploaded_at: "2026-04-18T10:12:00Z" },
  { id: "a13", filename: "aurora-insightsphere-agreement.pdf",  file_size: 280_000,  page_count: 5,  uploaded_at: "2026-04-18T10:14:00Z" },
  { id: "a14", filename: "aurora-vantage-tech-engagement.pdf",  file_size: 320_000,  page_count: 6,  uploaded_at: "2026-04-18T10:16:00Z" },
];

export const DEMO_MOCK_DOCS: Record<string, DemoPortalDoc[]> = {
  "demo-trellis-token": TRELLIS_MOCK_DOCS,
  "demo-aurora-token": AURORA_MOCK_DOCS,
};
