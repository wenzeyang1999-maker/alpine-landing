/**
 * Print/PDF layout for an ODD report. Server-rendered to an HTML string and
 * turned into a PDF by /api/investor/report-pdf (headless Chromium → page.pdf).
 *
 * Reuses the SAME entity/org chart components as the web report (in print mode,
 * so the boxes drop their interactive dots). The narrative's inline citations
 * become numbered footnotes with a Sources appendix. Inline styles only — no
 * Tailwind — so the print HTML is fully self-contained.
 */
import React from "react";
import { getReportContent, topicNumbers } from "@/lib/investor/report-content";
import { getFundCharts } from "@/lib/app-portal/fund-charts";
import { EntityChart, OrgChart } from "@/components/app-portal/review/FundCharts";
import { makePrintCiter, type PrintCiter } from "@/lib/investor/print-citations";
import { ScoreGauge, AumBars, BenchmarkBars, MiniBenchmark } from "@/components/investor/PrintCharts";

/* eslint-disable @typescript-eslint/no-explicit-any */

const SEV: Record<string, string> = { HIGH: "#dc2626", MEDIUM: "#d97706", LOW: "#64748b" };
const SEV_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: "0 0 14px", paddingBottom: 8, borderBottom: `2px solid #1e3a5f` }}>{children}</h1>
  );
}

function OverviewBlock({ title, lines }: { title: string; lines: string[] }) {
  const filled = lines.filter(Boolean);
  if (filled.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{title}</div>
      {filled.map((l, i) => (
        <p key={i} style={{ fontSize: 10, lineHeight: 1.55, color: "#334155", margin: "0 0 5px" }}>{l}</p>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 10px", paddingLeft: 14, listStyle: "none" }}>
      {items.map((t, i) => (
        <li key={i} style={{ fontSize: 10, lineHeight: 1.5, color: "#334155", marginBottom: 5, position: "relative", paddingLeft: 10 }}>
          <span style={{ position: "absolute", left: -2, top: 6, width: 4, height: 4, borderRadius: 4, background: "#4f46e5" }} />
          {t}
        </li>
      ))}
    </ul>
  );
}

const INK = "#0f172a";
const MUTED = "#64748b";
const SUBTLE = "#94a3b8";
const BORDER = "#e2e8f0";
const RATING: Record<string, { bg: string; fg: string; label: string }> = {
  GREEN: { bg: "#dcfce7", fg: "#15803d", label: "ACCEPT" },
  YELLOW: { bg: "#fef3c7", fg: "#b45309", label: "WATCHLIST" },
  RED: { bg: "#fee2e2", fg: "#b91c1c", label: "FLAG" },
};
const FLAG_DOT: Record<string, string> = { green: "#16a34a", yellow: "#d97706", red: "#dc2626" };

function flagColor(flag?: string) {
  return flag ? FLAG_DOT[flag] : undefined;
}

// ── Narrative (findings) → print blocks with footnote markers ─────────────────
// A direct function (not a component) so it runs EAGERLY during the document
// body — populating the footnote collector before the Sources appendix reads it.
// (A child component would render after the parent, leaving the appendix empty.)
function renderPrintFindings(text: string, citer: PrintCiter) {
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  let bullets: string[] = [];
  let key = 0;
  const flushPara = () => {
    if (para.length) {
      out.push(
        <p key={`p${key++}`} style={{ fontSize: 10.5, lineHeight: 1.65, color: "#334155", margin: "0 0 8px", textAlign: "justify" }}>
          {citer.render(para.join(" "))}
        </p>,
      );
      para = [];
    }
  };
  const flushBullets = () => {
    if (bullets.length) {
      out.push(
        <ul key={`u${key++}`} style={{ margin: "0 0 8px 18px", padding: 0 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 10.5, lineHeight: 1.6, color: "#334155", marginBottom: 2 }}>
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
        <h4 key={`h${key++}`} style={{ fontSize: 11, fontWeight: 700, color: INK, margin: "12px 0 5px" }}>
          {line.slice(4)}
        </h4>,
      );
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

// ── Evidence table ───────────────────────────────────────────────────────────
function EvidenceTable({ groups }: { groups: any[] }) {
  if (!groups || groups.length === 0) return null;
  return (
    <div style={{ marginTop: 10 }}>
      {groups.map((g: any, gi: number) => (
        <div key={gi} style={{ marginBottom: 8, breakInside: "avoid" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: INK, marginBottom: 2 }}>{g.group}</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9.5 }}>
            <tbody>
              {(g.items || []).map((it: any, ii: number) => (
                <tr key={ii}>
                  <td style={{ padding: "3px 8px 3px 0", color: MUTED, verticalAlign: "top", width: "34%", borderBottom: `1px solid ${BORDER}` }}>{it.label}</td>
                  <td style={{ padding: "3px 8px 3px 0", color: INK, verticalAlign: "top", borderBottom: `1px solid ${BORDER}` }}>
                    {flagColor(it.flag) && (
                      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 9, background: flagColor(it.flag), marginRight: 5, verticalAlign: "middle" }} />
                    )}
                    {it.value}
                  </td>
                  <td style={{ padding: "3px 0", color: SUBTLE, verticalAlign: "top", width: "22%", fontSize: 8.5, textAlign: "right", borderBottom: `1px solid ${BORDER}` }}>{it.source || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ── Full document ─────────────────────────────────────────────────────────────
export function ReportPrintDocument({ slug, recipient, date }: { slug: string; recipient?: string; date: string }) {
  const content = getReportContent(slug);
  if (!content) return <div>Report not found.</div>;
  const { entry, topicData, mock } = content;
  const charts = getFundCharts(entry.dataKey);
  const nums = topicNumbers(topicData);
  const citer = makePrintCiter();
  const r = RATING[entry.rating] || RATING.YELLOW;
  const fund = (mock as any)?.fund || {};
  const ros: any[] = Array.isArray((mock as any)?.risk_observations) ? (mock as any).risk_observations : [];
  const rosSorted = [...ros].sort((a, b) => (SEV_ORDER[a.severity] ?? 3) - (SEV_ORDER[b.severity] ?? 3));
  const strengths: any[] = Array.isArray((mock as any)?.strengths) ? (mock as any).strengths : [];
  const perf: any = (mock as any)?.fund_performance || {};
  const peer: any = (mock as any)?.peer_comparison || {};
  const terms: any = perf.fund_terms || {};
  const requiredBeforeClose = rosSorted.filter((o) => o.severity === "HIGH");
  const postClose = rosSorted.filter((o) => o.severity !== "HIGH");

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: INK }}>
      {/* Cover */}
      <section style={{ breakAfter: "page", padding: "40px 0" }}>
        <div style={{ borderBottom: `3px solid #1e3a5f`, paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", color: MUTED, fontWeight: 700 }}>ALPINE · OPERATIONAL DUE DILIGENCE</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 10, lineHeight: 1.15 }}>{entry.fundName}</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{entry.manager}</div>
        </div>
        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Strategy", entry.strategy],
              ["Assets under management", fund.aum || "—"],
              ["Domicile", fund.domicile || "—"],
              ["ODD score", `${entry.oddScore} / 100${fund.odd_percentile ? ` · ${fund.odd_percentile} percentile` : ""}`],
            ].map(([k, v]) => (
              <tr key={k as string}>
                <td style={{ padding: "6px 0", color: MUTED, width: "40%" }}>{k}</td>
                <td style={{ padding: "6px 0", fontWeight: 600 }}>{v}</td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: "6px 0", color: MUTED }}>Overall assessment</td>
              <td style={{ padding: "6px 0" }}>
                <span style={{ background: r.bg, color: r.fg, fontWeight: 700, fontSize: 11, padding: "3px 10px", borderRadius: 4, fontFamily: "sans-serif" }}>{r.label}</span>
              </td>
            </tr>
          </tbody>
        </table>
        {fund.recommendation_summary && (
          <p style={{ fontSize: 11.5, lineHeight: 1.6, color: "#334155", marginTop: 22 }}>
            Alpine <span dangerouslySetInnerHTML={{ __html: fund.recommendation_summary }} />
          </p>
        )}
        <div style={{ marginTop: 40, fontSize: 10, color: SUBTLE }}>
          <div style={{ color: "#b91c1c", fontWeight: 700, letterSpacing: "0.1em" }}>CONFIDENTIAL</div>
          <div style={{ marginTop: 4 }}>Prepared {date}{recipient ? ` for ${recipient}` : ""}. Sources are footnoted; see the appendix.</div>
        </div>
      </section>

      {/* Overview */}
      <section style={{ breakAfter: "page" }}>
        <PageTitle>Overview</PageTitle>
        <div style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 18 }}>
          <ScoreGauge score={entry.oddScore} label={r.label} />
          <div style={{ flex: 1 }}>
            {fund.recommendation_summary && (
              <p style={{ fontSize: 11, lineHeight: 1.6, color: "#334155", margin: 0 }}>
                Alpine <span dangerouslySetInnerHTML={{ __html: fund.recommendation_summary }} />
              </p>
            )}
          </div>
          {perf.aum_history && perf.aum_history.length > 0 && <AumBars data={perf.aum_history} title="AUM by vintage ($M)" />}
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          <div style={{ flex: 1 }}>
            <OverviewBlock
              title="Manager"
              lines={[
                `${entry.manager} — ${entry.strategy.toLowerCase()}.`,
                [charts?.org?.caption ? charts.org.caption.replace(/^Management organization · /, "") : "", fund.domicile].filter(Boolean).join(" · "),
              ]}
            />
            <OverviewBlock
              title="Fund"
              lines={[
                `${entry.fundName}${fund.domicile ? `, ${fund.domicile}` : ""}.`,
                [fund.aum ? `Assets: ${fund.aum}` : "", terms.minimum_investment ? `Min ${terms.minimum_investment}` : "", terms.nav_frequency ? `${terms.nav_frequency} NAV` : ""].filter(Boolean).join(" · "),
              ]}
            />
            <OverviewBlock
              title="Controls"
              lines={[
                [terms.administrator ? `Administrator: ${terms.administrator}` : "", terms.auditor ? `Auditor: ${terms.auditor}` : ""].filter(Boolean).join(". "),
                perf.fees ? `Fees: ${perf.fees.management_fee} mgmt · ${perf.fees.performance_fee} carry${perf.fees.hurdle_rate && perf.fees.hurdle_rate !== "None" ? ` · ${perf.fees.hurdle_rate} hurdle` : ""}.` : "",
              ]}
            />
          </div>
          <div style={{ flex: 1 }}>
            {strengths.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d", marginBottom: 4 }}>Strengths</div>
                <BulletList items={strengths.slice(0, 5).map((s: any) => s.title)} />
              </>
            )}
            {rosSorted.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#b91c1c", marginBottom: 4 }}>Key Risks</div>
                <BulletList items={rosSorted.slice(0, 6).map((o: any) => o.title)} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section style={{ breakBefore: "page" }}>
        <PageTitle>Assessment</PageTitle>
        {fund.recommendation_summary && (
          <p style={{ fontSize: 11, lineHeight: 1.65, color: "#334155", marginTop: 0 }}>
            Alpine <span dangerouslySetInnerHTML={{ __html: fund.recommendation_summary }} />
          </p>
        )}
        {peer.benchmark_comparison && peer.benchmark_comparison.length > 0 && (
          <div style={{ margin: "16px 0", padding: "12px 14px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#f8fafc", breakInside: "avoid" }}>
            <BenchmarkBars data={peer.benchmark_comparison} title="Fund vs. peer benchmark (0–100)" />
          </div>
        )}
        {fund.conditions_summary && (
          <>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: "14px 0 4px" }}>Conditions</h3>
            <p style={{ fontSize: 10.5, lineHeight: 1.6, color: "#334155", margin: 0 }} dangerouslySetInnerHTML={{ __html: fund.conditions_summary }} />
          </>
        )}
      </section>

      {/* Risks */}
      {rosSorted.length > 0 && (
        <section style={{ breakBefore: "page" }}>
          <PageTitle>Risks</PageTitle>
          {rosSorted.map((o: any) => (
            <div key={o.id} style={{ marginBottom: 12, breakInside: "avoid", borderLeft: `3px solid ${SEV[o.severity] || "#64748b"}`, paddingLeft: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: SEV[o.severity] || "#64748b", padding: "1px 6px", borderRadius: 3, fontFamily: "sans-serif" }}>{o.severity}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{o.title}</span>
              </div>
              <p style={{ fontSize: 9.5, lineHeight: 1.5, color: "#475569", margin: "3px 0 0" }}>{o.detail}</p>
              {o.benchmark && (
                <MiniBenchmark
                  portfolio={o.benchmark.portfolio_pct}
                  portfolioLabel={(o.benchmark.portfolio_label || "").split(" ").slice(0, 3).join(" ")}
                  industry={o.benchmark.industry_pct}
                  outlier={o.benchmark.is_outlier}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Alpine Ratings */}
      <section style={{ breakBefore: "page" }}>
        <PageTitle>Alpine Ratings</PageTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <tbody>
            {nums.map((n, i) => {
              const t = topicData[n];
              const tr = RATING[(t.rating || "").toUpperCase()] || RATING.YELLOW;
              return (
                <tr key={n} style={{ background: i % 2 ? "#f8fafc" : "#fff" }}>
                  <td style={{ padding: "7px 10px", color: "#0f172a", borderBottom: `1px solid ${BORDER}` }}>{i + 1}. {t.name}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${BORDER}`, width: 120 }}>
                    <span style={{ background: tr.bg, color: tr.fg, fontWeight: 700, fontSize: 9.5, padding: "2px 9px", borderRadius: 4, fontFamily: "sans-serif" }}>{tr.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Remediation & Monitoring */}
      {(requiredBeforeClose.length > 0 || postClose.length > 0) && (
        <section style={{ breakBefore: "page" }}>
          <PageTitle>Remediation &amp; Monitoring</PageTitle>
          {requiredBeforeClose.length > 0 && (
            <>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#b91c1c", margin: "0 0 6px" }}>Required Before Close</h3>
              {requiredBeforeClose.map((o: any) => (
                <div key={o.id} style={{ marginBottom: 8, breakInside: "avoid" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#0f172a" }}>{o.title}</div>
                  {o.remediation && <p style={{ fontSize: 9.5, lineHeight: 1.5, color: "#475569", margin: "2px 0 0" }}>{o.remediation}</p>}
                </div>
              ))}
            </>
          )}
          {postClose.length > 0 && (
            <>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#b45309", margin: "14px 0 6px" }}>Post-Close Monitoring</h3>
              {postClose.map((o: any) => (
                <div key={o.id} style={{ marginBottom: 6, breakInside: "avoid" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a" }}>{o.title}</div>
                  {o.remediation && <p style={{ fontSize: 9, lineHeight: 1.45, color: "#64748b", margin: "1px 0 0" }}>{o.remediation}</p>}
                </div>
              ))}
            </>
          )}
        </section>
      )}

      {/* Chapters */}
      {nums.map((n, i) => {
        const topic = topicData[n];
        const tr = RATING[(topic.rating || "").toUpperCase()] || null;
        return (
          <section key={n} style={{ breakBefore: "page" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: 6, marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 10, color: SUBTLE, fontFamily: "sans-serif" }}>Chapter {i + 1}</span>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: "2px 0 0" }}>{topic.name}</h2>
              </div>
              {tr && <span style={{ background: tr.bg, color: tr.fg, fontWeight: 700, fontSize: 9.5, padding: "2px 8px", borderRadius: 4, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{tr.label}</span>}
            </div>

            {charts && charts.orgTopic === n && (
              <div style={{ marginBottom: 12, breakInside: "avoid" }}>
                <OrgChart data={charts.org} print />
              </div>
            )}
            {charts && charts.entityTopic === n && (
              <div style={{ marginBottom: 12, breakInside: "avoid" }}>
                <EntityChart data={charts.entity} print />
              </div>
            )}

            {topic.findings && renderPrintFindings(topic.findings, citer)}

            {topic.dataPoints && topic.dataPoints.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "14px 0 4px", fontFamily: "sans-serif" }}>VERIFIED EVIDENCE</div>
                <EvidenceTable groups={topic.dataPoints} />
              </>
            )}
          </section>
        );
      })}

      {/* Sources appendix */}
      {citer.footnotes.length > 0 && (
        <section style={{ breakBefore: "page" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, borderBottom: `1px solid ${BORDER}`, paddingBottom: 6, marginBottom: 10 }}>Sources</h2>
          <ol style={{ margin: 0, paddingLeft: 22 }}>
            {citer.footnotes.map((f) => (
              <li key={f.n} style={{ fontSize: 9.5, lineHeight: 1.5, color: "#334155", marginBottom: 3, breakInside: "avoid" }}>
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
