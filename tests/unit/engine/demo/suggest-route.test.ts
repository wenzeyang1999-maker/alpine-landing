/**
 * suggest route (Lane B / T4). Gated (401 without cookie), returns {} when no API key (D3: no
 * placeholder floor), and bad input is handled. Never 500s for a missing key.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "../../../../app/api/demo/valuation/suggest/route";
import { signDemoToken, DEMO_COOKIE } from "../../../../lib/engine/demo/gate";

async function req(payload: unknown, withCookie: boolean) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (withCookie) headers["cookie"] = `${DEMO_COOKIE}=${await signDemoToken()}`;
  return new Request("http://localhost/api/demo/valuation/suggest", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

const body = {
  profile: { strategy: "credit" },
  questions: [
    { id: "04.14.79", prompt: "Does the fund have a key person provision?" },
    { id: "01.20", prompt: "Describe the board of directors." },
  ],
};

describe("suggest route", () => {
  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("returns 401 without the demo cookie", async () => {
    const res = await POST(await req(body, false));
    expect(res.status).toBe(401);
  });

  it("returns {} suggestions when no API key (no placeholder floor, no 500)", async () => {
    const res = await POST(await req(body, true));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.suggestions).toEqual({});
  });

  it("returns {} suggestions with an empty/garbage question list", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key"; // key present, but nothing to suggest
    const res = await POST(await req({ profile: body.profile, questions: [] }, true));
    expect(res.status).toBe(200);
    expect((await res.json()).suggestions).toEqual({});
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("returns 400 on malformed JSON body", async () => {
    const r = new Request("http://localhost/api/demo/valuation/suggest", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: `${DEMO_COOKIE}=${await signDemoToken()}` },
      body: "{not json",
    });
    const res = await POST(r);
    expect(res.status).toBe(400);
  });
});
