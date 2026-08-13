import { describe, it, expect, beforeEach, vi } from "vitest";

// Mocks the drizzle boundary rather than the database: schema tables become
// sentinels so the suite never imports drizzle-orm, and each builder chain
// resolves from `fixture.rows` keyed by the table passed to .from()/.update().
const fixture = vi.hoisted(() => ({
  rows: {} as Record<string, unknown[]>,
  updates: [] as Array<{ table: string; values: Record<string, unknown> }>,
  failUpdate: false,
  failSelectFor: null as string | null,
}));

vi.mock("@/lib/db/schema", () => ({
  firmsInManager: { __t: "firms" },
  customers: { __t: "customers" },
}));

vi.mock("drizzle-orm", () => ({ eq: () => ({}) }));

vi.mock("@/lib/db", () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function selectBuilder() {
    let table = "";
    const b: any = {
      from(t: any) { table = t.__t; return b; },
      where() { return b; },
      limit() {
        if (fixture.failSelectFor === table) return Promise.reject(new Error("db unavailable"));
        return Promise.resolve(fixture.rows[table] ?? []);
      },
    };
    return b;
  }
  function updateBuilder(t: any) {
    const table = t.__t;
    let values: Record<string, unknown> = {};
    const b: any = {
      set(v: Record<string, unknown>) { values = v; return b; },
      where() {
        if (fixture.failUpdate) return Promise.reject(new Error("unique violation"));
        fixture.updates.push({ table, values });
        return Promise.resolve(undefined);
      },
    };
    return b;
  }
  return { db: { select: () => selectBuilder(), update: (t: any) => updateBuilder(t) } };
});

import { portalTokenForManager, validateClaimableToken } from "@/lib/manager/portal-link";

beforeEach(() => {
  fixture.rows = {};
  fixture.updates = [];
  fixture.failUpdate = false;
  fixture.failSelectFor = null;
});

describe("portalTokenForManager — resolution order", () => {
  it("returns the firm's claimed token first, without consulting customers", async () => {
    fixture.rows.firms = [{ slug: "acme", portalToken: "claimed-token" }];
    fixture.rows.customers = [{ portalToken: "should-not-be-used" }];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBe("claimed-token");
    expect(fixture.updates).toHaveLength(0);
  });

  it("prefers the claimed token over the demo-slug mapping", async () => {
    fixture.rows.firms = [{ slug: "trellis", portalToken: "explicit-token" }];

    expect(await portalTokenForManager("firm-1", "a@trellis.com")).toBe("explicit-token");
  });

  it("falls back to the demo-slug mapping when no token is claimed", async () => {
    fixture.rows.firms = [{ slug: "trellis", portalToken: null }];

    expect(await portalTokenForManager("firm-1", "demo@alpinedd.com")).toBe("demo-trellis-token");
    expect(fixture.updates).toHaveLength(0);
  });

  it("falls back to the customer email match and backfills the firm token", async () => {
    fixture.rows.firms = [{ slug: "acme", portalToken: null }];
    fixture.rows.customers = [{ portalToken: "customer-token" }];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBe("customer-token");
    expect(fixture.updates).toEqual([{ table: "firms", values: { portalToken: "customer-token" } }]);
  });

  it("still returns the token when the backfill write fails", async () => {
    fixture.rows.firms = [{ slug: "acme", portalToken: null }];
    fixture.rows.customers = [{ portalToken: "customer-token" }];
    fixture.failUpdate = true;

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBe("customer-token");
    expect(fixture.updates).toHaveLength(0);
  });

  it("returns null when nothing matches, and does not backfill", async () => {
    fixture.rows.firms = [{ slug: "acme", portalToken: null }];
    fixture.rows.customers = [];

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
    expect(fixture.updates).toHaveLength(0);
  });

  it("still resolves by email when the firm row is missing, but skips the backfill", async () => {
    fixture.rows.firms = [];
    fixture.rows.customers = [{ portalToken: "customer-token" }];

    expect(await portalTokenForManager("missing", "a@acme.com")).toBe("customer-token");
    expect(fixture.updates).toHaveLength(0);
  });

  it("returns null instead of throwing when the database is unavailable", async () => {
    fixture.failSelectFor = "firms";

    expect(await portalTokenForManager("firm-1", "a@acme.com")).toBeNull();
  });
});

describe("validateClaimableToken", () => {
  it("rejects an empty token", async () => {
    expect(await validateClaimableToken("")).toBe(false);
  });

  it("rejects an absurdly long token without querying", async () => {
    expect(await validateClaimableToken("x".repeat(201))).toBe(false);
  });

  it("rejects a token that matches no onboarded customer", async () => {
    fixture.rows.customers = [];

    expect(await validateClaimableToken("unknown-token")).toBe(false);
  });

  it("rejects a token already claimed by another firm", async () => {
    fixture.rows.customers = [{ id: "cust-1" }];
    fixture.rows.firms = [{ id: "firm-existing" }];

    expect(await validateClaimableToken("taken-token")).toBe(false);
  });

  it("accepts a real, unclaimed token", async () => {
    fixture.rows.customers = [{ id: "cust-1" }];
    fixture.rows.firms = [];

    expect(await validateClaimableToken("free-token")).toBe(true);
  });

  it("returns false rather than throwing when the database is unavailable", async () => {
    fixture.failSelectFor = "customers";

    expect(await validateClaimableToken("any-token")).toBe(false);
  });
});
