"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import {
  BG_CARD, BG_GREEN, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, BORDER, LS_H3, LS_BODY,
} from "@/lib/constants";

type Product = {
  num: string;
  name: string;
  tagline: string;
  promise: string;
  outcome: string;
  outcomeColor: string;
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
    name: "Alpine Report",
    tagline: "Full-Scope Institutional-Grade ODD Report",
    promise: "Accelerated extraction. Strengthened verification. Human-owned assessments and conclusions.",
    outcome: "RATED",
    outcomeColor: GREEN,
    price: "< $5,000",
    priceDetail: "per review",
    features: [
      "901 strategy-specific questions across 8 chapters",
      "Two-act framework: Manager + Fund",
      "54-regulator verification across 3 tiers",
      "RATED · RISKS FLAGGED outcomes with citations",
      "3–5 day delivery, IC-ready package",
    ],
    cta: "Book a Demo",
    ctaHref: "/early-access",
    highlight: true,
  },
  {
    num: "02",
    name: "Alpine Therapy",
    tagline: "Consulting & Remediation",
    promise: "Risks identified → mitigation pathways mapped → operational gaps closed → more capital raised.",
    outcome: "REMEDIATED",
    outcomeColor: VIOLET,
    price: "Custom",
    priceDetail: "per engagement",
    features: [
      "Gap analysis from prior ODD reports",
      "Mitigation pathway design",
      "Remediation work alongside operations",
      "Fundraising readiness support",
      "Pre-LP-meeting walkthrough",
    ],
    cta: "Book a Call",
    ctaHref: "/early-access",
    highlight: false,
  },
  {
    num: "03",
    name: "Alpine Infrastructure",
    tagline: "Allocator Platform",
    promise: "Self-serve tool for in-house teams to expedite and standardize reviews.",
    outcome: "CONTINUOUS",
    outcomeColor: AMBER,
    price: "Custom",
    priceDetail: "annual license",
    features: [
      "Self-serve workspace for in-house ODD teams",
      "Standardized 8-chapter framework",
      "Continuous portfolio monitoring",
      "Custom workflows · SSO · on-prem option",
      "White-label + API access",
    ],
    cta: "Book a Call",
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
          <p className="font-body" style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}>
            Accelerated process. Enhanced standard. Better decisions.
          </p>
        </div>

        {/* Three product cards */}
        <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="rounded-card p-6 flex flex-col"
              style={{
                background: BG_CARD,
                border: `1px solid ${p.highlight ? VIOLET : BORDER}`,
                boxShadow: p.highlight ? `0 0 0 1px ${VIOLET}15, 0 4px 16px rgba(0,0,0,0.06)` : "none",
              }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-[11px]" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.08em" }}>
                  {p.num}
                </span>
                <span
                  className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
                  style={{ background: `${p.outcomeColor}15`, color: p.outcomeColor, fontWeight: 700, letterSpacing: "0.08em" }}
                >
                  {p.outcome}
                </span>
              </div>

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
          ))}
        </div>

        {/* Continuous monitoring — concise, no price */}
        <div
          className="rounded-card p-5 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <div>
            <span className="font-heading text-[13px]" style={{ color: INK, fontWeight: 600, letterSpacing: LS_H3 }}>
              Continuous Monitoring
            </span>
            <p className="font-body text-[12px] mt-1" style={{ color: MUTED, letterSpacing: LS_BODY }}>
              24/7 monitoring for key person changes, regulatory actions, and material events. Available with any product.
            </p>
          </div>
          <Link
            href="/early-access"
            className="font-mono text-[11px] uppercase shrink-0 hover:opacity-70 transition-opacity"
            style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.08em" }}
          >
            Add to engagement →
          </Link>
        </div>

        {/* Quality commitment */}
        <div className="rounded-card p-7 mt-4 text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <Shield size={18} style={{ color: GREEN }} className="mx-auto mb-3" />
          <h3 className="font-heading mb-2" style={{ fontSize: "0.9375rem", fontWeight: 600, letterSpacing: LS_H3, color: INK }}>
            Institutional Quality Commitment
          </h3>
          <p className="font-body text-[13px] max-w-lg mx-auto" style={{ color: SECONDARY, lineHeight: 1.65, letterSpacing: LS_BODY }}>
            Every report is analyst-reviewed against a defined scope of 901 strategy-specific questions across
            8 chapters and regulatory verification across 54 regulators. If coverage falls short, we re-review at no additional cost.
          </p>
        </div>
      </div>
    </section>
  );
}
