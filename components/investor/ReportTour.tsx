"use client";

import { useEffect, useRef, useState } from "react";

// sessionStorage key set by InvestorTour when portfolio tour is completed
export const REPORT_TOUR_PENDING_KEY = "alpine_investor_report_tour_pending";

function tourKey(email: string) {
  return `alpine_report_tour_v1_${email}`;
}

const DEMO_EMAIL = "demo@alpinedd.com";

// ── Steps ─────────────────────────────────────────────────────────────────────

interface Step {
  selector: string;
  title: string;
  body: string;
  tip?: string;
  position: "right" | "bottom" | "left" | "top";
}

const STEPS: Step[] = [
  {
    selector: "report-header",
    title: "Fund report header",
    body: "The fund name, overall rating (Accept / Watchlist / Flag), and PDF download button are pinned here. The rating is Alpine's final ODD recommendation.",
    tip: "Download PDF to share this report with your investment committee.",
    position: "bottom",
  },
  {
    selector: "report-view-toggle",
    title: "Alpine Report vs Alpine Data",
    body: "Switch between the analyst narrative (Alpine Report) and the raw evidence base (Alpine Data) — the structured data points behind every finding, with citations.",
    tip: "Use Alpine Data to verify any specific claim in the report.",
    position: "bottom",
  },
  {
    selector: "report-toc",
    title: "Report Contents",
    body: "Jump to any chapter from here. The 8 chapters follow the same institutional framework across all Alpine reviews — from Manager Governance to LP Communications.",
    position: "right",
  },
  {
    selector: "report-overview",
    title: "Investment recommendation",
    body: "The Overview shows Alpine's recommendation, the headline rationale, and any post-close monitoring items that require follow-up before or after investment.",
    tip: "The ODD Score (0–100) lets you compare this fund against others in your portfolio.",
    position: "right",
  },
  {
    selector: "report-chapters",
    title: "Chapter-by-chapter findings",
    body: "Each chapter card shows the rating for that topic. Click a chapter in the sidebar to read the full analyst narrative — findings, flags, and evidence citations.",
    tip: "Yellow and Red chapters are the ones that need your attention.",
    position: "top",
  },
  {
    selector: "report-documents",
    title: "Source documents",
    body: "Every finding is backed by a document. Click any citation to see the exact passage Alpine's analyst reviewed — fund documents, regulatory filings, and verification records.",
    tip: "Alpine Data view links each data point directly to its source.",
    position: "top",
  },
];

// ── SVG Spotlight ─────────────────────────────────────────────────────────────

interface Rect { top: number; left: number; width: number; height: number }

function SvgSpotlight({ rect, padding = 12 }: { rect: Rect | null; padding?: number }) {
  const [displayed, setDisplayed] = useState<Rect | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setDisplayed(rect));
    return () => cancelAnimationFrame(raf.current);
  }, [rect]);

  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const x = displayed ? displayed.left - padding : vw / 2 - 100;
  const y = displayed ? displayed.top - padding : vh / 2 - 60;
  const w = displayed ? displayed.width + padding * 2 : 200;
  const h = displayed ? displayed.height + padding * 2 : 120;
  const r = 10;

  return (
    <svg style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 1000, pointerEvents: "none" }}
      viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none">
      <defs>
        <mask id="report-tour-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={r} fill="black"
            style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#report-tour-mask)" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.7"
        style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={r + 4} fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.2"
        style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

// ── Step Card ─────────────────────────────────────────────────────────────────

function StepCard({ step, index, total, rect, onNext, onSkip }: {
  step: Step; index: number; total: number; rect: Rect | null;
  onNext: () => void; onSkip: () => void;
}) {
  const CARD_W = 340;
  const PAD = 20;
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => { setVisible(true); setKey((k) => k + 1); }, 80);
    return () => clearTimeout(t);
  }, [index]);

  let style: React.CSSProperties = {
    position: "fixed", width: CARD_W, zIndex: 1002,
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(8px)",
    transition: "opacity 0.28s ease, transform 0.28s ease",
  };

  if (rect) {
    if (step.position === "right")       { style.top = rect.top; style.left = rect.left + rect.width + PAD; }
    else if (step.position === "left")   { style.top = rect.top; style.left = rect.left - CARD_W - PAD; }
    else if (step.position === "bottom") { style.top = rect.top + rect.height + PAD; style.left = rect.left + rect.width / 2 - CARD_W / 2; }
    else                                 { style.top = rect.top - 240 - PAD; style.left = rect.left + rect.width / 2 - CARD_W / 2; }
    style.left = Math.max(12, Math.min(Number(style.left), window.innerWidth - CARD_W - 12));
    style.top  = Math.max(12, Math.min(Number(style.top),  window.innerHeight - 260 - 12));
  } else {
    style.bottom = 32; style.right = 32;
  }

  const isLast = index === total - 1;

  return (
    <div key={key} style={style}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(124,58,237,0.08)", overflow: "hidden", border: "1px solid rgba(124,58,237,0.12)" }}>
        <div style={{ height: 5, background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: "16px 16px 0 0" }} />
        <div style={{ padding: "20px 22px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#7c3aed", background: "#f5f3ff", borderRadius: 99, padding: "3px 10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {index + 1} / {total}
            </span>
            <button onClick={onSkip} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2, lineHeight: 1, fontSize: 18 }}>×</button>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 8 }}>{step.title}</h3>
          <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, marginBottom: step.tip ? 10 : 18 }}>{step.body}</p>
          {step.tip && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 18, background: "#faf5ff", borderRadius: 8, padding: "8px 10px", border: "1px solid #ede9fe" }}>
              <span style={{ fontSize: 12, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 11.5, color: "#6d28d9", lineHeight: 1.5, margin: 0 }}>{step.tip}</p>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 5, flex: 1 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 99, background: i === index ? "#7c3aed" : i < index ? "#c4b5fd" : "#e5e7eb", transition: "width 0.3s ease, background 0.3s ease" }} />
              ))}
            </div>
            <button onClick={onNext} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#7c3aed", border: "none", borderRadius: 9, cursor: "pointer", boxShadow: "0 2px 8px rgba(124,58,237,0.35)" }}>
              {isLast ? "Done" : "Next"}
              {!isLast && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </div>
          {!isLast && (
            <button onClick={onSkip} style={{ marginTop: 10, width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: "#9ca3af", textAlign: "center" }}>
              Skip tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FAB ───────────────────────────────────────────────────────────────────────

function TourFab({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Take a tour"
      style={{
        position: "fixed", bottom: 20, left: 20, zIndex: 500,
        display: "flex", alignItems: "center",
        gap: hovered ? 7 : 0,
        padding: hovered ? "8px 14px 8px 10px" : "8px 10px",
        background: hovered ? "#7c3aed" : "#f5f3ff",
        border: "1.5px solid #ddd6fe",
        borderRadius: 99, cursor: "pointer",
        boxShadow: hovered ? "0 4px 16px rgba(124,58,237,0.3)" : "0 1px 6px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease", overflow: "hidden", whiteSpace: "nowrap",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hovered ? "#fff" : "#7c3aed"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 600, color: hovered ? "#fff" : "#7c3aed", maxWidth: hovered ? 80 : 0, opacity: hovered ? 1 : 0, transition: "max-width 0.2s ease, opacity 0.15s ease", overflow: "hidden" }}>
        Take a tour
      </span>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ReportTour({ email }: { email: string }) {
  const [phase, setPhase] = useState<"idle" | "touring" | "fab">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const isDemo = email === DEMO_EMAIL;

  useEffect(() => {
    // Explicit handoff from portfolio tour — highest priority
    const pending = sessionStorage.getItem(REPORT_TOUR_PENDING_KEY);
    if (pending) {
      sessionStorage.removeItem(REPORT_TOUR_PENDING_KEY);
      setPhase("touring");
      return;
    }

    if (isDemo) {
      // Demo: auto-start once per browser session, FAB on subsequent visits
      const sessionSeen = sessionStorage.getItem("alpine_report_tour_session");
      setPhase(sessionSeen ? "fab" : "touring");
      return;
    }

    // Non-demo: auto-start on first ever visit, FAB after that
    const seen = localStorage.getItem(tourKey(email));
    setPhase(seen ? "fab" : "touring");
  }, [email, isDemo]);

  useEffect(() => {
    if (phase !== "touring") { setRect(null); return; }
    function measure() {
      const el = document.querySelector(`[data-tour="${STEPS[stepIndex].selector}"]`);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    const t = setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [phase, stepIndex]);

  function finish() {
    if (isDemo) sessionStorage.setItem("alpine_report_tour_session", "1");
    else localStorage.setItem(tourKey(email), "1");
    setPhase("fab");
  }

  function next() {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else finish();
  }

  if (phase === "idle") return null;
  if (phase === "fab") return <TourFab onClick={() => { setStepIndex(0); setPhase("touring"); }} />;

  return (
    <>
      {isDemo && <TourFab onClick={() => { setStepIndex(0); setPhase("touring"); }} />}
      <SvgSpotlight rect={rect} />
      <StepCard step={STEPS[stepIndex]} index={stepIndex} total={STEPS.length} rect={rect} onNext={next} onSkip={finish} />
    </>
  );
}
