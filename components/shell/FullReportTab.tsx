"use client";

import { useState } from "react";
import { downloadDemoFile } from "@/lib/demo-downloads";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Types ────────────────────────────────────────────────────────────────────

interface TopicDataGroup {
  group: string;
  items: Array<{ label: string; value: string; source?: string; flag?: string }>;
}

interface TopicInfo {
  name: string;
  rating: string;
  summary: string;
  findings?: string;
  dataPoints: TopicDataGroup[];
}

interface FullReportTabProps {
  topicData: Record<number, TopicInfo>;
  riskObservations: Array<{ id: string; severity: string; title: string; detail: string; topic?: string; topics?: string[] }>;
  fundName?: string;
  managerName?: string;
  reviewDate?: string;
  overallRating?: string;
  alpineReviewId?: string | null;
}

// ── Constants ────────────────────────────────────────────────────────────────

const TOPIC_ABBREVS: Record<number, string> = {
  1: "GOV", 2: "TERMS", 3: "REG", 4: "SVCP", 5: "INV",
  6: "TRADE", 7: "VAL", 8: "TECH", 9: "FIN", 10: "ASSET", 11: "LEGAL", 12: "RPT",
};

function ratingBadge(rating: string): string {
  const r = (rating || "").toUpperCase();
  if (r === "GREEN") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  if (r === "YELLOW") return "text-amber-500 bg-amber-500/10 border-amber-500/30";
  if (r === "RED") return "text-red-500 bg-red-500/10 border-red-500/30";
  return "text-br-text-muted bg-br-surface border-br";
}

function ratingDot(rating: string): string {
  const r = (rating || "").toUpperCase();
  if (r === "GREEN") return "bg-emerald-400";
  if (r === "YELLOW") return "bg-amber-400";
  if (r === "RED") return "bg-red-400";
  return "bg-br-text-muted";
}

// ── Cover Section ────────────────────────────────────────────────────────────

function CoverSection({ fundName, managerName, reviewDate, overallRating, topicData }: {
  fundName: string; managerName: string; reviewDate: string; overallRating: string; topicData: Record<number, TopicInfo>;
}) {
  const ratings = Object.values(topicData);
  const greenCount = ratings.filter((t) => t.rating === "GREEN").length;
  const yellowCount = ratings.filter((t) => t.rating === "YELLOW").length;
  const redCount = ratings.filter((t) => t.rating === "RED").length;

  const overallColor = overallRating === "ACCEPT" ? "text-emerald-400" : overallRating === "FLAG" ? "text-red-400" : "text-amber-400";
  const overallBg = overallRating === "ACCEPT" ? "bg-emerald-500/10" : overallRating === "FLAG" ? "bg-red-500/10" : "bg-amber-500/10";

  return (
    <div className="bg-br-card border border-br rounded-xl overflow-hidden">
      {/* Co-branding header bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#1A1A2E] via-[#1E2A3A] to-[#1A1A2E] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-amber-400 to-purple-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 3l8 16H4L12 3z" /><path d="M10 14l2-4 2 4" /></svg>
          </div>
          <div>
            <span className="text-[14px] font-heading font-bold text-[#F5F0E8]">Alpine Due Diligence</span>
            <span className="text-[10px] text-[#F5F0E8]/50 ml-2">ODD Report</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/alpine-icon.svg" alt="Alpine" className="h-5 opacity-70" />
        </div>
      </div>

      {/* Fund info + rating ring */}
      <div className="px-6 py-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-[20px] font-heading font-bold text-br-text-primary">{fundName}</h1>
            <p className="text-[13px] text-br-text-secondary mt-0.5">{managerName}</p>
            <p className="text-[11px] text-br-text-muted mt-0.5">Report Date: {reviewDate}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className={`text-[16px] font-heading font-bold px-4 py-1.5 rounded-lg border ${overallColor} ${overallBg}`}>
              {overallRating}
            </span>
            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono">
              <span className="text-emerald-400">{greenCount}G</span>
              <span className="text-amber-400">{yellowCount}Y</span>
              <span className="text-red-400">{redCount}R</span>
            </div>
          </div>
        </div>

        {/* 12-topic strip */}
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(topicData).map(([num, topic]) => {
            const r = topic.rating.toUpperCase();
            const bg = r === "GREEN" ? "bg-emerald-400/15" : r === "RED" ? "bg-red-400/15" : "bg-amber-400/15";
            const text = r === "GREEN" ? "text-emerald-400" : r === "RED" ? "text-red-400" : "text-amber-400";
            return (
              <div key={num} className={`flex flex-col items-center px-2 py-1 rounded-lg ${bg}`}>
                <span className={`text-[9px] font-mono font-semibold ${text}`}>{TOPIC_ABBREVS[parseInt(num)]}</span>
                <span className={`text-[8px] font-mono ${text}`}>{r.charAt(0)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Topic Section (collapsible) ──────────────────────────────────────────────

function TopicSection({ number, topic, riskObservations }: {
  number: number; topic: TopicInfo; riskObservations: any[];
}) {
  const [expanded, setExpanded] = useState(number <= 3);
  const topicRisks = riskObservations.filter((r: any) =>
    r.topics?.includes(topic.name) || r.topics?.includes(`Topic ${number}`) || r.topic === topic.name
  );

  return (
    <div className="bg-br-card border border-br rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-br-card-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${ratingDot(topic.rating)}`} />
          <span className="text-[10px] font-mono text-br-text-muted">T{number}</span>
          <span className="text-[13px] font-heading font-semibold text-br-text-primary">{topic.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${ratingBadge(topic.rating)}`}>{topic.rating}</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-br-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}><path d="M3 4.5l3 3 3-3" /></svg>
      </button>

      {expanded && (
        <div className="border-t border-br">
          {/* Summary */}
          <div className="px-5 py-3 bg-br-surface/50">
            <p className="text-[12px] text-br-text-secondary leading-relaxed italic">{topic.summary}</p>
          </div>

          {/* Narrative findings with subsection headings */}
          {topic.findings && (
            <div className="px-5 py-4 space-y-3">
              {topic.findings.split("\n\n").map((block, bi) => {
                const trimmed = block.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("### ")) {
                  return (
                    <div key={bi} className="flex items-center gap-2 pt-2">
                      <div className="w-[3px] h-4 rounded-full bg-alpine-violet" />
                      <h4 className="text-[13px] font-heading font-semibold text-br-text-primary">{trimmed.slice(4)}</h4>
                    </div>
                  );
                }
                return <p key={bi} className="text-[12px] text-br-text-secondary leading-relaxed">{trimmed}</p>;
              })}
            </div>
          )}

          {/* Data points */}
          {topic.dataPoints.length > 0 && (
            <div className="px-5 py-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {topic.dataPoints.map((group, gi) => (
                  <div key={gi} className={`bg-br-surface/30 border border-br/30 rounded-lg overflow-hidden ${
                    gi === topic.dataPoints.length - 1 && topic.dataPoints.length % 2 !== 0 ? "lg:col-span-2" : ""
                  }`}>
                    <div className="px-3 py-1.5 border-b border-br/20">
                      <h4 className="text-[10px] font-heading font-semibold text-br-text-muted uppercase tracking-wider">{group.group}</h4>
                    </div>
                    <div className="divide-y divide-br/10">
                      {group.items.map((dp, i) => (
                        <div key={i} className="px-3 py-1.5 flex items-start gap-2">
                          <span className="text-[10px] text-br-text-muted w-[120px] flex-shrink-0 pt-0.5 font-medium">{dp.label}</span>
                          <span className="text-[11px] text-br-text-primary leading-snug flex-1">
                            {dp.value}
                            {dp.flag && (
                              <span className={`ml-1 text-[10px] ${
                                dp.flag === "green" ? "text-emerald-500" : dp.flag === "red" ? "text-red-500" : "text-amber-500"
                              }`}>{dp.flag === "green" ? "✓" : dp.flag === "red" ? "✗" : "⚠"}</span>
                            )}
                          </span>
                          {dp.source && (
                            <span className="text-[9px] text-br-text-muted/60 flex-shrink-0 font-mono">{dp.source}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk observations for this topic */}
          {topicRisks.length > 0 && (
            <div className="px-5 py-3 border-t border-br/30">
              {topicRisks.map((ro: any) => (
                <div key={ro.id} className={`px-3 py-2 rounded-lg border-l-2 mb-2 ${
                  ro.severity === "HIGH" ? "border-red-400 bg-red-500/5" : "border-amber-400 bg-amber-500/5"
                }`}>
                  <p className={`text-[11px] font-mono font-medium ${ro.severity === "HIGH" ? "text-red-400" : "text-amber-400"}`}>
                    {ro.id}: {ro.title}
                  </p>
                  <p className="text-[10px] text-br-text-muted mt-0.5 leading-relaxed">{ro.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function FullReportTab({
  topicData,
  riskObservations,
  fundName = "Ridgeline Capital Partners, LLC",
  managerName = "David Chen, CFA — Chief Investment Officer",
  reviewDate = "March 2026",
  overallRating = "WATCHLIST",
  alpineReviewId,
}: FullReportTabProps) {
  const [activeTab, setActiveTab] = useState<"full" | "brief" | "call" | "deck">("full");

  const conditions = [
    "Hire a dedicated Chief Compliance Officer with independent reporting line (within 90 days)",
    "Implement pre-clearance system for personal securities transactions (within 60 days)",
    "Draft and adopt formal written succession plan approved by Fund Board (within 120 days)",
    "Reconstitute Valuation Committee to achieve majority independence (within 90 days)",
  ];

  const keyStrengths = [
    "34 full-time staff with experienced leadership (CIO: 24 years, COO: 15 years)",
    "Goldman Sachs and Morgan Stanley as dual prime brokers — institutional-grade custody",
    "Ernst & Young LLP — clean, unqualified audit opinions for FY2023 and FY2024",
    "SEC registration current with no disciplinary actions or sanctions",
    "Institutional OMS (Eze) with T+1 reconciliation and segregation of duties",
  ];

  const keyConcerns = [
    { id: "RO-057", text: "No Dedicated Chief Compliance Officer", severity: "HIGH" },
    { id: "RO-059", text: "No Pre-Clearance for Personal Trading", severity: "HIGH" },
    { id: "RO-061", text: "Expert Network Use Without Compliance Oversight", severity: "HIGH" },
    { id: "RO-006", text: "No Formal Succession Plan", severity: "MEDIUM" },
    { id: "RO-007", text: "Key Person Concentration — David Chen sole decision-maker", severity: "MEDIUM" },
    { id: "RO-024", text: "Valuation Committee Not Majority Independent", severity: "MEDIUM" },
  ];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-[2px] bg-br-card rounded-lg p-[2px]">
          {[
            { id: "full" as const, label: "Full Report" },
            { id: "brief" as const, label: "Executive Brief" },
            { id: "call" as const, label: "Call Prep" },
            { id: "deck" as const, label: "IC Deck" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-br-surface text-br-text-primary"
                  : "text-br-text-muted hover:text-br-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Generated
          </span>
          <button
            onClick={() => {
              if (alpineReviewId) {
                window.open(`/api/reviews/${alpineReviewId}/output/pdf?report_type=full`, "_blank");
              } else {
                downloadDemoFile("ridgeline_annual_report_2024.pdf", "Ridgeline_ODD_Report.pdf");
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-alpine-violet text-white text-[11px] font-medium hover:bg-alpine-violet-light transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {activeTab === "full" ? (
        <div className="space-y-4 max-w-[900px]">
          {/* Cover */}
          <CoverSection
            fundName={fundName}
            managerName={managerName}
            reviewDate={reviewDate}
            overallRating={overallRating}
            topicData={topicData}
          />

          {/* Executive Summary */}
          <div className="bg-br-card border border-br rounded-xl p-5">
            <h2 className="text-[15px] font-heading font-semibold text-br-text-primary mb-3">Executive Summary</h2>
            <p className="text-[12px] text-br-text-secondary leading-relaxed mb-4">
              Alpine&apos;s assessment results in a <strong className="text-amber-400">WATCHLIST</strong> rating. The fund demonstrates institutional-quality infrastructure across the majority of operations, including recognized service providers, a well-documented investment strategy, and clean regulatory and audit records. However, material deficiencies in the compliance program, combined with key person concentration and gaps in the valuation governance framework, warrant conditions before Alpine can assign an ACCEPT rating.
            </p>

            {/* Key Strengths */}
            <h3 className="text-[12px] font-heading font-semibold text-br-text-primary mb-2">Key Strengths</h3>
            <ul className="space-y-1.5 mb-4">
              {keyStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-br-text-secondary">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            {/* Key Concerns */}
            <h3 className="text-[12px] font-heading font-semibold text-br-text-primary mb-2">Key Concerns</h3>
            <div className="space-y-1.5 mb-4">
              {keyConcerns.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-[11px]">
                  <span className={`font-mono font-medium flex-shrink-0 ${c.severity === "HIGH" ? "text-red-400" : "text-amber-400"}`}>{c.id}</span>
                  <span className="text-br-text-secondary">{c.text}</span>
                </div>
              ))}
            </div>

            {/* Conditions */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-3">
              <h3 className="text-[12px] font-heading font-semibold text-amber-400 mb-2">Conditions for ACCEPT Upgrade</h3>
              <ol className="space-y-1.5">
                {conditions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-br-text-secondary">
                    <span className="text-amber-400 font-mono font-medium flex-shrink-0">{i + 1}.</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 12 Topic Sections */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-heading font-semibold text-br-text-muted uppercase tracking-wider">Topic Analysis</h2>
            {Object.entries(topicData).map(([num, topic]) => (
              <TopicSection
                key={num}
                number={parseInt(num)}
                topic={topic}
                riskObservations={riskObservations}
              />
            ))}
          </div>

          {/* Appendix: Risk Observation Index */}
          <div className="bg-br-card border border-br rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-br bg-br-surface">
              <h2 className="text-[13px] font-heading font-semibold text-br-text-primary">Appendix A: Risk Observation Index</h2>
            </div>
            <div className="divide-y divide-br/30">
              {riskObservations.map((ro: any) => (
                <div key={ro.id} className="px-5 py-2.5 flex items-start gap-3">
                  <span className={`text-[10px] font-mono font-bold flex-shrink-0 ${ro.severity === "HIGH" ? "text-red-400" : "text-amber-400"}`}>{ro.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-br-text-primary">{ro.title}</p>
                    <p className="text-[10px] text-br-text-muted mt-0.5">{ro.detail}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                    ro.severity === "HIGH" ? "text-red-500 bg-red-500/10" : "text-amber-500 bg-amber-500/10"
                  }`}>{ro.severity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Appendix: Source Reference Index */}
          <div className="bg-br-card border border-br rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-br bg-br-surface">
              <h2 className="text-[13px] font-heading font-semibold text-br-text-primary">Appendix B: Source Reference Index</h2>
            </div>
            <div className="divide-y divide-br/30">
              {[
                { label: "Private Placement Memorandum",        file: "ridgeline_ppm.pdf",              type: "Fund Document" },
                { label: "Due Diligence Questionnaire (2026)",  file: "ridgeline_ddq_2026.pdf",         type: "Fund Document" },
                { label: "Form ADV Part 2A",                    file: "ridgeline_form_adv_2a.pdf",      type: "Regulatory Filing" },
                { label: "Limited Partnership Agreement",        file: "ridgeline_lpa.pdf",              type: "Fund Document" },
                { label: "Compliance Manual",                   file: "ridgeline_compliance_manual.pdf",type: "Compliance" },
                { label: "Audited Financial Statements FY2024", file: "ridgeline_financials_fy2024.pdf",type: "Financial" },
                { label: "Organization Chart",                  file: "ridgeline_org_chart.pdf",        type: "Fund Document" },
                { label: "Code of Ethics",                      file: "ridgeline_code_of_ethics.pdf",   type: "Compliance" },
                { label: "Valuation Policy",                    file: "ridgeline_valuation_policy.pdf", type: "Operations" },
                { label: "BCP/DR Plan",                         file: "ridgeline_bcp.pdf",              type: "Operations" },
                { label: "Insurance Coverage Summary",          file: "ridgeline_insurance.pdf",        type: "Insurance" },
                { label: "Side Letter Summary",                 file: "ridgeline_side_letters.pdf",     type: "Fund Document" },
                { label: "SEC EDGAR — IAPD",                   file: "",                               type: "SEC Verification" },
                { label: "Manager Due Diligence Call",          file: "",                               type: "Manager Interview" },
              ].map((ref, i) => (
                <div key={i} className="px-5 py-2 flex items-center justify-between hover:bg-br-card-hover/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-[10px] font-mono text-br-text-muted text-right">{i + 1}</span>
                    <div>
                      <span className="text-[11px] text-br-text-primary">{ref.label}</span>
                      <span className="text-[9px] text-br-text-muted ml-2">{ref.type}</span>
                    </div>
                  </div>
                  {ref.file && (
                    <button
                      onClick={() => downloadDemoFile(ref.file)}
                      className="text-[10px] text-alpine-violet hover:text-alpine-violet-light transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "brief" ? (
        <div className="bg-br-card border border-br rounded-xl p-6 max-w-[900px]">
          <h2 className="text-[15px] font-heading font-semibold text-br-text-primary mb-3">Executive Brief — Ridgeline Capital Partners</h2>
          <p className="text-[12px] text-br-text-secondary leading-relaxed mb-4">
            Overall rating: <strong className="text-amber-400">WATCHLIST</strong>. Of 12 topics assessed, 7 GREEN, 4 YELLOW, 1 RED. Material compliance gaps (no dedicated CCO, no pre-trade compliance) and key person concentration warrant 4 conditions for ACCEPT upgrade. Strong service providers (GS/MS prime, EY audit, Citco admin) and clean regulatory history partially offset operational deficiencies.
          </p>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h3 className="text-[12px] font-heading font-semibold text-amber-400 mb-2">4 Conditions for ACCEPT</h3>
            <ol className="space-y-1">
              {conditions.map((c, i) => (
                <li key={i} className="text-[11px] text-br-text-secondary flex gap-2">
                  <span className="text-amber-400 font-mono">{i + 1}.</span> {c}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : activeTab === "call" ? (
        <div className="bg-br-card border border-br rounded-xl p-6 max-w-[900px]">
          <h2 className="text-[15px] font-heading font-semibold text-br-text-primary mb-3">Call Preparation Notes</h2>
          <p className="text-[11px] text-br-text-muted mb-4">Discussion points for the Ridgeline Capital due diligence call.</p>
          <div className="space-y-3">
            {[
              { topic: "Compliance Program", questions: ["CCO hiring timeline and candidate profile", "Pre-clearance system implementation plan", "Expert network chaperoning policy"] },
              { topic: "Governance & Succession", questions: ["Written succession plan — when will it be drafted?", "Board composition changes planned?", "Key person insurance adequacy"] },
              { topic: "Valuation Committee", questions: ["Timeline for adding independent members", "Current mark dispute resolution process", "Level 3 asset classification methodology"] },
              { topic: "Technology & Cybersecurity", questions: ["Cybersecurity insurance coverage details", "Penetration testing frequency", "Incident response plan — last test date"] },
            ].map((section, i) => (
              <div key={i} className="bg-br-surface/50 rounded-lg p-3 border border-br/30">
                <h3 className="text-[12px] font-heading font-semibold text-br-text-primary mb-1.5">{section.topic}</h3>
                <ul className="space-y-1">
                  {section.questions.map((q, j) => (
                    <li key={j} className="text-[11px] text-br-text-secondary flex gap-2">
                      <span className="text-alpine-violet">•</span> {q}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-br-card border border-br rounded-xl p-8 text-center max-w-[900px]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-br-text-muted mb-3"><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M8 7h8M8 11h5" /></svg>
          <p className="text-[13px] text-br-text-secondary font-body mb-1">IC Presentation Deck</p>
          <p className="text-[11px] text-br-text-muted">Auto-generated slide deck for the Investment Committee — coming soon.</p>
        </div>
      )}
    </div>
  );
}
