"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  BG, BG_CARD, BG_AMBER, INK, SECONDARY, MUTED, SUBTLE, VIOLET, GREEN, AMBER, BORDER, LS_H3, LS_BODY,
} from "@/lib/constants";

type Side = { metric: string; unit: string; points: string[] };
type Step = {
  num: string; title: string; summary: string; color: string;
  advantage: string; advantageDesc: string;
  left: Side; right: Side;
};

const STEPS: Step[] = [
  {
    num: "01", title: "Collect Documents", color: VIOLET,
    summary: "Upload once. Everything is classified and ready.",
    advantage: "Easy",
    advantageDesc: "A few clicks to upload. Instant iterations — swap files, re-run, refine without restarting.",
    left: {
      metric: "Several days",
      unit: "of back-and-forth",
      points: [
        "Initial requests are partial — follow-up emails fill the gaps over days",
        "Missing items often surface only after the review has started",
        "Manual trackers and shared folders need to be updated throughout",
        "Every manager sends a different package and naming convention",
      ],
    },
    right: {
      metric: "Several clicks",
      unit: "to start the review",
      points: [
        "Start immediately — no waiting for a complete document set",
        "Alpine flags missing files and drafts AI follow-up requests automatically",
        "Calendar notifications keep outstanding items on track across stakeholders",
        "Analysis runs in parallel as remaining documents arrive",
      ],
    },
  },
  {
    num: "02", title: "Verify Regulatory", color: AMBER,
    summary: "54 regulators across 3 tiers. Checked automatically.",
    advantage: "Thorough",
    advantageDesc: "Manual lookups miss things. Alpine verifies against 54 regulators — automated, up-to-date.",
    left: {
      metric: "Hours",
      unit: "of manual verification",
      points: [
        "Separate regulator websites must be checked one by one",
        "Registration status and disclosures are copied over manually",
        "Disciplinary history can be missed if the search process is inconsistent",
        "Cross-checking findings across registries takes additional time",
      ],
    },
    right: {
      metric: "One pass",
      unit: "with ongoing monitoring",
      points: [
        "22 Tier 1 (SEC, FCA, MAS, ASIC, BaFin, FINMA…), 25 Tier 2 (CIMA, DFSA, SEBI, MFSA…), and 7 Tier 3 regulators — verified in one pass",
        "Disciplinary flags, registration gaps, and discrepancies surfaced in a single evidence trail",
      ],
    },
  },
  {
    num: "03", title: "Analyze Gaps", color: GREEN,
    summary: "The right questions for this fund. Not a generic checklist.",
    advantage: "Precise",
    advantageDesc: "A generic DDQ creates noise. A strategy-specific review keeps the analyst focused on the risks that actually matter.",
    left: {
      metric: "Generic",
      unit: "question sets",
      points: [
        "Same checklist for a quant hedge fund and a PE buyout",
        "Irrelevant questions slow the process and dilute focus",
        "Strategy-specific risks overlooked by a one-size-fits-all approach",
        "Analyst fatigue on irrelevant sections reduces quality throughout",
      ],
    },
    right: {
      metric: "472 questions",
      unit: "tailored to your fund",
      points: [
        "More precise, faster, and interactive — 472 strategy-specific questions scored in minutes, with real-time updates as fund details or regulatory guidance change",
        "38 configurations ensure only relevant questions apply — surfacing gaps that strategy-agnostic reviews routinely miss",
      ],
    },
  },
  {
    num: "04", title: "Analyst Review", color: AMBER,
    summary: "Real ODD experience behind every finding. Call prep included.",
    advantage: "Prepared",
    advantageDesc: "You get reviewed output, a clean evidence trail, and analyst-ready follow-up points for committee discussion.",
    left: {
      metric: "Manual prep",
      unit: "assembled across documents",
      points: [
        "Hours spent manually searching through documents to locate and confirm specific details",
        "Evidence tracing is done by hand — slow, inconsistent, and dependent on analyst memory",
      ],
    },
    right: {
      metric: "Reviewed",
      unit: "before delivery",
      points: [
        "Every report is reviewed by an experienced ODD analyst before delivery. No AI-only output reaches your IC.",
        "Search, extraction, and detail confirmation are fully automated by AI — analyst focus shifts to judgment, not legwork",
        "Every review is assigned to a senior ODD analyst with institutional due diligence experience",
        "You walk into committee with verified output and prepared support",
      ],
    },
  },
  {
    num: "05", title: "Deliver Report", color: VIOLET,
    summary: "IC-ready in under a week. Structured, cited, and defensible.",
    advantage: "Fast",
    advantageDesc: "Instead of waiting through a multi-week manual process, the team gets a structured package ready for internal review much sooner.",
    left: {
      metric: "Average 4+ weeks",
      unit: "to final review package",
      points: [
        "Unstructured PDF with no consistent rating or scoring framework",
        "Findings not traceable to source — hard to defend under questioning",
        "Weeks of additional IC prep required after receiving the report",
        "Annual review cadence — no visibility between cycles",
      ],
    },
    right: {
      metric: "1 week",
      unit: "draft report in minutes",
      points: [
        "ACCEPT / WATCHLIST / FLAG rating with clear, structured rationale",
        "Every finding cited to its source — traceable and audit-ready",
        "Follow-up question list included — no additional prep needed",
        "Optional monitoring for ongoing risk visibility between reviews",
      ],
    },
  },
];

export default function HowItWorks() {
  const [open, setOpen] = useState<string>("01");

  return (
    <section id="process" className="py-24 px-6" style={{ background: BG_CARD }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="font-sans text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
            How It Works
          </p>
          <h2 className="font-heading" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Five steps. One platform.
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-px">
          {STEPS.map((step) => {
            const isOpen = open === step.num;
            return (
              <div
                key={step.num}
                className="overflow-hidden"
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: step.num === "01" ? "8px 8px 2px 2px" : step.num === "05" ? "2px 2px 8px 8px" : "2px",
                }}
              >
                {/* Row header */}
                <button
                  className="w-full flex items-center gap-6 px-6 py-5 text-left transition-colors hover:bg-gray-50"
                  onClick={() => setOpen(isOpen ? "" : step.num)}
                >
                  <span className="font-sans shrink-0" style={{ fontSize: "0.75rem", fontWeight: 600, color: SUBTLE, letterSpacing: "0.04em", minWidth: "2rem" }}>
                    {step.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-heading block" style={{ fontSize: "0.9375rem", fontWeight: 600, letterSpacing: LS_H3, color: INK }}>
                      {step.title}
                    </span>
                    {!isOpen && (
                      <span className="font-body block mt-0.5" style={{ fontSize: "0.8125rem", color: MUTED, letterSpacing: LS_BODY }}>
                        {step.summary}
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown size={16} style={{ color: MUTED }} />
                  </motion.div>
                </button>

                {/* Expanded panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ borderTop: `1px solid ${BORDER}` }}>

                        {/* LEFT — Traditional */}
                        <div className="flex h-full flex-col px-8 py-7 lg:border-r" style={{ background: BG_AMBER, borderColor: BORDER }}>
                          <p className="font-sans text-[10px] uppercase mb-5" style={{ color: SUBTLE, fontWeight: 600, letterSpacing: "0.1em" }}>
                            Traditional ODD
                          </p>
                          {/* Big metric */}
                          <div className="mb-3 min-h-[84px]">
                            <div className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.042em", lineHeight: 1, color: SUBTLE }}>
                              {step.left.metric}
                            </div>
                            <div className="metric-label mt-0.5" style={{ color: SUBTLE, fontWeight: 500 }}>
                              {step.left.unit}
                            </div>
                          </div>
                          {/* Points */}
                          <div className="space-y-2">
                            {step.left.points.map((p) => (
                              <div key={p} className="flex items-start gap-2.5">
                                <span className="mt-1 shrink-0" style={{ color: SUBTLE, fontSize: "10px" }}>✕</span>
                                <span className="font-body text-[13px]" style={{ color: SECONDARY, lineHeight: 1.5 }}>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT — Alpine */}
                        <div className="relative flex h-full flex-col px-8 py-7" style={{ background: BG_CARD }}>
                          <div className="mb-5">
                            <p className="font-sans text-[10px] uppercase" style={{ color: step.color, fontWeight: 600, letterSpacing: "0.1em" }}>
                              With Alpine
                            </p>
                          </div>
                          <div
                            className="pointer-events-none absolute right-8 top-[2.25rem] font-heading"
                            style={{
                              color: step.color,
                              fontSize: "2.5rem",
                              fontWeight: 700,
                              letterSpacing: "-0.035em",
                              lineHeight: 1,
                              opacity: 0.35,
                            }}
                          >
                            {step.advantage}
                          </div>
                          {/* Big metric */}
                          <div className="mb-3 min-h-[84px]">
                            <div className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.042em", lineHeight: 1, color: step.color }}>
                              {step.right.metric}
                            </div>
                            <div className="metric-label mt-0.5" style={{ color: MUTED, fontWeight: 500 }}>
                              {step.right.unit}
                            </div>
                          </div>
                          <p className="font-body mb-5" style={{ fontSize: "0.8125rem", color: SECONDARY, lineHeight: 1.6, fontStyle: "italic" }}>
                            {step.advantageDesc}
                          </p>
                          {/* Points */}
                          <div className="space-y-2">
                            {step.right.points.map((p) => (
                              <div key={p} className="flex items-start gap-2.5">
                                <span className="mt-0.5 shrink-0" style={{ color: step.color, fontSize: "11px", fontWeight: 600 }}>✓</span>
                                <span className="font-body text-[13px]" style={{ color: SECONDARY, lineHeight: 1.5 }}>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
