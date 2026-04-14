"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
    label: "Upload",
    color: VIOLET,
    stats: [
      { value: "14+", label: "document types" },
      { value: "< 60s", label: "to classify" },
      { value: "Zero", label: "manual tagging" },
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
      { value: "10", label: "global registries" },
      { value: "~2 min", label: "vs. hours manually" },
      { value: "Live", label: "real-time data" },
    ],
    body: "Alpine cross-references registration and disciplinary data against live feeds from SEC EDGAR, FCA, MAS, SFC, CSSF, ASIC, and more — in the time it used to take to open a browser.",
    cols: 4,
    items: [
      { text: "SEC / IAPD", check: GREEN }, { text: "FCA (UK)", check: GREEN },
      { text: "MAS (Singapore)", check: GREEN }, { text: "SFC (Hong Kong)", check: GREEN },
      { text: "CSSF (Luxembourg)", check: GREEN }, { text: "ASIC (Australia)", check: GREEN },
      { text: "AMF (France)", check: GREEN }, { text: "BaFin (Germany)", check: GREEN },
    ],
  },
  {
    label: "Analyze",
    color: GREEN,
    stats: [
      { value: "472", label: "questions asked" },
      { value: "36", label: "fund strategies" },
      { value: "12", label: "ODD topics covered" },
      { value: "~5 min", label: "to analyze" },
    ],
    body: "The question set adapts to your fund's structure, type, and strategy. Not a generic checklist — a strategy-specific engine that surfaces gaps a standard review would miss.",
    cols: 4,
    items: [
      { text: "Governance", dot: GREEN }, { text: "Compliance", dot: GREEN },
      { text: "Valuation", dot: GREEN }, { text: "Trading", dot: AMBER },
      { text: "Technology", dot: AMBER }, { text: "Operations", dot: GREEN },
      { text: "AML / KYC", dot: GREEN }, { text: "Risk Management", dot: GREEN },
      { text: "Counterparty", dot: GREEN }, { text: "Liquidity", dot: AMBER },
      { text: "Investor Relations", dot: GREEN }, { text: "Business Continuity", dot: GREEN },
    ],
  },
  {
    label: "Review",
    color: AMBER,
    stats: [
      { value: "Zero", label: "AI-only output" },
      { value: "100%", label: "analyst-reviewed" },
      { value: "Senior", label: "ODD analyst assigned" },
    ],
    body: "Every report is reviewed by a senior ODD analyst before delivery. No finding leaves Alpine without a human signing off — that's the institutional standard your IC expects.",
    cols: 1,
    items: [
      { text: "ODD Analyst Assigned to Review", check: AMBER },
      { text: "Findings Verified Against Source Documents", check: AMBER },
      { text: "Evidence Reviewed & Citations Confirmed", check: AMBER },
      { text: "Follow-Up Questions Drafted by Analyst", check: AMBER },
      { text: "Report Approved and Released for Delivery", check: AMBER },
    ],
  },
  {
    label: "Deliver",
    color: VIOLET,
    stats: [
      { value: "< 5", label: "business days" },
      { value: "3", label: "rating outcomes" },
      { value: "Cite-ready", label: "for committee" },
    ],
    body: "A complete ODD report with ACCEPT / WATCHLIST / FLAG ratings, structured observations, source citations, and a follow-up question list — formatted to defend in front of your IC.",
    cols: 2,
    items: [
      { text: "ACCEPT / WATCHLIST / FLAG Rating" }, { text: "Structured Risk Observations" },
      { text: "Evidence Map & Source Citations" }, { text: "Follow-Up Question List" },
      { text: "IC-Ready Report Package" }, { text: "Ongoing Monitoring Available" },
    ],
  },
];

const AUDIENCE_TYPES = ["Endowments", "Pensions", "Family Offices", "Fund of Funds", "Consultants"];

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeStep, setActiveStep] = useState(0);

  const step = STEPS[activeStep] ?? STEPS[0];

  return (
    <section className="pt-32 pb-20 px-6" style={{ background: BG }}>
      <div className="max-w-3xl mx-auto text-center">

        {/* Eyebrow pill */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F6FAFF 100%)",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 6px 18px rgba(15,15,16,0.05), 0 1px 2px rgba(0,0,0,0.04)",
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: GREEN, boxShadow: `0 0 0 4px ${GREEN}20` }} />
          <span className="text-[11px] font-mono uppercase" style={{ color: GREEN, fontWeight: 700, letterSpacing: "0.08em" }}>
            Live
          </span>
          <span className="text-[14px] font-body" style={{ color: SECONDARY, fontWeight: 600, letterSpacing: "-0.015em" }}>
            AI Engine · Early Access now open
          </span>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          className="font-heading mb-8"
          style={{ fontSize: "clamp(3.25rem, 6.5vw, 5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.04em", color: INK }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Machine speed.<br />
          <span style={{ color: VIOLET }}>Analyst standards.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-body max-w-xl mx-auto"
          style={{ fontSize: "1.1875rem", fontWeight: 500, lineHeight: 1.7, letterSpacing: "-0.02em", color: SECONDARY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          472 questions across 36 strategies. Each review tailored to your fund&rsquo;s
          structure, type, and strategy. Draft in minutes, institutional delivery after analyst review.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href="/early-access"
            className="inline-flex items-center gap-1.5 rounded-btn px-5 py-2.5 font-body hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Book a Call <ArrowUpRight size={13} />
          </Link>
          <Link
            href="/early-access"
            className="inline-flex items-center rounded-btn px-5 py-2.5 font-body hover:bg-gray-50 transition-colors"
            style={{ color: SECONDARY, fontSize: "0.9375rem", fontWeight: 600, border: `1px solid ${BORDER}`, letterSpacing: "-0.02em" }}
          >
            Request a Demo
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <span
              className="font-mono text-[11px] uppercase"
              style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.14em" }}
            >
              Built for
            </span>
            <div className="hidden h-4 w-px sm:block" style={{ background: BORDER }} />
            {AUDIENCE_TYPES.map((type) => (
              <span
                key={type}
                className="font-body text-[15px]"
                style={{ color: MUTED, fontWeight: 500, letterSpacing: "-0.015em" }}
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Product mockup — folder tab panel */}
      <motion.div
        ref={ref}
        className="max-w-5xl mx-auto mt-16"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
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
                alpinedd.com/review/northpoint-capital
              </div>
            </div>
          </div>

          {/* Folder tabs */}
          <div
            className="flex items-end px-4 pt-3 overflow-x-auto"
            style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
            role="tablist"
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
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`workflow-panel-${i}`}
                  id={`workflow-tab-${i}`}
                  tabIndex={isActive ? 0 : -1}
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
                id={`workflow-panel-${activeStep}`}
                role="tabpanel"
                aria-labelledby={`workflow-tab-${activeStep}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {/* Stats row — big numbers with rhythm */}
                <div className="grid gap-3 mb-4 sm:gap-4 sm:mb-5" style={{ gridTemplateColumns: `repeat(${step.stats.length}, minmax(0, 1fr))` }}>
                  {step.stats.map((stat) => (
                    <div key={stat.label}>
                      <div
                        className="font-heading"
                        style={{ fontSize: "clamp(1.25rem, 4vw, 2.25rem)", fontWeight: 700, color: step.color, letterSpacing: "-0.05em", lineHeight: 1 }}
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

                {/* Body copy */}
                <p className="font-body mb-4 sm:mb-5" style={{ fontSize: "clamp(0.8125rem, 2.5vw, 0.9375rem)", fontWeight: 500, lineHeight: 1.65, color: SECONDARY, letterSpacing: "-0.015em" }}>
                  {step.body}
                </p>

                {/* Divider */}
                <div className="mb-3 sm:mb-4" style={{ height: "1px", background: BORDER }} />

                {/* Items — max 2 cols on mobile, step.cols on sm+ */}
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
    </section>
  );
}
