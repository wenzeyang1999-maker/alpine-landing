/**
 * Resolves a report slug to its content (topic data + mock narrative).
 *
 * Reports are mock data files (lib/app-portal/*-data.ts), not a DB table.
 * This is the bridge from the registry's `dataKey` to the actual modules.
 * Imported by the client-side report reader.
 */

import { AURORA_TOPIC_DATA, AURORA_MOCK } from "@/lib/app-portal/aurora-data";
import { TRELLIS_TOPIC_DATA, TRELLIS_MOCK } from "@/lib/app-portal/trellis-data";
import { TOPIC_DATA as RIDGELINE_TOPIC_DATA, RIDGELINE_MOCK } from "@/lib/app-portal/ridgeline-data";
import type { TopicInfo } from "@/lib/app-portal/ridgeline-data";
import { getReportEntry, type ReportRegistryEntry } from "@/lib/allocator/report-registry";

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
