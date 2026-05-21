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
  dataKey: "aurora" | "trellis" | "ridgeline";
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
