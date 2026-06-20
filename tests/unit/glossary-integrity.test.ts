import { describe, it, expect } from "vitest";
import { GLOSSARY, GLOSSARY_BY_ID, INLINE_LINKABLE_IDS } from "@/lib/glossary";

describe("glossary data integrity", () => {
  it("has unique ids", () => {
    const ids = GLOSSARY.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every related id resolves to a real term", () => {
    for (const t of GLOSSARY) {
      for (const rid of t.related || []) {
        expect(GLOSSARY_BY_ID[rid], `${t.id} → related "${rid}"`).toBeDefined();
      }
    }
  });

  it("every allowlist id resolves to a real term", () => {
    for (const id of Array.from(INLINE_LINKABLE_IDS)) {
      expect(GLOSSARY_BY_ID[id], `allowlist "${id}"`).toBeDefined();
    }
  });

  it("every term has a non-empty meaning and context", () => {
    for (const t of GLOSSARY) {
      expect(t.meaning.length, t.id).toBeGreaterThan(10);
      expect(t.context.length, t.id).toBeGreaterThan(10);
    }
  });

  it("excludes ambiguous short tokens from inline linking, keeps safe acronyms", () => {
    expect(INLINE_LINKABLE_IDS.has("ic")).toBe(false);
    expect(INLINE_LINKABLE_IDS.has("pb")).toBe(false);
    expect(INLINE_LINKABLE_IDS.has("sec")).toBe(true);
    expect(INLINE_LINKABLE_IDS.has("nav")).toBe(true);
  });
});
