/**
 * Regression guard: a firm whose documents all arrived through the secure
 * portal has zero manager_uploads. The match route used to return early on an
 * empty upload list, which skipped the portal search entirely and silently
 * returned no citations for exactly the customers Phase 3 onboards.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const fixture = vi.hoisted(() => ({
  managerUploads: [] as unknown[],
  portalRows: [] as unknown[],
  updates: 0,
}));

vi.mock("@/lib/manager/access", () => ({
  getCurrentManager: () =>
    Promise.resolve({ email: "arjun@trelliscapital.com", firm_id: "firm-1", is_verified: true }),
}));
vi.mock("@/lib/db/schema", () => ({
  managerUploads: { __t: "managerUploads" },
  portalDocuments: { __t: "portalDocuments" },
}));
vi.mock("drizzle-orm", () => ({ eq: () => ({}), desc: () => ({}) }));
vi.mock("@/lib/manager/portal-link", () => ({
  portalTokenForManager: () => Promise.resolve("demo-trellis-token"),
}));
vi.mock("@/lib/storage", () => ({
  signedUrl: () => Promise.resolve("https://blob.example/signed"),
  downloadObject: () => Promise.resolve(Buffer.from("")),
}));

vi.mock("@/lib/db", () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function selectBuilder() {
    let table = "";
    const rowsFor = () =>
      table === "portalDocuments" ? fixture.portalRows : fixture.managerUploads;
    const b: any = {
      from(t: any) { table = t.__t; return b; },
      where() { return b; },
      orderBy() { return b; },
      limit() { return Promise.resolve(rowsFor()); },
      then(res: (v: unknown) => unknown, rej?: (e: unknown) => unknown) {
        return Promise.resolve(rowsFor()).then(res, rej);
      },
    };
    return b;
  }
  return {
    db: {
      select: () => selectBuilder(),
      update: () => ({ set: () => ({ where: () => { fixture.updates++; return Promise.resolve(); } }) }),
    },
  };
});

import { POST } from "@/app/api/manager/documents/match/route";

function req(body: Record<string, unknown>) {
  return new Request("https://manager.alpinedd.com/api/manager/documents/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

beforeEach(() => {
  fixture.managerUploads = [];
  fixture.portalRows = [];
  fixture.updates = 0;
});

describe("passage match — portal-only firms", () => {
  it("searches portal documents even when the firm has no workspace uploads", async () => {
    fixture.portalRows = [
      {
        id: "pd-1",
        filename: "Trellis-Capital-Valuation-Policy.pdf",
        storagePath: "trellis/valuation.pdf",
        textContent:
          "The valuation policy requires independent third party review of all Level 3 positions each quarter. Marks are approved by the Valuation Committee.",
      },
    ];

    const res = await POST(req({ questionText: "independent valuation review of Level 3 positions" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.matches).toHaveLength(1);
    expect(data.matches[0].filename).toBe("Trellis-Capital-Valuation-Policy.pdf");
  });

  it("reuses cached text instead of re-parsing the PDF", async () => {
    fixture.portalRows = [
      {
        id: "pd-1",
        filename: "policy.pdf",
        storagePath: "p/policy.pdf",
        textContent: "The valuation policy requires independent third party review each quarter.",
      },
    ];

    await POST(req({ questionText: "independent valuation review" }));
    expect(fixture.updates).toBe(0);
  });

  it("returns no matches when neither source has documents", async () => {
    const res = await POST(req({ questionText: "anything at all" }));

    expect(res.status).toBe(200);
    expect((await res.json()).matches).toEqual([]);
  });
});
