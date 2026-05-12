"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import {
  BG,
  BG_CARD,
  BG_GREEN,
  INK,
  SECONDARY,
  MUTED,
  VIOLET,
  GREEN,
  AMBER,
  AMBER_TEXT,
  GREEN_TEXT,
  BORDER,
  BORDER_SUBTLE,
  LS_BODY,
} from "@/lib/constants";

type FindingCard = {
  kind: "finding";
  chapter: string;
  rating: string;
  ratingBg: string;
  ratingText: string;
  title: string;
  citation: string;
  quote: string;
  remediation: string;
};

type AnalysisCard = {
  kind: "analysis";
  chapter: string;
  rating: string;
  ratingBg: string;
  ratingText: string;
  title: string;
  body: string;
  table?: { layer: string; description: string }[];
};

type Card = FindingCard | AnalysisCard;

const CARDS: Card[] = [
  {
    kind: "finding",
    chapter: "CHAPTER 06 · INVESTMENT OPERATIONS & PORTFOLIO CONTROLS",
    rating: "RATED",
    ratingBg: `${GREEN}15`,
    ratingText: GREEN_TEXT,
    title: "Cash movement controls — single-signatory weakness flagged",
    citation: "[Compliance Manual §4.2.1]",
    quote: "Wires above $250K require sole approval from the COO with no secondary review or compliance check, per the policy reviewed on 2025-08-14.",
    remediation: "Recommend dual-signatory threshold for wires over $100K + monthly compliance audit log review. Industry standard: Level III control.",
  },
  {
    kind: "analysis",
    chapter: "CHAPTER 07 · VALUATION, ASSET EXISTENCE & REPORTING",
    rating: "RATED",
    ratingBg: `${GREEN}15`,
    ratingText: GREEN_TEXT,
    title: "Asset Existence & Verification",
    body: "The Fund's investments are evidenced by private agreements maintained electronically. Share certificates for certain portfolio companies are issued via Carta. Multiple parties are involved in each transaction:",
    table: [
      { layer: "Investment documentation", description: "Apex receives all docs and wire instructions from Manager" },
      { layer: "Carta certificates",        description: "Apex obtains share certificates directly from Carta platform" },
      { layer: "Wire verification",         description: "Apex independently verifies wire details with portfolio companies before initiating" },
      { layer: "Audit confirmations",       description: "Baker Thompson issues confirmations to ~50% of portfolio companies annually" },
    ],
  },
  {
    kind: "analysis",
    chapter: "CHAPTER 06 · INVESTMENT OPERATIONS & PORTFOLIO CONTROLS",
    rating: "RATED",
    ratingBg: `${GREEN}15`,
    ratingText: GREEN_TEXT,
    title: "Cash Controls",
    body: "All cash movements from Pacific Commerce are effected using the bank's online banking platform, requiring one of two authorized Apex individuals to initiate wires and one Managing Partner to release. Apex completes a verification callback for new payment instructions or changes to existing instructions. Pacific Commerce also occasionally completes callbacks per its own internal policies. Operating expenses are paid via Bill.com, requiring Apex to initiate and a Managing Partner to approve. Both Managing Partners must sign on the opening of new bank accounts.",
  },
];

export default function SampleOutput() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  }, [index]);

  const prev = useCallback(() => go(index > 0 ? index - 1 : CARDS.length - 1), [go, index]);
  const next = useCallback(() => go(index < CARDS.length - 1 ? index + 1 : 0), [go, index]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % CARDS.length);
    }, 8000);
    return () => clearInterval(id);
  }, [paused]);

  const card = CARDS[index];

  return (
    <section id="sample-output" className="py-24 px-6" style={{ background: BG_GREEN }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="SAMPLE OUTPUT"
          title={
            <>
              What you actually <span style={{ color: VIOLET }}>receive</span>.
            </>
          }
          sub="A ~50-page institutional-grade report with linked citations, identified risks, and actionable remediation recommendations. Below is an excerpt from a recent Trellis Capital IV review."
        />

        {/* Browser-chrome mockup */}
        <div
          className="rounded-panel overflow-hidden"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
          >
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

          {/* Carousel body */}
          <div
            className="relative overflow-hidden"
            style={{ height: 380, overflowY: "auto" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (dx < -40) next();
              else if (dx > 40) prev();
              touchStartX.current = null;
              setPaused(false);
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.22 }}
                className="p-6 sm:p-8"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <span
                    className="font-mono text-[11px] uppercase"
                    style={{ color: MUTED, fontWeight: 600, letterSpacing: "0.08em" }}
                  >
                    {card.chapter}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
                    style={{ background: card.ratingBg, color: card.ratingText, fontWeight: 700, letterSpacing: "0.08em" }}
                  >
                    {card.rating}
                  </span>
                </div>

                {card.kind === "finding" ? (
                  <>
                    <h3
                      className="font-heading mb-3"
                      style={{ fontSize: "1rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1.35 }}
                    >
                      {card.title}
                    </h3>
                    <div className="mb-4">
                      <span
                        className="font-mono inline-block uppercase px-2 py-0.5 rounded text-[10px]"
                        style={{ background: `${VIOLET}15`, color: VIOLET, fontWeight: 700, letterSpacing: "0.04em" }}
                      >
                        {card.citation}
                      </span>
                    </div>
                    <blockquote
                      className="font-body italic mb-4 pl-4"
                      style={{ fontSize: "14px", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY, borderLeft: `2px solid ${VIOLET}` }}
                    >
                      &ldquo;{card.quote}&rdquo;
                    </blockquote>
                    <p className="font-body" style={{ fontSize: "14px", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}>
                      <span className="font-mono uppercase mr-2 text-[10px]" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                        Remediation
                      </span>
                      {card.remediation}
                    </p>
                  </>
                ) : (
                  <>
                    <h3
                      className="font-heading mb-3"
                      style={{ fontSize: "1rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1.35 }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="font-body mb-4"
                      style={{ fontSize: "14px", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}
                    >
                      {card.body}
                    </p>
                    {card.table && (
                      <div className="overflow-hidden rounded-card" style={{ border: `1px solid ${BORDER}` }}>
                        {/* Table header */}
                        <div
                          className="grid grid-cols-2 px-4 py-2"
                          style={{ background: BORDER_SUBTLE, borderBottom: `1px solid ${BORDER}` }}
                        >
                          <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                            Verification Layer
                          </span>
                          <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                            Description
                          </span>
                        </div>
                        {card.table.map((row, i) => (
                          <div
                            key={row.layer}
                            className="grid grid-cols-2 px-4 py-2.5"
                            style={{
                              borderBottom: i < card.table!.length - 1 ? `1px solid ${BORDER}` : "none",
                            }}
                          >
                            <span className="font-body text-[13px]" style={{ color: INK, fontWeight: 500 }}>
                              {row.layer}
                            </span>
                            <span className="font-body text-[13px]" style={{ color: SECONDARY }}>
                              {row.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel controls */}
          <div
            className="flex items-center justify-between px-6 pb-5 pt-4"
            style={{ borderTop: `1px solid ${BORDER}` }}
          >
            {/* Dots */}
            <div className="flex gap-1.5">
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { go(i); setPaused(true); }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? 18 : 6,
                    height: 6,
                    background: i === index ? VIOLET : BORDER,
                  }}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => { prev(); setPaused(true); }}
                className="flex items-center justify-center rounded-btn transition-colors"
                style={{
                  width: 32, height: 32,
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  color: SECONDARY,
                }}
                aria-label="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8.5 2.5L4.5 7l4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => { next(); setPaused(true); }}
                className="flex items-center justify-center rounded-btn transition-colors"
                style={{
                  width: 32, height: 32,
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  color: SECONDARY,
                }}
                aria-label="Next"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 2.5L9.5 7l-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Ghost link */}
        <div className="mt-6">
          <Link
            href="/demo"
            className="font-mono text-[11px] uppercase"
            style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.08em" }}
          >
            See the full sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
