"use client";

/**
 * Engine Stubs — placeholder components for the real Alpine ODD engine.
 * Replace these with real imports from the engine when it's integrated.
 */

import React from "react";

function EngineStubCard({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl border border-br bg-br-card text-center p-8">
      <div className="w-12 h-12 rounded-full bg-alpine-violet/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-alpine-violet">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <h3 className="text-[14px] font-heading font-semibold text-br-text-primary mb-1">{title}</h3>
      <p className="text-[12px] text-br-text-muted max-w-xs">
        {description || "This section is powered by the Alpine ODD engine. Engine integration coming soon."}
      </p>
      <div className="mt-4 px-3 py-1 rounded-full bg-alpine-violet/10 text-alpine-violet text-[11px] font-mono tracking-wider">
        ENGINE · PENDING INTEGRATION
      </div>
    </div>
  );
}

// ReviewProvider stub
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReviewProvider({ children }: { children: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}

// Page content stubs — accept any props so TypeScript doesn't complain
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SummaryPageContent(_props?: any) {
  return <EngineStubCard title="ODD Summary" description="Full AI-generated ODD summary with topic ratings, risk observations, and executive overview." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UploadPageContent(_props?: any) {
  return <EngineStubCard title="Document Upload" description="Upload fund documents (Form ADV, DDQ, Compliance Manual, etc.) for AI analysis." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AnalysisPageContent(_props?: any) {
  return <EngineStubCard title="Gap Analysis" description="12-topic parallel AI analysis: Governance, Compliance, Valuation, Trading, Technology, Operations, Risk, and more." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerificationPageContent(_props?: any) {
  return <EngineStubCard title="SEC Verification" description="Automated SEC IAPD lookup and Form ADV cross-verification against uploaded documents." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportPageContent(_props?: any) {
  return <EngineStubCard title="Report Generation" description="IC-ready ODD report generation via two-pass Claude AI review (Sonnet draft → Opus review)." />;
}
// ── Inline markdown renderer ───────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // H3
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={i} style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "20px 0 8px", letterSpacing: "-0.01em" }}>
          {trimmed.slice(4)}
        </h3>
      );
      i++; continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={i} style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "24px 0 10px" }}>
          {trimmed.slice(3)}
        </h2>
      );
      i++; continue;
    }

    // H1
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h1 key={i} style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "24px 0 12px" }}>
          {trimmed.slice(2)}
        </h1>
      );
      i++; continue;
    }

    // Table block
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const dataRows = tableLines.filter(l => !/^\|[\s\-|]+\|$/.test(l.trim()));
      const [headerRow, ...bodyRows] = dataRows;
      const parseRow = (row: string) =>
        row.split("|").slice(1, -1).map(c => c.trim());
      const headers = parseRow(headerRow || "");
      nodes.push(
        <div key={`tbl-${i}`} style={{ overflowX: "auto", margin: "12px 0 16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} style={{ textAlign: "left", padding: "6px 10px", background: "#f1f5f9", borderBottom: "2px solid #e2e8f0", fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8fafc" }}>
                  {parseRow(row).map((cell, ci) => (
                    <td key={ci} style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569", verticalAlign: "top" }}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ margin: "8px 0 12px 16px", padding: 0, listStyle: "disc", color: "#334155", fontSize: 12.5, lineHeight: 1.75 }}>
          {items.map((item, ii) => <li key={ii}>{renderInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Empty line — skip
    if (trimmed === "") { i++; continue; }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(
        <p key={`p-${i}`} style={{ margin: "0 0 12px", fontSize: 12.5, lineHeight: 1.75, color: "#334155" }}>
          {renderInline(paraLines.join(" "))}
        </p>
      );
    }
  }

  return <div style={{ padding: "20px 28px 24px" }}>{nodes}</div>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportViewer({ content, ...rest }: { content?: string; [key: string]: any }) {
  void rest;
  if (!content) return <EngineStubCard title="ODD Report" description="Full ODD report with ACCEPT/WATCHLIST/FLAG ratings and numbered risk observations." />;
  return <MarkdownRenderer content={content} />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CallPrepViewer(_props?: any) {
  return <EngineStubCard title="Analyst Callaration" description="AI-generated analyst call guide with targeted questions based on identified gaps." />;
}
