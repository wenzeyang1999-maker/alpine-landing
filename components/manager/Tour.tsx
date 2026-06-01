"use client";

import { useEffect, useRef, useState } from "react";

// Key is scoped per email so different users on the same browser are tracked separately
function tourSeenKey(email: string) {
  return `alpine_tour_seen_v3_${email}`;
}

// ── Step definitions ──────────────────────────────────────────────────────────

interface Step {
  selector: string;
  title: string;
  body: string;
  tip?: string;
  position: "right" | "bottom" | "left" | "top";
}

const STEPS: Step[] = [
  {
    selector: "chapters-nav",
    title: "Navigate your 8 chapters",
    body: "Your DDQ is split across 8 institutional chapters — from Manager Governance to LP Communications. Click any chapter to jump directly to its questions.",
    tip: "Chapters are colour-coded by act: purple, green, and amber.",
    position: "right",
  },
  {
    selector: "hero-card",
    title: "Your Living DDQ",
    body: "This is your overall completion status. Answers auto-save as you type — no manual saving needed.",
    tip: "Your DDQ lives here permanently — update it any time.",
    position: "bottom",
  },
  {
    selector: "chapters-grid",
    title: "Chapter-by-chapter progress",
    body: "Each card shows how many questions you've answered in that chapter. The colour bar reflects the act type. Click any card to open its questions.",
    tip: "Green bar = 100% complete for that chapter.",
    position: "top",
  },
  {
    selector: "progress-panel",
    title: "Overall progress",
    body: "This shows your total completion percentage and how many questions you've answered across all 8 chapters.",
    tip: "The percentage updates live as you fill in answers.",
    position: "left",
  },
  {
    selector: "review-panel",
    title: "Review status",
    body: "Track which answers are unreviewed, flagged for follow-up, or marked as reviewed. Use Flag and Reviewed buttons inside each question to keep your DDQ audit-ready.",
    tip: "Allocators expect answers to be reviewed before submission.",
    position: "left",
  },
  {
    selector: "documents-panel",
    title: "Supporting documents",
    body: "Upload PDFs here — fund documents, compliance manuals, financial statements. Alpine uses them to auto-match source passages for each answer you give.",
    tip: "Click the purple dot next to any answered question to see the matched source text.",
    position: "left",
  },
  {
    selector: "invite-panel",
    title: "Invite your team",
    body: "Generate a link so teammates can join this workspace. They set their own password on first use and can collaborate on answers in real time.",
    tip: "Each invited user can answer questions and upload documents.",
    position: "left",
  },
  {
    selector: "ai-draft-btn",
    title: "Load AI Draft Answers",
    body: "This pre-fills all questions with AI-generated draft answers based on your fund documents. You have 20 runs shared across your team — each click counts as one run.",
    tip: "Review and edit every answer before sharing with allocators.",
    position: "bottom",
  },
  {
    selector: "continue-btn",
    title: "You're ready to go",
    body: "Click Continue to start answering questions from where you left off. You can jump to any chapter at any time using the sidebar.",
    tip: "Everything auto-saves — come back any time.",
    position: "bottom",
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
    <svg
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 1000, pointerEvents: "none" }}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="none"
    >
      <defs>
        <mask id="tour-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={x} y={y} width={w} height={h} rx={r}
            fill="black"
            style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.68)" mask="url(#tour-mask)" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.7"
        style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={r + 4} fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.2"
        style={{ transition: "x 0.45s cubic-bezier(0.4,0,0.2,1), y 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

// ── Step tooltip card ─────────────────────────────────────────────────────────

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
    style.top  = Math.max(12, Math.min(Number(style.top),  window.innerHeight - 240 - 12));
  } else {
    style.bottom = 32; style.right = 32;
  }

  const isLast = index === total - 1;

  return (
    <div key={key} style={style}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(124,58,237,0.08)", overflow: "hidden", border: "1px solid rgba(124,58,237,0.12)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: "16px 16px 0 0" }} />
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

// ── Welcome modal ─────────────────────────────────────────────────────────────

function WelcomeModal({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ width: 440, borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", animation: "welcomeIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a78bfa 100%)", padding: "32px 32px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 8 }}>Welcome to your Living DDQ</h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            The same 8-chapter institutional framework allocators use to evaluate managers — your answers are live, version-controlled, and shareable.
          </p>
        </div>
        <div style={{ background: "#fff", padding: "24px 32px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              { icon: "📋", text: "Answer institutional questions across 8 chapters" },
              { icon: "📎", text: "Auto-match answers to source documents" },
              { icon: "👥", text: "Invite teammates to collaborate in real time" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16, width: 28, textAlign: "center" }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.5 }}>Would you like a quick tour of the workspace?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onSkip} style={{ flex: 1, padding: "11px 16px", fontSize: 13, fontWeight: 500, color: "#6b7280", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, cursor: "pointer" }}>
              Skip for now
            </button>
            <button onClick={onStart} style={{ flex: 2, padding: "11px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#7c3aed", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
              Show me around
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes welcomeIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

// ── Floating mini-button (shown after tour is dismissed) ──────────────────────

function TourFab({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Take a tour"
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: hovered ? 7 : 0,
        padding: hovered ? "8px 14px 8px 10px" : "8px 10px",
        background: hovered ? "#7c3aed" : "#f5f3ff",
        border: "1.5px solid #ddd6fe",
        borderRadius: 99,
        cursor: "pointer",
        boxShadow: hovered ? "0 4px 16px rgba(124,58,237,0.3)" : "0 1px 6px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* Map icon */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hovered ? "#fff" : "#7c3aed"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
      </svg>
      {/* Label — expands on hover */}
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: hovered ? "#fff" : "#7c3aed",
        maxWidth: hovered ? 80 : 0,
        opacity: hovered ? 1 : 0,
        transition: "max-width 0.2s ease, opacity 0.15s ease",
        overflow: "hidden",
      }}>
        Take a tour
      </span>
    </button>
  );
}

// ── Main Tour ─────────────────────────────────────────────────────────────────

export default function Tour({ email }: { email: string }) {
  const [phase, setPhase] = useState<"idle" | "welcome" | "touring" | "fab">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(tourSeenKey(email));
    // First visit: show welcome modal. Any subsequent visit: go straight to FAB.
    setPhase(seen ? "fab" : "welcome");
  }, [email]);

  useEffect(() => {
    if (phase !== "touring") { setRect(null); return; }
    function measure() {
      const el = document.querySelector(`[data-tour="${STEPS[stepIndex].selector}"]`);
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
    localStorage.setItem(tourSeenKey(email), "1");
    setPhase("fab");
  }

  function next() {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else finish();
  }

  function reopenTour() {
    setStepIndex(0);
    setPhase("welcome");
  }

  if (phase === "idle") return null;
  if (phase === "fab") return <TourFab onClick={reopenTour} />;
  if (phase === "welcome") return <WelcomeModal onStart={() => setPhase("touring")} onSkip={finish} />;

  return (
    <>
      <SvgSpotlight rect={rect} />
      <StepCard step={STEPS[stepIndex]} index={stepIndex} total={STEPS.length} rect={rect} onNext={next} onSkip={finish} />
    </>
  );
}
