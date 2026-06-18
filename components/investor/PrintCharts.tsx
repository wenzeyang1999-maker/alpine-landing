/**
 * Lightweight inline-SVG charts for the print/PDF report. Pure functions, no
 * hooks, no "use client" — they server-render cleanly inside ReportPrintDocument.
 */
import React from "react";

const INK = "#0f172a";
const MUTED = "#64748b";
const SUBTLE = "#94a3b8";
const BORDER = "#e2e8f0";
const NAVY = "#1f3a5f"; // brand spine colour — restrained highlight for charts
const SLATE = "#cbd5e1";

const RATING_HEX: Record<string, string> = { GREEN: "#16a34a", YELLOW: "#d97706", RED: "#dc2626" };
function scoreColor(score: number): string {
  if (score >= 75) return RATING_HEX.GREEN;
  if (score >= 55) return RATING_HEX.YELLOW;
  return RATING_HEX.RED;
}

/** Donut gauge for the overall ODD score (X / 100). */
export function ScoreGauge({ score, label }: { score: number; label?: string }) {
  const size = 88;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const col = scoreColor(score);
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
          {/* Restrained navy arc — length encodes the score; the verdict label
              below carries the colour cue, so the ring stays calm. */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={NAVY}
            strokeWidth={stroke}
            strokeDasharray={`${c * pct} ${c}`}
          />
        </svg>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 21, fontWeight: 700, color: INK, fontFamily: "sans-serif", lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 8, color: SUBTLE, fontFamily: "sans-serif" }}>/ 100</span>
        </div>
      </div>
      {label && <div style={{ marginTop: 7, fontSize: 8.5, fontWeight: 700, color: col, fontFamily: "sans-serif", textAlign: "center", letterSpacing: "0.08em" }}>{label}</div>}
    </div>
  );
}

/** Vertical bar chart of AUM over time (values in $M). */
export function AumBars({ data, title }: { data: { date: string; aum: number }[]; title?: string }) {
  if (!data || data.length === 0) return null;
  const W = 320;
  const H = 78;
  const pad = 18;
  const max = Math.max(...data.map((d) => d.aum)) || 1;
  const bw = (W - pad * 2) / data.length;
  return (
    <div>
      {title && <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, fontFamily: "sans-serif", marginBottom: 4 }}>{title}</div>}
      <svg width={W} height={H + 16} style={{ display: "block" }}>
        <line x1={pad} y1={H} x2={W - pad} y2={H} stroke={BORDER} strokeWidth={1} />
        {data.map((d, i) => {
          const h = (d.aum / max) * (H - 22);
          const x = pad + i * bw + 3;
          const y = H - h;
          const yr = d.date.slice(0, 4);
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw - 6} height={h} rx={2} fill={i === data.length - 1 ? NAVY : SLATE} />
              <text x={x + (bw - 6) / 2} y={y - 3} textAnchor="middle" fontSize={7.5} fill={MUTED} fontFamily="sans-serif">{`$${d.aum}M`}</text>
              <text x={x + (bw - 6) / 2} y={H + 11} textAnchor="middle" fontSize={7.5} fill={SUBTLE} fontFamily="sans-serif">{yr.slice(2)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Diverging fund-vs-peer comparison: one row per dimension, two bars on a 0-100 scale. */
export function BenchmarkBars({ data, title }: { data: { metric: string; fund: number; peer_avg: number; delta: number }[]; title?: string }) {
  if (!data || data.length === 0) return null;
  const barMax = 220;
  return (
    <div>
      {title && <div style={{ fontSize: 10, fontWeight: 700, color: INK, marginBottom: 8 }}>{title}</div>}
      <div style={{ display: "flex", gap: 14, fontSize: 8.5, color: MUTED, fontFamily: "sans-serif", marginBottom: 6 }}>
        <span><span style={{ display: "inline-block", width: 8, height: 8, background: NAVY, borderRadius: 2, marginRight: 4 }} />Fund</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, background: SLATE, borderRadius: 2, marginRight: 4 }} />Peer average</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {data.map((d, i) => {
            const better = d.delta >= 0;
            return (
              <tr key={i}>
                <td style={{ fontSize: 9, color: INK, padding: "2.5px 8px 2.5px 0", width: "32%", verticalAlign: "middle" }}>{d.metric}</td>
                <td style={{ padding: "2.5px 0", verticalAlign: "middle" }}>
                  <div style={{ position: "relative", height: 13 }}>
                    <div style={{ position: "absolute", top: 1, left: 0, height: 5, width: (d.fund / 100) * barMax, background: NAVY, borderRadius: 3 }} />
                    <div style={{ position: "absolute", top: 7, left: 0, height: 5, width: (d.peer_avg / 100) * barMax, background: SLATE, borderRadius: 3 }} />
                  </div>
                </td>
                {/* Signed delta in neutral ink — no green/red, no ▲▼ arrows */}
                <td style={{ fontSize: 8.5, fontWeight: 600, fontFamily: "sans-serif", color: MUTED, textAlign: "right", width: 52, verticalAlign: "middle" }}>
                  {better ? "+" : ""}{d.delta}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Tiny inline benchmark for a single risk: fund's peer-cohort % vs industry %. */
export function MiniBenchmark({ portfolio, portfolioLabel, industry, outlier }: { portfolio: number; portfolioLabel?: string; industry: number; outlier?: boolean }) {
  const W = 160;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <svg width={W} height={16}>
        <rect x={0} y={5} width={W} height={6} rx={3} fill={BORDER} />
        <rect x={0} y={5} width={(portfolio / 100) * W} height={6} rx={3} fill={outlier ? RATING_HEX.RED : NAVY} />
        <line x1={(industry / 100) * W} y1={2} x2={(industry / 100) * W} y2={14} stroke={INK} strokeWidth={1.5} />
      </svg>
      <span style={{ fontSize: 8, color: MUTED, fontFamily: "sans-serif" }}>
        {portfolio}% {portfolioLabel ? portfolioLabel : "of peers"} · {industry}% industry{outlier ? " · outlier" : ""}
      </span>
    </div>
  );
}
