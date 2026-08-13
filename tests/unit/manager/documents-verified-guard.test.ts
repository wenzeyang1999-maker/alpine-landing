/**
 * Regression guard for the portal-document verification gate.
 *
 * Manager signup mints a session cookie before Alpine verifies the firm, and
 * portal-token resolution can match on email alone — so an unverified account
 * reaching these routes would expose another firm's uploaded documents. The
 * gate is four lines and easy to drop in a refactor; these tests fail loudly
 * if that happens. Mirrors tests/unit/api-guard.test.ts in intent.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const fixture = vi.hoisted(() => ({
  user: null as null | { email: string; firm_id: string; is_verified: boolean },
}));

vi.mock("@/lib/manager/access", () => ({
  getCurrentManager: () => Promise.resolve(fixture.user),
}));

// Reaching any of these would mean the gate let the request through.
vi.mock("@/lib/db/schema", () => ({ managerUploads: {}, portalDocuments: {} }));
vi.mock("drizzle-orm", () => ({ eq: () => ({}), and: () => ({}), desc: () => ({}) }));
vi.mock("@/lib/db", () => ({
  db: {
    select: () => {
      throw new Error("unverified account reached the database");
    },
  },
}));
vi.mock("@/lib/storage", () => ({
  signedUrl: () => Promise.resolve(null),
  removeObject: () => Promise.resolve(),
  downloadObject: () => Promise.resolve(Buffer.from("")),
}));
vi.mock("@/lib/manager/portal-link", () => ({
  portalTokenForManager: () => Promise.resolve(null),
}));

import { GET } from "@/app/api/manager/documents/route";
import { POST as MATCH } from "@/app/api/manager/documents/match/route";

function matchReq() {
  return new Request("https://manager.alpinedd.com/api/manager/documents/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText: "valuation policy" }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

beforeEach(() => {
  fixture.user = null;
});

describe("portal documents — verification gate", () => {
  it("401s an anonymous caller on the documents list", async () => {
    expect((await GET()).status).toBe(401);
  });

  it("403s an authenticated but unverified account on the documents list", async () => {
    fixture.user = { email: "attacker@example.com", firm_id: "firm-x", is_verified: false };

    const res = await GET();
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe("Account not verified");
  });

  it("401s an anonymous caller on the passage-match route", async () => {
    expect((await MATCH(matchReq())).status).toBe(401);
  });

  it("403s an authenticated but unverified account on the passage-match route", async () => {
    fixture.user = { email: "attacker@example.com", firm_id: "firm-x", is_verified: false };

    const res = await MATCH(matchReq());
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe("Account not verified");
  });
});
