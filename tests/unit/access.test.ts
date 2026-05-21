import { describe, it, expect, beforeEach, vi } from "vitest";

// Shared mutable fixture for the mocked Supabase client. `vi.hoisted` makes it
// available to the (hoisted) vi.mock factory below.
const fixture = vi.hoisted(() => ({
  byTable: {} as Record<string, { data: unknown; error: unknown }>,
}));

function makeQuery(result: { data: unknown; error: unknown }) {
  const q: Record<string, unknown> = {};
  for (const method of ["select", "eq", "order", "in", "update", "insert", "delete", "upsert"]) {
    q[method] = () => q;
  }
  q.maybeSingle = () => Promise.resolve(result);
  q.single = () => Promise.resolve(result);
  q.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);
  return q;
}

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => makeQuery(fixture.byTable[table] ?? { data: null, error: null }),
  },
}));
vi.mock("next/headers", () => ({ cookies: () => ({ get: () => undefined }) }));

import { canAccessReport, getVisibleReports } from "@/lib/investor/access";

beforeEach(() => {
  fixture.byTable = {};
});

describe("canAccessReport (IDOR guard)", () => {
  it("allows a report that is assigned AND published for an active investor", async () => {
    fixture.byTable = {
      investors: { data: { is_active: true }, error: null },
      report_publications: { data: { report_slug: "aurora-capital-iv" }, error: null },
      investor_reports: { data: { report_slug: "aurora-capital-iv" }, error: null },
    };
    expect(await canAccessReport("alloc-1", "aurora-capital-iv")).toBe(true);
  });

  it("denies a report that is assigned but NOT published", async () => {
    fixture.byTable = {
      investors: { data: { is_active: true }, error: null },
      report_publications: { data: null, error: null },
      investor_reports: { data: { report_slug: "aurora-capital-iv" }, error: null },
    };
    expect(await canAccessReport("alloc-1", "aurora-capital-iv")).toBe(false);
  });

  it("denies a published report the investor is NOT assigned to", async () => {
    fixture.byTable = {
      investors: { data: { is_active: true }, error: null },
      report_publications: { data: { report_slug: "aurora-capital-iv" }, error: null },
      investor_reports: { data: null, error: null },
    };
    expect(await canAccessReport("alloc-1", "aurora-capital-iv")).toBe(false);
  });

  it("denies access for a deactivated investor", async () => {
    fixture.byTable = {
      investors: { data: { is_active: false }, error: null },
      report_publications: { data: { report_slug: "aurora-capital-iv" }, error: null },
      investor_reports: { data: { report_slug: "aurora-capital-iv" }, error: null },
    };
    expect(await canAccessReport("alloc-1", "aurora-capital-iv")).toBe(false);
  });

  it("denies an unknown slug without querying the DB", async () => {
    expect(await canAccessReport("alloc-1", "no-such-report")).toBe(false);
  });
});

describe("getVisibleReports", () => {
  it("returns only reports that are both assigned and published", async () => {
    fixture.byTable = {
      investor_reports: {
        data: [{ report_slug: "aurora-capital-iv" }, { report_slug: "trellis-capital-iv" }],
        error: null,
      },
      report_publications: { data: [{ report_slug: "aurora-capital-iv" }], error: null },
    };
    const reports = await getVisibleReports("alloc-1");
    expect(reports.map((r) => r.slug)).toEqual(["aurora-capital-iv"]);
  });

  it("returns nothing when the investor has no assignments", async () => {
    fixture.byTable = {
      investor_reports: { data: [], error: null },
      report_publications: { data: [], error: null },
    };
    expect(await getVisibleReports("alloc-1")).toEqual([]);
  });
});
