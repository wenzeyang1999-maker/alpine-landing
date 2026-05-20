import { describe, it, expect, beforeEach, vi } from "vitest";
import { hashPassword } from "@/lib/investor/password";

// Mutable investor row returned by the mocked Supabase client.
const fixture = vi.hoisted(() => ({ investorRow: null as unknown }));

function makeQuery(result: { data: unknown; error: unknown }) {
  const q: Record<string, unknown> = {};
  for (const method of ["select", "eq", "update", "insert"]) q[method] = () => q;
  q.maybeSingle = () => Promise.resolve(result);
  q.single = () => Promise.resolve(result);
  q.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);
  return q;
}

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => makeQuery({ data: fixture.investorRow, error: null }),
  },
}));

import { POST } from "@/app/api/investor/auth/login/route";

function loginRequest(body: unknown) {
  return new Request("http://localhost/api/investor/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("investor login route", () => {
  beforeEach(() => {
    fixture.investorRow = null;
  });

  it("returns 400 when fields are missing", async () => {
    const res = await POST(loginRequest({}) as never);
    expect(res.status).toBe(400);
  });

  it("returns 200 and sets the investor_session cookie on valid credentials", async () => {
    fixture.investorRow = {
      id: "alloc-1",
      email: "demo@example.com",
      password_hash: hashPassword("right-password"),
      is_active: true,
    };
    const res = await POST(loginRequest({ email: "demo@example.com", password: "right-password" }) as never);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie") ?? "").toContain("investor_session=");
  });

  it("returns 401 on a wrong password", async () => {
    fixture.investorRow = {
      id: "alloc-1",
      email: "demo@example.com",
      password_hash: hashPassword("right-password"),
      is_active: true,
    };
    const res = await POST(loginRequest({ email: "demo@example.com", password: "WRONG" }) as never);
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("Invalid email or password.");
  });

  it("returns an identical 401 for an unknown email (no account enumeration)", async () => {
    fixture.investorRow = null;
    const res = await POST(loginRequest({ email: "ghost@example.com", password: "anything" }) as never);
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("Invalid email or password.");
  });

  it("returns 401 for a deactivated account", async () => {
    fixture.investorRow = {
      id: "alloc-1",
      email: "demo@example.com",
      password_hash: hashPassword("right-password"),
      is_active: false,
    };
    const res = await POST(loginRequest({ email: "demo@example.com", password: "right-password" }) as never);
    expect(res.status).toBe(401);
  });
});
