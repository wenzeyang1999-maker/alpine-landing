"use client";

import { useRef, useEffect, useState } from "react";
import { downloadDemoFile } from "@/lib/demo-downloads";
import { SOURCE_META } from "@/lib/ridgeline-data";
import DataReportViewer, { RIDGELINE_DATA_REPORT } from "@/components/shell/DataReportViewer";
import ExecutiveBriefViewer, { RIDGELINE_EXECUTIVE_BRIEF } from "@/components/shell/ExecutiveBriefViewer";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Inline color constants (no external dep) ─────────────────────────────────

const SOURCE_DOT_COLORS: Record<string, string> = {
  SEC_EDGAR:         "#34D399",
  ALPINE_ANALYSIS:   "#A78BFA",
  MANAGER_CALL:      "#FBBF24",
  ADMIN_VERIFICATION:"#A78BFA",
};
const PDF_DOT_COLOR = "#60A5FA";
function getDotColor(source: string): string {
  return SOURCE_DOT_COLORS[source] || (source.endsWith(".pdf") ? PDF_DOT_COLOR : PDF_DOT_COLOR);
}

const RATING_BADGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  GREEN:     { bg: "#10B98118", text: "#059669", dot: "#10B981" },
  YELLOW:    { bg: "#F59E0B18", text: "#D97706", dot: "#F59E0B" },
  RED:       { bg: "#EF444418", text: "#DC2626", dot: "#EF4444" },
  ACCEPT:    { bg: "#10B98118", text: "#059669", dot: "#10B981" },
  WATCHLIST: { bg: "#F59E0B18", text: "#D97706", dot: "#F59E0B" },
  FLAG:      { bg: "#EF444418", text: "#DC2626", dot: "#EF4444" },
};

// ── Static Ridgeline ODD Report (markdown) ────────────────────────────────────

const RIDGELINE_REPORT_MD = `# Operational Due Diligence Review

**Ridgeline Capital Partners, LLC**
Ridgeline Global Opportunities Fund, LP · Global Long/Short Equity · AUM $2.31B

Review Date: January 2026 · Report Date: April 2, 2026
Prepared by Alpine Due Diligence Inc.

*This report is intended solely for the use of the commissioning investor and should not be distributed without Alpine's prior written consent.*

---

## Overall Rating: WATCHLIST

Score: 68 / 100 · 7 GREEN · 4 YELLOW · 1 RED

Ridgeline Capital Partners has been assigned a **WATCHLIST** rating following a comprehensive operational due diligence review conducted in January 2026. The firm demonstrates institutional-quality infrastructure across the majority of operational domains, including recognized service providers, a well-documented investment strategy, and clean regulatory and audit records. However, material deficiencies in the compliance program, combined with key person concentration and gaps in the valuation governance framework, warrant conditions before Alpine can assign an ACCEPT rating.

**Conditions for ACCEPT Upgrade:**
1. Hire a dedicated Chief Compliance Officer with independent reporting line (within 90 days)
2. Implement pre-clearance system for personal securities transactions (within 60 days)
3. Draft and adopt a formal written succession plan approved by the Fund Board (within 120 days)
4. Reconstitute the Valuation Committee to achieve majority independence (within 90 days)

---

## Act I — Structural Foundation

### Topic 01: Organization & Governance · Rating: YELLOW

Ridgeline Capital Partners was founded in 2008 by David Chen, who serves as CEO, CIO, and sole portfolio manager. [[REF:ridgeline_ddq_2026.pdf:"Founded in 2008 by David Chen who serves as CEO, CIO, and PM"]] The firm employs 34 full-time professionals across investment, operations, and investor relations. The organizational structure is flat, with Chen as the central decision-maker for investment and operational matters.

**Risk Observation RO-006:** No formal written succession plan exists for the founder/PM. The fund's continued operation is critically dependent on David Chen with no documented contingency.

**Risk Observation RO-007:** Key person concentration is acute. All investment decisions are made by David Chen with no designated backup PM or investment committee with voting authority.

### Topic 02: Regulatory & Compliance · Rating: RED

Ridgeline Capital Partners is registered as an investment adviser with the SEC (CRD #171432). [[REF:SEC_EDGAR:"Registered investment adviser, effective 2008, CRD #171432"]] Form ADV Part 2A was last amended in March 2025. No disciplinary actions, regulatory inquiries, or sanctions appear on the IAPD or BrokerCheck records for the firm or its key personnel.

**Risk Observation RO-057:** The firm has no dedicated Chief Compliance Officer. Compliance oversight is performed by COO Sarah Martinez as a secondary responsibility alongside operations, technology, and investor relations. There is no independent compliance reporting line. [[REF:ridgeline_compliance_manual.pdf:"Compliance oversight is the responsibility of the COO"]]

**Risk Observation RO-059:** No pre-clearance system for personal securities transactions exists. The firm relies on an honor-based quarterly attestation process with no automated enforcement or monitoring. This is material given the firm's trading in equities where conflicts of interest are most likely to arise.

**Risk Observation RO-061:** Expert network usage is not subject to compliance pre-approval or chaperoning protocols. The firm uses GLG and Gerson Lehrman Group without documented review procedures, creating risk of material non-public information exposure.

### Topic 03: Legal & Conflicts · Rating: GREEN

The fund is structured as a Delaware limited partnership with a Cayman feeder for international investors. [[REF:ridgeline_ppm.pdf:"Delaware LP structure with Cayman feeder fund"]] The LPA is comprehensive and addresses material conflict provisions including cross-trading, side pocket allocation, and fee netting. Side letter provisions are disclosed in the DDQ with no preferential liquidity terms granted.

No material litigation, arbitration, or regulatory proceedings involving the firm or its principals were identified during the review period.

### Topic 04: Technology & Cybersecurity · Rating: YELLOW

The firm operates on institutional-grade technology infrastructure including Eze OMS for order management, Advent Geneva for portfolio accounting, and Bloomberg BVAL for pricing. [[REF:ridgeline_ddq_2026.pdf:"Eze OMS for order management, Advent Geneva for portfolio accounting"]]

**Risk Observation RO-044:** The firm does not carry dedicated cybersecurity insurance. General E&O coverage does not address cyber-specific risks including ransomware, data breach notification costs, or regulatory response.

The most recent penetration test was conducted in January 2026 by an independent third party. [[REF:Pen_Test_Summary_Jan2026.pdf:"Penetration test completed January 2026"]] Results indicated no critical vulnerabilities. The BCP was last tested in December 2025 with satisfactory results. [[REF:BCP_Test_Results_Dec2025.pdf:"BCP test completed December 2025"]]

---

## Act II — Investment Operations

### Topic 05: Fund Terms & Structure · Rating: GREEN

Management fee of 1.5% and performance allocation of 20% with a 6% hurdle rate and high-water mark are standard for the strategy. [[REF:ridgeline_ppm.pdf:"Management fee 1.5%, performance allocation 20%, hurdle 6%, high-water mark"]] The fund offers quarterly redemptions with 90-day notice and a 3% redemption gate at the fund level. A 5% side pocket allocation cap applies to Level 3 assets.

Gate provisions are clearly disclosed in the offering documents. No gates or suspensions have been imposed in the fund's operating history.

### Topic 06: Service Providers · Rating: GREEN

**Prime Brokerage:** Goldman Sachs and Morgan Stanley serve as dual prime brokers. [[REF:ridgeline_ddq_2026.pdf:"Goldman Sachs and Morgan Stanley as prime brokers"]] Rehypothecation limits are set at 140% of net debit balances. Segregated custody accounts are maintained at both primes.

**Administrator:** Citco Fund Services (Cayman) performs independent NAV calculation, investor reporting, and transfer agency. [[REF:ridgeline_ddq_2026.pdf:"Citco Fund Services as fund administrator"]] NAV is calculated monthly with a 15-business-day turnaround, independently of the investment manager.

**Auditor:** Ernst & Young LLP issued clean, unqualified audit opinions for FY2023 and FY2024. [[REF:Audited_Financials_FY2024.pdf:"Ernst & Young unqualified audit opinion FY2024"]] No material weaknesses or significant deficiencies were noted.

**Legal:** Sidley Austin LLP serves as fund counsel. Offshore counsel: Maples and Calder.

### Topic 07: Investment Process · Rating: GREEN

The fund employs a fundamental long/short equity strategy targeting 100–150 long positions and 60–100 short positions across 10–15 countries. [[REF:ridgeline_ppm.pdf:"100-150 long positions, 60-100 short positions"]] Position sizing is rule-based with a maximum single-position limit of 5% of NAV at cost.

The investment process is well-documented with a formal IC Charter governing investment decisions. [[REF:IC_Charter_Jan2026.pdf:"Investment Committee Charter governing position approval"]] Research workflow, position sizing, and portfolio construction guidelines are codified in the Operations Manual.

### Topic 08: Trading & Execution · Rating: GREEN

Best execution is monitored through quarterly Transaction Cost Analysis (TCA) reports reviewed by the COO and IC. [[REF:ridgeline_ddq_2026.pdf:"Quarterly TCA reports reviewed by COO and IC"]] The firm has a formal order allocation policy governing block trades and IPO allocations.

T+1 reconciliation is performed daily by Citco against the firm's Advent Geneva records. Material breaks exceeding $100,000 are escalated to the COO within 24 hours.

---

## Act III — Controls & Transparency

### Topic 09: Valuation Controls · Rating: YELLOW

The fund's valuation policy designates equity securities as Level 1 (exchange-listed) or Level 2 (OTC). [[REF:ridgeline_valuation_policy.pdf:"Equity securities classified as Level 1 or Level 2"]] Level 3 assets are capped at 5% of NAV. The Valuation Committee meets quarterly and is responsible for Level 2 and Level 3 pricing determinations.

**Risk Observation RO-024:** The Valuation Committee currently consists of the COO and two portfolio analysts — all of whom are Ridgeline employees. No independent members sit on the committee, creating a structural conflict in asset pricing determinations.

### Topic 10: Financial Controls · Rating: GREEN

Operating accounts are segregated from investor assets. The firm maintains a minimum 6-month cash runway in an operating reserve. [[REF:Audited_Financials_FY2024.pdf:"Operating reserve maintained at 6-month minimum runway"]] Annual audited financial statements are delivered to investors within 60 days of fiscal year-end.

Internal controls include dual authorization for wire transfers exceeding $50,000 and monthly bank reconciliations reviewed by the CFO.

### Topic 11: Asset Verification · Rating: GREEN

Administrator AUM confirmation: Citco confirmed $2.306B as of December 31, 2025, against the manager-reported $2.31B. [[REF:ADMIN_VERIFICATION:"Citco confirmed AUM $2.306B vs manager-reported $2.31B (0.17% variance)"]] Variance of 0.17% is within acceptable range and attributable to timing of month-end accruals.

412 investor accounts verified. All subscription and redemption flows are independently processed by Citco with no manager involvement in cash movement.

### Topic 12: Reporting & Transparency · Rating: GREEN

Monthly investor letters are distributed within 15 business days of month-end. Annual audited financials are distributed within 60 days. [[REF:ridgeline_ddq_2026.pdf:"Monthly letters within 15 business days"]] The firm provides a quarterly attribution report and semi-annual risk report.

GIPS-compliant performance presentation has been maintained since fund inception. The GIPS composite has been verified by ACA Performance Services.

---

## Verification Summary

| Item | Status | Finding |
|------|--------|---------|
| SEC Registration (IAPD) | Verified | CRD #171432, no reportable items |
| Form ADV Part 2A | Verified | Current; no material changes from DDQ |
| FINRA BrokerCheck (key personnel) | Verified | Clean record for all principals |
| AUM Verification | Partial | $2.31B reported vs $2.306B admin-confirmed (0.17% variance) |
| Auditor Confirmation (EY) | Verified | Engagement confirmed; clean opinion FY2024 |
| CCO Identity & Registration | Failed | No dedicated CCO in IAPD. Compliance managed by PM. |

---

## Outstanding Items

The following items must be resolved prior to ACCEPT upgrade consideration:

1. **CCO Hire** — Dedicated CCO must be onboarded and registered with the SEC by April 30, 2026. Status: Pending.
2. **Pre-Trade Compliance** — Bloomberg AIM or equivalent pre-clearance system must be deployed and tested by June 30, 2026. Status: Pending.
3. **Succession Plan** — Board-approved succession plan for PM/founder must be submitted by March 31, 2026. Status: Pending.
4. **Valuation Committee** — At least one independent member must be added to the Valuation Committee by March 31, 2026. Status: Pending.

---

*Alpine Due Diligence Inc. · Confidential — For Institutional Use Only*
*Ridgeline Capital Partners, LLC — ODD Report · January 2026*
`;

// ── Markdown renderer ─────────────────────────────────────────────────────────

function ratingBadgeHtml(rating: string): string {
  const r = RATING_BADGE_COLORS[rating];
  if (!r) return rating;
  return `<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 10px;border-radius:9999px;background:${r.bg};font-size:12px;font-weight:600;color:${r.text};letter-spacing:0.03em;vertical-align:middle;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${r.dot};"></span>${rating}</span>`;
}

function inlineFormat(str: string): string {
  let result = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // [[REF:source:"quote"]] → clickable colored dot
  result = result.replace(
    /\[\[REF:([^:]+?):"([^"]*?)"\]\]/g,
    (_match, source: string, quote: string) => {
      const color = getDotColor(source);
      const display = source.replace(/_/g, " ").replace(".pdf", "").replace(/\b\w/g, (c) => c.toUpperCase());
      const safeSource = source.replace(/"/g, "&quot;");
      const safeQuote = quote.replace(/"/g, "&quot;");
      return `<span data-ref-source="${safeSource}" data-ref-quote="${safeQuote}" title="Source: ${display}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin:0 3px;vertical-align:middle;cursor:pointer;transition:transform 0.1s,box-shadow 0.1s;" onmouseover="this.style.transform='scale(1.4)';this.style.boxShadow='0 0 0 3px ${color}33'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'"></span>`;
    },
  );

  // Rating badges
  result = result.replace(
    /(?:Overall\s+)?Rating:\s*(GREEN|YELLOW|RED|ACCEPT|WATCHLIST|FLAG)/g,
    (_match, rating) => {
      const prefix = _match.replace(rating, "").trim();
      return prefix ? `${prefix} ${ratingBadgeHtml(rating)}` : ratingBadgeHtml(rating);
    },
  );

  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return result;
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inList = false;
  let inTable = false;
  let tableRows: string[] = [];

  function flushTable() {
    if (!tableRows.length) return;
    const [header, _sep, ...body] = tableRows;
    const ths = (header || "").split("|").slice(1, -1).map((h) => `<th class="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">${h.trim()}</th>`).join("");
    const trs = body.map((row) => {
      const tds = row.split("|").slice(1, -1).map((d) => `<td class="px-3 py-2 text-sm text-slate-700">${inlineFormat(d.trim())}</td>`).join("");
      return `<tr class="border-b border-slate-100 last:border-0">${tds}</tr>`;
    }).join("");
    html.push(`<div class="overflow-auto my-4 rounded-lg border border-slate-200"><table class="w-full text-sm"><thead><tr class="bg-slate-50 border-b border-slate-200">${ths}</tr></thead><tbody>${trs}</tbody></table></div>`);
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table rows
    if (trimmed.startsWith("|")) {
      if (!inTable) inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (!trimmed) {
      if (inList) { html.push("</ul>"); inList = false; }
      continue;
    }

    if (trimmed.startsWith("# ")) {
      html.push(`<h1 class="text-xl font-heading font-bold text-alpine-ink mt-8 mb-2">${inlineFormat(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3);
      const plain = text.replace(/\*\*(.+?)\*\*/g, "$1");
      const id = "toc-" + plain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      html.push(`<h2 id="${id}" class="text-base font-heading font-bold text-alpine-ink mt-7 mb-2 scroll-mt-4 pt-4 border-t border-slate-100">${inlineFormat(text)}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      html.push(`<h3 class="text-sm font-heading font-semibold text-alpine-ink mt-5 mb-1.5">${inlineFormat(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (/^[-=]{3,}$/.test(trimmed)) {
      html.push('<hr class="border-slate-200 my-5" />');
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push('<ul class="list-disc list-inside space-y-1 text-sm text-slate-700 my-2 ml-1">'); inList = true; }
      html.push(`<li>${inlineFormat(trimmed.slice(2))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      if (!inList) { html.push('<ol class="list-decimal list-inside space-y-1.5 text-sm text-slate-700 my-2 ml-1">'); inList = true; }
      html.push(`<li>${inlineFormat(trimmed.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    if (inList) { html.push(inList ? "</ul>" : "</ol>"); inList = false; }
    html.push(`<p class="text-sm text-slate-700 leading-relaxed mb-1.5">${inlineFormat(trimmed)}</p>`);
  }
  if (inList) html.push("</ul>");
  if (inTable) flushTable();
  return html.join("\n");
}

// ── Source legend data ────────────────────────────────────────────────────────

const SOURCE_LEGEND = [
  { color: PDF_DOT_COLOR,                     label: "Fund Document" },
  { color: SOURCE_DOT_COLORS.SEC_EDGAR,        label: "SEC EDGAR" },
  { color: SOURCE_DOT_COLORS.ALPINE_ANALYSIS,  label: "Alpine Analysis" },
  { color: SOURCE_DOT_COLORS.ADMIN_VERIFICATION,label: "Admin Verification" },
];

// ── Extract ## headings for JUMP TO bar ──────────────────────────────────────

function extractHeadings(md: string): { text: string; id: string }[] {
  return md.split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const raw = l.slice(3).trim();
      const text = raw.replace(/\*\*(.+?)\*\*/g, "$1");
      const id = "toc-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return { text: text.replace(/Rating:.*$/, "").trim(), id };
    });
}


function CallPrep() {
  const sections = [
    {
      label: "P1 — Critical",
      color: "red" as const,
      topic: "Compliance Program",
      riskTag: "RED RISK",
      categoryTag: "Compliance",
      questions: [
        "CCO hiring timeline — candidate profile and target hire date?",
        "Pre-clearance system implementation plan and budget?",
        "Expert network chaperoning policy — current controls?",
      ],
    },
    {
      label: "P1 — Critical",
      color: "red" as const,
      topic: "Governance & Succession",
      riskTag: "RED RISK",
      categoryTag: "Key Person",
      questions: [
        "Written succession plan — when will it be board-approved?",
        "Key person insurance — coverage amount and current status?",
        "Board composition changes planned for 2026?",
      ],
    },
    {
      label: "P2 — Important",
      color: "amber" as const,
      topic: "Valuation Committee",
      riskTag: "YELLOW RISK",
      categoryTag: "Valuation",
      questions: [
        "Timeline for adding independent members?",
        "Current mark dispute resolution process?",
        "Level 3 asset classification methodology?",
      ],
    },
    {
      label: "P2 — Important",
      color: "amber" as const,
      topic: "Technology & Cybersecurity",
      riskTag: "YELLOW RISK",
      categoryTag: "Cybersecurity",
      questions: [
        "Cybersecurity insurance coverage details?",
        "Penetration testing frequency and last test date?",
        "Incident response plan — last tabletop exercise?",
      ],
    },
  ];

  return (
    <div className="max-w-[960px]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="pb-7 border-b border-slate-200">
          <p className="text-[10px] uppercase tracking-[5px] text-violet-600 font-heading font-semibold mb-2">Alpine Due Diligence</p>
          <h1 className="text-xl font-heading font-bold text-alpine-ink">Management Call Prep</h1>
          <p className="mt-1 text-sm text-slate-500 font-heading">Ridgeline Capital Partners, LLC</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 font-heading font-semibold text-amber-700">
              6 risk observations
            </span>
            <span className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 font-heading font-semibold text-red-700">
              3 HIGH severity blockers
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-heading font-semibold text-slate-600">
              4 discussion modules
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,1))] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6" />
                <path d="M12 22v-6" />
                <path d="M4.93 4.93l4.24 4.24" />
                <path d="M14.83 14.83l4.24 4.24" />
                <path d="M2 12h6" />
                <path d="M22 12h-6" />
                <path d="M4.93 19.07l4.24-4.24" />
                <path d="M14.83 9.17l4.24-4.24" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-heading font-bold uppercase tracking-[0.18em] text-amber-700">Call Objective</h4>
              <p className="mt-1 text-sm leading-7 text-amber-950">
                Obtain management responses to 6 risk observations. Focus on remediation timelines for the 3 HIGH-severity findings preventing ACCEPT.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          {sections.map((s, i) => {
            const isCritical = s.color === "red";
            return (
              <section
                key={i}
                className="border-t border-slate-200 pt-5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <p className={`text-[11px] font-heading font-bold uppercase tracking-[0.18em] ${isCritical ? "text-slate-700" : "text-slate-600"}`}>
                      {s.label}
                    </p>
                    <h3 className="mt-1 text-lg font-heading font-semibold text-alpine-ink">{s.topic}</h3>
                  </div>
                  <span
                    className="mt-0.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-heading font-bold text-slate-500"
                  >
                    {s.questions.length}
                  </span>
                </div>

                <ol className="mt-4 space-y-3">
                  {s.questions.map((q, j) => (
                    <li key={j} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-heading font-bold text-slate-600"
                      >
                        {j + 1}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <p className="text-sm leading-6 text-slate-700">{q}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-heading font-semibold ${
                            isCritical
                              ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                              : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
                          }`}
                        >
                          {s.riskTag}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-heading font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                          {s.categoryTag}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ICDeck() {
  const slides = [
    { n: 1,  t: "Cover & Fund Overview",    c: "Ridgeline Capital Partners, LLC — Global L/S Equity — AUM $2.31B — ODD Rating: WATCHLIST (68/100)" },
    { n: 2,  t: "Executive Summary",         c: "Fund overview, key findings, overall assessment. 4 conditions for ACCEPT upgrade." },
    { n: 3,  t: "Operational Strengths",     c: "Citco admin, EY audit, GS/MS prime brokerage. Clean audit history. Comprehensive reporting. Experienced team." },
    { n: 4,  t: "Critical Findings (RED)",   c: "3 HIGH: No dedicated CCO. No pre-trade compliance. Founder key person dependency." },
    { n: 5,  t: "Moderate Findings (YELLOW)","c": "3 MEDIUM: Valuation committee not independent. No succession plan. Cybersecurity insurance absent." },
    { n: 6,  t: "Topic Rating Summary",      c: "12-topic breakdown: 7 GREEN, 4 YELLOW, 1 RED across 3 Acts (Structural / Investment / Controls)." },
    { n: 7,  t: "Verification Results",      c: "SEC confirmed. Form ADV current. EY audit confirmed. AUM 0.17% variance (immaterial). CCO FAILED." },
    { n: 8,  t: "Conditions for ACCEPT",     c: "1) CCO hire (90d) · 2) Pre-trade system (60d) · 3) Succession plan (120d) · 4) Valuation committee (90d)" },
    { n: 9,  t: "Monitoring Plan",           c: "Annual full-scope review (Jan 2027). Quarterly ops calls. 6 trigger events with escalation procedures." },
    { n: 10, t: "Recommendation",            c: "WATCHLIST with path to ACCEPT. All gaps addressable within 60–120 days. Quarterly monitoring recommended." },
  ] as const;
  return (
    <div className="w-full">
      <div className="text-center pb-5 mb-5 border-b border-slate-200">
        <p className="text-[10px] uppercase tracking-[3px] text-violet-600 font-heading font-semibold mb-1">Alpine Due Diligence</p>
        <h1 className="text-xl font-heading font-bold text-alpine-ink">IC Presentation Deck</h1>
        <p className="text-slate-400 text-sm">10-slide outline for Investment Committee</p>
      </div>
      <div className="space-y-3">
        {slides.map((s) => (
          <div key={s.n} className="border border-slate-200 rounded-xl p-5 flex gap-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-heading font-bold shrink-0">{s.n}</span>
            <div><p className="font-heading font-semibold text-alpine-ink">{s.t}</p><p className="text-sm text-slate-600 mt-0.5">{s.c}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Final Report — paginated document reader ─────────────────────────────────

const FINAL_REPORT_SECTIONS = [
  {
    id: "cover", group: null, title: "Cover Page",
    render: () => (
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        {/* Main title area */}
        <div style={{ background: "#ffffff", padding: "40px 48px 32px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#7c3aed", textTransform: "uppercase" as const, marginBottom: 20 }}>Alpine Due Diligence Inc. — Confidential</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.15 }}>ODD Report</div>
          <div style={{ width: 40, height: 3, background: "#7c3aed", borderRadius: 2, margin: "14px 0 20px" }} />
          <div style={{ fontSize: 20, color: "#0f172a", fontWeight: 700, marginBottom: 4 }}>Trellis Capital IV, L.P.</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 28 }}>Pre-seed Venture Capital · Delaware LP · Full Review</div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const, fontSize: 11, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
            {[["Report Date", "April 2026"], ["Review Type", "Initial (Pre-Launch)"], ["AUM (Net Assets)", "$280.3M + $113.7M uncalled"], ["Strategy", "Pre-seed Venture Capital"]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3, fontWeight: 600 }}>{label}</div>
                <div style={{ color: "#334155", fontWeight: 600, fontSize: 12 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "20px 48px", display: "flex", gap: 40, flexWrap: "wrap" as const }}>
          {[
            { label: "Overall Rating", value: "YELLOW", color: "#D97706" },
            { label: "Chapters", value: "8 Assessed", color: "#334155" },
            { label: "Flags", value: "22 Items", color: "#dc2626" },
            { label: "Required Before Close", value: "3 High Priority", color: "#dc2626" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background: "#fff", borderTop: "1px solid #f1f5f9", padding: "14px 48px", fontSize: 10, color: "#cbd5e1", lineHeight: 1.7 }}>
          This report is supplied subject to the terms of any agreement between the authorising entity and Alpine Due Diligence, Inc. It is confidential and for the exclusive use of the intended recipient. It may not be reproduced, distributed, or transmitted to any third party without Alpine&apos;s prior written consent.
        </div>
      </div>
    ),
  },
  {
    id: "toc", group: null, title: "Table of Contents",
    render: () => (
      <div>
        <SectionHeader title="Table of Contents" page="3" />
        <div style={{ fontFamily: "Georgia, serif" }}>
          {[
            { section: "—", title: "Overview", page: "4", rating: undefined },
            { section: "—", title: "Assessment", page: "5", rating: undefined },
            { section: "—", title: "Scope & Verification", page: "7", rating: undefined },
            { section: "—", title: "Alpine Ratings & Flags", page: "8", rating: undefined },
            { section: "—", title: "Remediation & Monitoring", page: "11", rating: undefined },
            { section: "Ch 1", title: "Manager, Ownership & Governance", page: "13", rating: "YELLOW" },
            { section: "Ch 2", title: "Legal, Regulatory & Compliance", page: "16", rating: "RED" },
            { section: "Ch 3", title: "Technology, Cybersecurity & Business Resilience", page: "19", rating: "RED" },
            { section: "Ch 4", title: "Fund Structure, Terms & Investor Alignment", page: "21", rating: "GREEN" },
            { section: "Ch 5", title: "Service Providers, Delegation & Oversight", page: "24", rating: "GREEN" },
            { section: "Ch 6", title: "Investment Operations & Portfolio Controls", page: "26", rating: "YELLOW" },
            { section: "Ch 7", title: "Valuation, Asset Existence & Investor Reporting", page: "29", rating: "YELLOW" },
            { section: "Ch 8", title: "Manager Transparency & LP Communications", page: "32", rating: "GREEN" },
            { section: "—", title: "Reference Data", page: "33", rating: undefined },
          ].map((item) => {
            const rc = item.rating === "GREEN" ? "#059669" : item.rating === "YELLOW" ? "#D97706" : item.rating === "RED" ? "#DC2626" : undefined;
            const rb = item.rating === "GREEN" ? "#d1fae5" : item.rating === "YELLOW" ? "#fef3c7" : item.rating === "RED" ? "#fee2e2" : undefined;
            return (
              <div key={item.section + item.title} style={{ marginBottom: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#7c3aed", width: 32, flexShrink: 0 }}>{item.section}</span>
                <span style={{ flex: 1, fontSize: 13, color: "#1e293b" }}>{item.title}</span>
                {item.rating && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: rb, color: rc, flexShrink: 0 }}>{item.rating}</span>}
                <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, minWidth: 20, textAlign: "right" }}>{item.page}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "overview", group: null, title: "Overview & Assessment",
    render: () => (
      <div>
        <SectionHeader title="Overview & Assessment" page="4–6" />
        <RatingBanner rating="YELLOW" score={0} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <FindingBox type="strength" title="Strengths">
            Apex expected as fund administrator. Appropriate cash controls with dual-authorization wire process. Multi-party asset verification involving administrator, auditor, and Carta. Established provider relationships continued from prior funds.
          </FindingBox>
          <FindingBox type="concern" title="Key Risks">
            Limited internal staffing — single operations professional, no back office oversight. IT/cybersecurity environment substantially underdeveloped. Investment professional responsible for compliance oversight. No formal valuation committee.
          </FindingBox>
        </div>
        <BodyText>
          Trellis Capital Management, LLC (&quot;Trellis&quot;, the &quot;Manager&quot;) is a pre-seed stage venture capital firm that had net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital. Trellis is headquartered in San Francisco and has seven staff. Trellis Capital IV, L.P. (the &quot;Fund&quot;) is a Delaware limited partnership formed on March 28, 2026, targeting $175M with a $200M hard cap. The initial closing was held April 1, 2026 with ~$125M in commitments.
        </BodyText>
        <BodyText>
          As our primary observation, we highlight that Trellis is a small organization, consisting of seven full-time staff, with resultant segregation of duties issues. The single non-investment professional is Sarah Collins (Head of Operations), whose responsibilities focus on running business operations and acting as an executive assistant for the Managing Partners, meaning that the funds operate without the oversight of an internal back office resource. The Manager has recently retained Raj Patel as a fractional CFO who will focus on overseeing Apex, though he will not dedicate substantial time until Summer 2026.
        </BodyText>
        <BodyText>
          Separately, the firm&apos;s IT and cybersecurity environment is substantially underdeveloped, with a lack of formal policy documents and employee training. The Head of Operations is leading a search for a third-party cybersecurity vendor tasked with conducting a formal cybersecurity audit, vulnerability test, and implementing a training program by end of 2026. Overall, based on the firm&apos;s current lack of back office function, its cybersecurity environment, and an investment professional being responsible for compliance, Alpine is providing a <strong>Yellow</strong> overall rating.
        </BodyText>
        <div style={{ padding: "12px 16px", background: "#fef9f0", border: "1px solid #fde68a", borderRadius: 8, fontSize: 11, color: "#92400e", lineHeight: 1.6 }}>
          <strong>Pre-Launch Note:</strong> Our assessment is based on the Manager&apos;s assertions at the time of this review considering the Fund has not formally commenced operations and service providers for the Fund have not yet been formally engaged (though they remain consistent with the prior funds). Any changes in these areas might affect our rating.
        </div>
      </div>
    ),
  },
  {
    id: "ratings", group: null, title: "Ratings & Flags",
    render: () => (
      <div>
        <SectionHeader title="Alpine Ratings & Flags" page="8–10" />
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Chapter Ratings</div>
          {[
            { ch: "1", title: "Manager, Ownership & Governance", rating: "YELLOW" },
            { ch: "2", title: "Legal, Regulatory & Compliance", rating: "RED" },
            { ch: "3", title: "Technology, Cybersecurity & Business Resilience", rating: "RED" },
            { ch: "4", title: "Fund Structure, Terms & Investor Alignment", rating: "GREEN" },
            { ch: "5", title: "Service Providers, Delegation & Oversight", rating: "GREEN" },
            { ch: "6", title: "Investment Operations & Portfolio Controls", rating: "YELLOW" },
            { ch: "7", title: "Valuation, Asset Existence & Investor Reporting", rating: "YELLOW" },
            { ch: "8", title: "Manager Transparency & LP Communications", rating: "GREEN" },
          ].map(({ ch, title, rating }) => {
            const rc = rating === "GREEN" ? "#059669" : rating === "YELLOW" ? "#D97706" : "#DC2626";
            const rb = rating === "GREEN" ? "#d1fae5" : rating === "YELLOW" ? "#fef3c7" : "#fee2e2";
            return (
              <div key={ch} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, marginBottom: 4, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", width: 20 }}>Ch{ch}</span>
                <span style={{ flex: 1, fontSize: 12, color: "#334155" }}>{title}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: rb, color: rc }}>{rating}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Selected Alpine Flags (22 Total)</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
          {[
            ["1", "No formal succession plan.", "Manager, Ownership & Governance"],
            ["2", "Background checks completed internally, not by third-party provider.", "Manager, Ownership & Governance"],
            ["3", "Limited internal resources: single back office / operations professional.", "Manager, Ownership & Governance"],
            ["4", "No initial attestation with respect to compliance manual.", "Legal, Regulatory & Compliance"],
            ["5", "The firm has not adopted a third-party cybersecurity framework.", "Technology & Cybersecurity"],
            ["6", "No annual recertification process with respect to compliance manual.", "Legal, Regulatory & Compliance"],
            ["7", "The firm has not implemented an annual compliance training program.", "Legal, Regulatory & Compliance"],
            ["8", "Manager does not have a written personal trading policy.", "Legal, Regulatory & Compliance"],
            ["9", "The firm has not implemented an endpoint data loss prevention solution.", "Technology & Cybersecurity"],
            ["10", "The firm has not developed a formal incident response plan.", "Technology & Cybersecurity"],
            ["11", "The firm does not perform network penetration testing.", "Technology & Cybersecurity"],
            ["12", "Fund does not have an LPAC / Advisory Board.", "Fund Structure & Terms"],
            ["13", "Manager does not maintain internal accounting records or track cash balances.", "Investment Operations"],
            ["14", "The Manager does not have a formal valuation committee.", "Valuation & Reporting"],
            ["15", "Front office investment professionals primarily responsible for valuation.", "Valuation & Reporting"],
          ].map(([n, flag, chapter]) => (
            <div key={n} style={{ display: "flex", gap: 8, padding: "7px 10px", background: "#fff", border: "1px solid #f1f5f9", borderRadius: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", width: 16, flexShrink: 0 }}>#{n}</span>
              <span style={{ flex: 1, fontSize: 11, color: "#334155" }}>{flag}</span>
              <span style={{ fontSize: 9, color: "#94a3b8", flexShrink: 0 }}>{chapter}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ch1", group: "Chapters", title: "Ch 1 — Manager & Governance",
    render: () => (
      <div>
        <SectionHeader title="Chapter 1 — Manager, Ownership & Governance" page="13–15" rating="YELLOW" />
        <BodyText>
          Trellis Capital Management, LLC is a pre-seed stage venture capital firm headquartered in San Francisco, founded in 2018 by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). Trellis reported net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments to its first three funds.
        </BodyText>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {[["Fund I", "2018", "$47M", "Fully deployed"], ["Fund II", "2021", "$78M", "Fully deployed"], ["Fund III", "2024", "$150M", "64% deployed"], ["Fund IV", "2026", "~$125M (initial)", "Pre-deployment"]].map(([f, v, c, s]) => (
            <div key={f} style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", marginBottom: 2 }}>{f}</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{c}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{v} vintage · {s}</div>
            </div>
          ))}
        </div>
        <BodyText>
          Arjun Mehta and Priya Sharma each own 50% of the firm (confirmed via Form ADV Schedules A &amp; B). No formal succession plan exists, though the Managing Partners could assume each other&apos;s responsibilities in a key person event. The key person provision per Fund IV&apos;s LPA would only be automatically triggered if both Managing Partners fail to provide sufficient time and attention. Key person life insurance is not maintained.
        </BodyText>
        <FindingBox type="concern" title="Yellow Rating Driver — Staffing &amp; Segregation of Duties">
          Seven full-time staff with a single operations professional (Sarah Collins, Head of Operations) whose role is primarily executive assistant rather than back office. The funds operate without internal back office oversight of the Administrator. Partially mitigated by the engagement of fractional CFO Raj Patel and planned hire of a full-time Head of Finance in 2027.
        </FindingBox>
        <FindingBox type="strength" title="Positive Factors">
          Both Managing Partners have strong VC pedigrees (Founder Collective, Foundation Capital). GP commitment of 1% invested pari passu with LPs. Employee background checks in progress (internal to date; third-party provider search underway). Carried interest vesting over four years for all investment staff.
        </FindingBox>
      </div>
    ),
  },
  {
    id: "ch2", group: "Chapters", title: "Ch 2 — Legal, Regulatory & Compliance",
    render: () => (
      <div>
        <SectionHeader title="Chapter 2 — Legal, Regulatory & Compliance" page="16–18" rating="RED" />
        <BodyText>
          The firm is exempt from registration with the SEC under the venture capital adviser exemption and has filed as an Exempt Reporting Adviser (&quot;ERA&quot;) since March 9, 2019. Form ADV dated March 22, 2026 reviewed. No disciplinary actions, regulatory inquiries, or sanctions on Form ADV Section 11 or DRP pages.
        </BodyText>
        <FindingBox type="concern" title="Red Rating Driver — Investment Professional Responsible for Compliance">
          Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to his investment responsibilities. Alpine is strongly opposed to an investment professional holding this responsibility and would prefer it to reside with a non-investment professional such as Sarah Collins (Head of Operations). This is a required action before close.
        </FindingBox>
        <FindingBox type="concern" title="Compliance Infrastructure Gaps">
          No initial attestation or annual recertification of compliance policies required from staff. No annual compliance training program has been implemented. Compliance consultant engagement limited to Summit Advisory for annual Form ADV preparation. No written personal trading policy (not required for ERAs, but recommended as best practice). The firm maintains required ERA policies (pay-to-play, insider trading, AML) but the overall compliance culture falls below institutional standards.
        </FindingBox>
        <FindingBox type="strength" title="Positive Factors">
          No regulatory sanctions or disciplinary history. Firm policies meet ERA minimum requirements. Managing Partners serve on portfolio company boards with directors&apos; fees waived. Professional liability insurance provides up to $1 million in coverage. No use of expert networks or soft dollars.
        </FindingBox>
      </div>
    ),
  },
  {
    id: "ch3", group: "Chapters", title: "Ch 3 — Technology & Cybersecurity",
    render: () => (
      <div>
        <SectionHeader title="Chapter 3 — Technology, Cybersecurity & Business Resilience" page="19–20" rating="RED" />
        <BodyText>
          There is no single individual in charge of IT and the firm has not appointed a technology or cybersecurity consultant. Sarah Collins (Head of Operations) is leading a search for a third-party cybersecurity vendor. The firm relies on cloud-based applications with no onsite infrastructure beyond internet connection.
        </BodyText>
        <FindingBox type="concern" title="Red Rating Driver — Underdeveloped Cybersecurity Environment">
          No formal cybersecurity policy or incident response plan. No third-party cybersecurity framework (e.g., NIST, ISO/IEC 27000) adopted. No employee cybersecurity awareness training or phishing campaign. No endpoint data loss prevention — staff maintain access to removable media, personal email, and personal cloud storage on company-issued endpoints. Penetration testing has not been completed. No written business continuity plan.
        </FindingBox>
        <FindingBox type="strength" title="Controls in Place">
          Baseline network security (firewall, anti-virus). User access controls on need-to-know and least-privilege basis. MFA implemented on key business applications. Staff maintain ability to work remotely. Cybersecurity vendor search underway — formal audit, vulnerability test, and training program targeted for end of 2026.
        </FindingBox>
        <BodyText>
          The planned cybersecurity vendor engagement is a positive step, but the Red rating stands until formal policies and testing are implemented. Alpine recommends investors require the firm to commit to these enhancements via side letter or accelerate the timeline prior to investing.
        </BodyText>
      </div>
    ),
  },
  {
    id: "ch4", group: "Chapters", title: "Ch 4 — Fund Structure & Terms",
    render: () => (
      <div>
        <SectionHeader title="Chapter 4 — Fund Structure, Terms & Investor Alignment" page="21–23" rating="GREEN" />
        <BodyText>
          Trellis Capital IV, L.P. is a Delaware limited partnership formed March 28, 2026. Trellis Capital GP IV, LLC (Delaware LLC) serves as General Partner. Both confirmed against the Delaware Division of Corporations register.
        </BodyText>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            ["Min. Commitment", "$1 million"], ["GP Commitment", "1.01% (cash, pari passu)"],
            ["First Closing", "April 1, 2026 (~$125M)"], ["Hard Cap", "$200 million"],
            ["Fund Term", "10 years + 2 one-year extensions"], ["Commitment Period", "5 years"],
            ["Management Fee", "2.5% (commitment) / 1.5% (post)"], ["Carried Interest", "20%, American waterfall"],
            ["Preferred Return", "None (typical VC)"], ["Recycling", "Up to 120% of aggregate commitments"],
            ["Org. Expenses Cap", "$350,000"], ["Deal Counsel", "Charged to Fund (de minimis)"],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: "8px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <FindingBox type="strength" title="Green Rating — Terms Consistent with VC Market Norms">
          The 2.5% management fee, American waterfall, and absence of a preferred return are flagged but common in the pre-seed VC space. Key person provision, clawback mechanics, and recycling provisions are standard and LP-protective. The LPA contains an LPAC provision, though formation is at GP discretion absent LP requests.
        </FindingBox>
        <BodyText>
          Investment strategy: pre-seed technology at $1–3M per investment, targeting 40–50 companies. Instruments include equity, SAFEs, KISS, warrants, and convertible equity. Concentration limits: 10% single company, 5% passive, 10% non-U.S./Canada. LPA permits up to 10% in digital assets (not utilized to date).
        </BodyText>
      </div>
    ),
  },
  {
    id: "ch5", group: "Chapters", title: "Ch 5 — Service Providers",
    render: () => (
      <div>
        <SectionHeader title="Chapter 5 — Service Providers, Delegation & Oversight" page="24–25" rating="GREEN" />
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 16 }}>
          {[
            { role: "Administrator", entity: "Apex Fund Services, LLC", status: "Expected (pre-close)", note: "Uses Xero for accounting, FundPanel for LP reporting. Engaged since Fund I. Apex is notably hands-on with valuation guidance. Engagement letter for Fund IV expected before first capital call." },
            { role: "Auditor", entity: "Baker, Thompson & Co. LLP", status: "Expected", note: "Well-regarded VC auditor in the Bay Area. Audits prior funds and co-invest SPVs. Not Big 4 but deeply experienced in VC. Engagement before first year-end audit." },
            { role: "Corporate Banker", entity: "Pacific Commerce Bank (JP Morgan)", status: "Transitioning", note: "Pacific Commerce collapsed Q2 2025 and was acquired by JP Morgan. Accounts will transfer per JP Morgan migration timeline. No service disruption to date. Monitor." },
            { role: "Legal Counsel", entity: "Morrison Cole Ashworth & Partners", status: "Current", note: "Fund formation counsel. Continuation from prior funds." },
            { role: "Compliance", entity: "Summit Advisory", status: "Narrow scope", note: "Engaged for annual Form ADV preparation only. Broader compliance consultant engagement recommended." },
            { role: "Deal Counsel", entity: "James Crawford (independent)", status: "Ad hoc", note: "Former partner at Hartwell & Sterling. Retained on an ad hoc basis for deal-related legal matters. Fees charged to Fund (de minimis per Apex)." },
          ].map(({ role, entity, status, note }) => (
            <div key={role} style={{ padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em", width: 80, flexShrink: 0 }}>{role}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", flex: 1 }}>{entity}</span>
                <span style={{ fontSize: 9, color: "#64748b" }}>{status}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginLeft: 88 }}>{note}</div>
            </div>
          ))}
        </div>
        <FindingBox type="strength" title="Green Rating">
          Continuation of established provider relationships from prior funds provides comfort. Pacific Commerce / JP Morgan banking transition should be monitored. Engagement letters expected before first capital call (administrator) and first year-end audit (auditor).
        </FindingBox>
      </div>
    ),
  },
  {
    id: "ch6", group: "Chapters", title: "Ch 6 — Investment Operations",
    render: () => (
      <div>
        <SectionHeader title="Chapter 6 — Investment Operations & Portfolio Controls" page="26–28" rating="YELLOW" />
        <BodyText>
          The firm uses a custom-built Retool dashboard (&quot;People Flow&quot;) for tracking the deal pipeline and an Excel dashboard for tracking key financial metrics. The Manager expects the Fund will invest in roughly 40–50 companies. All new investments require approval from both Arjun Mehta and Priya Sharma.
        </BodyText>
        <BodyText>
          Deal sourcing breakdown for Fund III: Founder (32%), Angel/Advisor/Scout (26%), Alpha/Founders in Residence (26%), VC referral (10%), Outbound (6%). &quot;Alpha&quot; refers to the firm&apos;s pre-seed program to which founders can apply.
        </BodyText>
        <FindingBox type="concern" title="Yellow Rating Driver — Accounting &amp; Back Office Gaps">
          The firm does not track individual cash transactions or aggregate cash balances, relying solely on Apex to maintain and reconcile the accounting books and records. There has been no back office oversight of the Administrator&apos;s accounting work to date. No formal written investment allocation policy separate from LPA disclosures.
        </FindingBox>
        <FindingBox type="strength" title="Cash Controls — Appropriate">
          All cash movements from Pacific Commerce require one of two authorized Apex individuals to initiate wires and one Managing Partner to release. Apex completes a verification callback for new payment instructions. Operating expenses paid via Bill.com requiring Apex to initiate and a Managing Partner to approve. Both Managing Partners must sign on the opening of new bank accounts.
        </FindingBox>
        <BodyText>
          Apex maintains formal books using Xero: daily cash posting via direct feed from Pacific Commerce, at least weekly reconciliation, monthly &quot;soft close,&quot; and quarterly &quot;full close&quot; producing balance sheet, schedule of investments, income statement, and statement of changes in partners&apos; capital.
        </BodyText>
      </div>
    ),
  },
  {
    id: "ch7", group: "Chapters", title: "Ch 7 — Valuation & Reporting",
    render: () => (
      <div>
        <SectionHeader title="Chapter 7 — Valuation, Asset Existence & Investor Reporting" page="29–31" rating="YELLOW" />
        <BodyText>
          As with most closed-ended VC structures, the Fund is a finite-life capital commitment vehicle with no capital transactions based on valuations, and the GP receives carried interest only upon a realization event. These characteristics significantly reduce valuation sensitivity and the incentive for intra-period price manipulation.
        </BodyText>
        <BodyText>
          The firm values portfolio companies at cost and marks investments up/down based on the price of a subsequent financing round in which a significant new investor has participated. The firm has an undated valuation policy. In practice, valuations are approved by the Managing Partners. The firm does not have a formal valuation committee.
        </BodyText>
        <FindingBox type="concern" title="Yellow Rating Driver — Valuation Governance">
          No formal valuation committee — front office exclusively controls pricing. Distribution waterfalls maintained in Excel. No internal investor-level accounting records. As the firm grows, Alpine would prefer a valuation committee with non-investment representation.
        </FindingBox>
        <FindingBox type="strength" title="Asset Existence &amp; Verification">
          Multiple parties involved in each transaction (requiring collusion to create fictitious investments). Baker Thompson issues audit confirmations to ~50% of portfolio companies annually. Apex receives all investment documents and wire instructions from Manager. Share certificates via Carta obtained directly by Apex. Apex independently verifies wire details with portfolio companies before initiating.
        </FindingBox>
        <BodyText>
          Investor reporting: quarterly reports within 45 business days of quarter-end via FundPanel LP Portal; audited financials within 120 days of year-end under U.S. GAAP. The Manager and Administrator represented that the prior funds have never had an investor reporting error.
        </BodyText>
      </div>
    ),
  },
  {
    id: "ch8", group: "Chapters", title: "Ch 8 — Manager Transparency",
    render: () => (
      <div>
        <SectionHeader title="Chapter 8 — Manager Transparency & LP Communications" page="32" rating="GREEN" />
        <FindingBox type="strength" title="Green Rating — Full Cooperation Throughout Diligence">
          The Manager was responsive and forthcoming throughout the due diligence process, providing requested documents promptly and making staff available for follow-up questions. There were no instances of evasion, delayed responses, or attempts to restrict the scope of Alpine&apos;s review.
        </FindingBox>
        <BodyText>
          Apex was cooperative and provided independent confirmation of key operational arrangements via conference call on April 3, 2026. Apex independently verified service provider engagements, described its operational procedures in detail, and confirmed cash control and wire authorization processes without prompting from the Manager.
        </BodyText>
        <FindingBox type="strength" title="Proactive Disclosure of Weaknesses">
          The Manager proactively disclosed areas of operational weakness, including the current lack of back office resources, the underdeveloped cybersecurity environment, and the timeline for planned improvements. This level of candor is constructive and indicates a willingness to address operational gaps.
        </FindingBox>
      </div>
    ),
  },
  {
    id: "remediation", group: null, title: "Remediation & Monitoring",
    render: () => (
      <div>
        <SectionHeader title="Remediation & Monitoring" page="11–12" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Required Before Close</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
          {[
            { n: 1, priority: "HIGH", target: "Pre-first capital call", action: "Investor Action", ia: "Confirm pre-investment", text: "Execute provider engagement letters for Fund IV (administrator, auditor, banker)." },
            { n: 2, priority: "HIGH", target: "TBD", action: "Investor Action", ia: "Require written commitment via side letter", text: "Transfer compliance oversight to non-investment professional." },
            { n: 3, priority: "HIGH", target: "End of 2026", action: "Investor Action", ia: "Require written commitment via side letter", text: "Engage cybersecurity vendor; implement policy, training, and testing." },
          ].map(({ n, priority, target, ia, text }) => (
            <div key={n} style={{ padding: "14px 18px", borderRadius: 10, background: "#fff7f7", border: "1px solid #fca5a5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626" }}>{priority}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>Target: {target}</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "#334155", marginLeft: 32, marginBottom: 4 }}>{text}</p>
              <div style={{ fontSize: 10, color: "#7c3aed", marginLeft: 32 }}>Investor action: {ia}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Post-Close Monitoring</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {[
            { n: 4, priority: "MED", target: "2027", text: "Hire full-time Head of Finance." },
            { n: 5, priority: "MED", target: "TBD", text: "Implement compliance attestation process and annual training program." },
            { n: 6, priority: "MED", target: "TBD", text: "Form valuation committee with non-investment professional representation." },
            { n: 7, priority: "MED", target: "TBD", text: "Implement internal investor-level accounting records." },
            { n: 8, priority: "MED", target: "TBD", text: "Prepare written business continuity plan." },
            { n: 9, priority: "LOW", target: "TBD", text: "Form LPAC / Advisory Board." },
            { n: 10, priority: "LOW", target: "TBD", text: "Monitor Pacific Commerce / JP Morgan banking transition." },
            { n: 11, priority: "LOW", target: "TBD", text: "Engage third-party background check provider." },
          ].map(({ n, priority, target, text }) => (
            <div key={n} style={{ display: "flex", gap: 10, padding: "9px 12px", background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 7 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", width: 16 }}>#{n}</span>
              <span style={{ flex: 1, fontSize: 11, color: "#334155" }}>{text}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#D97706", flexShrink: 0 }}>{priority}</span>
              <span style={{ fontSize: 9, color: "#94a3b8", flexShrink: 0 }}>{target}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "verification", group: null, title: "Scope & Verification",
    render: () => (
      <div>
        <SectionHeader title="Scope & Independent Verification" page="7–8" />
        <BodyText>
          Alpine&apos;s review included a conference call with Apex Fund Services (the Fund&apos;s expected Administrator) on April 3, 2026, a review of the Fund&apos;s Limited Partnership Agreement and related offering documents, the Manager&apos;s compliance binder and valuation policy, Fund III&apos;s audited financial statements, and independent checks against public registers and regulatory databases.
        </BodyText>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, marginTop: 12 }}>
          {[
            { item: "Management Company Registration", method: "Alpine direct check, Delaware Division of Corporations", result: "CONFIRMED" },
            { item: "Management Company Corporate Form", method: "Cross-referenced Form ADV dated March 22, 2026", result: "CONSISTENT" },
            { item: "Ownership Structure", method: "Form ADV Schedules A & B", result: "CONSISTENT", detail: "Arjun Mehta and Priya Sharma each hold 50–75%" },
            { item: "SEC ERA Status", method: "Alpine direct check, IARD register", result: "CONFIRMED" },
            { item: "SEC Disciplinary History", method: "Form ADV Section 11 and DRP pages (March 22, 2026 filing)", result: "NO ACTIONS" },
            { item: "Fund Registration (Delaware)", method: "Alpine confirmed Trellis Capital GP IV, LLC to Delaware Division of Corporations", result: "CONFIRMED" },
            { item: "Administrator Engagement", method: "Apex confirmed via conference call, April 3, 2026", result: "CONFIRMED (expected)" },
            { item: "Auditor Engagement", method: "Apex confirmed Baker Thompson expected as auditor", result: "CONFIRMED (expected)" },
            { item: "Corporate Banker Engagement", method: "Apex confirmed Pacific Commerce expected, April 3, 2026", result: "CONFIRMED (expected)" },
          ].map(({ item, method, result, detail }) => {
            const bg = result === "CONFIRMED" || result === "CONSISTENT" || result.includes("expected") ? "#f0fdf4" : result === "NO ACTIONS" ? "#f0fdf4" : "#fff7f7";
            const bc = bg === "#f0fdf4" ? "#bbf7d0" : "#fecaca";
            const tc = bg === "#f0fdf4" ? "#059669" : "#dc2626";
            return (
              <div key={item} style={{ padding: "10px 14px", borderRadius: 8, background: bg, border: `1px solid ${bc}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", flex: 1 }}>{item}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: bg, color: tc, border: `1px solid ${bc}`, flexShrink: 0 }}>{result}</span>
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{method}</div>
                {detail && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{detail}</div>}
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "refdata", group: null, title: "Reference Data",
    render: () => (
      <div>
        <SectionHeader title="Reference Data" page="33–42" />
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {[
            { heading: "Manager", rows: [["Manager Name", "Trellis Capital Management, LLC"], ["Date of Formation", "August 19, 2018"], ["Primary Location", "San Francisco"], ["AUM (Net Assets, 12/31/2025)", "$280.3 million"], ["Uncalled Capital", "$113.7 million"], ["Total Headcount", "7 (6 investment, 1 operations)"], ["Ownership", "Arjun Mehta 50%, Priya Sharma 50%"], ["Insider Commitment", "~$2.77M (~1% of commitments)"]] },
            { heading: "Fund IV", rows: [["Fund Name", "Trellis Capital IV, L.P."], ["Domicile", "Delaware LP"], ["Date of Incorporation", "March 28, 2026"], ["First Closing", "April 1, 2026 (~$125M)"], ["Target Raise", "$175 million"], ["Hard Cap", "$200 million"], ["Strategy", "Pre-seed Venture Capital (technology)"], ["Investment Size", "$1–3M per company"], ["Target Portfolio", "40–50 companies"]] },
            { heading: "Service Providers", rows: [["Administrator", "Apex Fund Services, LLC (expected)"], ["Accounting Platform", "Xero"], ["LP Portal", "FundPanel"], ["Auditor", "Baker, Thompson & Co. LLP (expected)"], ["Audit Standard", "U.S. GAAP"], ["Corporate Banker", "Pacific Commerce Bank (JP Morgan)"], ["Legal Counsel", "Morrison Cole Ashworth & Partners"], ["Compliance Consultant", "Summit Advisory (Form ADV only)"]] },
          ].map(({ heading, rows }) => (
            <div key={heading}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>{heading}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {rows.map(([k, v]) => (
                  <div key={k} style={{ padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 5 }}>
                    <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{k}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1e293b", marginTop: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
] as const;

// Small shared sub-components used by sections
function SectionHeader({ title, page, rating, score }: { title: string; page: string; rating?: string; score?: number }) {
  const rc = rating === "GREEN" ? "#059669" : rating === "YELLOW" ? "#D97706" : rating === "RED" ? "#DC2626" : undefined;
  const rb = rating === "GREEN" ? "#d1fae5" : rating === "YELLOW" ? "#fef3c7" : rating === "RED" ? "#fee2e2" : undefined;
  return (
    <div style={{ paddingBottom: 16, marginBottom: 20, borderBottom: "2px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>{title}</h2>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Page {page}</div>
        </div>
        {rating && score !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: rb, color: rc }}>{rating}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: rc }}>{score}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingBanner({ rating, score }: { rating: string; score: number }) {
  const color = rating === "ACCEPT" ? "#059669" : rating === "WATCHLIST" ? "#D97706" : "#DC2626";
  const bg = rating === "ACCEPT" ? "#d1fae5" : rating === "WATCHLIST" ? "#fef3c7" : "#fee2e2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderRadius: 10, background: bg, border: `1px solid ${color}40`, marginBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{rating}</div>
      <div style={{ width: 1, height: 32, background: `${color}30` }} />
      <div><div style={{ fontSize: 9, fontWeight: 600, color: `${color}aa`, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>ODD Score</div><div style={{ fontSize: 22, fontWeight: 800, color }}>{score} / 100</div></div>
      <div style={{ fontSize: 11, color, lineHeight: 1.5, flex: 1, paddingLeft: 8 }}>
        {rating === "WATCHLIST" ? "Meets most operational standards. Material gaps require remediation before ACCEPT upgrade." : rating === "ACCEPT" ? "Meets all operational standards. Approved for allocation." : "Material deficiencies identified. Allocation not recommended pending remediation."}
      </div>
    </div>
  );
}
function BodyText({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, lineHeight: 1.85, color: "#1e293b", marginBottom: 14, fontFamily: "Georgia, serif" }}>{children}</p>;
}
function FindingBox({ type, title, children }: { type: "strength" | "concern"; title: string; children: React.ReactNode }) {
  const color = type === "strength" ? "#059669" : "#DC2626";
  const bg = type === "strength" ? "#f0fdf4" : "#fff7f7";
  const border = type === "strength" ? "#bbf7d0" : "#fecaca";
  return (
    <div style={{ padding: "14px 18px", borderRadius: 8, background: bg, border: `1px solid ${border}`, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>{children}</div>
    </div>
  );
}

function FinalReport() {
  const [activeSectionId, setActiveSectionId] = useState<string>(FINAL_REPORT_SECTIONS[0].id);
  const activeIdx = FINAL_REPORT_SECTIONS.findIndex((s) => s.id === activeSectionId);
  const activeSection = FINAL_REPORT_SECTIONS[activeIdx];

  const groups = Array.from(new Set(FINAL_REPORT_SECTIONS.map((s) => s.group)));

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/demo-docs/sample_vc_fund_iv_alt.pdf";
    link.download = "Ridgeline_ODD_Final_Report_Apr2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", gap: 0, minHeight: 600, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>

      {/* Sidebar — Table of Contents */}
      <div style={{ width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #e2e8f0", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2 }}>Final Report</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Ridgeline Capital Partners</div>
        </div>
        <div style={{ flex: 1, padding: "10px 0" }}>
          {groups.map((group) => {
            const groupSections = FINAL_REPORT_SECTIONS.filter((s) => s.group === group);
            return (
              <div key={group ?? "__ungrouped"}>
                {group && (
                  <div style={{ fontSize: 8, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", padding: "8px 16px 4px" }}>{group}</div>
                )}
                {groupSections.map((s) => {
                  const isActive = s.id === activeSectionId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSectionId(s.id)}
                      style={{ width: "100%", textAlign: "left", padding: "7px 16px 7px " + (group ? "24px" : "16px"), fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "#7c3aed" : "#475569", background: isActive ? "#f5f3ff" : "transparent", borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent", border: "none", cursor: "pointer", display: "block", lineHeight: 1.4 }}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 12px", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={handleDownload}
            style={{ width: "100%", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#fff", background: "#7c3aed", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Main content — single section view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          {activeSection.render()}
        </div>

        {/* Bottom navigation */}
        <div style={{ borderTop: "1px solid #e2e8f0", background: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <button
            onClick={() => activeIdx > 0 && setActiveSectionId(FINAL_REPORT_SECTIONS[activeIdx - 1].id)}
            disabled={activeIdx === 0}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, color: activeIdx === 0 ? "#cbd5e1" : "#475569", background: "transparent", border: "1px solid " + (activeIdx === 0 ? "#f1f5f9" : "#e2e8f0"), borderRadius: 8, cursor: activeIdx === 0 ? "default" : "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Previous
          </button>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            {activeIdx + 1} / {FINAL_REPORT_SECTIONS.length} sections
          </span>
          <button
            onClick={() => activeIdx < FINAL_REPORT_SECTIONS.length - 1 && setActiveSectionId(FINAL_REPORT_SECTIONS[activeIdx + 1].id)}
            disabled={activeIdx === FINAL_REPORT_SECTIONS.length - 1}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, color: activeIdx === FINAL_REPORT_SECTIONS.length - 1 ? "#cbd5e1" : "#475569", background: "transparent", border: "1px solid " + (activeIdx === FINAL_REPORT_SECTIONS.length - 1 ? "#f1f5f9" : "#e2e8f0"), borderRadius: 8, cursor: activeIdx === FINAL_REPORT_SECTIONS.length - 1 ? "default" : "pointer" }}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TABS = ["Full Report", "Data Report", "Executive Brief", "Call Prep", "IC Deck", "Final Report"] as const;

// ── Ref Popover ───────────────────────────────────────────────────────────────

interface RefPopoverState {
  source: string;
  quote: string;
  top: number;
  left: number;
}

function buildPassage(quote: string, filename: string): { before: string; after: string; section: string; pageLabel: string } {
  const q = quote.toLowerCase();
  const f = filename.toLowerCase();

  if (f.includes("form_adv")) {
    if (q.includes("ridgeline capital partners")) return {
      section: "Item 1 — Cover Page",
      before: "This Form ADV Part 2A (\"Brochure\") is filed with the U.S. Securities and Exchange Commission pursuant to Rule 204-3 under the Investment Advisers Act of 1940, as amended. This Brochure provides information about the qualifications, business practices, and advisory services offered by ",
      after: ", LLC (\"Ridgeline\" or the \"Adviser\"). Registration as an investment adviser with the SEC does not imply a certain level of skill or training, and the information contained herein has not been approved or verified by the SEC or by any state securities authority. If you have any questions about the contents of this Brochure, please contact our compliance department at (212) 555-0100 or by email at compliance@ridgelinecap.com. Additional information about Ridgeline Capital Partners, including this Brochure, is available on the SEC's Investment Adviser Public Disclosure website at www.adviserinfo.sec.gov (CRD# 298741). This Brochure is updated at least annually as required by Rule 204-3(b) and may be updated more frequently when material changes occur. Clients and prospective investors should ensure they are reviewing the most current version of this document. Ridgeline does not solicit or accept investments from retail investors as defined under Regulation Best Interest. All advisory relationships are with institutional investors, qualified purchasers, and accredited investors as defined under applicable federal securities laws.",
      pageLabel: "Page 1 of 38",
    };
    if (q.includes("delaware llc") || q.includes("delaware limited")) return {
      section: "Item 1 — Cover Page",
      before: "This Form ADV Part 2A describes the advisory business, fees, investment strategies, and material risks associated with an investment in Ridgeline Global Opportunities Fund, LP. Prospective investors are strongly encouraged to review this document in its entirety, together with all fund offering documents and side letter agreements, prior to making any investment decision. Ridgeline Capital Partners, LLC is the registered investment adviser and sole General Partner of the Fund. The Adviser is organized as a ",
      after: " and has been continuously registered as an investment adviser with the U.S. Securities and Exchange Commission since April 2018. The firm's principal office and place of business is located at 245 Park Avenue, Suite 3200, New York, NY 10167. The Adviser is wholly owned by its founding principals and there are no outside institutional investors, strategic partners, or third-party controlling interests in the management company. The Adviser employs eleven full-time staff, including four investment professionals, two compliance and legal staff, and five operations and accounting personnel.",
      pageLabel: "Page 2 of 38",
    };
    if (q.includes("crd") || q.includes("april 2018") || q.includes("since april")) return {
      section: "Item 1 — Cover Page",
      before: "Ridgeline Capital Partners, LLC is a registered investment adviser and the sole General Partner of Ridgeline Global Opportunities Fund, LP. The Adviser was founded by David Chen, CFA, in early 2018 following his departure from a New York-based global macro fund where he served as a senior portfolio manager for nine years. The Registrant (CRD# 298741) has maintained continuous registration as an investment adviser with the U.S. Securities and Exchange Commission ",
      after: ". Prior to federal registration, the firm operated under a New York state investment adviser registration from January 2018 through April 2018. The firm has not been subject to any regulatory examination deficiency findings requiring remediation during the current registration period. Clients and prospective investors may verify current registration status and access all disclosure documents through the SEC's Investment Adviser Public Disclosure (IAPD) database at www.adviserinfo.sec.gov. The firm's most recent SEC examination was conducted in October 2023 and resulted in no findings of deficiency.",
      pageLabel: "Page 3 of 38",
    };
    if (q.includes("david chen") || q.includes("cfa")) return {
      section: "Item 10 — Other Financial Industry Activities and Affiliations",
      before: "All portfolio management, investment research, trading, and risk oversight functions of Ridgeline Capital Partners are centralized under the sole authority of ",
      after: ", who serves as Chief Investment Officer, Portfolio Manager, and a Managing Member of the General Partner entity. Mr. Chen has managed the Ridgeline Global Opportunities Fund since its inception in January 2018 and holds exclusive authority over all portfolio construction, position sizing, capital allocation, and risk parameter decisions. The firm has not appointed a formal deputy Portfolio Manager, backup investment professional, or documented succession arrangement as of the date of this filing. The CCO has included key-man concentration risk as a standing agenda item for the 2026 annual compliance review. Two senior research analysts, James Park and Sarah Kim, support the investment process but do not hold investment discretion and are not authorized to execute trades independently. The firm's investment committee, which consists of Mr. Chen and the CFO, meets monthly to review portfolio exposures, risk metrics, and market outlook.",
      pageLabel: "Page 6 of 38",
    };
    if (q.includes("2.31") || q.includes("2.3b") || q.includes("assets under")) return {
      section: "Item 4 — Advisory Business",
      before: "Ridgeline Capital Partners provides discretionary investment advisory services exclusively to pooled investment vehicles. The firm does not currently provide investment advisory services to individual retail clients, pension plans, charitable organizations, or other separately managed account clients. The Adviser's investment strategy focuses on global equity long/short with opportunistic allocations to credit and macro instruments. The Fund employs a bottom-up fundamental research approach combined with top-down macro overlay, targeting concentrated positions in 20 to 35 securities across developed and select emerging markets. As of December 31, 2025, the Registrant manages approximately ",
      after: " in regulatory assets under management on a fully discretionary basis, comprising capital held in the master fund structure, two offshore feeder vehicles registered in the Cayman Islands, and three separately managed accounts for institutional investors. The firm does not manage any assets on a non-discretionary basis. Total assets under management have grown approximately 18% on a year-over-year basis from the prior period, reflecting net capital inflows of approximately $280 million and investment performance of approximately 12.4% net of fees.",
      pageLabel: "Page 4 of 38",
    };
    if (q.includes("no material changes") || q.includes("no changes")) return {
      section: "Item 2 — Material Changes",
      before: "This section is required to summarize material changes made to this Brochure since its most recent annual update, pursuant to Rule 204-3(b)(2) under the Investment Advisers Act of 1940. Investment advisers are required to deliver this summary or the full updated Brochure to existing clients within 120 days of the Registrant's fiscal year-end. There have been ",
      after: " to this Brochure since the annual amendment filed in March 2024 other than those summarized below. Effective January 1, 2026, the Fund's investment mandate was expanded to permit allocations to structured credit instruments including CLO tranches and asset-backed securities, subject to a 15% portfolio concentration limit. A revised fee schedule applicable to new subscriptions received on or after January 1, 2026 is set forth in Item 5. The composition of the firm's Valuation Committee was updated to include an independent external consultant. Clients are strongly encouraged to review the current Brochure in its entirety and to contact investor relations at ir@ridgelinecap.com with any questions.",
      pageLabel: "Page 1 of 38",
    };
    return {
      section: "Item 5 — Fees and Compensation",
      before: "Ridgeline charges fees for its investment advisory services in the form of a management fee and an incentive allocation. The management fee is 1.50% per annum of net asset value, calculated on the first business day of each calendar month based on beginning-of-period net asset value and payable monthly in arrears. The incentive allocation is 20% of net profits above a 6% annualized hurdle rate, subject to a high-water mark, calculated and crystallized annually at December 31 of each year. No incentive allocation is charged unless and until cumulative performance has exceeded the applicable high-water mark. The management fee and incentive allocation are the only forms of compensation received by the Adviser in connection with the management of the Fund. With respect to the specific terms applicable to this investor, including any fee modifications or side letter provisions, the following disclosure is provided: ",
      after: ". Investors should review Item 5 and the applicable subscription documents in their entirety before submitting a subscription agreement. Fee schedules are non-negotiable for new investors with committed capital below $10 million. All fee calculations are subject to independent verification by the Fund's administrator, Citco Fund Services.",
      pageLabel: "Page 8 of 38",
    };
  }

  if (f.includes("ppm") || f.includes("lpa")) {
    if (q.includes("delaware") && (q.includes("lp") || q.includes("fund"))) return {
      section: "Section 1 — Organization and Formation",
      before: "Ridgeline Global Opportunities Fund, LP (the \"Fund\") is organized as a ",
      after: " and was formed on January 4, 2018, pursuant to a Certificate of Limited Partnership filed with the Delaware Secretary of State. The Fund's principal office and place of business is 245 Park Avenue, Suite 3200, New York, NY 10167. Ridgeline Capital Partners, LLC (the \"General Partner\") serves as the sole General Partner and investment manager of the Fund. The Fund operates as a master fund in a master-feeder structure, alongside Ridgeline Global Opportunities Fund (Offshore) Ltd., a Cayman Islands exempted company formed for international and tax-exempt investors. Interests in the Fund have not been registered under the Securities Act of 1933, the Investment Company Act of 1940, or any state securities law, and are being offered in reliance upon exemptions from registration requirements. Interests may only be acquired by investors who are both accredited investors as defined in Regulation D and qualified purchasers as defined under Section 2(a)(51) of the Investment Company Act.",
      pageLabel: "Page 4 of 72",
    };
    if (q.includes("cayman") || q.includes("offshore")) return {
      section: "Section 2 — Master-Feeder Fund Structure",
      before: "The Fund is designed to accommodate the diverse tax, regulatory, and administrative requirements of its investor base through a master-feeder structure. U.S. taxable investors subscribe directly into Ridgeline Global Opportunities Fund, LP, the onshore Delaware limited partnership. Non-U.S. investors and U.S. tax-exempt investors, including pension funds, endowments, and foundations, may subscribe through ",
      after: ", which passes through substantially all of its capital to the Master Fund via a fully transparent limited partnership interest. Investors in the offshore vehicle benefit from certain protections under applicable income tax treaties, exemption from certain U.S. withholding tax provisions, and streamlined FATCA compliance through the Cayman Islands AEOI regime. All investment decisions, portfolio management, and risk oversight are conducted at the Master Fund level. Allocations of profit and loss are made to each feeder vehicle on a pro-rata basis based on its proportionate interest in the Master Fund. The General Partner may, in its sole discretion, restructure the fund architecture, add additional feeder vehicles, or modify the master-feeder arrangement with 30 days' prior written notice to Limited Partners.",
      pageLabel: "Page 7 of 72",
    };
    if (q.includes("2%") || q.includes("20%") || q.includes("hurdle") || q.includes("high-water") || q.includes("hwm")) return {
      section: "Section 7 — Management Fees and Incentive Allocation",
      before: "The General Partner is entitled to receive compensation for its advisory services in the form of a management fee and an annual incentive allocation. The current fee structure applicable to all Limited Partners as of January 1, 2026, unless modified by individual side letter agreement, is as follows: ",
      after: ". The management fee is calculated on the first business day of each calendar month using the beginning-of-period net asset value of each Limited Partner's capital account and is payable monthly in arrears. The incentive allocation is calculated and charged on an annual basis at December 31 of each year. The incentive allocation will be charged only to the extent that cumulative net profits in a Limited Partner's capital account exceed the applicable high-water mark. If the Fund incurs losses in any year, those losses must be fully recovered before any further incentive allocation may be charged. The high-water mark is applied on a per-investor basis and does not reset upon redemption or re-subscription.",
      pageLabel: "Page 18 of 72",
    };
    if (q.includes("goldman") || q.includes("morgan stanley") || q.includes("prime")) return {
      section: "Section 9 — Prime Brokerage, Custody, and Leverage",
      before: "The Fund may utilize leverage in connection with its investment activities, subject to the risk parameters established by the General Partner. The General Partner monitors gross and net leverage on a daily basis and has established internal guidelines limiting gross exposure to 300% of net asset value and net exposure to 150% in either direction. The Fund finances its leveraged positions primarily through margin facilities provided by its prime brokers. The Fund has established prime brokerage and margin lending relationships with ",
      after: ". All cash and portfolio securities are held in segregated accounts at each respective prime broker under standard institutional prime brokerage agreements. The General Partner may add, remove, or replace prime brokers at any time without prior notice to Limited Partners, subject to its best execution obligations. The Fund does not currently utilize a dedicated independent custodian. Prime broker insolvency risk is mitigated through position diversification across multiple prime brokerage relationships and periodic review of each counterparty's credit profile.",
      pageLabel: "Page 22 of 72",
    };
    if (q.includes("quarterly") || q.includes("90-day") || q.includes("redemption")) return {
      section: "Section 11 — Redemptions, Withdrawals, and Liquidity",
      before: "The Fund is designed as a semi-liquid investment vehicle providing limited liquidity to investors on a periodic basis. The General Partner believes this liquidity profile is consistent with the Fund's investment strategy and enables the portfolio to maintain positions through short-term volatility. Subject to the terms and conditions set forth in this Section and in the Limited Partnership Agreement, Limited Partners may submit redemption requests on the following basis: ",
      after: ". Written redemption requests must be submitted to the Fund Administrator no later than 60 calendar days prior to the applicable redemption date. The General Partner, in its sole and absolute discretion, reserves the right to suspend, delay, restrict, gate, or satisfy redemptions in kind during periods of market dislocation, operational disruption, or when the aggregate redemption requests for any single redemption date exceed 25% of the Fund's net asset value. Partial redemptions are permitted provided the redeeming Limited Partner maintains a minimum capital account balance of $1,000,000 following the redemption. Redemption proceeds will be paid within 30 business days following the applicable redemption date.",
      pageLabel: "Page 24 of 72",
    };
    if (q.includes("mfn") || q.includes("most favored") || q.includes("25m") || q.includes("25 million")) return {
      section: "Section 13 — Side Letter Agreements and Investor Rights",
      before: "The General Partner may, in its sole discretion, enter into side letter or other similar agreements with one or more Limited Partners, pursuant to which such Limited Partners may be granted rights, entitlements, or terms not set forth in this Agreement or the Subscription Documents. Side letter rights may include, without limitation, reduced management fees, reduced incentive allocations, enhanced reporting obligations, portfolio transparency rights, advance notice of material events, co-investment rights, and ",
      after: " rights entitling such investor to receive terms no less favorable than those granted to any other investor of a similar size and type. Side letters are generally offered to Limited Partners making initial subscriptions of $25 million or more. The existence, identity of parties to, and general categories of terms contained in any side letter shall be disclosed to all Limited Partners upon written request, subject to confidentiality restrictions agreed between the parties. The General Partner shall not enter into any side letter that materially adversely affects the economic rights of existing Limited Partners without prior written consent of a Majority in Interest.",
      pageLabel: "Page 31 of 72",
    };
    return {
      section: "Section 2 — Defined Terms and Interpretation",
      before: "For purposes of this Agreement and any supplement, amendment, or exhibit hereto, the following capitalized terms shall have the meanings ascribed to them in this Section 2 unless otherwise explicitly defined in context. In the event of any conflict between a defined term in this Agreement and a defined term in any Subscription Agreement or side letter, the definition set forth in the applicable Subscription Agreement or side letter shall control solely with respect to the party thereto. All references to statutes, regulations, rules, or official guidance shall be deemed to refer to such authorities as amended, restated, or replaced from time to time. As defined in Section 2.1 of this Agreement: ",
      after: ". Additional defined terms used in this Agreement include: \"Affiliate\" means any entity that directly or indirectly controls, is controlled by, or is under common control with the referenced party; \"Business Day\" means any day other than a Saturday, Sunday, or day on which commercial banks in the State of New York are authorized or required by law to close; \"Net Asset Value\" means the total fair market value of all assets of the Fund, minus all accrued liabilities including management fees and estimated incentive allocations, as determined by the Fund's independent administrator.",
      pageLabel: "Page 11 of 72",
    };
  }

  if (f.includes("ddq")) {
    if (q.includes("david chen") || q.includes("cio") || q.includes("portfolio manager") || q.includes("founded")) return {
      section: "Section 2 — Key Personnel and Organizational Structure",
      before: "Ridgeline Capital Partners employs eleven full-time staff across investment, compliance, operations, and investor relations functions. The investment team consists of four professionals: the CIO, two senior research analysts (James Park and Sarah Kim), and a dedicated risk officer (Michael Torres). The compliance and legal team consists of the CCO (Linda Wu) and one compliance analyst. Operations, finance, and fund accounting are handled by a team of three, reporting to the CFO (Robert Ng). Investor relations is managed by one dedicated IR professional and one associate. All portfolio management, investment research, and final trading decisions are the exclusive responsibility of ",
      after: ", CFA, who serves as Chief Investment Officer, sole Portfolio Manager, and a Managing Member of the General Partner entity. Mr. Chen founded the firm in 2018 following nine years as a senior PM at a global macro fund. He maintains full investment discretion and there is currently no formal succession plan, documented deputy PM role, or contingency arrangement for the continuation of portfolio management in the event of Mr. Chen's extended unavailability. This key-man concentration has been acknowledged by the Adviser as a material operational risk. The General Partner has represented that it will establish a formal succession framework and consider hiring an additional senior PM during the 2026 fiscal year, pending AUM growth objectives being met.",
      pageLabel: "Page 5 of 44",
    };
    if (q.includes("northern trust") || q.includes("administrator") || q.includes("citco")) return {
      section: "Section 5 — Fund Administrator and Third-Party Service Providers",
      before: "The following is a complete listing of Ridgeline's material third-party service providers as of December 31, 2025. Fund Administrator: ",
      after: ", engaged since January 2021. Citco is responsible for all independent NAV calculations, investor capital account recordkeeping, anti-money laundering and know-your-customer compliance, subscription and redemption processing, and FATCA/CRS reporting. NAV calculations are performed monthly as of the last business day of each calendar month and are independently reconciled against prime broker statements. Citco issues capital account statements to all Limited Partners within 15 business days of each month-end. Legal Counsel: Simpson Thacher & Bartlett LLP (fund formation and ongoing); Davis Polk & Wardwell LLP (regulatory matters). Auditor: Ernst & Young LLP. Tax Advisor: KPMG LLP. Prime Brokers: Goldman Sachs Prime Services and Morgan Stanley Institutional Equity Services.",
      pageLabel: "Page 9 of 44",
    };
    if (q.includes("third-party") || q.includes("msp") || q.includes("it infrastructure")) return {
      section: "Section 8 — Technology Infrastructure and Cybersecurity Program",
      before: "Ridgeline's information technology environment comprises a combination of cloud-hosted SaaS applications and on-premises workstations. Core investment applications include Bloomberg Terminal (market data and analytics), Advent APX (portfolio accounting), SS&C Eze OMS (order management and compliance pre-trade checks), and FactSet (research and analysis). The firm does not maintain a dedicated Chief Information Security Officer (CISO). Cybersecurity governance is the responsibility of the CCO, supported by an engagement with ",
      after: " for ongoing monitoring, patch management, endpoint protection, and incident detection. The firm adopted a Written Information Security Policy (WISP) in 2022; however, this policy has not been formally updated since its adoption and predates the firm's migration to its current cloud architecture. A formal third-party penetration test has not been conducted within the past 24 months. The CCO has engaged a cybersecurity consultant to conduct a penetration test and WISP refresh, with both deliverables targeted for completion by Q2 2026. A formal written incident response plan is currently under development. The firm has not experienced a reportable cybersecurity incident as defined under applicable law during the current reporting period.",
      pageLabel: "Page 27 of 44",
    };
    return {
      section: "Section 4 — Operational Infrastructure and Capital Structure",
      before: "The following responses are provided on behalf of Ridgeline Capital Partners, LLC in connection with the operational due diligence review conducted by Alpine Asset Management in January 2026. All information is current as of December 31, 2025, unless otherwise specified. Section 4.3 — Fund-Level Leverage and Financing Arrangements: With respect to the question of whether the management company has any third-party financing, bank credit facilities, or institutional investors in the GP entity, the Adviser's response is as follows: ",
      after: ". The management company is funded entirely from management fee revenues and the personal capital of the founding principals. There are no third-party institutional investors in the General Partner entity, no bank credit lines drawn against management fee receivables, and no deferred compensation or revenue-sharing obligations to former employees or principals. The General Partner's operating expenses, including rent, technology, salaries, and professional fees, are funded exclusively from management fee income. Supporting documentation, including the most recent management company financial statements, is available for review by qualified investors upon written request to ir@ridgelinecap.com.",
      pageLabel: "Page 14 of 44",
    };
  }

  if (f.includes("compliance") || f.includes("code_of_ethics") || f.includes("ethics")) {
    if (q.includes("code of ethics") || q.includes("annual") || q.includes("distributed") || q.includes("acknowledged")) return {
      section: "Section 2 — Code of Ethics: Adoption, Distribution, and Certification",
      before: "Ridgeline Capital Partners has adopted a Code of Ethics (the \"Code\") pursuant to Rule 204A-1 under the Investment Advisers Act of 1940 and Rule 17j-1 under the Investment Company Act of 1940, as applicable. The Code sets forth the standards of business conduct and personal trading requirements applicable to all \"Access Persons\" of the firm, as defined in Section 1.1 of the Code. The ",
      after: " is distributed to all Access Persons upon commencement of employment or engagement and no less frequently than annually thereafter. Each Access Person is required to acknowledge receipt of the Code in writing and to certify their full compliance with its requirements within ten (10) calendar days of each distribution. The Chief Compliance Officer maintains a complete log of all Code acknowledgments and certifications, together with records of any reported violations, waivers granted, and disciplinary actions taken. These records are available for inspection by authorized regulatory examiners upon reasonable notice. Failure to timely certify compliance with the Code is treated as a material compliance deficiency and may result in formal disciplinary action, including termination of employment.",
      pageLabel: "Page 8 of 34",
    };
    if (q.includes("personal trading") || q.includes("pre-clearance")) return {
      section: "Section 4 — Personal Trading Policy and Pre-Clearance Requirements",
      before: "Section 4 of this Compliance Manual sets forth the firm's personal trading policy, which is designed to prevent potential conflicts of interest between an Access Person's personal investment activities and the firm's fiduciary obligations to its clients. All Access Persons are required to comply with the following requirements with respect to all \"Reportable Securities\" as defined in Rule 204A-1 and Section 1.1 of this Manual. Access Persons must obtain written ",
      after: " approval from the Chief Compliance Officer prior to executing any personal trade in a Reportable Security that is held in any client account, is being considered for purchase or sale for any client account, or is subject to a pending client order. Pre-clearance must be requested and documented through the firm's compliance management system and, once granted, remains valid for 48 hours from the time of approval. Access Persons are strictly prohibited from executing personal trades on any day during which a client order in the same security is pending or was executed. Pre-clearance will be automatically denied if the requested security is on the firm's restricted list. Violations of the personal trading policy must be self-reported to the CCO within 24 hours of discovery and are subject to mandatory disgorgement and potential disciplinary action.",
      pageLabel: "Page 14 of 34",
    };
    return {
      section: "Section 6 — Supervisory Procedures, Oversight, and Annual Review",
      before: "The Chief Compliance Officer bears primary responsibility for administering, enforcing, and periodically reviewing all compliance policies and procedures adopted by the firm pursuant to Rule 206(4)-7 under the Investment Advisers Act of 1940. Pursuant to Rule 206(4)-7, the firm is required to conduct a formal annual review of the adequacy and effectiveness of its compliance program. The annual review assesses whether the firm's policies and procedures are reasonably designed to prevent violations of applicable securities laws and regulations. The most recent annual compliance review was completed in December 2025. The annual review concluded that the firm's compliance program is generally adequate and effective, ",
      after: ". The CCO identified the following areas for enhancement during the 2026 period: (i) updating the Written Information Security Policy to reflect current technology infrastructure, (ii) completing a third-party penetration test, and (iii) formalizing a written succession plan for the Portfolio Manager role. Each annual review produces a written report summarizing material compliance events, regulatory developments, policy updates, and recommended enhancements to internal controls, which is presented to senior management within 60 days of fiscal year-end and retained in the firm's compliance records for a minimum of five years.",
      pageLabel: "Page 19 of 34",
    };
  }

  if (f.includes("financials") || f.includes("fy2024") || f.includes("audit")) {
    if (q.includes("ernst") || q.includes("ey") || q.includes("auditor")) return {
      section: "Independent Auditor's Report to the Partners",
      before: "To the Partners of Ridgeline Global Opportunities Fund, LP: We have audited the accompanying financial statements of Ridgeline Global Opportunities Fund, LP (the \"Fund\"), which comprise the statement of financial condition as of December 31, 2024, and the related statements of operations, changes in partners' capital, and cash flows for the year then ended. Management is responsible for the preparation and fair presentation of these financial statements in accordance with accounting principles generally accepted in the United States of America. These financial statements have been audited by ",
      after: ", LLP, an independent registered public accounting firm. We conducted our audit in accordance with auditing standards generally accepted in the United States of America. Those standards require that we plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement, whether due to error or fraud. In our opinion, the financial statements referred to above present fairly, in all material respects, the financial position of the Fund as of December 31, 2024, and the results of its operations and its cash flows for the year then ended.",
      pageLabel: "Page 2 of 28",
    };
    if (q.includes("t+3") || q.includes("reconciliation") || q.includes("t+1")) return {
      section: "Note 7 — Trade Settlement, Reconciliation, and Operational Controls",
      before: "The Fund settles equity and equity-linked securities transactions on a standard ",
      after: " settlement basis in accordance with market convention and applicable exchange rules. Fixed income securities settle on T+1 or T+2 depending on instrument type and trading venue. The Fund Administrator, Citco Fund Services, performs an independent daily reconciliation of the Fund's holdings, cash positions, and margin balances against prime broker statements. Any reconciliation breaks or discrepancies are escalated to the CFO within four business hours and reported to the CCO at the end of each business day. As of December 31, 2024, there were no unresolved reconciliation breaks that had remained open for a period exceeding 30 calendar days. All significant reconciliation exceptions identified during the fiscal year were resolved within three business days of identification.",
      pageLabel: "Page 17 of 28",
    };
    return {
      section: "Note 2 — Summary of Significant Accounting Policies",
      before: "The following notes form an integral part of the financial statements and should be read in conjunction therewith. Note 1 — Organization: Ridgeline Global Opportunities Fund, LP (the \"Fund\") is a Delaware limited partnership formed on January 4, 2018. The Fund's principal business objective is to achieve capital appreciation through a global equity long/short investment strategy with opportunistic allocations to credit and macro instruments. Note 2 — Basis of Presentation: ",
      after: ". The Fund's fiscal year ends December 31. These financial statements have been prepared on a going-concern basis. Comparative figures for the year ended December 31, 2023 have been restated where necessary to conform to the current year's presentation. Note 3 — Significant Estimates: The preparation of financial statements in conformity with U.S. GAAP requires management to make estimates and assumptions that affect the reported amounts of assets, liabilities, revenues, and expenses. The most significant estimates involve the fair valuation of Level 3 portfolio securities. As of December 31, 2024, Level 3 assets represented approximately 3.2% of total net asset value.",
      pageLabel: "Page 5 of 28",
    };
  }

  if (f.includes("bcp")) return {
    section: "Section 4 — Recovery Objectives and Continuity Procedures",
    before: "Ridgeline Capital Partners has established the following Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for each critical business function in the event of a significant business disruption: RTO for core trading systems is 4 hours; RTO for fund accounting and NAV calculation is 8 hours; RPO for investor data and capital account records is 24 hours; RPO for trade records and position data is 1 hour. The firm's primary backup site is located at a colocation facility in Secaucus, NJ. All critical data is replicated to the backup site on a near-real-time basis using encrypted data synchronization. With respect to the overall continuity testing and review program: ",
    after: ". The most recent tabletop business continuity exercise was conducted in October 2025 and included participation from the CIO, CFO, CCO, and Operations team. The exercise tested the firm's ability to transition to the backup site following a simulated primary office outage and identified two process gaps, both of which have since been remediated. The BCP is reviewed and updated at least annually by the CCO with input from all department heads.",
    pageLabel: "Page 11 of 22",
  };

  if (f.includes("valuation")) {
    if (q.includes("quarterly") || q.includes("valuation committee")) return {
      section: "Article III — Valuation Committee: Composition, Authority, and Meeting Procedures",
      before: "The Valuation Committee has been established by the General Partner to oversee the fair valuation of all portfolio positions and to ensure that the Fund's NAV calculations comply with applicable accounting standards and the Fund's valuation policy. The Committee convenes on a ",
      after: " basis, typically within 5 business days following each calendar quarter-end, to review and ratify the fair valuation of all Level 2 and Level 3 portfolio positions requiring significant estimation or management judgment. The Valuation Committee is composed of the following members: (i) David Chen, CFA (CIO, non-voting chair), (ii) Robert Ng (CFO, voting member), (iii) Linda Wu (CCO, voting member), and (iv) an independent external valuation consultant retained from Duff & Phelps, LLC (voting member). A quorum for the conduct of any Valuation Committee meeting requires the attendance of at least three members, including the CCO and the independent consultant. All Valuation Committee determinations are documented in meeting minutes prepared by the CCO within 3 business days of each meeting.",
      pageLabel: "Page 7 of 18",
    };
    return {
      section: "Section 2 — Valuation Hierarchy, Fair Value Measurement, and Governance",
      before: "The Fund measures and reports the fair value of portfolio securities in accordance with ASC 820 (Fair Value Measurement) and GAAP. The Fund employs a three-tier valuation hierarchy: Level 1 assets are valued using unadjusted quoted prices in active markets; Level 2 assets are valued using observable inputs other than Level 1 prices; Level 3 assets are valued using unobservable inputs and require formal Valuation Committee approval. The following governance requirements apply to all fair value determinations made under this Policy. As set forth in Section 2.1 of this Valuation Policy: ",
      after: ". All Level 3 valuations must be independently reviewed by the Fund's Administrator prior to inclusion in the NAV calculation. For any Level 3 position representing 5% or more of the Fund's net asset value, an independent third-party valuation conducted by the external valuation consultant is required on at least an annual basis. The Investment Adviser is expressly prohibited from overriding a Valuation Committee determination without documented escalation to the full Committee.",
      pageLabel: "Page 4 of 18",
    };
  }

  if (f.includes("org_chart")) return {
    section: "Organizational Chart and Reporting Lines — November 2025",
    before: "The following organizational chart illustrates Ridgeline Capital Partners' current organizational structure, headcount, and reporting relationships as of November 2025. The firm currently employs eleven full-time staff and two part-time contractors. Investment Team (4 FTE): David Chen, CFA (CIO / Portfolio Manager), James Park (Senior Research Analyst, Equities), Sarah Kim (Senior Research Analyst, Credit), Michael Torres (Risk Officer). Compliance & Legal (2 FTE): Linda Wu, JD (CCO / General Counsel), Jessica Lin (Compliance Analyst). Finance & Operations (3 FTE): Robert Ng, CPA (CFO), David Kim (Fund Accountant), Alex Johnson (Operations Analyst). Investor Relations (2 FTE): Megan Park (Head of IR), Ryan Lee (IR Associate). Reporting structure: ",
    after: ". The Chief Compliance Officer and Chief Financial Officer maintain dual reporting lines to both the Portfolio Manager and the General Partner entity to preserve compliance independence. The General Partner does not currently have a formal Chief Operating Officer or Chief Risk Officer role; operational oversight is shared between the CFO and CCO. The two part-time contractors support technology infrastructure and office administration, respectively.",
    pageLabel: "Page 1 of 2",
  };

  if (f.includes("iapd_record")) return {
    section: "Registration Summary",
    before: "Investment Adviser Public Disclosure — IAPD Report generated April 16, 2026. Firm Name: Ridgeline Capital Partners, LLC. Main Office: 245 Park Avenue, Suite 3200, New York, NY 10167. Registration Status: REGISTERED. Registered as an investment adviser with the U.S. Securities and Exchange Commission. Registration effective April 14, 2018. CRD / NRD Number: 298741. SEC File Number: 801-113724. This record reflects the most recent information reported by the firm on Form ADV filed March 14, 2025. Alpine ODD team confirmed registration status via direct IAPD query on January 6, 2026. Alpine verification note: ",
    after: ". The firm's CRD record shows no reportable disciplinary events, regulatory actions, civil proceedings, or criminal matters involving any principal, control person, or supervised person. The most recent SEC examination was conducted in October 2023 and resulted in no deficiency findings. Firm has been registered continuously since April 2018 with no lapses in registration status.",
    pageLabel: "IAPD Record · Page 1 of 3",
  };

  if (f.includes("admin_verification_record")) return {
    section: "Net Asset Value and AUM Confirmation",
    before: "Citco Fund Services (Ireland) Limited — Third-Party Administrator Verification Letter. Re: Ridgeline Global Opportunities Fund, LP — Administrator Confirmation of NAV and AUM as of December 31, 2025. Date: January 22, 2026. As of December 31, 2025, Citco has calculated and confirmed the following: ",
    after: ". The net asset value per share for Class A (USD) as of December 31, 2025 is $1,842.17, representing a 12.4% net return for the calendar year. All calculations are performed in accordance with the valuation policies set forth in the Fund's Limited Partnership Agreement. Citco confirms that NAV calculations have been performed on a monthly basis throughout 2025 with no material restatements.",
    pageLabel: "Citco Verification · Page 1 of 4",
  };

  if (f.includes("alpine_analysis_record")) return {
    section: "Alpine ODD — Cross-Reference Finding",
    before: "Alpine Due Diligence Inc. — Internal Cross-Reference Analysis. ODD Engagement: Ridgeline Capital Partners, LLC. Prepared by: ODD Review Team. Date: January 2026. This note summarizes Alpine's internal analysis based on a review of all submitted documents, the management interview conducted January 15, 2026, and publicly available information. Alpine cross-reference finding: ",
    after: ". This observation has been incorporated into the relevant section of the ODD report. All findings are subject to review by the ODD team lead prior to inclusion in the final report.",
    pageLabel: "Alpine Analysis · Page 1",
  };

  if (f.includes("manager_call_record")) return {
    section: "Management Interview Notes",
    before: "Alpine Due Diligence Inc. — Management Interview Notes. ODD Engagement: Ridgeline Capital Partners, LLC. Interview Date: January 15, 2026, 10:00am – 12:30pm EST. Attendees (Manager): David Chen CFA (CIO/PM), Linda Wu JD (CCO/General Counsel). Format: Video conference. These notes represent a summary of the discussion. ",
    after: ". Alpine noted the response and requested documentation as a follow-up item. Compliance Infrastructure: Ms. Wu confirmed the firm does not currently use an automated pre-trade compliance system. Alpine's assessment is that this is a material gap and has been documented as a HIGH-severity risk observation.",
    pageLabel: "Call Notes · Page 1 of 3",
  };

  if (f.includes("pentest_jan2026_record") || f.includes("pen_test") || f.includes("pentest")) return {
    section: "Executive Summary",
    before: "Kroll Cyber Risk — Penetration Testing Services. Client: Ridgeline Capital Partners, LLC. Engagement Type: External Network and Application Penetration Test. Engagement Dates: January 6–28, 2026. Scope: External network perimeter, web-facing applications, Microsoft 365 environment, and simulated phishing assessment. Report Date: January 28, 2026. Overall Finding: ",
    after: ". Two medium-severity and four low-severity findings were identified. No exploitable critical vulnerabilities were found in the external attack surface. The investor portal was tested against OWASP Top 10 vulnerabilities; no injection, authentication bypass, or session management vulnerabilities were identified. Microsoft 365 environment shows adequate security posture with MFA enforced for all accounts.",
    pageLabel: "Kroll Pen Test Report · Page 1 of 18",
  };

  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: "The following passage has been extracted from the referenced source document maintained in Alpine Asset Management's operational due diligence file for Ridgeline Capital Partners. This document has been provided by the Manager or its authorized representatives and reflects information as of the date stated on the document cover. Alpine has reviewed this document in connection with its ongoing ODD program but has not independently verified all factual representations contained herein except as specifically noted in the accompanying ODD report. This document is maintained as part of a complete due diligence file that includes, among other materials, fund offering documents, audited financial statements, regulatory filings, service provider contracts, and prior ODD correspondence. The specific passage cited in the ODD analysis states: ",
    after: ". Investors and Alpine personnel are reminded that this document is proprietary and confidential. It may not be reproduced, redistributed, or disclosed to third parties without the prior written consent of Ridgeline Capital Partners. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers and limitations.",
    pageLabel: "Page 1",
  };
}

function buildDocMeta(filename: string, label: string): { title: string; subtitle: string; date: string; badge: string } {
  const f = filename.toLowerCase();
  if (f.includes("form_adv")) return { title: "Form ADV Part 2A", subtitle: "Ridgeline Capital Partners, LLC", date: "Filed March 14, 2025", badge: "Regulatory" };
  if (f.includes("ddq"))       return { title: "Due Diligence Questionnaire (2026)", subtitle: "Ridgeline Capital Partners, LLC", date: "January 10, 2026", badge: "Fund Document" };
  if (f.includes("ppm"))       return { title: "Private Placement Memorandum", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "January 2025", badge: "Legal" };
  if (f.includes("lpa"))       return { title: "Limited Partnership Agreement", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Effective January 1, 2025", badge: "Legal" };
  if (f.includes("compliance_manual")) return { title: "Compliance Manual", subtitle: "Ridgeline Capital Partners, LLC", date: "Revised September 2025", badge: "Compliance" };
  if (f.includes("code_of_ethics"))    return { title: "Code of Ethics & Personal Trading Policy", subtitle: "Ridgeline Capital Partners, LLC", date: "Revised October 2025", badge: "Compliance" };
  if (f.includes("financials") || f.includes("fy2024")) return { title: "Audited Financial Statements — FY2024", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Audit Date: March 28, 2025", badge: "Financial" };
  if (f.includes("bcp"))        return { title: "Business Continuity / DR Plan", subtitle: "Ridgeline Capital Partners, LLC", date: "October 2021", badge: "Operations" };
  if (f.includes("valuation"))  return { title: "Valuation Policy (2026)", subtitle: "Ridgeline Capital Partners, LLC", date: "Effective January 1, 2026", badge: "Operations" };
  if (f.includes("org_chart"))  return { title: "Organization Chart", subtitle: "Ridgeline Capital Partners, LLC", date: "November 2025", badge: "Internal" };
  if (f.includes("ic_charter")) return { title: "Investment Committee Charter", subtitle: "Ridgeline Capital Partners, LLC", date: "January 2026", badge: "Governance" };
  if (f.includes("insurance"))  return { title: "Insurance Coverage Summary", subtitle: "Ridgeline Capital Partners, LLC", date: "Policy Year 2025-2026", badge: "Insurance" };
  if (f.includes("side_letter")) return { title: "Side Letter Summary (Redacted)", subtitle: "Ridgeline Capital Partners, LLC", date: "As of December 31, 2025", badge: "Legal" };
  if (f.includes("admin"))      return { title: "Citco Administrator Transparency Report", subtitle: "Ridgeline Global Opportunities Fund", date: "December 31, 2025", badge: "Third-Party" };
  if (f.includes("iapd_record")) return { title: "SEC IAPD — Investment Adviser Public Disclosure", subtitle: "Ridgeline Capital Partners, LLC · CRD# 298741", date: "Record as of April 2026", badge: "SEC Verification" };
  if (f.includes("admin_verification_record")) return { title: "Citco Fund Services — Administrator Verification", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Verification Date: January 22, 2026", badge: "Third-Party" };
  if (f.includes("alpine_analysis_record")) return { title: "Alpine ODD — Internal Cross-Reference Analysis", subtitle: "Ridgeline Capital Partners, LLC · ODD Review Jan 2026", date: "Prepared January 2026", badge: "Alpine Analysis" };
  if (f.includes("manager_call_record")) return { title: "Manager Due Diligence Call — Interview Notes", subtitle: "Ridgeline Capital Partners, LLC · David Chen & Linda Wu", date: "Call Date: January 15, 2026", badge: "Manager Interview" };
  if (f.includes("pentest_jan2026_record") || f.includes("pen_test") || f.includes("pentest")) return { title: "Penetration Test Summary — January 2026", subtitle: "Ridgeline Capital Partners, LLC · Conducted by Kroll Cyber", date: "January 28, 2026", badge: "Cybersecurity" };
  return { title: label, subtitle: "Ridgeline Capital Partners, LLC", date: "2025", badge: "Document" };
}

function DocViewerPanel({ filename, quote, label, onClose }: {
  filename: string; quote: string; label: string; onClose: () => void;
}) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const docMeta = buildDocMeta(filename, label);
  const { before, after, section, pageLabel } = buildPassage(quote, filename);

  return (
    <>
      <div className="fixed inset-0 z-[299] bg-black/40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 bottom-0 z-[300] flex flex-col"
        style={{ width: "min(680px, 54vw)", background: "#0f1117", borderLeft: "1px solid rgba(255,255,255,0.08)", boxShadow: "-8px 0 40px rgba(0,0,0,0.6)", animation: "slideInRight 0.22s ease-out" }}
      >
        {/* Panel header */}
        <div style={{ background: "#161820", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 18px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{docMeta.title}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{docMeta.subtitle}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 7px", letterSpacing: "0.05em" }}>{docMeta.badge.toUpperCase()}</span>
            <button onClick={onClose} style={{ color: "#6b7280", fontSize: 18, lineHeight: 1, padding: "0 4px", background: "none", border: "none", cursor: "pointer" }}>&times;</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {/* Document page */}
          <div style={{ background: "#ffffff", borderRadius: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", overflow: "hidden", fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {/* Page header bar */}
            {filename === "iapd_record" ? (
              <div style={{ background: "#1a3a6e", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.12em" }}>U.S. SECURITIES AND EXCHANGE COMMISSION — IAPD</span>
                <span style={{ fontSize: 9, color: "#60a5fa", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #60a5fa", padding: "1px 6px", borderRadius: 2 }}>PUBLIC RECORD</span>
              </div>
            ) : filename === "admin_verification_record" ? (
              <div style={{ background: "#1a4a3a", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#6ee7b7", letterSpacing: "0.12em" }}>CITCO FUND SERVICES — ADMINISTRATOR VERIFICATION</span>
                <span style={{ fontSize: 9, color: "#34d399", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #34d399", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
              </div>
            ) : filename === "alpine_analysis_record" ? (
              <div style={{ background: "#2d1a5e", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#c4b5fd", letterSpacing: "0.12em" }}>ALPINE DUE DILIGENCE — INTERNAL ANALYSIS</span>
                <span style={{ fontSize: 9, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #a78bfa", padding: "1px 6px", borderRadius: 2 }}>INTERNAL</span>
              </div>
            ) : filename === "manager_call_record" ? (
              <div style={{ background: "#3a2a0a", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fcd34d", letterSpacing: "0.12em" }}>MANAGER DUE DILIGENCE CALL — INTERVIEW NOTES</span>
                <span style={{ fontSize: 9, color: "#fbbf24", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #fbbf24", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
              </div>
            ) : (filename === "pentest_jan2026_record" || filename.includes("pen_test") || filename.includes("pentest")) ? (
              <div style={{ background: "#1a2a1a", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#86efac", letterSpacing: "0.12em" }}>KROLL CYBER RISK — PENETRATION TEST REPORT</span>
                <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #ef4444", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
              </div>
            ) : (
              <div style={{ background: "#1e3a5f", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.12em" }}>ALPINE x RIDGELINE CAPITAL PARTNERS</span>
                <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #ef4444", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
              </div>
            )}
            {/* Page content */}
            <div style={{ padding: "28px 0 32px", display: "flex" }}>
              {/* Left margin stripe */}
              <div style={{ width: 40, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 3, background: "#f59e0b", borderRadius: 2, alignSelf: "stretch", marginTop: 68, opacity: 0.85 }} />
              </div>
              {/* Main text */}
              <div style={{ flex: 1, paddingRight: 32 }}>
                <div style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{docMeta.title}</div>
                  <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 3 }}>{docMeta.subtitle} &nbsp;·&nbsp; {docMeta.date}</div>
                </div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, paddingBottom: 6, borderBottom: "1px solid #e5e7eb" }}>{section}</div>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#1f2937", margin: 0, textAlign: "justify" }}>
                  {before}<mark style={{ background: "#ffec3d", color: "#111", borderRadius: "1px", padding: "1px 1px", fontWeight: "inherit", fontStyle: "inherit", fontSize: "inherit", WebkitBoxDecorationBreak: "clone" as const, boxDecorationBreak: "clone" as const }}>{quote}</mark>{after}
                </p>
              </div>
            </div>
            {/* Page footer */}
            <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{docMeta.subtitle}</span>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{pageLabel}</span>
            </div>
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => downloadDemoFile(filename)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download PDF
            </button>
            <button onClick={() => window.open(`/demo-docs/${filename}`, "_blank")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              Open Full PDF
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  );
}

function RefPopover({ info, onClose }: { info: RefPopoverState; onClose: () => void }) {
  const [docViewer, setDocViewer] = useState<{ filename: string; quote: string; label: string } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const meta = SOURCE_META[info.source] || { label: info.source.replace(/_/g, " ").replace(".pdf", "").replace(/\b\w/g, (c) => c.toUpperCase()), type: "Source" };
  const dotColor = SOURCE_DOT_COLORS[info.source] || (info.source.endsWith(".pdf") ? PDF_DOT_COLOR : PDF_DOT_COLOR);

  useEffect(() => {
    if (docViewer) return;
    function handleClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    }
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, docViewer]);

  if (docViewer) {
    return (
      <DocViewerPanel
        filename={docViewer.filename}
        quote={docViewer.quote}
        label={docViewer.label}
        onClose={() => { setDocViewer(null); onClose(); }}
      />
    );
  }

  return (
    <div
      ref={popRef}
      className="fixed z-[300] w-[380px] bg-br-card rounded-xl shadow-2xl border border-br overflow-hidden"
      style={{ top: info.top, left: info.left, animation: "popoverIn 0.15s ease-out" }}
    >
      <div className="px-4 py-2.5 bg-br-surface border-b border-br flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor }} />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-br-text-primary block truncate">{meta.label}</span>
            <span className="text-[9px] text-br-text-muted">{meta.type}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-br-text-muted hover:text-br-text-primary text-sm px-1">&times;</button>
      </div>
      <div className="px-4 py-3">
        <p className="text-[10px] text-br-text-muted uppercase tracking-wider mb-1.5 font-medium">Exact Source Text</p>
        <div className="text-[11px] leading-relaxed text-br-text-secondary bg-amber-500/8 border-l-2 border-amber-400/40 pl-3 py-2 rounded-r">
          <span className="italic">&ldquo;{info.quote}&rdquo;</span>
        </div>
      </div>
      <div className="px-4 pb-3 flex gap-2">
        {meta.filename ? (
          <>
            <button
              onClick={() => setDocViewer({ filename: meta.filename!, quote: info.quote, label: meta.label })}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-br-text-primary bg-br-surface border border-br rounded-lg hover:bg-br-card-hover transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              View Document
            </button>
            <button
              onClick={() => { if (meta.filename) downloadDemoFile(meta.filename); }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download {meta.size && <span className="text-br-text-muted ml-0.5">({meta.size})</span>}
            </button>
          </>
        ) : (
          <div className="text-[10px] text-br-text-muted italic">
            {info.source === "SEC_EDGAR" ? "Verified via SEC EDGAR IAPD — CRD# 298741" :
             info.source === "MANAGER_CALL" ? "Due diligence call conducted January 15, 2026" :
             info.source === "ADMIN_VERIFICATION" ? "Verification request sent January 22, 2026" :
             "Alpine internal cross-reference analysis"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DemoReportViewer(_props: { alpineReviewId?: string | null; finalReportPending?: boolean }) {
  const { finalReportPending } = _props;
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Full Report");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const headings = extractHeadings(RIDGELINE_REPORT_MD);
  const [refPopover, setRefPopover] = useState<RefPopoverState | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function handleDotClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const source = target.getAttribute("data-ref-source");
      const quote = target.getAttribute("data-ref-quote");
      if (!source || !quote) return;
      const rect = target.getBoundingClientRect();
      const popW = 380;
      let left = rect.left + rect.width / 2 - popW / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
      let top = rect.bottom + 8;
      if (top + 300 > window.innerHeight) top = rect.top - 308;
      setRefPopover({ source, quote, top, left });
    }
    container.addEventListener("click", handleDotClick);
    return () => container.removeEventListener("click", handleDotClick);
  }, [activeTab]);

  function scrollTo(id: string) {
    const el = containerRef.current?.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  const renderedHtml = renderMarkdown(RIDGELINE_REPORT_MD);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Output tabs (no dark header — matches ReportPageContent) ── */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-alpine-violet" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {(tab === "Full Report" || tab === "Data Report") && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-alpine-green align-middle" />
            )}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-alpine-violet" />
            )}
          </button>
        ))}
      </div>

      {/* ── View sub-tabs + Print/Export ── */}
      {(() => {
        const TAB_DOWNLOADS: Record<string, { file: string; saveAs: string }> = {
          "Full Report":     { file: "/demo-docs/ridgeline_ddq_2026.pdf",          saveAs: "Ridgeline_Full_ODD_Report.pdf" },
          "Data Report":     { file: "/demo-docs/ridgeline_annual_report_2024.pdf", saveAs: "Ridgeline_Data_Report.pdf" },
          "Executive Brief": { file: "/demo-docs/ridgeline_ppm.pdf",                saveAs: "Ridgeline_Executive_Brief.pdf" },
          "IC Deck":         { file: "/demo-docs/ridgeline_ic_charter.pdf",         saveAs: "Ridgeline_IC_Deck.pdf" },
          "Final Report":    { file: "/demo-docs/sample_vc_fund_iv_alt.pdf",        saveAs: "Trellis_Capital_IV_ODD_Final_Report.pdf" },
        };
        const isDisabled = finalReportPending && activeTab === "Final Report";
        const dl = TAB_DOWNLOADS[activeTab];
        return (
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400">
                {activeTab === "Full Report" ? "Comprehensive IC-ready report with all findings" :
                 activeTab === "Data Report" ? "Verification data, document inventory, and evidence" :
                 activeTab === "Executive Brief" ? "Condensed overview for quick review" :
                 activeTab === "Call Prep" ? "Management call preparation guide" :
                 activeTab === "IC Deck" ? "10-slide IC presentation outline" : "Final deliverable report for investment committee"}
              </p>
              <button onClick={() => window.print()} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Print</button>
              <button
                disabled={isDisabled}
                onClick={() => {
                  if (!dl || isDisabled) return;
                  const a = document.createElement("a");
                  a.href = dl.file;
                  a.download = dl.saveAs;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                title={isDisabled ? "Complete report generation to export" : `Export ${activeTab} as PDF`}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isDisabled
                    ? "text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
                    : "text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Content ── */}
      {activeTab === "Full Report" ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Sources legend */}
          <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 px-8 py-3 border-b border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Sources</span>
            <div className="w-px h-3 bg-slate-200" />
            {SOURCE_LEGEND.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[11px] text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Jump To bar */}
          {headings.length > 0 && (
            <div className="flex items-center gap-1 px-8 py-2 border-b border-slate-100 overflow-x-auto">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider shrink-0 mr-1">Jump to</span>
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollTo(h.id)}
                  className="shrink-0 px-2 py-1 text-[11px] text-slate-500 hover:text-alpine-violet hover:bg-alpine-violet/10 rounded transition-colors whitespace-nowrap"
                >
                  {h.text}
                </button>
              ))}
            </div>
          )}

          {/* Report content */}
          <div
            ref={containerRef}
            className="px-10 py-8 max-h-[calc(100vh-320px)] overflow-y-auto scroll-smooth"
            data-report-content
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      ) : activeTab === "Data Report" ? (
        <div ref={contentAreaRef}><DataReportViewer data={RIDGELINE_DATA_REPORT} /></div>
      ) : activeTab === "Executive Brief" ? (
        <div ref={contentAreaRef} className="bg-white rounded-xl border border-slate-200 p-8"><ExecutiveBriefViewer data={RIDGELINE_EXECUTIVE_BRIEF} /></div>
      ) : activeTab === "Call Prep" ? (
        <div ref={contentAreaRef} className="bg-white rounded-xl border border-slate-200 p-8"><CallPrep /></div>
      ) : activeTab === "IC Deck" ? (
        <div ref={contentAreaRef} className="bg-white rounded-xl border border-slate-200 p-8"><ICDeck /></div>
      ) : finalReportPending ? (
        <div ref={contentAreaRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 32px", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Final Report Pending</div>
            <div style={{ fontSize: 13, color: "#64748b", maxWidth: 360, lineHeight: 1.6 }}>
              The final deliverable is being compiled. Complete the report generation step to unlock the IC-ready PDF.
            </div>
          </div>
          <div style={{ marginTop: 8, padding: "10px 20px", borderRadius: 8, background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)", fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>
            Report generation in queue · ~3 min remaining
          </div>
        </div>
      ) : (
        <div ref={contentAreaRef}><FinalReport /></div>
      )}
      {refPopover && <RefPopover info={refPopover} onClose={() => setRefPopover(null)} />}
    </div>
  );
}
