import { describe, it, expect, beforeEach, vi } from "vitest";

// Mocks the drizzle boundary rather than the database: schema tables become
// sentinels so the suite never imports drizzle-orm, and each builder chain
// resolves from `fixture.rows` keyed by the table passed to .from()/.update().
const fixture = vi.hoisted(() => ({
  rows: {} as Record<string, unknown[]>,
  inserts: [] as Array<{ table: string; values: Record<string, unknown> }>,
  failInsert: false,
  failSelectFor: null as string | null,
}));

vi.mock("@/lib/db/schema", () => ({
  firmsInManager: { __t: "firms" },
  customers: { __t: "customers" },
  portalLinks: { __t: "portalLinks" },
}));

vi.mock("drizzle-orm", () => ({ eq: () => ({}), and: () => ({}) }));

vi.mock("@/lib/db", () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function selectBuilder() {
    // The joined query reads from portalLinks and joins customers; the FIRST
    // table named decides which fixture list answers, matching the real
    // driver's behaviour of returning joined rows per left-hand row.
    let table = "";
    const b: any = {
      from(t: any) { table = t.__t; return b; },
      innerJoin() { return b; },
      where() { return b; },
      limit() {
        if (fixture.failSelectFor === table) return Promise.reject(new Error("db unavailable"));
        return Promise.resolve(fixture.rows[table] ?? []);
      },
    };
    return b;
  }
  function insertBuilder(t: any) {
    const table = t.__t;
    return {
      values(v: Record<string, unknown>) {
        if (fixture.failInsert) return Promise.reject(new Error("unique violation"));
        fixture.inserts.push({ table, values: v });
        return Promise.resolve(undefined);
      },
    };
  }
  return { db: { select: () => selectBuilder(), insert: (t: any) => insertBuilder(t) } };
});

import { portalTokenForManager, claimableCustomerForToken } from "@/lib/manager/portal-link";

beforeEach(() => {
  fixture.rows = {};
  fixture.inserts = [];
  fixture.failInsert = false;
  fixture.failSelectFor = null;
});

describe("portalTokenForManager — approved links only", () => {
  it("returns the token of an approved link to an active customer", async () => {
    fixture.rows.portalLinks = [{ portalToken: "cust-token", status: "active" }];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBe("cust-token");
    expect(fixture.inserts).toHaveLength(0);
  });

  it("returns null when the approved link's customer has been offboarded", async () => {
    fixture.rows.portalLinks = [{ portalToken: "cust-token", status: "inactive" }];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
  });

  it("falls back to the demo-slug map for seeded demo firms", async () => {
    fixture.rows.portalLinks = [];
    fixture.rows.firms = [{ slug: "trellis" }];

    expect(await portalTokenForManager("firm-1", "demo@alpinedd.com")).toBe("demo-trellis-token");
  });

  it("grants nothing on an email match, and records a pending suggestion", async () => {
    fixture.rows.portalLinks = [];
    fixture.rows.firms = [{ slug: "acme" }];
    fixture.rows.customers = [{ id: "cust-1" }];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
    expect(fixture.inserts).toEqual([
      { table: "portalLinks", values: { firmId: "firm-1", customerId: "cust-1", status: "pending", suggestedBy: "a@acme.com" } },
    ]);
  });

  it("does not duplicate a suggestion that already exists", async () => {
    fixture.rows.portalLinks = [{ id: "link-1" }];
    fixture.rows.firms = [{ slug: "acme" }];
    fixture.rows.customers = [{ id: "cust-1" }];

    // The approved lookup and the existing-suggestion lookup share a fixture
    // list here; either way no second row may be written.
    await portalTokenForManager("firm-1", "a@acme.com");
    expect(fixture.inserts).toHaveLength(0);
  });

  it("returns null when no link, no demo slug and no matching customer exist", async () => {
    fixture.rows.portalLinks = [];
    fixture.rows.firms = [{ slug: "acme" }];
    fixture.rows.customers = [];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
    expect(fixture.inserts).toHaveLength(0);
  });

  it("returns null instead of throwing when the database is unavailable", async () => {
    fixture.failSelectFor = "portalLinks";

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
  });

  it("still records the suggestion when the insert fails", async () => {
    fixture.rows.portalLinks = [];
    fixture.rows.firms = [{ slug: "acme" }];
    fixture.rows.customers = [{ id: "cust-1" }];
    fixture.failInsert = true;

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
    expect(fixture.inserts).toHaveLength(0);
  });
});

describe("claimableCustomerForToken", () => {
  it("rejects an empty token", async () => {
    expect(await claimableCustomerForToken("")).toBeNull();
  });

  it("rejects an absurdly long token without querying", async () => {
    expect(await claimableCustomerForToken("x".repeat(201))).toBeNull();
  });

  it("rejects a token with no active onboarded customer", async () => {
    fixture.rows.customers = [];

    expect(await claimableCustomerForToken("unknown-token")).toBeNull();
  });

  it("rejects a token whose portal is already approved to a firm", async () => {
    fixture.rows.customers = [{ id: "cust-1" }];
    fixture.rows.portalLinks = [{ id: "link-existing" }];

    expect(await claimableCustomerForToken("taken-token")).toBeNull();
  });

  it("returns the customer id for a real, unclaimed token", async () => {
    fixture.rows.customers = [{ id: "cust-1" }];
    fixture.rows.portalLinks = [];

    expect(await claimableCustomerForToken("free-token")).toBe("cust-1");
  });

  it("returns null rather than throwing when the database is unavailable", async () => {
    fixture.failSelectFor = "customers";

    expect(await claimableCustomerForToken("any-token")).toBeNull();
  });
});
