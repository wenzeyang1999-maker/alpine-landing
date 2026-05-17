"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, BORDER, BORDER_SUBTLE,
} from "@/lib/constants";

type Item = { text: string; dot?: string; check?: string };
type Stat = { value: string; label: string };

const STEPS: {
  label: string;
  color: string;
  stats: Stat[];
  body: string;
  cols: number;
  items: Item[];
}[] = [
  {
    label: "Collect",
    color: VIOLET,
    stats: [
      { value: "14+",   label: "document types" },
      { value: "< 60s", label: "to classify" },
      { value: "Zero",  label: "manual tagging" },
    ],
    body: "Drop your files. Alpine recognizes each document type and maps it to your fund's analysis path automatically — before the review even begins.",
    cols: 4,
    items: [
      { text: "Form ADV" }, { text: "DDQ Response" }, { text: "Compliance Manual" }, { text: "PPM" },
      { text: "Org Chart" }, { text: "Audited Financials" }, { text: "BCP/DR Plan" }, { text: "Cybersecurity Policy" },
    ],
  },
  {
    label: "Verify",
    color: AMBER,
    stats: [
      { value: "54",        label: "regulators checked" },
      { value: "3",         label: "coverage tiers" },
      { value: "Automated", label: "up-to-date data" },
    ],
    body: "Alpine cross-references registration and disciplinary data across 54 regulators in 3 tiers — SEC EDGAR, FCA, MAS, SFC, CSSF, ASIC, and 48 more — automated and kept current.",
    cols: 4,
    items: [
      { text: "SEC / IAPD",          check: GREEN }, { text: "FCA (UK)",          check: GREEN },
      { text: "OSC (Canada)",        check: GREEN }, { text: "MAS (Singapore)",   check: GREEN },
      { text: "SFC (Hong Kong)",     check: GREEN }, { text: "CSSF (Luxembourg)", check: GREEN },
      { text: "ASIC (Australia)",    check: GREEN }, { text: "AMF (France)",      check: GREEN },
    ],
  },
  {
    label: "Analyze",
    color: GREEN,
    stats: [
      { value: "~1,000", label: "questions asked" },
      { value: "38",  label: "fund strategies" },
      { value: "8",   label: "Chapters" },
    ],
    body: "The same eight chapters apply to every fund. Inside them, the question set adapts to your fund's structure, type, and strategy — surfacing gaps a generic checklist would miss.",
    cols: 4,
    items: [
      { text: "01 · Manager Ownership & Governance",      dot: GREEN },
      { text: "02 · Legal, Regulatory & Compliance",       dot: GREEN },
      { text: "03 · Tech, Cyber & Resilience",             dot: GREEN },
      { text: "04 · Fund Structure, Terms & Alignment",    dot: GREEN },
      { text: "05 · Service Providers & Oversight",        dot: GREEN },
      { text: "06 · Investment Ops & Portfolio Controls",  dot: GREEN },
      { text: "07 · Valuation, Asset Existence & Reporting", dot: GREEN },
      { text: "08 · Manager Transparency & LP Comms",      dot: GREEN },
    ],
  },
  {
    label: "Interviews",
    color: AMBER,
    stats: [
      { value: "30–60 min",   label: "live calls" },
      { value: "8 chapters",  label: "covered" },
      { value: "Verified",    label: "with manager & admin" },
    ],
    body: "Live calls with the Manager and the Administrator to verify findings, walk through operational gaps, and capture context that documents alone can't. The analyst leads. The Manager and Administrator confirm or reconcile.",
    cols: 1,
    items: [
      { text: "Pre-call brief delivered to the Manager",          check: AMBER },
      { text: "Eight-chapter walkthrough on the call",            check: AMBER },
      { text: "Administrator interview on ops and controls",      check: AMBER },
      { text: "Findings cross-checked against source documents",  check: AMBER },
      { text: "Remediation pathways scoped together",             check: AMBER },
    ],
  },
  {
    label: "Review & Remediations",
    color: VIOLET,
    stats: [
      { value: "5–8",            label: "business days" },
      { value: "Citations",      label: "linked with traceability" },
      { value: "100% Human",     label: "reviewed" },
      { value: "Risks flagged",  label: "with remediations" },
    ],
    body: "An ODD expert owns the final review. Every finding cited to source. Every risk paired with a remediation pathway. Defensible in front of your IC.",
    cols: 2,
    items: [
      { text: "Evidence map & source citations" },             { text: "Remediation pathway per risk" },
      { text: "IC-ready report package" },                     { text: "Advisory Board oversight" },
      { text: "Ongoing monitoring available" },                { text: "Cross-verified findings & ratings" },
    ],
  },
];

export default function HeroMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const step = STEPS[activeStep] ?? STEPS[0];

  const mockupMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : {
        initial: { opacity: 0, y: 24 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: 0.1 },
      };

  const panelMotion = shouldReduceMotion
    ? ({ initial: false, animate: false, transition: { duration: 0 } } as const)
    : ({
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.18 },
      } as const);

  return (
    <motion.div
      ref={ref}
      id="hero-mockup"
      className="max-w-5xl mx-auto mt-10"
      {...mockupMotion}
    >
      <div
        className="rounded-panel overflow-hidden"
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: AMBER }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
          </div>
          <div className="flex-1 mx-4">
            <div
              className="rounded px-3 py-1 text-[11px] font-sans max-w-xs mx-auto text-center"
              style={{ background: BG_CARD, color: MUTED, border: `1px solid ${BORDER}`, letterSpacing: "0.01em" }}
            >
              alpinedd.com/review/trellis-capital-iv
            </div>
          </div>
        </div>

        {/* Folder tabs — toggle buttons (not ARIA tab pattern; no arrow-key handler implemented) */}
        <div
          className="flex items-end px-4 pt-3 overflow-x-auto"
          style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
          aria-label="Operational due diligence workflow"
        >
          {STEPS.map((s, i) => {
            const isActive = i === activeStep;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => setActiveStep(i)}
                onMouseEnter={() => setActiveStep(i)}
                onFocus={() => setActiveStep(i)}
                aria-pressed={isActive}
                className="relative flex min-w-max flex-1 items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 text-[12px] sm:text-[14px] font-body whitespace-nowrap transition-colors"
                style={{
                  background: isActive ? BG_CARD : "transparent",
                  color: isActive ? INK : MUTED,
                  fontWeight: isActive ? 600 : 500,
                  borderTop: isActive ? `1px solid ${BORDER}` : "1px solid transparent",
                  borderLeft: isActive ? `1px solid ${BORDER}` : "1px solid transparent",
                  borderRight: isActive ? `1px solid ${BORDER}` : "1px solid transparent",
                  borderBottom: isActive ? `1px solid ${BG_CARD}` : "none",
                  borderRadius: "6px 6px 0 0",
                  marginBottom: isActive ? "-1px" : "0",
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-sans text-white shrink-0"
                  style={{ background: s.color, fontWeight: 700, opacity: isActive ? 1 : 0.7 }}
                >
                  {i + 1}
                </div>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Tab content panel */}
        <div className="p-4 sm:p-6 md:p-8" style={{ background: BG_CARD, minHeight: "220px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              {...panelMotion}
            >
              <div className="grid gap-3 mb-4 sm:gap-4 sm:mb-5" style={{ gridTemplateColumns: `repeat(${step.stats.length}, minmax(0, 1fr))` }}>
                {step.stats.map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-heading"
                      style={{ fontSize: "clamp(1.125rem, 3.6vw, 2rem)", fontWeight: 700, color: step.color, letterSpacing: "-0.05em", lineHeight: 1 }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="metric-label mt-1"
                      style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)", fontWeight: 700, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-body mb-4 sm:mb-5" style={{ fontSize: "clamp(0.8125rem, 2.5vw, 0.9375rem)", fontWeight: 500, lineHeight: 1.65, color: SECONDARY, letterSpacing: "-0.015em" }}>
                {step.body}
              </p>

              <div className="mb-3 sm:mb-4" style={{ height: "1px", background: BORDER }} />

              <div className={[
                "grid gap-1.5 sm:gap-2",
                step.cols === 4 ? "grid-cols-2 sm:grid-cols-4" :
                step.cols === 2 ? "grid-cols-1 sm:grid-cols-2" :
                "grid-cols-1",
              ].join(" ")}>
                {step.items.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-1.5 rounded-card px-2.5 py-2 sm:px-4 sm:py-2.5 font-body"
                    style={{ background: BORDER_SUBTLE, border: `1px solid ${BORDER}`, color: SECONDARY, fontWeight: 500, fontSize: "clamp(0.6875rem, 2vw, 0.8125rem)" }}
                  >
                    {item.check && (
                      <span className="shrink-0" style={{ color: item.check, fontSize: "10px", fontWeight: 600 }}>✓</span>
                    )}
                    {item.dot && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.dot }} />
                    )}
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
