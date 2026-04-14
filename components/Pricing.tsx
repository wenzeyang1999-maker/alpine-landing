"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { BG_CARD, BG_GREEN, INK, SECONDARY, MUTED, VIOLET, GREEN, BORDER, LS_H3, LS_BODY } from "@/lib/constants";

type Tier = {
  name: string; tagline: string; price: string; priceDetail: string;
  features: string[]; cta: string; ctaHref: string; highlight: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Review", tagline: "Per-Engagement", price: "$3,500", priceDetail: "per review",
    features: ["Strategy-specific 472-question analysis", "SEC EDGAR + global regulatory verification", "IC-ready ACCEPT/WATCHLIST/FLAG report", "Source-cited findings with audit trail", "Unlimited document uploads per review"],
    cta: "Start a Review", ctaHref: "/early-access", highlight: false,
  },
  {
    name: "Platform", tagline: "Annual Subscription", price: "$30K", priceDetail: "per year",
    features: ["Unlimited ODD reviews", "All 38 strategy profiles", "Continuous monitoring (up to 25 funds)", "Priority analysis queue", "Custom framework configuration", "Dedicated onboarding"],
    cta: "Request Access", ctaHref: "/early-access", highlight: false,
  },
  {
    name: "Enterprise", tagline: "On-Prem Deployment", price: "Custom", priceDetail: "annual license",
    features: ["Deploy on your infrastructure", "Nothing leaves your environment", "White-label + API access", "Custom question tree", "Unlimited monitoring", "Dedicated support"],
    cta: "Contact Sales", ctaHref: "/early-access", highlight: false,
  },
];

function CountUpCurrency({
  target,
  prefix = "$",
  duration = 1.1,
}: {
  target: number;
  prefix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
    </span>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6" style={{ background: BG_GREEN }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="font-sans text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
            Pricing
          </p>
          <h2 className="font-heading mb-3" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Institutional ODD at a fraction of the cost.
          </h2>
          <p className="font-body text-[13px]" style={{ color: MUTED, letterSpacing: LS_BODY }}>
            Traditional third-party ODD often runs above five figures per review. Alpine starts at $3,500.
          </p>
        </div>

        <div
          className="rounded-panel p-6 md:p-7 mb-10 overflow-hidden"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 8px 30px rgba(15,15,16,0.05)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-7 items-center">
            <div>
              <p className="font-mono text-[11px] uppercase mb-2" style={{ color: MUTED, letterSpacing: "0.08em" }}>
                Traditional ODD
              </p>
              <div className="font-heading" style={{ fontSize: "clamp(2rem,4vw,3.75rem)", fontWeight: 700, letterSpacing: "-0.05em", color: INK, lineHeight: 1 }}>
                <CountUpCurrency target={15000} />
              </div>
              <p className="font-mono text-[11px] mt-2" style={{ color: MUTED, letterSpacing: "0.08em" }}>
                average review cost
              </p>
            </div>

            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3" style={{ color: VIOLET }}>
                <motion.svg
                  width="88"
                  height="56"
                  viewBox="0 0 88 56"
                  fill="none"
                  initial={{ opacity: 0, x: -10, y: -6 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  <motion.path
                    d="M10 14 C 28 14, 38 16, 44 22 C 50 28, 56 34, 63 36 L70 38"
                    stroke={VIOLET}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.35 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.path
                    d="M60 28 L70 38 L59 46"
                    stroke={VIOLET}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.35 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.36, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.svg>
                <div className="text-left">
                  <div className="font-heading text-[18px]" style={{ fontWeight: 700, letterSpacing: "-0.03em" }}>
                    76% lower
                  </div>
                  <div className="font-mono text-[10px] uppercase" style={{ letterSpacing: "0.08em" }}>
                    faster cost profile
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-left md:text-right">
              <p className="font-mono text-[11px] uppercase mb-2" style={{ color: VIOLET, letterSpacing: "0.08em" }}>
                Alpine Review
              </p>
              <div className="font-heading" style={{ fontSize: "clamp(2rem,4vw,3.75rem)", fontWeight: 700, letterSpacing: "-0.05em", color: VIOLET, lineHeight: 1 }}>
                <CountUpCurrency target={3500} />
              </div>
              <p className="font-mono text-[11px] mt-2" style={{ color: MUTED, letterSpacing: "0.08em" }}>
                starting review price
              </p>
            </div>
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-card p-6 flex flex-col"
              style={{
                background: BG_CARD,
                border: `1px solid ${tier.highlight ? VIOLET : BORDER}`,
                boxShadow: tier.highlight ? `0 0 0 1px ${VIOLET}15, 0 4px 16px rgba(0,0,0,0.06)` : "none",
              }}
            >
              {tier.name === "Platform" && (
                <span className="font-sans text-[10px] uppercase mb-2" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
                  Most Popular
                </span>
              )}
              <h3 className="font-heading" style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: LS_H3, color: INK }}>
                Alpine {tier.name}
              </h3>
              <p className="font-mono text-[11px] mt-1" style={{ color: MUTED }}>{tier.tagline}</p>

              <div className="mt-5 mb-6">
                <span className="font-heading" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.04em", color: INK }}>
                  {tier.price}
                </span>
                <span className="font-mono text-[11px] ml-1.5" style={{ color: MUTED }}>{tier.priceDetail}</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-body text-[13px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
                    <span style={{ color: GREEN, marginTop: "1px", flexShrink: 0, fontSize: "11px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className="rounded-btn px-4 py-3 font-body text-[13px] text-center mt-6 inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                style={tier.highlight
                  ? { background: INK, color: "#fff", fontWeight: 500 }
                  : { color: INK, border: `1px solid ${BORDER}`, fontWeight: 500 }
                }
              >
                {tier.cta} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>

        {/* Monitoring add-on */}
        <div className="rounded-card p-5 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <span className="font-heading text-[13px]" style={{ color: INK, fontWeight: 600, letterSpacing: LS_H3 }}>
              Continuous Monitoring Add-On
            </span>
            <p className="font-body text-[12px] mt-1" style={{ color: MUTED, letterSpacing: LS_BODY }}>
              24/7 AI monitoring for key person changes, regulatory actions, and material events.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 700, color: INK }}>$200</span>
            <span className="font-mono text-[11px] ml-1" style={{ color: MUTED }}>/fund/month</span>
          </div>
        </div>

        {/* Quality guarantee */}
        <div className="rounded-card p-7 mt-4 text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <Shield size={18} style={{ color: GREEN }} className="mx-auto mb-3" />
          <h3 className="font-heading mb-2" style={{ fontSize: "0.9375rem", fontWeight: 600, letterSpacing: LS_H3, color: INK }}>
            Institutional Quality Commitment
          </h3>
          <p className="font-body text-[13px] max-w-lg mx-auto" style={{ color: SECONDARY, lineHeight: 1.65, letterSpacing: LS_BODY }}>
            Every report is analyst-reviewed against a defined scope of 472 questions, 12 ODD topics,
            and regulatory verification across 54 regulators. If coverage falls short, we re-review at no additional cost.
          </p>
        </div>
      </div>
    </section>
  );
}
