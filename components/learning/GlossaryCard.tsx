"use client";

import { useState } from "react";
import { INK, MUTED, SUBTLE, VIOLET, BORDER, BG_CARD } from "@/lib/constants";
import { GLOSSARY_BY_ID, type GlossaryTerm } from "@/lib/glossary";
import { linkify } from "./linkify";

/**
 * One glossary term card. Hierarchy: term → expansion → Meaning → "Why it
 * matters in diligence" → related chips. Anchored by `term.id` for #deep-links;
 * the `:target` flash is handled by a global keyframe in GlossaryExplorer.
 */
export default function GlossaryCard({ term }: { term: GlossaryTerm }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = `${window.location.origin}/learning-center#${term.id}`;
    const done = () => { setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
    } else {
      fallbackCopy(url, done);
    }
  }

  const related = (term.related || [])
    .map((id) => GLOSSARY_BY_ID[id])
    .filter(Boolean);

  return (
    <div
      id={term.id}
      data-term-card
      className="rounded-panel scroll-mt-28"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}`, padding: "20px 22px" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h2 className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            {term.term}
          </h2>
          {term.expansion && (
            <div className="font-body" style={{ fontSize: "0.875rem", color: MUTED, marginTop: 3 }}>
              {term.expansion}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: SUBTLE, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>
            {term.category}
          </span>
          <button
            type="button"
            onClick={copyLink}
            aria-label={`Copy link to ${term.term}`}
            className="font-mono"
            style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: copied ? VIOLET : SUBTLE, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", minHeight: 28, whiteSpace: "nowrap" }}
          >
            {copied ? "Copied!" : "Link"}
          </button>
        </div>
      </div>

      <p className="font-body" style={{ fontSize: "0.95rem", color: INK, lineHeight: 1.6, marginTop: 12 }}>
        {linkify(term.meaning, term.id)}
      </p>

      <div className="font-mono" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: SUBTLE, marginTop: 14, marginBottom: 4 }}>
        Why it matters in diligence
      </div>
      <p className="font-body" style={{ fontSize: "0.875rem", color: SUBTLE, lineHeight: 1.6 }}>
        {linkify(term.context, term.id)}
      </p>

      {related.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 16 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED }}>Related</span>
          {related.map((r) => (
            <a
              key={r.id}
              href={`#${r.id}`}
              className="font-body"
              style={{ fontSize: 12, fontWeight: 600, color: VIOLET, background: `${VIOLET}10`, borderRadius: 999, padding: "4px 10px", textDecoration: "none", lineHeight: 1.4 }}
            >
              {r.term}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function fallbackCopy(text: string, done: () => void) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    done();
  } catch {
    /* clipboard unavailable — no-op */
  }
}
