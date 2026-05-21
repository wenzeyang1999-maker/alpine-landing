/**
 * Resolves a report slug to its content (topic data + mock narrative).
 *
 * Reports are mock data files (lib/app-portal/*-data.ts), not a DB table.
 * This is the bridge from the registry's `dataKey` to the actual modules.
 * Imported by the client-side report reader.
 */

import { AURORA_TOPIC_DATA, AURORA_MOCK, AURORA_COLLECTION_DOCS } from "@/lib/app-portal/aurora-data";
import { TRELLIS_TOPIC_DATA, TRELLIS_MOCK, TRELLIS_COLLECTION_DOCS } from "@/lib/app-portal/trellis-data";
import {
  TOPIC_DATA as RIDGELINE_TOPIC_DATA,
  RIDGELINE_MOCK,
  COLLECTION_DOCS as RIDGELINE_COLLECTION_DOCS,
} from "@/lib/app-portal/ridgeline-data";
import { GRANITE_TOPIC_DATA, GRANITE_MOCK, GRANITE_COLLECTION_DOCS } from "@/lib/app-portal/granite-data";
import { CORDOVA_TOPIC_DATA, CORDOVA_MOCK, CORDOVA_COLLECTION_DOCS } from "@/lib/app-portal/cordova-data";
import { BLACKPINE_TOPIC_DATA, BLACKPINE_MOCK, BLACKPINE_COLLECTION_DOCS } from "@/lib/app-portal/blackpine-data";
import { HAVENCREST_TOPIC_DATA, HAVENCREST_MOCK, HAVENCREST_COLLECTION_DOCS } from "@/lib/app-portal/havencrest-data";
import { RIDGELINE_RESORT_TOPIC_DATA, RIDGELINE_RESORT_MOCK, RIDGELINE_RESORT_COLLECTION_DOCS } from "@/lib/app-portal/ridgeline-resort-data";
import type { TopicInfo } from "@/lib/app-portal/ridgeline-data";
import { getDemoFileUrl } from "@/lib/app-portal/demo-downloads";
import { getReportEntry, type ReportRegistryEntry } from "@/lib/investor/report-registry";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ReportContent {
  entry: ReportRegistryEntry;
  topicData: Record<number, TopicInfo>;
  /** Fund narrative + risk observations + strengths (shape varies by fund). */
  mock: any;
}

export function getReportContent(slug: string): ReportContent | null {
  const entry = getReportEntry(slug);
  if (!entry) return null;
  switch (entry.dataKey) {
    case "aurora":
      return { entry, topicData: AURORA_TOPIC_DATA, mock: AURORA_MOCK };
    case "trellis":
      return { entry, topicData: TRELLIS_TOPIC_DATA, mock: TRELLIS_MOCK };
    case "ridgeline":
      return { entry, topicData: RIDGELINE_TOPIC_DATA, mock: RIDGELINE_MOCK };
    case "granite":
      return { entry, topicData: GRANITE_TOPIC_DATA, mock: GRANITE_MOCK };
    case "cordova":
      return { entry, topicData: CORDOVA_TOPIC_DATA, mock: CORDOVA_MOCK };
    case "blackpine":
      return { entry, topicData: BLACKPINE_TOPIC_DATA, mock: BLACKPINE_MOCK };
    case "havencrest":
      return { entry, topicData: HAVENCREST_TOPIC_DATA, mock: HAVENCREST_MOCK };
    case "ridgelineResort":
      return { entry, topicData: RIDGELINE_RESORT_TOPIC_DATA, mock: RIDGELINE_RESORT_MOCK };
    default:
      return null;
  }
}

/** Topic numbers present in a report, sorted ascending. */
export function topicNumbers(topicData: Record<number, TopicInfo>): number[] {
  return Object.keys(topicData)
    .map((k) => Number(k))
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);
}

export interface ReferencedDoc {
  name: string;
  type: string;
  filename: string;
  /** Public download URL for the source PDF. */
  url: string;
}

/**
 * Source documents Alpine reviewed to produce the report — downloadable.
 * Only entries whose file actually resolves are returned.
 */
export function getReferencedDocs(slug: string): ReferencedDoc[] {
  const entry = getReportEntry(slug);
  if (!entry) return [];
  let docs: any[];
  switch (entry.dataKey) {
    case "aurora":
      docs = AURORA_COLLECTION_DOCS;
      break;
    case "trellis":
      docs = TRELLIS_COLLECTION_DOCS;
      break;
    case "ridgeline":
      docs = RIDGELINE_COLLECTION_DOCS;
      break;
    case "granite":
      docs = GRANITE_COLLECTION_DOCS;
      break;
    case "cordova":
      docs = CORDOVA_COLLECTION_DOCS;
      break;
    case "blackpine":
      docs = BLACKPINE_COLLECTION_DOCS;
      break;
    case "havencrest":
      docs = HAVENCREST_COLLECTION_DOCS;
      break;
    case "ridgelineResort":
      docs = RIDGELINE_RESORT_COLLECTION_DOCS;
      break;
    default:
      return [];
  }
  const out: ReferencedDoc[] = [];
  const seen = new Set<string>();
  for (const d of docs) {
    const filename: string | undefined = d.filename;
    if (!filename || seen.has(filename)) continue;
    const url = getDemoFileUrl(filename);
    if (!url) continue;
    seen.add(filename);
    out.push({ name: d.name, type: d.type ?? "Document", filename, url });
  }
  return out;
}

/** Public download URL for a fund's finalized ODD report PDF, or null. */
export function getReportPdfUrl(slug: string): string | null {
  const entry = getReportEntry(slug);
  if (!entry?.reportPdf) return null;
  return getDemoFileUrl(entry.reportPdf);
}
