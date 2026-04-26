"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { TOPIC_DATA, RIDGELINE_MOCK, VAULT_DATA } from "@/lib/ridgeline-data";
import { ReportViewer } from "@/components/engine-stubs";
import { PlaceholderTab } from "./PlaceholderTab";
import { RefDot } from "./RefDot";
import { downloadDemoFile } from "@/lib/demo-downloads";

// ── SOURCE_META filename map for doc vault downloads ──────────────────────────
const DOC_FILENAME_MAP: Record<string, string> = {
  "Regulatory": "ridgeline_form_adv_2a.pdf",
  "Compliance": "ridgeline_compliance_manual.pdf",
  "Financial": "ridgeline_financials_fy2024.pdf",
  "Legal": "ridgeline_ppm.pdf",
  "Operations": "ridgeline_bcp.pdf",
  "Governance": "ridgeline_org_chart.pdf",
  "ODD Review": "ridgeline_ddq_2026.pdf",
};

const STATUS_COLORS: Record<string, string> = {
  reviewed: "text-emerald-400 bg-emerald-500/10",
  flagged: "text-red-400 bg-red-500/10",
  pending: "text-amber-400 bg-amber-500/10",
};

function DocVaultPanel({ docs, topicName, onClose }: { docs: any[]; topicName: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, animation: "fadeIn 0.15s ease" }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 520,
          background: "#0f1117", borderLeft: "1px solid rgba(255,255,255,0.08)",
          zIndex: 301, display: "flex", flexDirection: "column",
          animation: "slideInRight 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ background: "#161820", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb" }}>Relevant Documents</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{topicName} · {docs.length} document{docs.length !== 1 ? "s" : ""}</div>
            </div>
            <button
              onClick={onClose}
              style={{ color: "#6b7280", fontSize: 20, lineHeight: 1, padding: "2px 6px", background: "none", border: "none", cursor: "pointer" }}
              title="Close (Esc)"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Document list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {docs.map((doc: any) => (
            <div
              key={doc.id}
              style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-start", gap: 12 }}
            >
              {/* Icon */}
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb", marginBottom: 3 }}>{doc.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 6px" }}>{doc.category.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: "#6b7280" }}>{doc.uploaded_by}</span>
                  <span style={{ fontSize: 10, color: "#6b7280" }}>·</span>
                  <span style={{ fontSize: 10, color: "#6b7280" }}>{doc.date}</span>
                  {doc.pages && <span style={{ fontSize: 10, color: "#6b7280" }}>· {doc.pages}pp</span>}
                  {doc.size_kb && <span style={{ fontSize: 10, color: "#6b7280" }}>· {doc.size_kb >= 1000 ? (doc.size_kb / 1000).toFixed(1) + " MB" : doc.size_kb + " KB"}</span>}
                </div>
                {doc.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const, marginBottom: 6 }}>
                    {doc.tags.map((t: string) => (
                      <span key={t} style={{ fontSize: 9, color: "#7b2cbf", background: "rgba(123,44,191,0.1)", border: "1px solid rgba(123,44,191,0.2)", borderRadius: 3, padding: "1px 5px" }}>{t}</span>
                    ))}
                  </div>
                )}
                {doc.risk_flags?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                    {doc.risk_flags.map((f: string) => (
                      <span key={f} style={{ fontSize: 9, color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 3, padding: "1px 5px" }}>⚑ {f}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button
                    onClick={() => downloadDemoFile(DOC_FILENAME_MAP[doc.category] || "")}
                    style={{ fontSize: 10, fontWeight: 500, color: "#34d399", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 5, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download
                  </button>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: "4px 8px", borderRadius: 5, ...(STATUS_COLORS[doc.status] ? {} : {}), color: doc.status === "reviewed" ? "#34d399" : doc.status === "flagged" ? "#f87171" : "#fbbf24", background: doc.status === "reviewed" ? "rgba(52,211,153,0.08)" : doc.status === "flagged" ? "rgba(248,113,113,0.08)" : "rgba(251,191,36,0.08)", border: `1px solid ${doc.status === "reviewed" ? "rgba(52,211,153,0.2)" : doc.status === "flagged" ? "rgba(248,113,113,0.2)" : "rgba(251,191,36,0.2)"}` }}>
                    {doc.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ width: "100%", padding: "9px", fontSize: 12, fontWeight: 500, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, cursor: "pointer" }}
          >
            ← Back to {topicName}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
      `}</style>
    </>
  );
}

type RiskObsOverride = { severity: string; title: string; detail: string; remediation: string };

const RATING_META: Record<string, { label: string; dot: string; badge: string; border: string; bg: string; text: string }> = {
  GREEN:  { label: "GREEN",  dot: "bg-emerald-400", badge: "text-emerald-600 bg-emerald-50 border-emerald-200",  border: "border-emerald-200", bg: "bg-emerald-50/60",  text: "text-emerald-700" },
  YELLOW: { label: "YELLOW", dot: "bg-amber-400",   badge: "text-amber-600 bg-amber-50 border-amber-200",       border: "border-amber-200",   bg: "bg-amber-50/60",    text: "text-amber-700"   },
  RED:    { label: "RED",    dot: "bg-red-400",      badge: "text-red-600 bg-red-50 border-red-200",             border: "border-red-200",     bg: "bg-red-50/60",      text: "text-red-700"     },
};

function extractStaticRationale(findings: string): string {
  const m = findings.match(/###\s+(?:GREEN|YELLOW|RED)\s+Rating Rationale\s*\n+([\s\S]*?)(?:\n###|$)/i);
  return m ? m[1].trim() : "";
}

export function TopicPage({ topicNumber, onNavigate, alpineReviewId, topicDataOverride, mockOverride, vaultDataOverride, slug, onRatingChange, initialRating, initialRiskOverrides, onRiskObsSaved }: { topicNumber: number; onNavigate: (page: string) => void; alpineReviewId?: string | null; topicDataOverride?: Record<number, any>; mockOverride?: any; vaultDataOverride?: any; slug?: string; onRatingChange?: (topicNumber: number, rating: string) => void; initialRating?: string; initialRiskOverrides?: Record<string, RiskObsOverride>; onRiskObsSaved?: (id: string, edit: RiskObsOverride) => void }) {
  const activeTopicData = topicDataOverride || TOPIC_DATA;
  const activeMock = mockOverride || RIDGELINE_MOCK;
  const activeVault = vaultDataOverride || VAULT_DATA;
  const topic = activeTopicData[topicNumber];
  const [reportSection, setReportSection] = useState<string | null>(null);
  const [reportView, setReportView] = useState<"view" | "edit">("view");
  const [editContent, setEditContent] = useState(topic?.findings || "");
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [riskOverrides, setRiskOverrides] = useState<Record<string, RiskObsOverride>>(initialRiskOverrides ?? {});
  const [editingRisk, setEditingRisk] = useState<string | null>(null);
  const [riskDraft, setRiskDraft] = useState<RiskObsOverride | null>(null);
  const [savingRisk, setSavingRisk] = useState(false);

  // Topic-level rating override
  const staticRationale = topic ? extractStaticRationale(topic.findings || "") : "";
  const [ratingOverride, setRatingOverride] = useState<{ rating: string; rationale: string } | null>(null);
  const [editingRating, setEditingRating] = useState(false);
  const [ratingDraft, setRatingDraft] = useState({ rating: topic?.rating || "YELLOW", rationale: staticRationale });
  const [savingRating, setSavingRating] = useState(false);

  const effectiveRating = ratingOverride?.rating ?? initialRating ?? topic?.rating ?? "YELLOW";
  const effectiveRationale = ratingOverride?.rationale ?? staticRationale;

  const effectiveReportContent = reportSection || topic?.findings || null;

  useEffect(() => {
    if (!alpineReviewId) return;
    fetch(`/api/reviews/${alpineReviewId}/output/content?report_type=full`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const md = data?.markdown_content || data?.content || "";
        if (!md) return;
        const regex = new RegExp(`## Topic ${topicNumber}:[\\s\\S]*?(?=\\n## Topic \\d+:|\\n## Outstanding|\\n## Appendix|$)`);
        const match = md.match(regex);
        if (match) {
          setReportSection(match[0].trim());
          setEditContent(match[0].trim());
        }
      })
      .catch(() => {});
  }, [alpineReviewId, topicNumber]);

  // Keep local state in sync when parent's shared overrides change (e.g. after edit in another tab)
  useEffect(() => {
    if (initialRiskOverrides) setRiskOverrides(initialRiskOverrides);
  }, [initialRiskOverrides]);

  function startEditRisk(ro: any) {
    const merged = riskOverrides[ro.id] ? { ...ro, ...riskOverrides[ro.id] } : ro;
    setRiskDraft({ severity: merged.severity, title: merged.title, detail: merged.detail, remediation: merged.remediation || "" });
    setEditingRisk(ro.id);
  }

  async function saveRisk(id: string) {
    if (!riskDraft || !slug) return;
    setSavingRisk(true);
    try {
      await fetch("/api/risk-obs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, review_slug: slug, ...riskDraft }),
      });
      setRiskOverrides((prev) => ({ ...prev, [id]: riskDraft }));
      onRiskObsSaved?.(id, riskDraft);
      setEditingRisk(null);
    } finally {
      setSavingRisk(false);
    }
  }

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/topic-rating?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((rows: Array<{ topic_number: number; rating: string; rationale: string }>) => {
        const match = rows.find((r) => r.topic_number === topicNumber);
        if (match) setRatingOverride({ rating: match.rating, rationale: match.rationale });
      })
      .catch(() => {});
  }, [slug, topicNumber]);

  async function saveRating() {
    if (!slug) return;
    setSavingRating(true);
    try {
      await fetch("/api/topic-rating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, topic_number: topicNumber, rating: ratingDraft.rating, rationale: ratingDraft.rationale }),
      });
      setRatingOverride({ rating: ratingDraft.rating, rationale: ratingDraft.rationale });
      onRatingChange?.(topicNumber, ratingDraft.rating);
      setEditingRating(false);
    } finally {
      setSavingRating(false);
    }
  }

  if (!topic) return <PlaceholderTab label={`Topic ${topicNumber}`} />;

  const rm = RATING_META[effectiveRating] || RATING_META.YELLOW;
  const dotColor = rm.dot;

  const topicRisks = activeMock.risk_observations.filter((r: any) => topic.riskObsIds.includes(r.id));
  const topicDocs = activeVault.documents.filter((d: any) => topic.docCategories.includes(d.category));

  return (
    <div className="space-y-5">
      {/* Back breadcrumb */}
      <button
        onClick={() => onNavigate("analysis")}
        className="flex items-center gap-1 text-[13px] text-br-text-muted hover:text-alpine-violet transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M7 2L3 6l4 4" />
        </svg>
        {Object.keys(activeTopicData).length}-Topic ODD Assessment
      </button>

      {/* Topic Header */}
      <div className="bg-br-card border border-br rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          <h2 className="text-[16px] font-heading font-semibold text-br-text-primary">{topic.name}</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${rm.badge}`}>{effectiveRating}</span>
        </div>
        <p className="text-[12px] text-br-text-secondary leading-relaxed">{topic.summary}</p>
      </div>

      {/* Legend */}
      <div className="bg-br-card border border-br rounded-xl px-4 py-2 flex items-center gap-4 flex-wrap text-[10px]">
        <span className="font-heading font-semibold text-br-text-muted uppercase tracking-wider">Legend</span>
        <span className="text-emerald-500">✓ No concern</span>
        <span className="text-amber-500">⚠ Attention</span>
        <span className="text-red-500">✗ Gap</span>
        <span className="text-br-text-muted">·</span>
        <span className="text-br-text-muted flex items-center gap-1.5">
          <span className="w-[7px] h-[7px] rounded-full bg-blue-400 inline-block" /> Fund Doc
          <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 inline-block" /> Regulatory
          <span className="w-[7px] h-[7px] rounded-full bg-amber-400 inline-block" /> Manager / Follow-Up
          <span className="w-[7px] h-[7px] rounded-full bg-purple-400 inline-block" /> Alpine / Third-Party
        </span>
      </div>

      {/* Key Data Points */}
      {topic.dataPoints.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {topic.dataPoints.map((group: any, gi: number) => (
            <div key={gi} className={`bg-br-card border border-br rounded-xl overflow-hidden ${
              gi === topic.dataPoints.length - 1 && topic.dataPoints.length % 2 !== 0 ? "lg:col-span-2" : ""
            }`}>
              <div className="px-4 py-2 border-b border-br">
                <h4 className="text-[10px] font-heading font-semibold text-br-text-muted uppercase tracking-wider">{group.group}</h4>
              </div>
              <div className="divide-y divide-br/20">
                {group.items.map((dp: any, i: number) => {
                  const srcColor: "blue" | "emerald" | "amber" | "purple" =
                    !dp.source ? "blue"
                    : ["Form ADV", "SEC EDGAR"].includes(dp.source) ? "emerald"
                    : ["Manager Response", "Not Provided"].includes(dp.source) ? "amber"
                    : ["Alpine Analysis", "Admin Transparency Report"].includes(dp.source) ? "purple"
                    : "blue";
                  return (
                    <div key={i} className="px-4 py-1.5 flex items-start gap-2">
                      <span className="text-[10px] text-br-text-muted w-[130px] flex-shrink-0 pt-0.5 font-medium">{dp.label}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-br-text-primary leading-snug break-words">
                          {dp.value}
                          {dp.flag && (
                            <span className={`ml-1.5 text-[10px] ${
                              dp.flag === "green" ? "text-emerald-500" : dp.flag === "red" ? "text-red-500" : "text-amber-500"
                            }`}>{dp.flag === "green" ? "✓" : dp.flag === "red" ? "✗" : "⚠"}</span>
                          )}
                        </span>
                        {dp.source && (
                          <RefDot source={dp.source} quote={dp.value} color={srcColor} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Risk Observations */}
      {topicRisks.length > 0 && (
        <div className="bg-br-card border border-br rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-br">
            <h3 className="text-[12px] font-heading font-semibold text-br-text-primary">Risk Observations</h3>
          </div>
          <div className="divide-y divide-br/50">
            {topicRisks.map((ro: any) => {
              const merged = riskOverrides[ro.id] ? { ...ro, ...riskOverrides[ro.id] } : ro;
              const isEditing = editingRisk === ro.id;
              const sevClass = merged.severity === "HIGH" ? "text-red-500 bg-red-500/10" : merged.severity === "MEDIUM" ? "text-amber-500 bg-amber-500/10" : "text-br-text-muted bg-br-surface";
              const inputCls = "w-full bg-br-surface border border-br rounded-md px-2.5 py-1.5 text-[12px] text-br-text-primary outline-none font-sans";

              if (isEditing && riskDraft) {
                return (
                  <div key={ro.id} className="px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-br-text-muted">{ro.id}</span>
                      <select value={riskDraft.severity} onChange={(e) => setRiskDraft((p) => p ? { ...p, severity: e.target.value } : p)}
                        className={`${inputCls} w-24`}>
                        <option>HIGH</option>
                        <option>MEDIUM</option>
                        <option>LOW</option>
                      </select>
                    </div>
                    <input value={riskDraft.title} onChange={(e) => setRiskDraft((p) => p ? { ...p, title: e.target.value } : p)}
                      placeholder="Title" className={inputCls} />
                    <textarea value={riskDraft.detail} onChange={(e) => setRiskDraft((p) => p ? { ...p, detail: e.target.value } : p)}
                      placeholder="Detail" rows={3} className={`${inputCls} resize-y leading-relaxed`} />
                    <textarea value={riskDraft.remediation} onChange={(e) => setRiskDraft((p) => p ? { ...p, remediation: e.target.value } : p)}
                      placeholder="Remediation (optional)" rows={2} className={`${inputCls} resize-y leading-relaxed`} />
                    <div className="flex gap-2">
                      <button onClick={() => saveRisk(ro.id)} disabled={savingRisk}
                        className="px-3 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-semibold disabled:opacity-50">
                        {savingRisk ? "Saving…" : "Save"}
                      </button>
                      <button onClick={() => setEditingRisk(null)}
                        className="px-3 py-1 rounded-md border border-br text-br-text-muted text-[11px]">
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={ro.id} className="px-4 py-3 group">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-br-text-muted">{merged.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${sevClass}`}>{merged.severity}</span>
                    </div>
                    <button onClick={() => startEditRisk(ro)} title="Edit"
                      className="opacity-0 group-hover:opacity-100 text-[10px] px-1.5 py-0.5 rounded border border-br text-br-text-muted hover:text-br-text-primary transition-opacity">
                      ✎
                    </button>
                  </div>
                  <p className="text-[12px] font-medium text-br-text-primary">{merged.title}</p>
                  <p className="text-[11px] text-br-text-muted mt-0.5">{merged.detail}</p>
                  {merged.remediation && <p className="text-[11px] text-alpine-violet mt-1">{merged.remediation}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Relevant Documents */}
      {topicDocs.length > 0 && (
        <div className="bg-br-card border border-br rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-br flex items-center justify-between">
            <h3 className="text-[12px] font-heading font-semibold text-br-text-primary">Relevant Documents</h3>
            <button onClick={() => setShowAllDocs(true)} className="text-[10px] text-alpine-violet hover:underline">View all &rarr;</button>
          </div>
          <div className="divide-y divide-br/50">
            {topicDocs.map((doc: any) => (
              <div key={doc.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-br-card-hover transition-colors group">
                <div className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-br-text-muted flex-shrink-0">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div>
                    <span className="text-[11px] font-medium text-br-text-primary">{doc.name}</span>
                    <span className="text-[10px] text-br-text-muted ml-2">{doc.uploaded_by}</span>
                  </div>
                </div>
                <span className="text-[10px] text-br-text-muted">{doc.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Risk Card */}
      {(effectiveRationale || topic.rating) && (
        <div className={`border rounded-xl overflow-hidden ${rm.border}`}>
          <div className={`px-4 py-2.5 border-b ${rm.border} ${rm.bg} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${rm.dot}`} />
              <h3 className={`text-[12px] font-heading font-semibold ${rm.text}`}>{effectiveRating} Rating Rationale</h3>
            </div>
            {!editingRating && (
              <button
                onClick={() => { setRatingDraft({ rating: effectiveRating, rationale: effectiveRationale }); setEditingRating(true); }}
                className="text-[10px] px-2 py-0.5 rounded border border-current opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "inherit" }}
              >
                ✎ Edit
              </button>
            )}
          </div>

          {editingRating ? (
            <div className="px-4 py-3 space-y-3 bg-white dark:bg-br-card">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-br-text-muted font-medium w-16">Rating</span>
                <div className="flex gap-2">
                  {(["GREEN", "YELLOW", "RED"] as const).map((r) => {
                    const m = RATING_META[r];
                    return (
                      <button key={r} onClick={() => setRatingDraft((p) => ({ ...p, rating: r }))}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold border transition-all ${ratingDraft.rating === r ? `${m.badge} ring-2 ring-offset-1` : "border-br text-br-text-muted hover:border-current"}`}
                        style={ratingDraft.rating === r ? {} : {}}>
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <textarea
                  value={ratingDraft.rationale}
                  onChange={(e) => setRatingDraft((p) => ({ ...p, rationale: e.target.value }))}
                  rows={4}
                  placeholder="Describe the rationale for this rating…"
                  className="w-full bg-br-surface border border-br rounded-md px-3 py-2 text-[12px] text-br-text-primary outline-none resize-y leading-relaxed font-sans"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={saveRating} disabled={savingRating}
                  className="px-3 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-semibold disabled:opacity-50">
                  {savingRating ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditingRating(false)}
                  className="px-3 py-1 rounded-md border border-br text-br-text-muted text-[11px]">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-white dark:bg-br-card">
              <p className="text-[12px] text-br-text-secondary leading-relaxed">{effectiveRationale}</p>
            </div>
          )}
        </div>
      )}

      {/* Report Section */}
      {effectiveReportContent && (
        <div className="bg-br-card border border-br rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-br flex items-center justify-between">
            <h3 className="text-[12px] font-heading font-semibold text-br-text-primary">
              Report — Chapter {topicNumber}: {topic.name}
            </h3>
            <div className="flex items-center gap-1">
              {(["view", "edit"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setReportView(mode)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    reportView === mode ? "bg-br-surface text-br-text-primary" : "text-br-text-muted hover:text-br-text-secondary"
                  }`}
                >
                  {mode === "view" ? "View" : "Edit"}
                </button>
              ))}
              <button
                onClick={() => downloadDemoFile("sample_vc_fund_iv_alt.pdf")}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-br-text-muted hover:text-br-text-secondary transition-colors flex items-center gap-1"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {reportView === "view" ? (
              <ReportViewer
                content={effectiveReportContent}
                reviewId={alpineReviewId || ""}
                demoMode
              />
            ) : (
              <div className="p-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-[400px] bg-br-surface border border-br rounded-lg p-3 text-[12px] font-mono text-br-text-primary resize-y focus:outline-none focus:ring-1 focus:ring-alpine-violet"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Docs panel */}
      {showAllDocs && topicDocs.length > 0 && (
        <DocVaultPanel docs={topicDocs} topicName={topic.name} onClose={() => setShowAllDocs(false)} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between text-[15px]">
        {activeTopicData[topicNumber - 1] && (
          <button onClick={() => onNavigate(`analysis-topic-${topicNumber - 1}`)} className="text-br-text-secondary hover:text-br-text-primary flex items-center gap-2 transition-colors font-medium">
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 5l3 3" /></svg>
            {activeTopicData[topicNumber - 1]?.name}
          </button>
        )}
        <div />
        {activeTopicData[topicNumber + 1] && (
          <button onClick={() => onNavigate(`analysis-topic-${topicNumber + 1}`)} className="text-br-text-secondary hover:text-br-text-primary flex items-center gap-2 transition-colors font-medium">
            {activeTopicData[topicNumber + 1]?.name}
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 2l3 3-3 3" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
