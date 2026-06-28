/**
 * extract route (Lane B / T1). Gated, validates URL vs multipart inputs, and — the critical
 * failure mode — streams a clean {type:"error"} when no API key is configured (NOT a 500).
 * The full live extraction path is exercised by extract-pool / ch4-extract with a mock client;
 * here we cover the route's request handling + the no-key contract.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "../../../../app/api/demo/valuation/extract/route";
import { signDemoToken, DEMO_COOKIE } from "../../../../lib/engine/demo/gate";

async function cookie() {
  return `${DEMO_COOKIE}=${await signDemoToken()}`;
}

async function readStream(res: Response): Promise<Record<string, unknown>[]> {
  const text = await res.text();
  return text
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as Record<string, unknown>);
}

describe("extract route", () => {
  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("returns 401 without the demo cookie", async () => {
    const res = await POST(
      new Request("http://localhost/api/demo/valuation/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: "https://www.sec.gov/x.htm" }),
      }),
    );
    expect(res.status).toBe(401);
  });

  it("rejects a non-sec.gov URL with 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/demo/valuation/extract", {
        method: "POST",
        headers: { "content-type": "application/json", cookie: await cookie() },
        body: JSON.stringify({ url: "https://evil.example.com/x.htm" }),
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects a multipart request with no file (400)", async () => {
    const form = new FormData();
    const res = await POST(
      new Request("http://localhost/api/demo/valuation/extract", {
        method: "POST",
        headers: { cookie: await cookie() },
        body: form,
      }),
    );
    expect(res.status).toBe(400);
  });

  it("streams a clean error event (not a 500) for a URL when no API key is set", async () => {
    const res = await POST(
      new Request("http://localhost/api/demo/valuation/extract", {
        method: "POST",
        headers: { "content-type": "application/json", cookie: await cookie() },
        body: JSON.stringify({ url: "https://www.sec.gov/Archives/edgar/data/1.htm" }),
      }),
    );
    expect(res.status).toBe(200);
    const events = await readStream(res);
    expect(events.length).toBe(1);
    expect(events[0].type).toBe("error");
    expect(String(events[0].message)).toMatch(/not configured|API key/i);
  });

  it("streams a clean error event for a valid upload when no API key is set", async () => {
    const form = new FormData();
    form.set("file", new File(["<p>a filing body</p>"], "filing.html", { type: "text/html" }));
    const res = await POST(
      new Request("http://localhost/api/demo/valuation/extract", {
        method: "POST",
        headers: { cookie: await cookie() },
        body: form,
      }),
    );
    expect(res.status).toBe(200);
    const events = await readStream(res);
    expect(events[0].type).toBe("error");
  });
});
