/**
 * Print/PDF layout for an ODD report. Server-rendered to an HTML string and
 * turned into a PDF by /api/investor/report-pdf (headless Chromium → page.pdf).
 *
 * Heavy, institutional layout modelled on Alpine's reference ops-review report:
 * cover → table of contents → Overview → Assessment → Scope & Verification →
 * Alpine Ratings → Alpine Flags → Remediation & Monitoring → per-chapter
 * narrative (each on a divider page) → consolidated Reference Data → Sources.
 *
 * The same entity/org chart components as the web report are woven in (print
 * mode, so the boxes drop their interactive dots), the gauge / AUM / benchmark
 * graphs sit inline, and the narrative's inline citations become numbered
 * footnotes collected into the Sources appendix.
 *
 * Per-page chrome (navy spine, running header, footer, page numbers) is NOT
 * drawn here — the route stamps it onto every page with pdf-lib. The TOC's page
 * numbers are placeholders (`data-page-for`) that the route fills in after
 * measuring where each `data-section` / `data-subsection` lands.
 *
 * Inline styles only — no Tailwind — so the print HTML is fully self-contained.
 */
import React from "react";
import { getReportContent, topicNumbers } from "@/lib/investor/report-content";
import { getFundCharts } from "@/lib/app-portal/fund-charts";
import { EntityChart, OrgChart } from "@/components/app-portal/review/FundCharts";
import { makePrintCiter, type PrintCiter } from "@/lib/investor/print-citations";
import { MiniBenchmark } from "@/components/investor/PrintCharts";
import { getAssessmentNarrative, getScopeVerification, getOverviewContent } from "@/lib/investor/report-narrative";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Design tokens ─────────────────────────────────────────────────────────────
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const INK = "#1a1a1a";
const BODY = "#333740";
const MUTED = "#6b7280";
const SUBTLE = "#9ca3af";
const BORDER = "#e5e7eb";
const NAVY = "#1f3a5f";
const ZEBRA = "#f7f8fa";

const SEV: Record<string, string> = { HIGH: "#dc2626", MEDIUM: "#d97706", LOW: "#64748b" };
const SEV_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const RATING: Record<string, { bg: string; fg: string; label: string }> = {
  GREEN: { bg: "#dcfce7", fg: "#15803d", label: "GREEN" },
  YELLOW: { bg: "#fef3c7", fg: "#b45309", label: "YELLOW" },
  RED: { bg: "#fee2e2", fg: "#b91c1c", label: "RED" },
};
const FLAG_DOT: Record<string, string> = { green: "#16a34a", yellow: "#d97706", red: "#dc2626" };
const PRIORITY: Record<string, string> = { HIGH: "High", MEDIUM: "Med", LOW: "Low" };

function ratingOf(v?: string) {
  return RATING[(v || "").toUpperCase()] || RATING.YELLOW;
}

/** Drop the redundant "— REQUIRED BEFORE CLOSE" suffix some risk titles carry;
 *  that gating already lives in the Remediation section. */
function cleanTitle(t?: string) {
  return (t || "").replace(/\s*[—–-]\s*REQUIRED BEFORE CLOSE\s*$/i, "").trim();
}

// ── Small building blocks ─────────────────────────────────────────────────────
// The real Alpine wordmark from the site (public/alpine-logo-dark.svg), inlined
// so it renders as crisp vector in the PDF. Plus Jakarta Sans / DM Sans are
// loaded by the print HTML; they fall back to the doc sans if unavailable.
function Logo({ small }: { small?: boolean }) {
  const w = small ? 150 : 210;
  const h = (w * 76) / 320;
  return (
    <svg width={w} height={h} viewBox="0 0 320 76" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id="alpine-icon-bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="72%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <rect x="0" y="8" width="60" height="60" rx="12" fill="url(#alpine-icon-bg)" />
      <g fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.3 45.6L30 28L41.7 45.6" />
        <path d="M24.1 39.8L30 31L35.9 39.8" />
      </g>
      <text x="76" y="41" fontFamily="'Plus Jakarta Sans', 'Helvetica Neue', sans-serif" fontSize="28" fontWeight="600" fill="#0F0F10" letterSpacing="5">ALPINE</text>
      <text x="77" y="58" fontFamily="'DM Sans', 'Helvetica Neue', sans-serif" fontSize="11" fontWeight="400" fill="#6B7280" letterSpacing="3.5">DUE DILIGENCE</text>
    </svg>
  );
}

function RatingChip({ rating, big }: { rating?: string; big?: boolean }) {
  const r = ratingOf(rating);
  return (
    <span
      style={{
        background: r.bg,
        color: r.fg,
        fontWeight: 700,
        fontSize: big ? 11 : 9,
        letterSpacing: "0.04em",
        padding: big ? "5px 12px" : "2px 9px",
        borderRadius: 4,
        fontFamily: SANS,
        whiteSpace: "nowrap",
      }}
    >
      {r.label}
    </span>
  );
}

/** Legend for the green/amber/red status dots used in the data tables and charts. */
function DotLegend({ style }: { style?: React.CSSProperties }) {
  const items: [string, string][] = [
    [FLAG_DOT.green, "Satisfactory"],
    [FLAG_DOT.yellow, "Monitor / caution"],
    [FLAG_DOT.red, "Deficiency / flag"],
  ];
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center", fontFamily: SANS, fontSize: 8.5, color: MUTED, ...style }}>
      <span style={{ fontWeight: 700, color: "#3f4654", letterSpacing: "0.04em" }}>STATUS</span>
      {items.map(([c, label]) => (
        <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: 9, background: c, display: "inline-block" }} />
          {label}
        </span>
      ))}
    </div>
  );
}

/** Large, light page title with a hairline rule beneath — the section header style. */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1 style={{ fontSize: 27, fontWeight: 400, color: INK, margin: "0 0 14px", fontFamily: SANS, letterSpacing: "-0.01em" }}>{children}</h1>
      <div style={{ borderBottom: `1px solid ${BORDER}` }} />
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: INK, fontFamily: SANS, letterSpacing: "0.02em", margin: "18px 0 7px" }}>{children}</div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10.5, lineHeight: 1.62, color: BODY, fontFamily: SANS, margin: "0 0 9px" }}>{children}</p>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 10px", padding: 0, listStyle: "none" }}>
      {items.filter(Boolean).map((t, i) => (
        <li key={i} style={{ fontSize: 10, lineHeight: 1.5, color: BODY, fontFamily: SANS, marginBottom: 6, position: "relative", paddingLeft: 12 }}>
          <span style={{ position: "absolute", left: 0, top: 0 }}>·</span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Zebra Field/Value table used throughout Reference Data and verification. */
function KVTable({ rows }: { rows: { k: string; v: React.ReactNode; flag?: string }[] }) {
  const filled = rows.filter((r) => r.v !== undefined && r.v !== null && r.v !== "");
  if (filled.length === 0) return null;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: SANS, marginBottom: 4 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", fontSize: 8.5, fontWeight: 400, color: SUBTLE, padding: "4px 10px", width: "38%", borderBottom: `1px solid ${BORDER}` }}>Field</th>
          <th style={{ textAlign: "left", fontSize: 8.5, fontWeight: 400, color: SUBTLE, padding: "4px 10px", borderBottom: `1px solid ${BORDER}` }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {filled.map((r, i) => (
          <tr key={i} style={{ background: i % 2 ? ZEBRA : "#fff", breakInside: "avoid" }}>
            <td style={{ fontSize: 9.5, color: MUTED, padding: "6px 10px", verticalAlign: "top" }}>{r.k}</td>
            <td style={{ fontSize: 9.5, color: INK, padding: "6px 10px", verticalAlign: "top" }}>
              {r.flag && FLAG_DOT[r.flag] && (
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 9, background: FLAG_DOT[r.flag], marginRight: 6, verticalAlign: "middle" }} />
              )}
              {r.v}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Generic multi-column data table (Remediation, Flags, Verification). */
function GridTable({ head, rows, widths }: { head: string[]; rows: React.ReactNode[][]; widths?: (string | number)[] }) {
  if (rows.length === 0) return null;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: SANS, marginBottom: 6 }}>
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={i} style={{ textAlign: "left", fontSize: 8.5, fontWeight: 400, color: SUBTLE, padding: "5px 10px", borderBottom: `1px solid ${BORDER}`, width: widths?.[i] }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 ? ZEBRA : "#fff", breakInside: "avoid" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ fontSize: 9.5, color: j === 0 ? MUTED : INK, padding: "7px 10px", verticalAlign: "top", lineHeight: 1.45 }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** One TOC line: label, dotted leader, page-number placeholder filled by the route. */
function TocRow({ label, anchor, level }: { label: string; anchor: string; level: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: SANS, margin: level === 0 ? "13px 0 0" : "6px 0 0", paddingLeft: level * 18 }}>
      <span style={{ fontSize: level === 0 ? 11.5 : 9.5, color: level === 0 ? INK : MUTED, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ flex: 1, borderBottom: `1px dotted ${SUBTLE}`, margin: "0 5px 3px" }} />
      <span data-page-for={anchor} style={{ fontSize: level === 0 ? 11 : 9.5, color: level === 0 ? INK : MUTED, whiteSpace: "nowrap" }}>00</span>
    </div>
  );
}

// ── Narrative (findings) → print blocks with footnote markers ─────────────────
// Direct function (not a component) so it runs EAGERLY during the body — the
// footnote collector must be populated before the Sources appendix reads it.
// `subPrefix`/`subStart` give each `### ` heading a stable anchor for the TOC.
function renderPrintFindings(text: string, citer: PrintCiter, subPrefix: string) {
  const out: React.ReactNode[] = [];
  const tableNodes: React.ReactNode[] = []; // collected separately → rendered full-width at chapter end
  let para: string[] = [];
  let bullets: string[] = [];
  let tableRows: string[] = [];
  let key = 0;
  let sub = 0;
  const flushPara = () => {
    if (para.length) {
      out.push(
        <p key={`p${key++}`} style={{ fontSize: 10.5, lineHeight: 1.62, color: BODY, fontFamily: SANS, margin: "0 0 9px" }}>
          {citer.render(para.join(" "))}
        </p>,
      );
      para = [];
    }
  };
  const flushBullets = () => {
    if (bullets.length) {
      out.push(
        <ul key={`u${key++}`} style={{ margin: "0 0 9px 16px", padding: 0 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 10.5, lineHeight: 1.55, color: BODY, fontFamily: SANS, marginBottom: 3 }}>
              {citer.render(b)}
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  // Markdown pipe-tables → real tables. Collected into `tableNodes` and rendered
  // full-width AFTER the two-column narrative, so they don't break the column flow.
  const flushTable = () => {
    if (!tableRows.length) return;
    const cells = (r: string) => r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    const rows = tableRows
      .map(cells)
      .filter((cs) => !cs.every((c) => c === "" || /^:?-{2,}:?$/.test(c))); // drop the |---| separator
    tableRows = [];
    if (rows.length === 0) return;
    const [head, ...bodyRows] = rows;
    tableNodes.push(
      <table key={`t${key++}`} style={{ width: "100%", borderCollapse: "collapse", fontFamily: SANS, margin: "0 0 12px", breakInside: "avoid" }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} style={{ textAlign: "left", fontSize: 8.5, fontWeight: 400, color: SUBTLE, padding: "5px 9px", borderBottom: `1px solid ${BORDER}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((cs, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? ZEBRA : "#fff", breakInside: "avoid" }}>
              {cs.map((c, ci) => (
                <td key={ci} style={{ fontSize: 9, color: ci === 0 ? MUTED : INK, padding: "6px 9px", verticalAlign: "top", lineHeight: 1.4 }}>{citer.render(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>,
    );
  };
  const flushAll = () => { flushPara(); flushBullets(); flushTable(); };
  for (const raw of (text || "").split("\n")) {
    const line = raw.trim();
    if (line === "") {
      flushAll();
    } else if (line.startsWith("|") && line.endsWith("|")) {
      flushPara();
      flushBullets();
      tableRows.push(line);
    } else if (line.startsWith("### ")) {
      flushAll();
      // First element gets no top margin so both columns start at the same level.
      const mt = out.length === 0 ? 0 : 16;
      out.push(
        <div key={`h${key++}`} data-subsection={`${subPrefix}-${sub}`} style={{ fontSize: 12, fontWeight: 700, color: INK, fontFamily: SANS, letterSpacing: "0.02em", margin: `${mt}px 0 6px` }}>
          {line.slice(4)}
        </div>,
      );
      sub++;
    } else if (line.startsWith("•") || line.startsWith("- ")) {
      flushPara();
      flushTable();
      bullets.push(line.replace(/^[•-]\s*/, ""));
    } else {
      flushBullets();
      flushTable();
      para.push(line);
    }
  }
  flushAll();
  return { body: <>{out}</>, tables: tableNodes };
}

/** Pull the `### ` sub-headings out of findings prose for the TOC. */
function subHeadings(text: string): string[] {
  return (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("### ") && !/Rating Rationale/i.test(l))
    .map((l) => l.slice(4));
}

/**
 * Split a findings block into the narrative (everything before the
 * `### <color> Rating Rationale` heading) and the rationale prose itself.
 * The rationale moves to the Chapter Summary; the chapter body drops it.
 */
function splitRationale(findings: string): { narrative: string; rationale: string } {
  const text = findings || "";
  const m = text.match(/###\s+(?:GREEN|YELLOW|RED)\s+Rating Rationale[^\n]*\n/i);
  if (!m || m.index === undefined) return { narrative: text, rationale: "" };
  const narrative = text.slice(0, m.index).trimEnd();
  let rationale = text.slice(m.index + m[0].length).trim();
  // The rating chip already shows the colour — strip any colour-word lead-in
  // so the summary reads as plain prose ("The rating reflects…").
  rationale = rationale
    .replace(/\bThe\s+(?:GREEN|YELLOW|RED)\s+rating\b/gi, "The rating")
    .replace(/^\s*(?:GREEN|YELLOW|RED)\s+rating\s+based\s+on:?/i, "The rating reflects:")
    .replace(/^\s*(?:GREEN|YELLOW|RED)\s*[:\-–—]\s*/i, "")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { narrative, rationale };
}

// ── Full document ─────────────────────────────────────────────────────────────
export function ReportPrintDocument({ slug, recipient, date, fillHeight = "248mm" }: { slug: string; recipient?: string; date: string; fillHeight?: string }) {
  const content = getReportContent(slug);
  if (!content) return <div>Report not found.</div>;
  const { entry, topicData, mock } = content;
  const charts = getFundCharts(entry.dataKey);
  const nums = topicNumbers(topicData);
  const citer = makePrintCiter();
  // Markdown tables embedded in chapter findings are collected here during the
  // chapter render and emitted in Reference Data under their topic (chapters
  // stay pure narrative). Populated before the Reference Data map reads it.
  const chapterTables: Record<number, React.ReactNode[]> = {};
  const narrative = getAssessmentNarrative(entry.dataKey);
  const scopeVer = getScopeVerification(entry.dataKey);
  const overview = getOverviewContent(entry.dataKey);
  const fund = (mock as any)?.fund || {};
  const ros: any[] = Array.isArray((mock as any)?.risk_observations) ? (mock as any).risk_observations : [];
  const rosSorted = [...ros].sort((a, b) => (SEV_ORDER[a.severity] ?? 3) - (SEV_ORDER[b.severity] ?? 3));
  const strengths: any[] = Array.isArray((mock as any)?.strengths) ? (mock as any).strengths : [];
  const perf: any = (mock as any)?.fund_performance || {};
  const terms: any = perf.fund_terms || {};
  const requiredBeforeClose = rosSorted.filter((o) => o.severity === "HIGH");
  const postClose = rosSorted.filter((o) => o.severity !== "HIGH");

  // ── Fallback Overview prose (funds without an authored overview in
  // report-narrative.ts). Built to stay grammatical across fund types. ──
  const aOrAn = (s: string) => (/^[aeiou]/i.test(String(s || "").trim()) ? "an" : "a");
  const fbMinTxt = terms.minimum_investment
    ? (/negotiat/i.test(terms.minimum_investment) ? ", with a negotiated minimum commitment" : `, with a minimum commitment of ${terms.minimum_investment}`)
    : "";
  const fbNavTxt = terms.nav_frequency ? ` and ${String(terms.nav_frequency).toLowerCase()} NAV reporting` : "";
  const fbHurdle = perf.fees?.hurdle_rate;
  const fbHasHurdle = fbHurdle && !/^\s*none/i.test(String(fbHurdle));
  const fbPerfFee = perf.fees ? String(perf.fees.performance_fee) : "";
  const fbCarry = /carr(y|ied)/i.test(fbPerfFee) ? fbPerfFee : `${fbPerfFee} carry`;
  const fbManager = `${entry.manager} (“the Manager”) pursues ${aOrAn(entry.strategy)} ${entry.strategy.toLowerCase()} strategy.${fund.aum ? ` Assets under management are ${fund.aum}.` : ""}`;
  const fbFund = `${entry.fundName} is ${fund.domicile ? `${aOrAn(fund.domicile)} ${fund.domicile}` : "the subject fund"}${fbMinTxt}${fbNavTxt}.`;
  const fbControls = [
    terms.administrator ? `${terms.administrator} serves as administrator.` : "",
    terms.auditor ? `${terms.auditor} acts as auditor.` : "",
    perf.fees ? `Fees run ${perf.fees.management_fee} management / ${fbCarry}${fbHasHurdle ? ` over a ${fbHurdle} hurdle` : ""}.` : "",
  ].filter(Boolean);
  // Deduped risk titles — drop exact + prefix-overlap duplicates.
  const fbRisks: string[] = [];
  const fbRiskSeen: string[] = [];
  for (const o of rosSorted) {
    const t = cleanTitle(o.title);
    const k = t.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!k || fbRiskSeen.some((s) => s.startsWith(k) || k.startsWith(s))) continue;
    fbRiskSeen.push(k);
    fbRisks.push(t);
    if (fbRisks.length >= 7) break;
  }

  // topic-name lookup for flags/sections
  const topicName = (key: any): string => {
    if (topicData[key]?.name) return topicData[key].name;
    const found = nums.find((n) => String(n) === String(key));
    return found ? topicData[found].name : String(key ?? "");
  };

  return (
    <div style={{ fontFamily: SANS, color: BODY }}>
      {/* ── Cover ── */}
      <section data-section="cover" style={{ breakAfter: "page", height: fillHeight, position: "relative" }}>
        <div style={{ position: "absolute", top: "30%", left: 0, right: 0 }}>
          <Logo />
          <h1 style={{ fontSize: 44, fontWeight: 400, color: INK, margin: "40px 0 0", letterSpacing: "-0.02em" }}>ODD Report</h1>
          <div style={{ width: 150, borderBottom: `2px solid ${INK}`, margin: "16px 0 22px" }} />
          <div style={{ fontSize: 22, fontWeight: 400, color: INK }}>{entry.fundName}</div>
          <div style={{ fontSize: 10.5, color: MUTED, marginTop: 16, lineHeight: 1.9 }}>
            <div>{[entry.strategy, fund.domicile, entry.manager].filter(Boolean).join("  |  ")}</div>
            <div>{date}</div>
            <div>Review Type: Operational Due Diligence</div>
          </div>
        </div>
      </section>

      {/* ── Table of Contents ── */}
      <section data-section="toc" style={{ breakAfter: "page" }}>
        <SectionTitle>Table of Contents</SectionTitle>
        <TocRow label="Overview" anchor="overview" level={0} />
        <TocRow label="Assessment" anchor="assessment" level={0} />
        {scopeVer && (
          <>
            <TocRow label="Scope & Verification" anchor="scope" level={0} />
            <TocRow label="Scope of Review" anchor="scope-1" level={1} />
            <TocRow label="Independent Verification Performed" anchor="scope-2" level={1} />
          </>
        )}
        <TocRow label="Alpine Ratings" anchor="ratings" level={0} />
        {rosSorted.length > 0 && <TocRow label="Alpine Flags" anchor="flags" level={0} />}
        {(requiredBeforeClose.length > 0 || postClose.length > 0) && (
          <>
            <TocRow label="Remediation & Monitoring" anchor="remediation" level={0} />
            {requiredBeforeClose.length > 0 && <TocRow label="Required Before Close" anchor="rem-1" level={1} />}
            {postClose.length > 0 && <TocRow label="Post-Close Monitoring" anchor="rem-2" level={1} />}
          </>
        )}
        {nums.map((n, i) => (
          <React.Fragment key={n}>
            <TocRow label={`Chapter ${i + 1}: ${topicData[n].name}`} anchor={`ch-${n}`} level={0} />
            {subHeadings(topicData[n].findings || "").map((h, k) => (
              <TocRow key={k} label={h} anchor={`sub-${n}-${k}`} level={1} />
            ))}
          </React.Fragment>
        ))}
        <TocRow label="Reference Data" anchor="reference" level={0} />
        {nums.map((n, i) => (
          <TocRow key={n} label={`${i + 1}. ${topicData[n].name}`} anchor={`ref-${n}`} level={1} />
        ))}
        {citer.footnotes.length >= 0 && <TocRow label="Sources" anchor="sources" level={0} />}
      </section>

      {/* ── Overview ── */}
      <section data-section="overview" style={{ breakBefore: "page" }}>
        <SectionTitle>Overview</SectionTitle>
        <div style={{ display: "flex", gap: 30 }}>
          <div style={{ flex: 1.05 }}>
            <SubHead>Manager Overview</SubHead>
            {overview
              ? overview.manager.map((p, i) => <Para key={`m${i}`}>{p}</Para>)
              : <Para>{fbManager}</Para>}
            <SubHead>Fund Overview</SubHead>
            {overview
              ? overview.fund.map((p, i) => <Para key={`f${i}`}>{p}</Para>)
              : <Para>{fbFund}</Para>}
            {(overview ? overview.controls : fbControls).length > 0 && (
              <>
                <SubHead>Controls Overview</SubHead>
                {(overview ? overview.controls : fbControls).map((s, i) => <Para key={i}>{s}</Para>)}
              </>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {(overview ? overview.strengths.length > 0 : strengths.length > 0) && (
              <>
                <SubHead>Strengths</SubHead>
                <Bullets items={overview ? overview.strengths : strengths.slice(0, 6).map((s: any) => s.title)} />
              </>
            )}
            {(overview ? overview.risks.length > 0 : fbRisks.length > 0) && (
              <>
                <SubHead>Risks</SubHead>
                <Bullets items={overview ? overview.risks : fbRisks} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Assessment ── */}
      <section data-section="assessment" style={{ breakBefore: "page" }}>
        <SectionTitle>Assessment</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${BORDER}`, paddingBottom: 13, marginBottom: 15 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, fontFamily: SANS }}>Overall Rating</span>
          <RatingChip rating={entry.rating} big />
        </div>
        {narrative ? (
          // Rich long-form memo (two columns, fills the page top-to-bottom).
          <>
            <div style={{ columnCount: 2, columnGap: 26, columnFill: "auto" }}>
              {narrative.intro.map((p, i) => <Para key={`ai${i}`}>{p}</Para>)}
              {narrative.body.map((p, i) => <Para key={`ab${i}`}>{p}</Para>)}
              {narrative.preLaunchNote && (
                <div style={{ marginTop: 6, breakInside: "avoid", borderLeft: `3px solid ${MUTED}`, background: "#f8fafc", padding: "10px 13px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: INK, fontFamily: SANS }}>Pre-Launch Note. </span>
                  <span style={{ fontSize: 10, lineHeight: 1.6, color: BODY, fontFamily: SANS }}>{narrative.preLaunchNote}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          // Fallback: structured rating summary for funds without an authored memo.
          <>
            {fund.recommendation_summary && (
              <p style={{ fontSize: 10.5, lineHeight: 1.7, color: BODY, fontFamily: SANS, marginTop: 0 }}>
                Alpine <span dangerouslySetInnerHTML={{ __html: fund.recommendation_summary }} />
              </p>
            )}
            {(() => {
              const concern = nums.filter((n) => (topicData[n].rating || "").toUpperCase() !== "GREEN" && topicData[n].summary);
              const positives = nums.filter((n) => (topicData[n].rating || "").toUpperCase() === "GREEN" && topicData[n].summary);
              const ordered = [...concern, ...positives];
              if (ordered.length === 0) return null;
              const strip = (s: string) => (s || "").replace(/^\s*(GREEN|YELLOW|RED)\s*[:\-–—]\s*/i, "");
              return (
                <>
                  <SubHead>Basis for the Assessment</SubHead>
                  <Para>The rating reflects findings across the eight diligence chapters that follow. The areas carrying the most weight are summarised below; each is developed in full, with supporting evidence, in its chapter.</Para>
                  {ordered.map((n) => {
                    const tr = ratingOf(topicData[n].rating);
                    return (
                      <div key={n} style={{ breakInside: "avoid", borderLeft: `2px solid ${tr.fg}`, paddingLeft: 12, margin: "0 0 11px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: INK, fontFamily: SANS }}>{topicData[n].name}</span>
                          <RatingChip rating={topicData[n].rating} />
                        </div>
                        <div style={{ fontSize: 10, lineHeight: 1.55, color: BODY, fontFamily: SANS }}>{strip(topicData[n].summary)}</div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
            {fund.conditions_summary && (
              <>
                <SubHead>Conditions</SubHead>
                <p style={{ fontSize: 10.5, lineHeight: 1.65, color: BODY, fontFamily: SANS, margin: 0 }} dangerouslySetInnerHTML={{ __html: fund.conditions_summary }} />
              </>
            )}
          </>
        )}
      </section>

      {/* ── Scope & Verification ── */}
      {scopeVer && (
        <section data-section="scope" style={{ breakBefore: "page" }}>
          <SectionTitle>Scope &amp; Verification</SectionTitle>
          <div data-subsection="scope-1">
            <SubHead>Scope of Review</SubHead>
            <Para>{scopeVer.scope}</Para>
          </div>
          {scopeVer.verification.length > 0 && (
            <div data-subsection="scope-2" style={{ marginTop: 6 }}>
              <SubHead>Independent Verification Performed</SubHead>
              <GridTable
                head={["Verification", "Result", "Evidence Basis"]}
                widths={["27%", "18%", "55%"]}
                rows={scopeVer.verification.map((v) => [
                  v.verification,
                  <span key="r" style={{ color: /flag|pending|not appointed/i.test(v.result) ? "#b45309" : "#15803d", fontWeight: 600 }}>{v.result}</span>,
                  v.evidence,
                ])}
              />
            </div>
          )}
        </section>
      )}

      {/* ── Alpine Ratings ── */}
      <section data-section="ratings" style={{ breakBefore: "page" }}>
        <SectionTitle>Alpine Ratings</SectionTitle>
        <GridTable
          head={["Chapter", "Rating"]}
          widths={["78%", "22%"]}
          rows={nums.map((n, i) => [`${i + 1}. ${topicData[n].name}`, <RatingChip key={n} rating={topicData[n].rating} />])}
        />
      </section>

      {/* ── Alpine Flags ── */}
      {rosSorted.length > 0 && (
        <section data-section="flags" style={{ breakBefore: "page" }}>
          <SectionTitle>Alpine Flags</SectionTitle>
          <GridTable
            head={["#", "Flag", "Section"]}
            widths={[40, "55%", "33%"]}
            rows={rosSorted.map((o, i) => [String(i + 1), cleanTitle(o.title), topicName(o.topic)])}
          />
        </section>
      )}

      {/* ── Remediation & Monitoring ── */}
      {(requiredBeforeClose.length > 0 || postClose.length > 0) && (
        <section data-section="remediation" style={{ breakBefore: "page" }}>
          <SectionTitle>Remediation &amp; Monitoring</SectionTitle>
          {requiredBeforeClose.length > 0 && (
            <div data-subsection="rem-1">
              <SubHead>Required Before Close</SubHead>
              <GridTable
                head={["#", "Issue", "Priority", "Investor Action"]}
                widths={[34, "40%", 70, "auto"]}
                rows={requiredBeforeClose.map((o, i) => [String(i + 1), cleanTitle(o.title), PRIORITY[o.severity] || o.severity, o.remediation || "Confirm pre-investment"])}
              />
            </div>
          )}
          {postClose.length > 0 && (
            <div data-subsection="rem-2">
              <SubHead>Post-Close Monitoring</SubHead>
              <GridTable
                head={["#", "Issue", "Priority", "Investor Action"]}
                widths={[34, "40%", 70, "auto"]}
                rows={postClose.map((o, i) => [String(requiredBeforeClose.length + i + 1), cleanTitle(o.title), PRIORITY[o.severity] || o.severity, o.remediation || "Monitor progress"])}
              />
            </div>
          )}
        </section>
      )}

      {/* ── Chapters (divider + narrative) ── */}
      {nums.map((n, i) => {
        const topic = topicData[n];
        return (
          <React.Fragment key={n}>
            {/* divider page */}
            <section data-section={`ch-div-${n}`} style={{ breakBefore: "page", height: fillHeight, position: "relative" }}>
              <div style={{ position: "absolute", bottom: "30%", left: 0 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", color: SUBTLE, fontFamily: SANS }}>ALPINE</div>
                <div style={{ fontSize: 34, fontWeight: 400, color: INK, margin: "8px 0 4px", letterSpacing: "-0.01em" }}>Chapter {i + 1}</div>
                <div style={{ fontSize: 19, fontWeight: 400, color: "#3f4654", marginBottom: 16 }}>{topic.name}</div>
                <RatingChip rating={topic.rating} big />
              </div>
            </section>
            {/* chapter content */}
            <section data-section={`ch-${n}`} style={{ breakBefore: "page" }}>
              <SectionTitle>Chapter {i + 1}: {topic.name}</SectionTitle>
              {topic.findings && (() => {
                // Split off the rating rationale; it becomes the Chapter Summary,
                // appended right after the narrative inside the same two columns.
                const { narrative, rationale } = splitRationale(topic.findings);
                const { body, tables } = renderPrintFindings(narrative, citer, `sub-${n}`);
                // Tables move to Reference Data; the chapter is narrative only.
                if (tables.length > 0) chapterTables[n] = tables;
                const summary = rationale || (topic.summary || "").replace(/\s*\n+\s*/g, " ").replace(/\s+/g, " ").trim();
                // column-fill:auto fills the left column to the bottom of the page
                // (the print fragmentainer) before flowing right, so a chapter
                // shorter than two balanced columns still occupies the page
                // top-to-bottom. No explicit height → long chapters never clip.
                return (
                  <div style={{ columnCount: 2, columnGap: 26, columnFill: "auto" }}>
                    {body}
                    {summary && (
                      <div style={{ breakInside: "avoid", marginTop: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 6px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: INK, fontFamily: SANS, letterSpacing: "0.02em" }}>Chapter Summary</span>
                          <RatingChip rating={topic.rating} />
                        </div>
                        <Para>{citer.render(summary)}</Para>
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* per-chapter risk mini-benchmarks */}
              {rosSorted.filter((o) => String(o.topic) === String(n) && o.benchmark).map((o) => (
                <div key={o.id} style={{ marginTop: 8, breakInside: "avoid", borderLeft: `3px solid ${SEV[o.severity] || "#64748b"}`, paddingLeft: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: INK, fontFamily: SANS }}>{cleanTitle(o.title)}</div>
                  <MiniBenchmark
                    portfolio={o.benchmark.portfolio_pct}
                    portfolioLabel={(o.benchmark.portfolio_label || "").split(" ").slice(0, 3).join(" ")}
                    industry={o.benchmark.industry_pct}
                    outlier={o.benchmark.is_outlier}
                  />
                </div>
              ))}
            </section>
          </React.Fragment>
        );
      })}

      {/* ── Reference Data ── */}
      <section data-section="reference" style={{ breakBefore: "page" }}>
        <SectionTitle>Reference Data</SectionTitle>
        <DotLegend style={{ margin: "-8px 0 18px" }} />
        {nums.map((n, i) => {
          const groups = topicData[n].dataPoints || [];
          const hasOrg = charts && charts.orgTopic === n;
          const hasEntity = charts && charts.entityTopic === n;
          const tables = chapterTables[n] || [];
          if (groups.length === 0 && !hasOrg && !hasEntity && tables.length === 0) return null;
          return (
            <div key={n} data-subsection={`ref-${n}`} style={{ marginBottom: 18, breakBefore: "page" }}>
              <h2 style={{ fontSize: 16, fontWeight: 400, color: INK, fontFamily: SANS, margin: "8px 0 12px" }}>{i + 1}. {topicData[n].name}</h2>
              {hasOrg && (
                <div style={{ marginBottom: 14, breakInside: "avoid" }}>
                  <OrgChart data={charts!.org} print />
                </div>
              )}
              {hasEntity && (
                <div style={{ marginBottom: 14, breakInside: "avoid" }}>
                  <EntityChart data={charts!.entity} print />
                </div>
              )}
              {groups.map((g: any, gi: number) => (
                <div key={gi} style={{ marginBottom: 12, breakInside: "avoid" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: INK, fontFamily: SANS, marginBottom: 6 }}>{g.group}</div>
                  <KVTable rows={(g.items || []).map((it: any) => ({ k: it.label, v: it.value, flag: it.flag }))} />
                </div>
              ))}
              {tables.length > 0 && <div style={{ marginTop: 4 }}>{tables}</div>}
            </div>
          );
        })}
      </section>

      {/* ── Sources appendix ── */}
      {citer.footnotes.length > 0 && (
        <section data-section="sources" style={{ breakBefore: "page" }}>
          <SectionTitle>Sources</SectionTitle>
          <ol style={{ margin: 0, paddingLeft: 22, columnCount: 2, columnGap: 28, columnFill: "balance" }}>
            {citer.footnotes.map((f) => (
              <li key={f.n} style={{ fontSize: 9.5, lineHeight: 1.55, color: BODY, fontFamily: SANS, marginBottom: 4, breakInside: "avoid" }}>
                <span style={{ fontWeight: 700, color: INK }}>{f.source}</span>
                <span style={{ color: MUTED }}> — “{f.quote}”</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
