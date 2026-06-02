"use client";

import { useEffect, useRef, useState } from "react";
import { REPORT_TOUR_PENDING_KEY } from "@/components/investor/ReportTour";

function tourKey(email: string) {
  return `alpine_investor_tour_v1_${email}`;
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
    selector: "investor-sidebar",
    title: "Navigate your portfolio",
    body: "Use the sidebar to switch between Portfolio Overview, Active Reviews, Fund Universe, and analytics views — Peer Comparison and Risk Heatmap.",
    tip: "Click any section to jump directly to it.",
    position: "right",
  },
  {
    selector: "investor-portfolio-stats",
    title: "Your portfolio at a glance",
    body: "See the total number of funds, unique strategies, and combined AUM across all reports Alpine has prepared for you.",
    tip: "Green = Accept, Amber = Watchlist, Red = Flag.",
    position: "bottom",
  },
  {
    selector: "investor-odd-score",
    title: "Portfolio ODD Score",
    body: "The donut shows your average ODD score across all funds. The arc segments reflect the split between Accept, Watchlist, and Flag-rated funds.",
    tip: "A higher score means stronger operational due diligence across your portfolio.",
    position: "left",
  },
  {
    selector: "investor-topic-health",
    title: "8-Topic Health",
    body: "Each chip shows the pass rate for one of Alpine's 8 due diligence chapters — from Governance to LP Reporting. Red means a majority of funds have issues in that topic.",
    tip: "Click into any fund to see the chapter-level detail.",
    position: "bottom",
  },
  {
    selector: "investor-fund-table",
    title: "Your fund reports",
    body: "Each row is one fund Alpine has reviewed. The 8-letter grid shows per-chapter ratings at a glance: G = Accept, Y = Watchlist, R = Flag.",
    tip: "Click any row to open the full ODD report for that fund.",
    position: "top",
  },
  {
    selector: "investor-open-report",
    title: "Open a full report",
    body: "Click Open → to access the complete due diligence report — flag breakdown, source documents, and chapter-by-chapter findings prepared by Alpine analysts.",
    tip: "Reports are live and updated whenever Alpine completes a review cycle.",
    position: "left",
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
        <mask id="investor-tour-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={r} fill="black"
            style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#investor-tour-mask)" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"
        style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={r + 4} fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.2"
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
    else                                 { style.top = rect.top - 220 - PAD; style.left = rect.left + rect.width / 2 - CARD_W / 2; }
    style.left = Math.max(12, Math.min(Number(style.left), window.innerWidth - CARD_W - 12));
    style.top  = Math.max(12, Math.min(Number(style.top),  window.innerHeight - 260 - 12));
  } else {
    // Centered fallback when anchor element not found (e.g. hidden on mobile)
    style.top = "50%";
    style.left = "50%";
    style.transform = "translate(-50%, -50%)";
    style.width = Math.min(CARD_W, (typeof window !== "undefined" ? window.innerWidth : 360) - 32);
  }

  const isLast = index === total - 1;

  return (
    <div key={key} style={style}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(34,197,94,0.08)", overflow: "hidden", border: "1px solid rgba(34,197,94,0.15)" }}>
        <div style={{ height: 5, background: "linear-gradient(90deg, #16a34a, #22c55e, #86efac)", borderRadius: "16px 16px 0 0" }} />
        <div style={{ padding: "20px 22px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", borderRadius: 99, padding: "3px 10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {index + 1} / {total}
            </span>
            <button onClick={onSkip} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2, lineHeight: 1, fontSize: 18 }}>×</button>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 8 }}>{step.title}</h3>
          <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, marginBottom: step.tip ? 10 : 18 }}>{step.body}</p>
          {step.tip && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 18, background: "#f0fdf4", borderRadius: 8, padding: "8px 10px", border: "1px solid #bbf7d0" }}>
              <span style={{ fontSize: 12, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 11.5, color: "#15803d", lineHeight: 1.5, margin: 0 }}>{step.tip}</p>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 5, flex: 1 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 99, background: i === index ? "#22c55e" : i < index ? "#86efac" : "#e5e7eb", transition: "width 0.3s ease, background 0.3s ease" }} />
              ))}
            </div>
            <button onClick={onNext} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#16a34a", border: "none", borderRadius: 9, cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.35)" }}>
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

// ── Welcome Modal ─────────────────────────────────────────────────────────────

function WelcomeModal({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ width: 440, borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", animation: "investorWelcomeIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ background: "linear-gradient(135deg, #14532d 0%, #16a34a 55%, #4ade80 100%)", padding: "32px 32px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 8 }}>
            Welcome to your ODD Portal
          </h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: 0 }}>
            Alpine&apos;s institutional-grade operational due diligence platform — your fund reports, ratings, and risk analytics in one place.
          </p>
        </div>
        <div style={{ background: "#fff", padding: "24px 32px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              { icon: "📊", text: "Portfolio-level ODD scoring across all your funds" },
              { icon: "🔍", text: "8-topic chapter ratings — Governance to LP Reporting" },
              { icon: "📄", text: "Full analyst reports with source-level evidence" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16, width: 28, textAlign: "center" }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.5 }}>
            Would you like a quick tour of the portal?
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onSkip} style={{ flex: 1, padding: "11px 16px", fontSize: 13, fontWeight: 500, color: "#6b7280", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, cursor: "pointer" }}>
              Skip for now
            </button>
            <button onClick={onStart} style={{ flex: 2, padding: "11px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#16a34a", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 14px rgba(22,163,74,0.4)" }}>
              Show me around
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes investorWelcomeIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
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
        background: hovered ? "#16a34a" : "#f0fdf4",
        border: "1.5px solid #bbf7d0",
        borderRadius: 99, cursor: "pointer",
        boxShadow: hovered ? "0 4px 16px rgba(22,163,74,0.3)" : "0 1px 6px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease", overflow: "hidden", whiteSpace: "nowrap",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hovered ? "#fff" : "#16a34a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 600, color: hovered ? "#fff" : "#16a34a", maxWidth: hovered ? 80 : 0, opacity: hovered ? 1 : 0, transition: "max-width 0.2s ease, opacity 0.15s ease", overflow: "hidden" }}>
        Take a tour
      </span>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function InvestorTour({ email }: { email: string }) {
  const [phase, setPhase] = useState<"idle" | "welcome" | "touring" | "fab">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const isDemo = email === DEMO_EMAIL;

  useEffect(() => {
    if (isDemo) {
      setPhase("welcome");
    } else {
      const seen = localStorage.getItem(tourKey(email));
      setPhase(seen ? "fab" : "welcome");
    }
  }, [email, isDemo]);

  useEffect(() => {
    if (phase !== "touring") { setRect(null); return; }
    function measure() {
      // Pick the first element that is actually rendered and visible
      const candidates = document.querySelectorAll(`[data-tour="${STEPS[stepIndex].selector}"]`);
      let el: Element | null = null;
      for (const c of Array.from(candidates)) {
        const r = c.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) { el = c; break; }
      }
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    const t = setTimeout(measure, 50);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [phase, stepIndex]);

  function finish() {
    if (!isDemo) localStorage.setItem(tourKey(email), "1");
    setPhase("fab");
  }

  function next() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // Last step done — signal the report page to auto-start its tour
      sessionStorage.setItem(REPORT_TOUR_PENDING_KEY, "1");
      finish();
    }
  }

  function reopenTour() {
    setStepIndex(0);
    setPhase("welcome");
  }

  if (phase === "idle") return null;

  const showFab = phase === "fab" || isDemo;

  if (phase === "fab") return <TourFab onClick={reopenTour} />;

  return (
    <>
      {showFab && <TourFab onClick={reopenTour} />}
      {phase === "welcome" && <WelcomeModal onStart={() => setPhase("touring")} onSkip={finish} />}
      <SvgSpotlight rect={phase === "touring" ? rect : null} />
      {phase === "touring" && (
        <StepCard step={STEPS[stepIndex]} index={stepIndex} total={STEPS.length} rect={rect} onNext={next} onSkip={finish} />
      )}
    </>
  );
}
