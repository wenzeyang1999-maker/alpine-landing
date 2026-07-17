/**
 * Tier-0 remediation guard. requireAdmin must 401 anonymous callers and any
 * non-allowlisted email, and pass a valid admin session. The ungated top-level
 * API routes (admin-email, watermark, *-draft, manager-verify) now call this.
 */
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.AUTH_SESSION_SECRET = "test-secret-at-least-32-chars-long-000";
});

async function mint(email: string): Promise<string> {
  const { signSession } = await import("../../lib/app-portal/auth-session");
  return signSession(email);
}
function req(cookie?: string): Request {
  return new Request("http://localhost/api/report-draft", {
    headers: cookie ? { cookie } : {},
  });
}

describe("requireAdmin (Tier-0 guard)", () => {
  it("401s a request with no cookie", async () => {
    const { requireAdmin } = await import("../../lib/api-guard");
    const res = await requireAdmin(req());
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it("401s a valid session for a NON-allowlisted email", async () => {
    const { requireAdmin } = await import("../../lib/api-guard");
    const token = await mint("stranger@evil.example");
    const res = await requireAdmin(req(`alpine_session=${encodeURIComponent(token)}`));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it("passes (null) a valid session for an allowlisted admin", async () => {
    const { requireAdmin } = await import("../../lib/api-guard");
    const token = await mint("azhang@alpinedd.com");
    const res = await requireAdmin(req(`alpine_session=${encodeURIComponent(token)}`));
    expect(res).toBeNull();
  });

  it("401s a tampered token", async () => {
    const { requireAdmin } = await import("../../lib/api-guard");
    const token = await mint("azhang@alpinedd.com");
    const tampered = token.slice(0, -2) + "xx";
    const res = await requireAdmin(req(`alpine_session=${encodeURIComponent(tampered)}`));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });
});
