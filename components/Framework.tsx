"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BG_CARD, BG, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, GREEN_TEXT, AMBER_TEXT, BORDER, BORDER_SUBTLE, LS_BODY, LS_H3,
} from "@/lib/constants";

type Chapter = { num: string; title: string; desc: string; questions: number };

const ACT_I: Chapter[] = [
  { num: "01", title: "Manager, Ownership & Governance",        desc: "Management company, AUM, insider investment, ownership & succession, human resources.", questions: 143 },
  { num: "02", title: "Legal, Regulatory & Compliance",         desc: "Regulatory oversight, compliance infrastructure and policies, claims, actions, conflicts.",  questions: 129 },
  { num: "03", title: "Technology, Cybersecurity & Resilience", desc: "IT overview, cybersecurity controls, business continuity, incident response.",              questions:  77 },
  { num: "04", title: "Fund Structure, Terms & Alignment",      desc: "Legal structure, key terms, fee structure, corporate governance, investment strategy.",     questions: 164 },
];

const ACT_II: Chapter[] = [
  { num: "05", title: "Service Providers & Oversight",          desc: "Administrator, auditor, banker, custodian, prime broker — engaged and verified.",          questions:  54 },
  { num: "06", title: "Investment Operations & Portfolio Controls", desc: "Portfolio management systems, decision process, allocation, cash tracking and controls.", questions: 232 },
  { num: "07", title: "Valuation, Asset Existence & Reporting", desc: "Valuation controls, asset existence verification, investor reporting, financial controls.",  questions:  88 },
  { num: "08", title: "Manager Transparency & LP Communications",   desc: "Diligence cooperation, administrator cooperation, disclosure quality.",                  questions:  14 },
];

const OUTCOMES = [
  { label: "RATED",         color: GREEN_TEXT, dot: GREEN,  desc: "Eight-chapter R/Y/G ratings with structured rationale." },
  { label: "RISKS FLAGGED", color: AMBER_TEXT, dot: AMBER,  desc: "Every risk surfaced, scored, and traced to evidence." },
  { label: "REMEDIATED",    color: VIOLET,     dot: VIOLET, desc: "Each risk paired with a remediation pathway." },
];

function ChapterCard({ ch, accent }: { ch: Chapter; accent: string }) {
  return (
    <div
      className="rounded-card p-5 flex flex-col h-full"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="font-mono text-[11px]" style={{ color: accent, fontWeight: 700, letterSpacing: "0.08em" }}>
          {ch.num}
        </span>
        <span className="font-mono text-[10px]" style={{ color: MUTED, letterSpacing: "0.06em" }}>
          {ch.questions} questions
        </span>
      </div>
      <h3
        className="font-heading mb-2"
        style={{ fontSize: "0.9375rem", fontWeight: 700, letterSpacing: LS_H3, color: INK, lineHeight: 1.25 }}
      >
        {ch.title}
      </h3>
      <p className="font-body" style={{ fontSize: "0.8125rem", lineHeight: 1.55, color: SECONDARY, letterSpacing: LS_BODY }}>
        {ch.desc}
      </p>
    </div>
  );
}

export default function Framework() {
  const shouldReduceMotion = useReducedMotion();

  // Container-level whileInView staggering. When reduced-motion is on, drop
  // the viewport/whileInView triggers entirely and render the cards visible.
  const actContainerMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-60px" },
        variants: { visible: { transition: { staggerChildren: 0.06 } } },
      };

  // Per-card motion. When reduced-motion is on, no animation, no variants —
  // just render the static visible state.
  const cardMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : {
        variants: { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } },
        transition: { duration: 0.35 },
      };

  return (
    <section id="framework" className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
            The Framework
          </p>
          <h2 className="font-heading mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            One framework. Two acts. Eight chapters.
          </h2>
          <p className="font-body" style={{ fontSize: "1.0625rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
            The same structural backbone used by institutional ODD providers, applied at engine speed — ~1,000 strategy-specific questions across eight chapters, expanding to 1,193 in practice with the strategy appendix.
          </p>
        </div>

        {/* The Spine — always-visible summary block above the collapsed grid */}
        <div
          className="rounded-panel p-6 sm:p-7 mb-6"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
            The Spine
          </p>
          <h3 className="font-heading mb-3" style={{ fontSize: "1.5rem", fontWeight: 700, color: INK, letterSpacing: "-0.025em" }}>
            Two Acts · Eight Chapters · ~1,000 Questions
          </h3>
          <p className="font-body" style={{ fontSize: "0.9375rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
            Act I covers the Manager (governance, compliance, technology, fund structure). Act II covers
            the Fund (service providers, ops, valuation, transparency). Drafted in 3-5 days. Defensible
            in front of your IC.
          </p>
        </div>

        {/* Eight-chapter grid — collapsed behind a summary toggle */}
        <details className="group mb-6">
          <summary
            className="cursor-pointer rounded-card px-5 py-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase select-none list-none"
            style={{
              color: VIOLET,
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <span>See the eight chapters</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform group-open:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>

          <div className="mt-6">
            {/* Two acts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Act I */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[10px] uppercase px-2 py-1 rounded-full"
                    style={{ background: `${VIOLET}15`, color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
                  >
                    Act I
                  </span>
                  <h3 className="font-heading" style={{ fontSize: "1rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
                    The Manager
                  </h3>
                  <span className="font-mono text-[10px]" style={{ color: MUTED, letterSpacing: "0.06em" }}>
                    · {ACT_I.reduce((a, c) => a + c.questions, 0)} questions
                  </span>
                </div>
                <motion.div
                  {...actContainerMotion}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {ACT_I.map((ch) => (
                    <motion.div
                      key={ch.num}
                      {...cardMotion}
                    >
                      <ChapterCard ch={ch} accent={VIOLET} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Act II */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[10px] uppercase px-2 py-1 rounded-full"
                    style={{ background: `${GREEN}15`, color: GREEN_TEXT, fontWeight: 700, letterSpacing: "0.1em" }}
                  >
                    Act II
                  </span>
                  <h3 className="font-heading" style={{ fontSize: "1rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
                    The Fund
                  </h3>
                  <span className="font-mono text-[10px]" style={{ color: MUTED, letterSpacing: "0.06em" }}>
                    · {ACT_II.reduce((a, c) => a + c.questions, 0)} questions
                  </span>
                </div>
                <motion.div
                  {...actContainerMotion}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {ACT_II.map((ch) => (
                    <motion.div
                      key={ch.num}
                      {...cardMotion}
                    >
                      <ChapterCard ch={ch} accent={GREEN} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </details>

        {/* Outcomes band */}
        <div
          className="rounded-panel p-6 sm:p-7"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <p className="font-mono text-[10px] uppercase mb-4" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
            Every report ships three outcomes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {OUTCOMES.map((o) => (
              <div key={o.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: o.dot }} />
                  <span
                    className="font-heading"
                    style={{ fontSize: "0.9375rem", fontWeight: 700, color: o.color, letterSpacing: "0.04em" }}
                  >
                    {o.label}
                  </span>
                </div>
                <p className="font-body" style={{ fontSize: "0.8125rem", lineHeight: 1.55, color: SECONDARY, letterSpacing: LS_BODY }}>
                  {o.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
