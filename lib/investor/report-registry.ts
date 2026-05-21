/**
 * Report registry — the single source of truth for which ODD reports exist.
 *
 * Reports live in code (the mock data modules under lib/app-portal/*-data.ts),
 * not in a DB table, so the DB `report_slug` columns have no foreign key.
 * Every publish/assign endpoint validates a slug against this registry before
 * insert; the reader 404s on unknown slugs. Orphan rows therefore stay inert.
 *
 * Built to be extensible — ~8 more reports are preseeded later by adding
 * entries here (and a matching data module).
 *
 * Pure data, no heavy imports — safe to import from access checks and the
 * analyst admin API. The reader maps `dataKey` to the actual data module.
 */

export type ReportRating = "GREEN" | "YELLOW" | "RED";

export interface ReportRegistryEntry {
  slug: string;
  fundName: string;
  manager: string;
  strategy: string;
  /** Overall ODD rating, used for report cards. */
  rating: ReportRating;
  /** ODD score out of 100. */
  oddScore: number;
  /** Number of topic chapters in the report body. */
  topicCount: number;
  /** Selects the data module the reader loads (lib/app-portal/*-data.ts). */
  dataKey: "aurora" | "trellis" | "ridgeline" | "granite" | "cordova" | "blackpine" | "havencrest" | "ridgelineResort";
  /** Filename of the finalized ODD report PDF (a DEMO_FILES key), if one exists. */
  reportPdf?: string;
}

export const REPORT_REGISTRY: Record<string, ReportRegistryEntry> = {
  "aurora-capital-iv": {
    slug: "aurora-capital-iv",
    fundName: "Aurora Ventures IV, L.P.",
    manager: "Aurora Capital Management, LLC",
    strategy: "Early-Stage Venture Capital",
    rating: "GREEN",
    oddScore: 82,
    topicCount: 8,
    dataKey: "aurora",
    reportPdf: "sample_vc_aurora_iv.pdf",
  },
  "trellis-capital-iv": {
    slug: "trellis-capital-iv",
    fundName: "Trellis Capital IV, L.P.",
    manager: "Trellis Capital Management, LLC",
    strategy: "Pre-seed Venture Capital",
    rating: "YELLOW",
    oddScore: 68,
    topicCount: 8,
    dataKey: "trellis",
    reportPdf: "sample_vc_fund_iv_alt.pdf",
  },
  "ridgeline-capital-partners": {
    slug: "ridgeline-capital-partners",
    fundName: "Ridgeline Global Opportunities Fund, LP",
    manager: "Ridgeline Capital Partners, LLC",
    strategy: "Global Long/Short Equity",
    rating: "YELLOW",
    oddScore: 64,
    topicCount: 12,
    dataKey: "ridgeline",
  },
  "granite-vii-credit": {
    slug: "granite-vii-credit",
    fundName: "Granite VII Credit Partners, L.P.",
    manager: "Granite Capital Management, LLC",
    strategy: "Senior Direct Lending — Middle-Market",
    rating: "GREEN",
    oddScore: 84,
    topicCount: 8,
    dataKey: "granite",
    reportPdf: "sample_credit_granite_vii.pdf",
  },
  "cordova-jv-iii": {
    slug: "cordova-jv-iii",
    fundName: "Cordova JV Real Estate Fund III, L.P.",
    manager: "Cordova Capital Partners, LLC",
    strategy: "Value-Add Multifamily — Sun Belt JV Equity",
    rating: "YELLOW",
    oddScore: 70,
    topicCount: 8,
    dataKey: "cordova",
    reportPdf: "sample_re_cordova_jv.pdf",
  },
  "blackpine-credit-iv": {
    slug: "blackpine-credit-iv",
    fundName: "Blackpine Credit Plus IV, L.P.",
    manager: "Blackpine Asset Management, LLC",
    strategy: "Opportunistic / Stressed Corporate Credit",
    rating: "YELLOW",
    oddScore: 67,
    topicCount: 8,
    dataKey: "blackpine",
    reportPdf: "sample_credit_blackpine_plus.pdf",
  },
  "havencrest-industrial-v": {
    slug: "havencrest-industrial-v",
    fundName: "Havencrest Industrial Trust V, L.P.",
    manager: "Havencrest Real Estate Advisors, LLC",
    strategy: "Core+ Industrial / Logistics Real Estate",
    rating: "GREEN",
    oddScore: 81,
    topicCount: 8,
    dataKey: "havencrest",
    reportPdf: "sample_re_havencrest_trust.pdf",
  },
  "ridgeline-resort-iii": {
    slug: "ridgeline-resort-iii",
    fundName: "Ridgeline Resort Holdings III, L.P.",
    manager: "Ridgeline Resort Capital, LLC",
    strategy: "Opportunistic Hospitality Real Estate",
    rating: "YELLOW",
    oddScore: 65,
    topicCount: 8,
    dataKey: "ridgelineResort",
    reportPdf: "sample_re_ridgeline_iii.pdf",
  },
};

export function isValidReportSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return Object.prototype.hasOwnProperty.call(REPORT_REGISTRY, slug);
}

export function getReportEntry(slug: string | null | undefined): ReportRegistryEntry | null {
  if (!slug) return null;
  return REPORT_REGISTRY[slug] ?? null;
}

export function allReportEntries(): ReportRegistryEntry[] {
  return Object.values(REPORT_REGISTRY);
}
