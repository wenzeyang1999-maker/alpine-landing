/**
 * generate route (Lane B / T3). Gated (401 without cookie), deterministic with no API key
 * (no 500), and rejects bad input. With no key the spine is returned as a Ch4Report.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "../../../../app/api/demo/valuation/generate/route";
import { signDemoToken, DEMO_COOKIE } from "../../../../lib/engine/demo/gate";
import { signAnswer } from "../../../../lib/engine/demo/answer-sign";
import { ChapterAnswer } from "../../../../lib/engine/demo/extract-llm";

const ans = (id: string, value: string, quote: string): ChapterAnswer => ({
  questionId: id, label: id, subsection: "x", status: "answered",
  value, quote, confidence: "high", sourceLabel: "TEST", filingAnswerable: true,
});

const answers: Record<string, ChapterAnswer> = {
  "04.18.116": ans("04.18.116", "1.5% of total assets", "annual rate of 1.5%"),
  "04.18.117": ans("04.18.117", "17.5%", "incentive fee of 17.5%"),
};

/** Build the body the UI sends, with valid server signatures (D5). */
async function signedBody() {
  const sigs: Record<string, string> = {};
  for (const id of Object.keys(answers)) sigs[id] = await signAnswer(answers[id]);
  return { profile: { strategy: "credit", scopes: ["closed_ended"] }, ticker: "TEST", name: "Test Fund", answers, sigs };
}

const body = { profile: { strategy: "credit", scopes: ["closed_ended"] }, ticker: "TEST", name: "Test Fund", answers };

async function req(payload: unknown, withCookie: boolean) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (withCookie) headers["cookie"] = `${DEMO_COOKIE}=${await signDemoToken()}`;
  return new Request("http://localhost/api/demo/valuation/generate", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

describe("generate route", () => {
  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY; // assert the deterministic (no-key) path
  });

  it("returns 401 without the demo cookie", async () => {
    const res = await POST(await req(body, false));
    expect(res.status).toBe(401);
  });

  it("returns 400 on a missing profile", async () => {
    const res = await POST(await req({ answers: {} }, true));
    expect(res.status).toBe(400);
  });

  it("returns 400 on missing answers", async () => {
    const res = await POST(await req({ profile: body.profile }, true));
    expect(res.status).toBe(400);
  });

  it("returns a deterministic Ch4Report with no API key (no 500)", async () => {
    const res = await POST(await req(await signedBody(), true));
    expect(res.status).toBe(200);
    const report = await res.json();
    expect(report.ticker).toBe("TEST");
    expect(["GREEN", "YELLOW", "RED"]).toContain(report.rating);
    expect(Array.isArray(report.fields)).toBe(true);
    expect(report.narrative).toContain("#### Legal Structure");
    expect(report.narrative).toContain("#### Fund Summary");
  });

  it("D5: renders server-signed answers as grounded filing fields", async () => {
    const res = await POST(await req(await signedBody(), true));
    const report = await res.json();
    const fee = report.fields.find((f: { id: string }) => f.id === "04.18.116");
    expect(fee).toBeTruthy();
    expect(fee.source).toBe("filing");
    expect(fee.answer).toContain("1.5%");
  });

  it("D5: drops forged/unsigned 'answered' answers (cannot wear the grounded badge)", async () => {
    // Same answers, NO signatures → a client trying to pass off fabricated grounded facts.
    const res = await POST(await req(body, true));
    expect(res.status).toBe(200);
    const report = await res.json();
    const grounded = report.fields.filter((f: { source: string }) => f.source === "filing");
    expect(grounded.length).toBe(0);
  });

  it("D5: a tampered value invalidates the signature", async () => {
    const sb = await signedBody();
    // keep the signature but change the value the client claims was grounded
    sb.answers["04.18.116"] = { ...sb.answers["04.18.116"], value: "0.1% (forged)" };
    const res = await POST(await req(sb, true));
    const report = await res.json();
    const fee = report.fields.find((f: { id: string }) => f.id === "04.18.116");
    expect(fee).toBeFalsy(); // demoted, not rendered as a grounded fact
  });
});
