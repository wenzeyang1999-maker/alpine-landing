"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import {
  BG_CARD, BG_GREEN, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, GREEN_TEXT, AMBER_TEXT, BORDER, LS_H3, LS_BODY,
} from "@/lib/constants";

type Product = {
  num: string;
  name: string;
  tagline: string;
  promise: string;
  outcome: string;
  outcomeColor: string;     // dot/border accent — uses bright brand color
  outcomeTextColor: string; // pill text — uses darker variant for AA contrast
  price: string;
  priceDetail: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight: boolean;
};

const PRODUCTS: Product[] = [
  {
    num: "01",
    name: "Alpine Lite",
    tagline: "Engine-Authored ODD Report",
    promise: "A structured ODD report by Alpine's proprietary engine, with risk ratings, citations, and scoped human review.",
    outcome: "DRAFTED",
    outcomeColor: GREEN,
    outcomeTextColor: GREEN_TEXT,
    price: "< $2,000",
    priceDetail: "per review",
    features: [
      "~1,000 strategy-specific ODD checks across 8 chapters",
      "Manager-level and fund-level review",
      "Verification across 54 regulators",
      "Risk ratings with source citations",
      "Delivered in 1–2 business days",
    ],
    cta: "Book a Demo",
    ctaHref: "/early-access",
    highlight: false,
  },
  {
    num: "02",
    name: "Alpine Review",
    tagline: "Analyst-Reviewed ODD Report",
    promise: "An analyst-reviewed ODD report with manager and administrator interviews and decision-shaped conclusions.",
    outcome: "REVIEWED",
    outcomeColor: VIOLET,
    outcomeTextColor: VIOLET,
    price: "< $5,000",
    priceDetail: "per review",
    features: [
      "Everything in Alpine Lite",
      "Analyst review of findings, ratings, and exceptions",
      "Manager and administrator interviews incorporated into the report",
      "Actionable remediations",
      "Delivered in 5–8 business days",
    ],
    cta: "Book a Demo",
    ctaHref: "/early-access",
    highlight: true,
  },
  {
    num: "03",
    name: "Alpine Platform",
    tagline: "ODD Workflow Platform",
    promise: "A workflow platform for internal teams running repeatable ODD reviews across managers, funds, and portfolios.",
    outcome: "DEPLOYED",
    outcomeColor: AMBER,
    outcomeTextColor: AMBER_TEXT,
    price: "Custom",
    priceDetail: "annual license",
    features: [
      "Workspace for internal ODD teams",
      "Standardized manager and fund review framework",
      "Portfolio-level review tracking",
      "Custom workflows, SSO, and deployment options",
      "API access and reporting exports",
    ],
    cta: "Talk to us",
    ctaHref: "/early-access",
    highlight: false,
  },
];

export default function Products() {
  return (
    <section id="services" className="py-24 px-6" style={{ background: BG_GREEN }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
            Service
          </p>
          <h2 className="font-heading mb-3" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            One framework. Three Products.
          </h2>
          <p className="font-body mb-5" style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}>
            Pay per report or license the platform. Same 8-chapter framework either way.
          </p>
          {/* Grouped outcome labels — not numbered, treated as one unit */}
          <div className="flex items-center gap-0">
            {PRODUCTS.map((p, i) => (
              <span key={p.outcome} className="flex items-center">
                <span
                  className="font-mono text-[15px] uppercase"
                  style={{ color: p.outcomeTextColor, fontWeight: 700, letterSpacing: "0.1em" }}
                >
                  {p.outcome}
                </span>
                {i < PRODUCTS.length - 1 && (
                  <span className="mx-3 font-mono text-[13px]" style={{ color: "#D1D5DB" }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Three product cards */}
        <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="flex flex-col">

            <div
              className="rounded-card p-6 flex flex-col flex-1"
              style={{
                background: BG_CARD,
                border: `1px solid ${p.highlight ? VIOLET : BORDER}`,
                boxShadow: p.highlight ? `0 0 0 1px ${VIOLET}15, 0 4px 16px rgba(0,0,0,0.06)` : "none",
              }}
            >
              <h3 className="font-heading" style={{ fontSize: "1.0625rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
                {p.name}
              </h3>
              <p className="font-mono text-[11px] mt-1" style={{ color: MUTED, letterSpacing: "0.04em" }}>
                {p.tagline}
              </p>

              <p className="font-body mt-4" style={{ fontSize: "0.8125rem", lineHeight: 1.55, color: SECONDARY, letterSpacing: LS_BODY }}>
                {p.promise}
              </p>

              <div className="mt-5 mb-5 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <span className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.04em", color: INK }}>
                  {p.price}
                </span>
                <span className="font-mono text-[11px] ml-1.5" style={{ color: MUTED }}>
                  {p.priceDetail}
                </span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 font-body text-[13px]"
                    style={{ color: SECONDARY, letterSpacing: LS_BODY }}
                  >
                    <span style={{ color: GREEN, marginTop: "1px", flexShrink: 0, fontSize: "11px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={p.ctaHref}
                className="rounded-btn px-4 py-3 font-body text-[13px] text-center mt-6 inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                style={p.highlight
                  ? { background: INK, color: "#fff", fontWeight: 600 }
                  : { color: INK, border: `1px solid ${BORDER}`, fontWeight: 500 }
                }
              >
                {p.cta} <ArrowRight size={13} />
              </Link>
            </div>
            </div>
          ))}
        </div>

        {/* Continuous monitoring — passive caption, no CTA (CTA dedup) */}
        <div
          className="rounded-card p-5 mt-4"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <span className="font-heading text-[13px]" style={{ color: INK, fontWeight: 600, letterSpacing: LS_H3 }}>
            Continuous Monitoring
          </span>
          <p className="font-body text-[12px] mt-1" style={{ color: MUTED, letterSpacing: LS_BODY }}>
            Optional monitoring for key person changes, regulatory actions, and material events. Available alongside any product.
          </p>
        </div>

        {/* Quality commitment */}
        <div className="rounded-card p-7 mt-4 text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <Shield size={18} style={{ color: GREEN }} className="mx-auto mb-3" />
          <h3 className="font-heading mb-2" style={{ fontSize: "0.9375rem", fontWeight: 600, letterSpacing: LS_H3, color: INK }}>
            Institutional Quality Commitment
          </h3>
          <p className="font-body text-[13px] max-w-lg mx-auto" style={{ color: SECONDARY, lineHeight: 1.65, letterSpacing: LS_BODY }}>
            Every report is reviewed against a defined scope of ~1,000 strategy-specific ODD checks across 8 chapters
            and regulatory verification across 54 regulators. Alpine Review adds manager and administrator
            interviews, analyst-owned conclusions, and actionable remediations.
          </p>
        </div>
      </div>
    </section>
  );
}
