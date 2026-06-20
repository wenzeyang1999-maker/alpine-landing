import { describe, it, expect } from "vitest";
import { linkifyGlossaryHtml } from "@/lib/glossary-html";

// A representative citation span as emitted by the report's inlineFormat (the
// [[REF]] → dot-span step), with a glossary acronym sitting inside its attributes.
const REF_SPAN = `<span data-ref-source="SEC_EDGAR" data-ref-quote="filed with the SEC in 2024" title="Source: Sec Edgar" style="background:#abc"></span>`;

describe("linkifyGlossaryHtml (report tooltips)", () => {
  it("wraps a term in visible text and leaves a [[REF]] span byte-for-byte intact", () => {
    const input = `The SEC reviewed it. ${REF_SPAN} Done.`;
    const out = linkifyGlossaryHtml(input, new Set());
    // citation span unchanged (no corruption, no term-link injected into attributes)
    expect(out).toContain(REF_SPAN);
    // the visible "SEC" became one glossary link
    expect(out).toContain('data-gloss-term="SEC"');
    expect((out.match(/class="gloss-term"/g) || []).length).toBe(1);
  });

  it("never links a term that only appears inside a tag/attribute", () => {
    // "SEC" appears ONLY inside the ref span's attributes here — must stay plain.
    const input = `Nothing notable. ${REF_SPAN}`;
    const out = linkifyGlossaryHtml(input, new Set());
    expect(out).not.toContain("gloss-term");
    expect(out).toContain(REF_SPAN);
  });

  it("links terms inside formatting tags (text between <strong> tags)", () => {
    const out = linkifyGlossaryHtml("<strong>NAV</strong> is computed", new Set());
    expect(out).toContain('data-gloss-term="NAV"');
    expect(out).toContain("<strong>"); // tag preserved
  });

  it("escapes the definition into the data attribute safely", () => {
    const out = linkifyGlossaryHtml("AIFMD framework", new Set());
    expect(out).toContain('data-gloss-def="');
    expect(out).not.toContain('data-gloss-def=""'); // non-empty
  });

  it("honors first-occurrence across calls via a shared seen set", () => {
    const seen = new Set<string>();
    const a = linkifyGlossaryHtml("AIFMD here", seen);
    const b = linkifyGlossaryHtml("AIFMD again", seen);
    expect(a).toContain("gloss-term");
    expect(b).not.toContain("gloss-term");
  });
});
