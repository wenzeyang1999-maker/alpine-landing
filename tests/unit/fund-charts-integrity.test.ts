import { describe, it, expect } from "vitest";
import { FUND_CHARTS, type FundCharts } from "@/lib/app-portal/fund-charts";
import { AURORA_TOPIC_DATA, AURORA_SOURCE_META } from "@/lib/app-portal/aurora-data";
import { TRELLIS_TOPIC_DATA, TRELLIS_SOURCE_META } from "@/lib/app-portal/trellis-data";
import { GRANITE_TOPIC_DATA, GRANITE_SOURCE_META } from "@/lib/app-portal/granite-data";
import { CORDOVA_TOPIC_DATA, CORDOVA_SOURCE_META } from "@/lib/app-portal/cordova-data";
import { BLACKPINE_TOPIC_DATA, BLACKPINE_SOURCE_META } from "@/lib/app-portal/blackpine-data";
import { HAVENCREST_TOPIC_DATA, HAVENCREST_SOURCE_META } from "@/lib/app-portal/havencrest-data";
import { RIDGELINE_RESORT_TOPIC_DATA, RIDGELINE_RESORT_SOURCE_META } from "@/lib/app-portal/ridgeline-resort-data";

/* eslint-disable @typescript-eslint/no-explicit-any */

// dataKey -> that fund's source meta + topic data.
const FUND: Record<string, { meta: Record<string, any>; topics: Record<number, any> }> = {
  aurora: { meta: AURORA_SOURCE_META, topics: AURORA_TOPIC_DATA as any },
  trellis: { meta: TRELLIS_SOURCE_META, topics: TRELLIS_TOPIC_DATA as any },
  granite: { meta: GRANITE_SOURCE_META, topics: GRANITE_TOPIC_DATA as any },
  cordova: { meta: CORDOVA_SOURCE_META, topics: CORDOVA_TOPIC_DATA as any },
  blackpine: { meta: BLACKPINE_SOURCE_META, topics: BLACKPINE_TOPIC_DATA as any },
  havencrest: { meta: HAVENCREST_SOURCE_META, topics: HAVENCREST_TOPIC_DATA as any },
  ridgelineResort: { meta: RIDGELINE_RESORT_SOURCE_META, topics: RIDGELINE_RESORT_TOPIC_DATA as any },
};

function chartSources(c: FundCharts): string[] {
  const out: string[] = [];
  const e = c.entity;
  const push = (n?: { ref?: { source: string } }) => { if (n?.ref) out.push(n.ref.source); };
  push(e.investors); push(e.manager); push(e.gp); push(e.fund); push(e.master);
  (e.feeders ?? []).forEach(push);
  (e.vehicles ?? []).forEach(push);
  (e.providers ?? []).forEach(push);
  c.org.leadership.forEach(push);
  c.org.groups.forEach((g) => g.people.forEach(push));
  (c.org.advisors ?? []).forEach(push);
  return out;
}

describe("fund charts", () => {
  for (const [dataKey, charts] of Object.entries(FUND_CHARTS)) {
    const fund = FUND[dataKey];

    it(`${dataKey}: dataKey is a known portal fund`, () => {
      expect(fund, `FUND_CHARTS has unknown dataKey "${dataKey}"`).toBeTruthy();
    });

    it(`${dataKey}: entityTopic and orgTopic exist in the fund's topic data`, () => {
      if (!fund) return;
      expect(fund.topics[charts.entityTopic], `entityTopic ${charts.entityTopic} missing`).toBeTruthy();
      expect(fund.topics[charts.orgTopic], `orgTopic ${charts.orgTopic} missing`).toBeTruthy();
    });

    it(`${dataKey}: every chart node source resolves to its SOURCE_META (catches typos)`, () => {
      if (!fund) return;
      const keys = new Set(Object.keys(fund.meta));
      const bad = chartSources(charts).filter((s) => !keys.has(s));
      expect(bad, `unknown chart sources for ${dataKey}: ${JSON.stringify(Array.from(new Set(bad)))}`).toEqual([]);
    });

    it(`${dataKey}: has both a manager and a fund node, and at least one leader`, () => {
      expect(charts.entity.manager?.label).toBeTruthy();
      expect(charts.entity.fund?.label).toBeTruthy();
      expect(charts.org.leadership.length).toBeGreaterThan(0);
    });
  }
});
