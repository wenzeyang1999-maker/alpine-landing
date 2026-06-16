import { describe, it, expect } from "vitest";
import { AURORA_TOPIC_DATA, AURORA_SOURCE_META } from "@/lib/app-portal/aurora-data";
import { TRELLIS_TOPIC_DATA, TRELLIS_SOURCE_META } from "@/lib/app-portal/trellis-data";
import { TOPIC_DATA as RIDGELINE_TOPIC_DATA, SOURCE_META as RIDGELINE_SOURCE_META } from "@/lib/app-portal/ridgeline-data";
import { GRANITE_TOPIC_DATA, GRANITE_SOURCE_META } from "@/lib/app-portal/granite-data";
import { CORDOVA_TOPIC_DATA, CORDOVA_SOURCE_META } from "@/lib/app-portal/cordova-data";
import { BLACKPINE_TOPIC_DATA, BLACKPINE_SOURCE_META } from "@/lib/app-portal/blackpine-data";
import { HAVENCREST_TOPIC_DATA, HAVENCREST_SOURCE_META } from "@/lib/app-portal/havencrest-data";
import { RIDGELINE_RESORT_TOPIC_DATA, RIDGELINE_RESORT_SOURCE_META } from "@/lib/app-portal/ridgeline-resort-data";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Every data point that cites a source feeds RefDot. If the cited source key is
// not in that fund's *_SOURCE_META, RefDot falls back to a generic preview — the
// exact "shows the wrong/generic document" class the RefDot dispatch fix targets.
const FUNDS: { name: string; topics: Record<number, any>; meta: Record<string, any> }[] = [
  { name: "aurora", topics: AURORA_TOPIC_DATA as any, meta: AURORA_SOURCE_META },
  { name: "trellis", topics: TRELLIS_TOPIC_DATA as any, meta: TRELLIS_SOURCE_META },
  { name: "ridgeline", topics: RIDGELINE_TOPIC_DATA as any, meta: RIDGELINE_SOURCE_META },
  { name: "granite", topics: GRANITE_TOPIC_DATA as any, meta: GRANITE_SOURCE_META },
  { name: "cordova", topics: CORDOVA_TOPIC_DATA as any, meta: CORDOVA_SOURCE_META },
  { name: "blackpine", topics: BLACKPINE_TOPIC_DATA as any, meta: BLACKPINE_SOURCE_META },
  { name: "havencrest", topics: HAVENCREST_TOPIC_DATA as any, meta: HAVENCREST_SOURCE_META },
  { name: "ridgelineResort", topics: RIDGELINE_RESORT_TOPIC_DATA as any, meta: RIDGELINE_RESORT_SOURCE_META },
];

function offenders(topics: Record<number, any>, meta: Record<string, any>): string[] {
  const keys = new Set(Object.keys(meta));
  const missing = new Set<string>();
  for (const topic of Object.values(topics)) {
    for (const group of topic?.dataPoints ?? []) {
      for (const item of group?.items ?? []) {
        if (item?.source && !keys.has(item.source)) missing.add(item.source);
      }
    }
  }
  return Array.from(missing).sort();
}

describe("data-point sources resolve to a SOURCE_META entry", () => {
  for (const fund of FUNDS) {
    it(`${fund.name}: every dataPoint.source exists in its SOURCE_META`, () => {
      expect(offenders(fund.topics, fund.meta)).toEqual([]);
    });
  }
});
