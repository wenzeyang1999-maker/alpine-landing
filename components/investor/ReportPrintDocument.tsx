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
import { ScoreGauge, AumBars, BenchmarkBars, MiniBenchmark } from "@/components/investor/PrintCharts";

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
const VERDICT: Record<string, string> = { GREEN: "ACCEPT", YELLOW: "WATCHLIST", RED: "FLAG" };
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
function Logo({ small }: { small?: boolean }) {
  const s = small ? 22 : 34;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block" }}>
        <defs>
          <linearGradient id="alpg" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="38%" stopColor="#ec4899" />
            <stop offset="72%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#alpg)" />
        <path d="M50 26 L70 72 L60 72 L50 48 L40 72 L30 72 Z" fill="#fff" />
      </svg>
      <div style={{ fontFamily: SANS, lineHeight: 1 }}>
        <div style={{ fontSize: small ? 12 : 17, fontWeight: 700, letterSpacing: "0.22em", color: NAVY }}>ALPINE</div>
        <div style={{ fontSize: small ? 6.5 : 8, letterSpacing: "0.18em", color: MUTED, marginTop: 3 }}>DUE DILIGENCE INC.</div>
      </div>
    </div>
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
    <div style={{ fontSize: 12.5, fontWeight: 400, color: "#3f4654", fontFamily: SANS, letterSpacing: "0.02em", margin: "18px 0 7px" }}>{children}</div>
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
  let para: string[] = [];
  let bullets: string[] = [];
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
  for (const raw of (text || "").split("\n")) {
    const line = raw.trim();
    if (line === "") {
      flushPara();
      flushBullets();
    } else if (line.startsWith("### ")) {
      flushPara();
      flushBullets();
      out.push(
        <div key={`h${key++}`} data-subsection={`${subPrefix}-${sub}`} style={{ fontSize: 12, fontWeight: 400, color: "#3f4654", fontFamily: SANS, letterSpacing: "0.02em", margin: "16px 0 6px" }}>
          {line.slice(4)}
        </div>,
      );
      sub++;
    } else if (line.startsWith("•") || line.startsWith("- ")) {
      flushPara();
      bullets.push(line.replace(/^[•-]\s*/, ""));
    } else {
      flushBullets();
      para.push(line);
    }
  }
  flushPara();
  flushBullets();
  return <>{out}</>;
}

/** Pull the `### ` sub-headings out of findings prose for the TOC. */
function subHeadings(text: string): string[] {
  return (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("### "))
    .map((l) => l.slice(4));
}

// ── Full document ─────────────────────────────────────────────────────────────
export function ReportPrintDocument({ slug, recipient, date }: { slug: string; recipient?: string; date: string }) {
  const content = getReportContent(slug);
  if (!content) return <div>Report not found.</div>;
  const { entry, topicData, mock } = content;
  const charts = getFundCharts(entry.dataKey);
  const nums = topicNumbers(topicData);
  const citer = makePrintCiter();
  const r = ratingOf(entry.rating);
  const fund = (mock as any)?.fund || {};
  const ros: any[] = Array.isArray((mock as any)?.risk_observations) ? (mock as any).risk_observations : [];
  const rosSorted = [...ros].sort((a, b) => (SEV_ORDER[a.severity] ?? 3) - (SEV_ORDER[b.severity] ?? 3));
  const strengths: any[] = Array.isArray((mock as any)?.strengths) ? (mock as any).strengths : [];
  const perf: any = (mock as any)?.fund_performance || {};
  const peer: any = (mock as any)?.peer_comparison || {};
  const terms: any = perf.fund_terms || {};
  const requiredBeforeClose = rosSorted.filter((o) => o.severity === "HIGH");
  const postClose = rosSorted.filter((o) => o.severity !== "HIGH");
  const verdict = VERDICT[(entry.rating || "").toUpperCase()] || "WATCHLIST";

  // topic-name lookup for flags/sections
  const topicName = (key: any): string => {
    if (topicData[key]?.name) return topicData[key].name;
    const found = nums.find((n) => String(n) === String(key));
    return found ? topicData[found].name : String(key ?? "");
  };

  // distinct evidence sources for the verification table
  const sourceSet = new Set<string>();
  nums.forEach((n) => (topicData[n].dataPoints || []).forEach((g: any) => (g.items || []).forEach((it: any) => it.source && sourceSet.add(it.source))));
  const distinctSources = Array.from(sourceSet).sort();

  return (
    <div style={{ fontFamily: SANS, color: BODY }}>
      {/* ── Cover ── */}
      <section data-section="cover" style={{ breakAfter: "page", height: "248mm", position: "relative" }}>
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
        <TocRow label="Scope & Verification" anchor="scope" level={0} />
        <TocRow label="Scope of Review" anchor="scope-1" level={1} />
        <TocRow label="Independent Verification Performed" anchor="scope-2" level={1} />
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
        <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 20 }}>
          <ScoreGauge score={entry.oddScore} label={verdict} />
          <div style={{ flex: 1 }}>
            {fund.recommendation_summary && (
              <p style={{ fontSize: 11, lineHeight: 1.62, color: BODY, fontFamily: SANS, margin: 0 }}>
                Alpine <span dangerouslySetInnerHTML={{ __html: fund.recommendation_summary }} />
              </p>
            )}
          </div>
          {perf.aum_history && perf.aum_history.length > 0 && <AumBars data={perf.aum_history} title="AUM by vintage ($M)" />}
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          <div style={{ flex: 1.05 }}>
            <SubHead>Manager Overview</SubHead>
            <Para>{`${entry.manager} ("the Manager") operates a ${entry.strategy.toLowerCase()} strategy${fund.domicile ? `, domiciled in ${fund.domicile}` : ""}.${fund.aum ? ` Assets under management are ${fund.aum}.` : ""}`}</Para>
            <SubHead>Fund Overview</SubHead>
            <Para>{`${entry.fundName}${fund.domicile ? ` is a ${fund.domicile} vehicle` : ""}${terms.minimum_investment ? ` with a ${terms.minimum_investment} minimum` : ""}${terms.nav_frequency ? ` and ${String(terms.nav_frequency).toLowerCase()} NAV reporting` : ""}.`}</Para>
            <SubHead>Controls Overview</SubHead>
            <Para>
              {[terms.administrator ? `${terms.administrator} serves as administrator` : "", terms.auditor ? `${terms.auditor} as auditor` : "", perf.fees ? `Fees run ${perf.fees.management_fee} management / ${perf.fees.performance_fee} carry${perf.fees.hurdle_rate && perf.fees.hurdle_rate !== "None" ? ` over a ${perf.fees.hurdle_rate} hurdle` : ""}` : ""].filter(Boolean).join(". ") + "."}
            </Para>
          </div>
          <div style={{ flex: 1 }}>
            {strengths.length > 0 && (
              <>
                <SubHead>Strengths</SubHead>
                <Bullets items={strengths.slice(0, 6).map((s: any) => s.title)} />
              </>
            )}
            {rosSorted.length > 0 && (
              <>
                <SubHead>Risks</SubHead>
                <Bullets items={rosSorted.slice(0, 7).map((o: any) => cleanTitle(o.title))} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Assessment ── */}
      <section data-section="assessment" style={{ breakBefore: "page" }}>
        <SectionTitle>Assessment</SectionTitle>
        <div style={{ background: r.bg, color: r.fg, fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", padding: "11px 16px", borderRadius: 4, marginBottom: 18, fontFamily: SANS }}>
          OVERALL RATING: {r.label}
        </div>
        {fund.recommendation_summary && (
          <p style={{ fontSize: 10.5, lineHeight: 1.7, color: BODY, fontFamily: SANS, marginTop: 0 }}>
            Alpine <span dangerouslySetInnerHTML={{ __html: fund.recommendation_summary }} />
          </p>
        )}
        {peer.benchmark_comparison && peer.benchmark_comparison.length > 0 && (
          <div style={{ margin: "16px 0", padding: "13px 15px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fafbfc", breakInside: "avoid" }}>
            <BenchmarkBars data={peer.benchmark_comparison} title="Fund vs. peer benchmark (0–100)" />
          </div>
        )}
        {/* Basis for the assessment — drawn from each chapter's own summary */}
        {(() => {
          const concern = nums.filter((n) => (topicData[n].rating || "").toUpperCase() !== "GREEN" && topicData[n].summary);
          const positives = nums.filter((n) => (topicData[n].rating || "").toUpperCase() === "GREEN" && topicData[n].summary);
          if (concern.length === 0 && positives.length === 0) return null;
          return (
            <>
              <SubHead>Basis for the Assessment</SubHead>
              <Para>
                {`The rating reflects findings across the eight diligence chapters that follow. The areas carrying the most weight are summarised below; each is developed in full, with supporting evidence, in its chapter.`}
              </Para>
              {concern.map((n) => {
                const tr = ratingOf(topicData[n].rating);
                return (
                  <p key={n} style={{ fontSize: 10.5, lineHeight: 1.65, color: BODY, fontFamily: SANS, margin: "0 0 9px" }}>
                    <span style={{ fontWeight: 700, color: INK }}>{topicData[n].name} — {tr.label}.</span> {topicData[n].summary}
                  </p>
                );
              })}
              {positives.length > 0 && (
                <p style={{ fontSize: 10.5, lineHeight: 1.65, color: BODY, fontFamily: SANS, margin: "0 0 9px" }}>
                  <span style={{ fontWeight: 700, color: INK }}>Areas of strength.</span>{" "}
                  {positives.map((n) => `${topicData[n].name} is rated GREEN — ${topicData[n].summary}`).join(" ")}
                </p>
              )}
            </>
          );
        })()}
        {fund.conditions_summary && (
          <>
            <SubHead>Conditions</SubHead>
            <p style={{ fontSize: 10.5, lineHeight: 1.65, color: BODY, fontFamily: SANS, margin: 0 }} dangerouslySetInnerHTML={{ __html: fund.conditions_summary }} />
          </>
        )}
      </section>

      {/* ── Scope & Verification ── */}
      <section data-section="scope" style={{ breakBefore: "page" }}>
        <SectionTitle>Scope &amp; Verification</SectionTitle>
        <div data-subsection="scope-1">
          <SubHead>Scope of Review</SubHead>
          <Para>
            {`Alpine's review of ${entry.fundName} included analysis of the fund's offering and constitutional documents, the Manager's compliance materials and policies, confirmation of service-provider engagements, and the operational narrative set out in the chapters that follow. Quantitative data points were checked against the Manager's responses and, where available, independent public registers and regulatory databases.`}
          </Para>
        </div>
        {distinctSources.length > 0 && (
          <div data-subsection="scope-2">
            <SubHead>Independent Verification Performed</SubHead>
            <GridTable
              head={["Source / Basis", "Status"]}
              widths={["62%", "38%"]}
              rows={distinctSources.map((s) => [s, "Reviewed"])}
            />
          </div>
        )}
      </section>

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
            <section data-section={`ch-div-${n}`} style={{ breakBefore: "page", height: "248mm", position: "relative" }}>
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
              {charts && charts.orgTopic === n && (
                <div style={{ marginBottom: 14, breakInside: "avoid" }}>
                  <OrgChart data={charts.org} print />
                </div>
              )}
              {charts && charts.entityTopic === n && (
                <div style={{ marginBottom: 14, breakInside: "avoid" }}>
                  <EntityChart data={charts.entity} print />
                </div>
              )}
              {topic.findings && renderPrintFindings(topic.findings, citer, `sub-${n}`)}
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
              {/* Chapter Summary */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 6px" }}>
                <div style={{ fontSize: 12, fontWeight: 400, color: "#3f4654", fontFamily: SANS }}>Chapter Summary</div>
                <RatingChip rating={topic.rating} />
              </div>
              {topic.summary && <Para>{topic.summary}</Para>}
            </section>
          </React.Fragment>
        );
      })}

      {/* ── Reference Data ── */}
      <section data-section="reference" style={{ breakBefore: "page" }}>
        <SectionTitle>Reference Data</SectionTitle>
        {nums.map((n, i) => {
          const groups = topicData[n].dataPoints || [];
          if (groups.length === 0) return null;
          return (
            <div key={n} data-subsection={`ref-${n}`} style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 400, color: INK, fontFamily: SANS, margin: "8px 0 12px" }}>{i + 1}. {topicData[n].name}</h2>
              {groups.map((g: any, gi: number) => (
                <div key={gi} style={{ marginBottom: 12, breakInside: "avoid" }}>
                  <div style={{ fontSize: 11, fontWeight: 400, color: "#3f4654", fontFamily: SANS, marginBottom: 6 }}>{g.group}</div>
                  <KVTable rows={(g.items || []).map((it: any) => ({ k: it.label, v: it.value, flag: it.flag }))} />
                </div>
              ))}
            </div>
          );
        })}
      </section>

      {/* ── Sources appendix ── */}
      {citer.footnotes.length > 0 && (
        <section data-section="sources" style={{ breakBefore: "page" }}>
          <SectionTitle>Sources</SectionTitle>
          <ol style={{ margin: 0, paddingLeft: 22 }}>
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
