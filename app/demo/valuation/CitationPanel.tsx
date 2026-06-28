"use client";
/**
 * Source document viewer (CD1–CD3): a focus-trapped modal that slides in from the right
 * (full-screen sheet on mobile). Under one header + a slim meta strip, the body is the full
 * real SEC filing (iframed, full-bleed), auto-scrolled to the cited passage with the grounded
 * quote highlighted, plus "Open on EDGAR" and "Download PDF". Never a faked document.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type CitationCtx = {
  context: string; quote: string; section: string; ticker: string;
  sourceLabel: string; sourceUrl: string; filingDate: string; docType: string; name: string;
};

const PANEL = "#0E1726", CONF = "#e0857f";

export default function CitationPanel({ open, ctx, onClose }: { open: boolean; ctx: CitationCtx | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [frameLoading, setFrameLoading] = useState(true);
  useEffect(() => { setFrameLoading(true); }, [ctx?.ticker, ctx?.quote]);

  // Passage mode (BYO): no ticker => no cached full document, so render the inline context
  // window with the verbatim quote highlighted instead of the full-document iframe.
  const passageMode = !!ctx && !ctx.ticker;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>('button,a[href],[tabindex]:not([tabindex="-1"])');
        if (els.length === 0) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); restoreRef.current?.focus(); };
  }, [open, onClose]);

  const download = useCallback(async () => {
    if (!ctx) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/demo/valuation/excerpt-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ctx),
      });
      if (res.ok) {
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${ctx.name.replace(/\W+/g, "_")}_excerpt.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } finally { setDownloading(false); }
  }, [ctx]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Source document"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(12,17,28,0.55)", display: "flex", justifyContent: "flex-end" }}>
      <style>{`@keyframes cpin{from{transform:translateX(24px);opacity:.6}to{transform:none;opacity:1}}
        .cp-panel{width:560px;max-width:78vw}
        @media(max-width:768px){.cp-panel{width:100vw!important;max-width:100vw!important}}
        @media(prefers-reduced-motion:reduce){.cp-panel{animation:none!important}}`}</style>

      <div ref={panelRef} className="cp-panel" style={{ background: PANEL, height: "100%", display: "flex", flexDirection: "column", boxShadow: "-16px 0 40px rgba(0,0,0,.35)", animation: "cpin .18s ease-out" }}>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#9aa6bd", fontSize: 17 }}>▤</span>
            <span>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "#fff" }}>{ctx?.docType ?? "Filing"}</span>
              <span style={{ display: "block", fontSize: 11, color: "#8b97ad" }}>{ctx?.name ?? ""}</span>
            </span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9.5, letterSpacing: ".6px", color: "#aeb8cc", border: "1px solid rgba(255,255,255,.18)", padding: "3px 8px", borderRadius: 5 }}>REGULATORY FILING</span>
            <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: "#8b97ad", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
          </span>
        </div>

        {/* meta strip: filing date + cited section + single CONFIDENTIAL marker */}
        {ctx && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "9px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <span style={{ fontSize: 11.5, color: "#8b97ad", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ctx.filingDate ? `Filed ${ctx.filingDate}` : ""}
              {ctx.section ? `${ctx.filingDate ? " · " : ""}${ctx.section}` : ""}
            </span>
            <span style={{ flex: "none", fontSize: 9, letterSpacing: ".6px", color: CONF, border: `1px solid ${CONF}`, padding: "2px 7px", borderRadius: 4 }}>CONFIDENTIAL</span>
          </div>
        )}

        {/* body: full-bleed real filing (curated, ticker present) — OR an inline passage card (BYO, no ticker / no cached document) */}
        <div style={{ position: "relative", flex: 1, background: "#fff", overflow: "hidden" }}>
          {!ctx ? (
            <div style={{ padding: 24 }}>
              {[90, 70, 100, 95, 60].map((w, i) => <div key={i} style={{ height: 11, width: `${w}%`, background: "#EEF0F3", borderRadius: 4, margin: "10px 0" }} />)}
            </div>
          ) : passageMode ? (
            <div style={{ height: "100%", overflowY: "auto", padding: "22px 24px" }}>
              <div style={{ fontSize: 10.5, letterSpacing: ".6px", color: "#6B7280", textTransform: "uppercase", marginBottom: 10 }}>Cited passage from the filing</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#1F2937", fontFamily: "Georgia, 'Times New Roman', serif", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 18px" }}>
                {renderPassage(ctx.context, ctx.quote)}
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 12 }}>The highlighted span is the verbatim quote a deterministic gate matched against the source text.</div>
            </div>
          ) : (
            <>
              <iframe
                title="Original filing"
                src={`/api/demo/valuation/filing?ticker=${encodeURIComponent(ctx.ticker)}&q=${encodeURIComponent(ctx.quote)}`}
                onLoad={() => setFrameLoading(false)}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
              {frameLoading && (
                <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6B7280" }}>
                  Loading the full filing and jumping to the cited passage…
                </div>
              )}
            </>
          )}
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: 10, padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          {!passageMode && (
            <button onClick={download} data-autofocus disabled={!ctx || downloading}
              title="Download a one-page PDF of the cited passage with surrounding context"
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#10402f", color: "#d6f5e6", border: "1px solid #1c5a42", borderRadius: 7, padding: 10, fontSize: 12.5, cursor: ctx ? "pointer" : "default", opacity: ctx ? 1 : 0.5 }}>
              {downloading ? "Preparing…" : "↓ Download excerpt"}
            </button>
          )}
          {(!passageMode || (ctx && ctx.sourceUrl)) && (
            <a href={ctx?.sourceUrl || "#"} target="_blank" rel="noreferrer" {...(passageMode ? { "data-autofocus": true } : {})}
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "transparent", color: "#aeb8cc", border: "1px solid rgba(255,255,255,.18)", borderRadius: 7, padding: 10, fontSize: 12.5, textDecoration: "none" }}>
              ↗ Open on EDGAR
            </a>
          )}
          {passageMode && !(ctx && ctx.sourceUrl) && (
            <button onClick={onClose} data-autofocus
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "transparent", color: "#aeb8cc", border: "1px solid rgba(255,255,255,.18)", borderRadius: 7, padding: 10, fontSize: 12.5, cursor: "pointer" }}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Render an inline passage with the verbatim quote highlighted (BYO passage mode).
 * The quote is a literal substring of the context (it is gated against the source text),
 * so a single indexOf split is safe. Falls back to the plain passage if not found.
 */
function renderPassage(context: string, quote: string): ReactNode {
  if (!quote) return context;
  const i = context.indexOf(quote);
  if (i < 0) return context;
  const before = context.slice(0, i);
  const after = context.slice(i + quote.length);
  return (
    <>
      {before}
      <mark style={{ background: "#FEF3C7", color: "#92400E", padding: "1px 2px", borderRadius: 2 }}>{quote}</mark>
      {after}
    </>
  );
}
