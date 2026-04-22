"use client";

import React from "react";
import { RefDot } from "@/components/review/RefDot";

export interface ExecutiveBriefData {
  overall_rating: "ACCEPT" | "WATCHLIST" | "FLAG";
  exec_summary: string;
  top_concerns: Array<{
    finding: string;
    severity: "HIGH" | "MEDIUM";
    topic: string;
  }>;
  key_strengths: Array<{
    strength: string;
    topic: string;
  }>;
  conditions: string[];
  verification_status: {
    sec_registration: string;
    administrator: string;
    form_adv: string;
  };
}

const RATING_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  ACCEPT: { bg: "bg-alpine-green/10", text: "text-alpine-green", border: "border-alpine-green/30" },
  WATCHLIST: { bg: "bg-alpine-amber/10", text: "text-alpine-amber", border: "border-alpine-amber/30" },
  FLAG: { bg: "bg-alpine-red/10", text: "text-alpine-red", border: "border-alpine-red/30" },
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: "bg-alpine-red/10", text: "text-alpine-red" },
  MEDIUM: { bg: "bg-alpine-amber/10", text: "text-alpine-amber" },
};

function sourceColor(source: string): "blue" | "emerald" | "amber" | "purple" {
  const s = source.toLowerCase();
  if (s === "sec_edgar" || s.includes("iapd") || s.includes("edgar")) return "blue";
  if (s === "admin_verification" || s.includes("pentest") || s.includes("kroll")) return "emerald";
  if (s === "manager_call" || s.includes("manager_call")) return "amber";
  if (s === "alpine_analysis" || s.includes("alpine_analysis")) return "purple";
  return "blue";
}

function renderWithRefs(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\[\[REF:([^\]:"]+):"([^"]+)"\]\]/g;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const [, source, quote] = match;
    parts.push(<RefDot key={key++} source={source} quote={quote} color={sourceColor(source)} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 0 ? text : <>{parts}</>;
}

function stripRefs(text: string): string {
  return text.replace(/\[\[REF:[^\]]*\]\]/g, "").replace(/\s{2,}/g, " ").trim();
}

function CheckCircle({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export const RIDGELINE_EXECUTIVE_BRIEF: ExecutiveBriefData = {
  overall_rating: "WATCHLIST",
  exec_summary:
    "Ridgeline Capital Partners, LLC manages the Ridgeline Global Opportunities Fund, LP, a global long/short equity strategy with approximately $2.31 billion in AUM [[REF:SEC_EDGAR:\"CRD# 298741, regulatory AUM reported as $2.31B\"]]. The fund employs a fundamental research-driven approach across 10-15 countries [[REF:ridgeline_ddq_2025.pdf:\"Global long/short equity strategy covering 100-150 long and 60-100 short positions across 10-15 countries\"]]. While the firm demonstrates strong investment capabilities and regulatory compliance, Alpine's review identified material gaps in operational infrastructure that require resolution before a full allocation recommendation [[REF:ALPINE_ANALYSIS:\"2 RED-rated topics and 4 YELLOW-rated topics identified across 12-topic assessment\"]]. The fund is placed on WATCHLIST pending remediation of key person dependency, business continuity shortcomings, and valuation governance concerns.",
  top_concerns: [
    {
      finding:
        "Single key person (David Chen) controls investment decisions, client relationships, and firm governance with no documented succession plan or interim CIO arrangement [[REF:ridgeline_ddq_2025.pdf:\"David Chen, CFA, serves as sole Portfolio Manager and Chief Investment Officer\"]] [[REF:ridgeline_org_chart.pdf:\"All investment team members report directly to David Chen\"]]",
      severity: "HIGH",
      topic: "Staffing & Key Person Risk",
    },
    {
      finding:
        "Business continuity plan lacks annual testing, specific recovery time objectives, and pandemic/remote work protocols despite lessons from COVID-19 [[REF:ridgeline_bcp.pdf:\"Business Continuity Plan, Last Updated: October 2021\"]] [[REF:ALPINE_ANALYSIS:\"BCP predates 2023 office relocation, no evidence of annual testing\"]]",
      severity: "HIGH",
      topic: "Business Continuity & Disaster Recovery",
    },
    {
      finding:
        "Valuation committee meets only quarterly and has not formalized escalation procedures for illiquid or hard-to-value positions in the portfolio [[REF:ridgeline_valuation_policy.pdf:\"The Valuation Committee shall convene on a quarterly basis\"]] [[REF:ALPINE_ANALYSIS:\"No documented escalation criteria for pricing disputes\"]]",
      severity: "MEDIUM",
      topic: "Valuation & Pricing",
    },
    {
      finding:
        "Cybersecurity framework lacks formal penetration testing schedule and incident response plan, relying primarily on managed service provider defaults [[REF:ridgeline_ddq_2025.pdf:\"IT infrastructure managed by third-party MSP\"]] [[REF:ALPINE_ANALYSIS:\"No evidence of penetration testing or written incident response plan\"]]",
      severity: "MEDIUM",
      topic: "Information Technology & Cybersecurity",
    },
  ],
  key_strengths: [
    {
      strength:
        "SEC-registered since 2017 with clean regulatory record. No disclosures on Form ADV Part 1A Items 11A-K. Current Form ADV filing consistent with prior year [[REF:SEC_EDGAR:\"CRD# 298741, registered since 2017, Items 11A-K all answered 'No'\"]] [[REF:ridgeline_form_adv_excerpt.pdf:\"No material changes to disclosure items\"]]",
      topic: "Regulatory & Registration",
    },
    {
      strength:
        "Independent administrator (Northern Trust) performs independent NAV calculation with monthly reconciliation. Clear separation of duties between portfolio management and operations [[REF:ADMIN_VERIFICATION:\"Northern Trust confirmed as independent administrator performing NAV calculations\"]] [[REF:ridgeline_ddq_2025.pdf:\"Northern Trust appointed as fund administrator\"]]",
      topic: "Service Provider Oversight",
    },
    {
      strength:
        "Comprehensive compliance manual with documented policies for insider trading prevention, personal trading, and gift/entertainment. Annual compliance review completed [[REF:ridgeline_compliance_manual.pdf:\"Code of Ethics distributed and acknowledged by all employees annually\"]]",
      topic: "Compliance & Regulatory Framework",
    },
  ],
  conditions: [
    "Document and implement a formal succession plan for the CIO/PM role, including an interim investment management arrangement [[REF:ALPINE_ANALYSIS:\"Key person dependency is the primary operational risk\"]]",
    "Complete annual BCP test with documented results and update the plan to include remote work protocols and specific RTOs [[REF:ridgeline_bcp.pdf:\"No test results documentation found\"]]",
    "Formalize the valuation escalation process with documented criteria for when positions require independent pricing [[REF:ridgeline_valuation_policy.pdf:\"No escalation procedures specified\"]]",
    "Engage a qualified firm to conduct annual penetration testing and develop a written incident response plan",
  ],
  verification_status: {
    sec_registration: "Confirmed: CRD# 298741, SEC-registered investment adviser, no disciplinary history [[REF:SEC_EDGAR:\"IAPD search confirmed clean record\"]]",
    administrator: "Confirmed: Northern Trust appointed as independent administrator, performing NAV calculations [[REF:ADMIN_VERIFICATION:\"Administrator independence verified\"]]",
    form_adv: "Reviewed: Current and prior filings compared. AUM growth from $1.89B to $2.31B. No material changes to business practices or disclosures [[REF:SEC_EDGAR:\"Form ADV comparison: AUM increased 22%, no new disclosure items\"]]",
  },
};

export default function ExecutiveBriefViewer({ data }: { data: ExecutiveBriefData }) {
  const rating = data.overall_rating || "WATCHLIST";
  const rs = RATING_STYLES[rating] || RATING_STYLES.WATCHLIST;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-alpine-ink">Executive Brief</h2>
          <p className="text-xs text-alpine-slate mt-0.5">Investment committee decision summary</p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-sm font-heading font-bold ${rs.bg} ${rs.text} border ${rs.border}`}>
          {rating}
        </span>
      </div>

      <section className={`rounded-lg border-l-4 ${rs.border} bg-slate-50 p-5`}>
        <h3 className="text-xs font-heading font-semibold text-alpine-slate uppercase tracking-wider mb-2">
          Assessment Summary
        </h3>
        <p className="text-sm text-alpine-ink leading-relaxed">{renderWithRefs(data.exec_summary)}</p>
      </section>

      {data.top_concerns.length > 0 && (
        <section>
          <h3 className="text-xs font-heading font-semibold text-alpine-slate uppercase tracking-wider mb-3">
            Key Concerns
          </h3>
          <div className="space-y-2">
            {data.top_concerns.map((c, i) => {
              const ss = SEVERITY_STYLES[c.severity] || SEVERITY_STYLES.MEDIUM;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-alpine-snow border border-alpine-border">
                  <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${ss.bg} ${ss.text}`}>
                    {c.severity}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-alpine-ink">{renderWithRefs(c.finding)}</p>
                    <p className="text-xs text-alpine-slate mt-0.5">{c.topic}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {data.key_strengths.length > 0 && (
        <section>
          <h3 className="text-xs font-heading font-semibold text-alpine-slate uppercase tracking-wider mb-3">
            Key Strengths
          </h3>
          <div className="space-y-2">
            {data.key_strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-alpine-snow border border-alpine-border">
                <CheckCircle className="shrink-0 mt-0.5 text-alpine-green" />
                <div className="min-w-0">
                  <p className="text-sm text-alpine-ink">{renderWithRefs(s.strength)}</p>
                  <p className="text-xs text-alpine-slate mt-0.5">{s.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.conditions.length > 0 && (
        <section>
          <h3 className="text-xs font-heading font-semibold text-alpine-slate uppercase tracking-wider mb-3">
            Conditions for Advancement
          </h3>
          <ol className="space-y-2">
            {data.conditions.map((cond, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-alpine-snow border border-alpine-border">
                <span className="shrink-0 w-5 h-5 rounded-full bg-alpine-violet/10 text-alpine-violet text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-alpine-ink">{renderWithRefs(cond)}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <h3 className="text-xs font-heading font-semibold text-alpine-slate uppercase tracking-wider mb-3">
          Verification Status
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(data.verification_status).map(([key, value]) => (
            <div key={key} className="p-3 rounded-lg bg-alpine-snow border border-alpine-border text-center">
              <p className="text-[10px] text-alpine-slate uppercase tracking-wider mb-1">
                {key.replace(/_/g, " ")}
              </p>
              <p className="text-xs font-medium text-alpine-green">{stripRefs(value)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
