"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, BORDER,
} from "@/lib/constants";

// Lazy-load the mockup — it lives below the fold and adds ~8KB of JS
// (5-tab interactive folder with framer animations + 5 STEPS data array).
// ssr: false keeps it out of the initial HTML; a fixed-height skeleton
// reserves layout space so CLS stays at 0 when it hydrates.
const HeroMockup = dynamic(() => import("./HeroMockup"), {
  ssr: false,
  loading: () => (
    <div className="max-w-5xl mx-auto mt-10">
      <div
        className="rounded-panel"
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
          minHeight: 480,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}
        aria-hidden
      />
    </div>
  ),
});

const AUDIENCE_TYPES = ["Endowments", "Pensions", "Family Offices", "Fund of Funds", "Consultants", "Managers"];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const eyebrowMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const headlineMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 } };

  const subtitleMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 0.2 } };

  const ctaMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.3 } };

  const audienceMotion = shouldReduceMotion
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.35 } };

  return (
    <section className="pt-28 pb-16 px-6" style={{ background: BG }}>
      <div className="max-w-3xl mx-auto text-center">

        {/* Eyebrow pill — just LIVE indicator */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F6FAFF 100%)",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 6px 18px rgba(15,15,16,0.05), 0 1px 2px rgba(0,0,0,0.04)",
          }}
          {...eyebrowMotion}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: GREEN, boxShadow: `0 0 0 4px ${GREEN}20` }} />
          <span className="text-[11px] font-mono uppercase" style={{ color: GREEN, fontWeight: 700, letterSpacing: "0.08em" }}>
            Live
          </span>
        </motion.div>

        {/* Display headline — ODD Engine for Institutional Capital */}
        <motion.h1
          className="font-heading mb-8"
          style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.25rem)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.038em", color: INK }}
          {...headlineMotion}
        >
          ODD Engine for<br />
          <span style={{ color: VIOLET }}>Institutional Capital</span>
        </motion.h1>

        {/* Subtitle — slide 3 of deck */}
        <motion.p
          className="font-body max-w-2xl mx-auto"
          style={{ fontSize: "1.0625rem", fontWeight: 500, lineHeight: 1.65, letterSpacing: "-0.02em", color: SECONDARY }}
          {...subtitleMotion}
        >
          Operational due diligence on alternative fund managers. Engine-drafted,
          analyst-reviewed, delivered in days instead of weeks.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-6"
          {...ctaMotion}
        >
          <Link
            href="/early-access"
            className="inline-flex items-center gap-1.5 rounded-btn px-6 py-3 font-body hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Book a Demo <ArrowUpRight size={13} />
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          {...audienceMotion}
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

      {/* Scroll affordance — visible cue that there's more below */}
      <div className="text-center mt-6 mb-2">
        <a
          href="#hero-mockup"
          className="font-mono text-[11px] uppercase inline-flex items-center gap-1.5"
          style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          See it in action
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>

      {/* Below-the-fold lazy-loaded mockup */}
      <HeroMockup />
    </section>
  );
}
