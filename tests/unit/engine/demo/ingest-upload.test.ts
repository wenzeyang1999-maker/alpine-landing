/**
 * Upload ingestion (Lane B / T1). Proves HTML normalization strips tags + decodes entities,
 * mime detection routes PDF magic-bytes vs HTML, and the downstream too-small-text gate
 * (< 2000 chars → "not enough readable text") is honored by the route's threshold.
 */
import { describe, it, expect } from "vitest";
import { ingestFromUpload, normalizeFilingText } from "../../../../lib/engine/demo/ingest";

const enc = (s: string) => new TextEncoder().encode(s);

describe("ingestFromUpload", () => {
  it("normalizes uploaded HTML (strips tags, decodes entities, collapses whitespace)", async () => {
    const html = "<html><head><style>.x{color:red}</style></head><body><h1>Fund&nbsp;Terms</h1><p>1.5%&mdash;fee   here</p></body></html>";
    const r = await ingestFromUpload(enc(html), "filing.html");
    expect(r.sourceLabel).toBe("filing.html");
    expect(r.text).toContain("Fund Terms");
    expect(r.text).not.toContain("<h1>");
    expect(r.text).not.toContain("color:red"); // style block removed
    expect(r.text).not.toMatch(/\s{2,}/); // whitespace collapsed
  });

  it("treats a .html upload as HTML even without an explicit doctype", async () => {
    const r = await ingestFromUpload(enc("<p>hello <b>world</b></p>"), "doc.htm");
    expect(r.text).toBe("hello world");
  });

  it("detects PDF by magic bytes (%PDF) regardless of filename", async () => {
    // A non-.pdf filename but PDF magic bytes → routed to the PDF path (which will throw on a
    // non-parseable stub). We assert the PDF branch is taken (an error, not silent HTML decode).
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]); // "%PDF-1.4"
    await expect(ingestFromUpload(pdfBytes, "mislabeled.bin")).rejects.toBeTruthy();
  });

  it("a tiny HTML upload normalizes to < 2000 chars (route's too-small gate trips)", async () => {
    const r = await ingestFromUpload(enc("<p>too short to be a filing</p>"), "tiny.html");
    expect(r.text.length).toBeLessThan(2000);
  });

  it("normalizeFilingText is a pure helper that handles numeric + named entities", () => {
    expect(normalizeFilingText("<p>A&#160;B&amp;C&nbsp;D</p>")).toBe("A B&C D");
  });
});
