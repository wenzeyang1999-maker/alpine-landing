"use client";

import { useEffect, useRef, useState } from "react";
import { ANSWER_REFS } from "@/lib/manager/answer-refs";

export interface SourceMatch {
  documentId: string;
  filename: string;
  passage: string;
  before: string;
  after: string;
  score: number;
  page?: number;
  section?: string;
  url?: string | null;
}

interface Props {
  questionId: string;
  questionText: string;
  answerText: string;
  pinned?: SourceMatch | null;
  onPin?: (match: SourceMatch) => void;
  /** signed URL map: filename → url */
  docUrls?: Record<string, string>;
}

// ── DocViewerPanel ────────────────────────────────────────────────────────────

function DocViewerPanel({ match, onClose }: { match: SourceMatch; onClose: () => void }) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const shortName = match.filename.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 400, animation: "fadeIn 0.15s ease" }}
      />

      {/* Sliding panel */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(620px, 50vw)",
          background: "#fff",
          borderLeft: "1px solid #e5e7eb",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          zIndex: 401,
          display: "flex", flexDirection: "column",
          animation: "slideInRight 0.22s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortName}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{match.filename}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 4, padding: "2px 7px", letterSpacing: "0.05em" }}>
              {Math.round(match.score * 100)}% MATCH
            </span>
            <button onClick={onClose} style={{ color: "#9ca3af", fontSize: 18, lineHeight: 1, padding: "0 4px", background: "none", border: "none", cursor: "pointer" }}>&times;</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* Simulated document page */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "Georgia, 'Times New Roman', serif" }}>

            {/* Page header band */}
            <div style={{ background: "#1e3a5f", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.1em", textTransform: "uppercase" }}>{shortName}</span>
              <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #ef4444", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
            </div>

            {/* Page content */}
            <div style={{ display: "flex", padding: "24px 0 28px" }}>
              {/* Left margin bar — amber indicator */}
              <div style={{ width: 36, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 3, background: "#f59e0b", borderRadius: 2, alignSelf: "stretch", marginTop: 60, opacity: 0.85 }} />
              </div>

              {/* Text column */}
              <div style={{ flex: 1, paddingRight: 28 }}>
                {/* Doc title */}
                <div style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{shortName}</div>
                </div>

                {/* Paragraph with highlighted passage */}
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#1f2937", margin: 0, textAlign: "justify" }}>
                  {match.before && (
                    <span style={{ color: "#6b7280" }}>{match.before} </span>
                  )}
                  <mark style={{
                    background: "#ffec3d",
                    color: "#111",
                    borderRadius: 1,
                    padding: "1px 1px",
                    WebkitBoxDecorationBreak: "clone",
                    boxDecorationBreak: "clone",
                  }}>
                    {match.passage}
                  </mark>
                  {match.after && (
                    <span style={{ color: "#6b7280" }}> {match.after}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Page footer */}
            <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "7px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{match.section ?? match.filename}</span>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{match.page ? `Page ${match.page}` : ""}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            {match.url && (
              <a
                href={match.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, textDecoration: "none", fontFamily: "sans-serif" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                Open Full PDF
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ── SourceDot ─────────────────────────────────────────────────────────────────

export function SourceDot({ questionId, questionText, answerText, pinned, onPin, docUrls }: Props) {
  const [docOpen, setDocOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<SourceMatch | null>(pinned ?? null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Sync pinned prop
  useEffect(() => { setMatch(pinned ?? null); }, [pinned]);

  // Check if hardcoded reference exists for this question
  const hardcoded = ANSWER_REFS[questionId];

  async function handleDotClick() {
    // Use hardcoded reference if available — open doc viewer directly
    if (hardcoded) {
      const url = docUrls?.[hardcoded.documentFile] ?? null;
      setMatch({
        documentId: hardcoded.documentFile,
        filename: hardcoded.documentFile,
        passage: hardcoded.quote,
        before: hardcoded.before,
        after: hardcoded.after,
        score: 1,
        page: hardcoded.page,
        section: hardcoded.section,
        url,
      });
      setDocOpen(true);
      return;
    }

    // Already have a match — open doc viewer directly
    if (match) { setDocOpen(true); return; }

    // Fallback: auto-match via API, then open viewer
    setLoading(true);
    try {
      const res = await fetch("/api/manager/documents/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, answerText }),
      });
      const data = await res.json();
      const top1: SourceMatch | null = data.matches?.[0] ?? null;
      setMatch(top1);
      if (top1) setDocOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const hasPinned = !!pinned || !!hardcoded;
  const dotTitle = hardcoded
    ? `Source: ${hardcoded.documentFile} — Page ${hardcoded.page}`
    : pinned
    ? `Source: ${pinned.filename}`
    : loading
    ? "Searching documents…"
    : "Find source in documents";

  return (
    <>
      {/* The dot */}
      <span
        ref={dotRef}
        onClick={handleDotClick}
        title={dotTitle}
        style={{
          display: "inline-block",
          width: 7, height: 7,
          borderRadius: "50%",
          background: hasPinned ? "#7c3aed" : "transparent",
          border: hasPinned ? "none" : "1.5px solid #9ca3af",
          marginLeft: 5,
          verticalAlign: "middle",
          cursor: "pointer",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      />

      {/* DocViewerPanel */}
      {docOpen && match && (
        <DocViewerPanel match={match} onClose={() => setDocOpen(false)} />
      )}
    </>
  );
}
