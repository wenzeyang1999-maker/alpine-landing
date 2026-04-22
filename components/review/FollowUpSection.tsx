"use client";

import { useState } from "react";
import { FOLLOW_UP_MOCK, COLLECTION_DOCS } from "@/lib/ridgeline-data";

// ── Follow-Up Agent Section ────────────────────────────────────────────────────

export function FollowUpSection({ mock }: { mock: typeof FOLLOW_UP_MOCK }) {
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [expandedRound, setExpandedRound] = useState<number>(1);

  const priorityStyle = (p: string) =>
    p === "critical" ? "text-red-500 bg-red-500/10" : p === "important" ? "text-amber-500 bg-amber-500/10" : "text-br-text-muted bg-br-surface";

  const totalQuestions = mock.rounds.reduce((s, r) => s + r.questions.length, 0);
  const totalResolved = mock.rounds.reduce((s, r) => s + r.questions.filter((q) => q.status === "answered").length, 0);
  const docUploads = mock.rounds.flatMap((r) => r.questions.flatMap((q) => q.sub_items.filter((si) => si.response_type === "document"))).length;

  return (
    <div className="bg-br-card border border-br rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-br flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-alpine-violet"><path d="M8 2v4l2.5 1.5" /><circle cx="8" cy="8" r="6" /></svg>
          <h3 className="text-[13px] font-heading font-semibold text-br-text-primary">AI Follow-Up Agent</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">{mock.rounds.length} rounds complete</span>
        </div>
        <span className="text-[10px] text-br-text-muted">{totalResolved}/{totalQuestions} questions · {docUploads} docs uploaded</span>
      </div>

      {/* Round tabs */}
      <div className="px-4 py-2 border-b border-br/50 flex items-center gap-2">
        {mock.rounds.map((r) => (
          <button
            key={r.round_number}
            onClick={() => setExpandedRound(r.round_number)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              expandedRound === r.round_number ? "bg-br-surface text-br-text-primary" : "text-br-text-muted hover:text-br-text-secondary"
            }`}
          >
            Round {r.round_number} ({r.questions.length})
          </button>
        ))}
      </div>

      {/* Questions */}
      {mock.rounds.filter((r) => r.round_number === expandedRound).map((round) => (
        <div key={round.round_number} className="divide-y divide-br/30">
          {round.questions.map((q) => {
            const isExpanded = expandedQ === q.id;
            const allResolved = q.sub_items.every((si) => si.resolved);
            return (
              <div key={q.id}>
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-br-card-hover transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {allResolved ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="5.5" /><path d="M5 7l1.5 1.5L9 6" /></svg>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-amber-400/50 flex-shrink-0" />
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityStyle(q.priority)}`}>
                      {q.priority === "critical" ? "CRITICAL" : q.priority === "important" ? "IMPORTANT" : "OPTIONAL"}
                    </span>
                    <span className="text-[12px] text-br-text-primary">Q{q.number}. {q.question_text}</span>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={`text-br-text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}><path d="M4 2l3 3-3 3" /></svg>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 ml-[22px] space-y-1.5 animate-fade-in">
                    {q.sub_items.map((si, idx) => (
                      <div key={idx} className="flex items-start gap-2 py-1">
                        {si.resolved ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><path d="M3 6l2 2 4-4" /></svg>
                        ) : (
                          <span className="w-3 h-3 rounded-full border border-br-text-muted/30 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] text-br-text-primary">{si.label}</span>
                          {si.resolved && (
                            <div className="mt-0.5">
                              {si.response_type === "document" ? (
                                <span className="text-[10px] text-alpine-violet flex items-center gap-1">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                  {si.resolved_by}
                                </span>
                              ) : (
                                <div>
                                  <span className="text-[10px] text-emerald-500 flex items-center gap-1 mb-0.5">
                                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12l3-3m0 0l3-3m-3 3h10" /></svg>
                                    Manager Response
                                  </span>
                                  {si.response_text && (
                                    <p className="text-[10px] text-br-text-muted leading-relaxed italic ml-3.5">&ldquo;{si.response_text.substring(0, 150)}{si.response_text.length > 150 ? "..." : ""}&rdquo;</p>
                                  )}
                                </div>
                              )}
                              {(si as any).commitment && (
                                <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                                  Pending: {(si as any).commitment}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Monitoring Items */}
      {mock.monitoring_items.length > 0 && (
        <>
          <div className="px-4 py-2 border-t border-br bg-br-surface">
            <span className="text-[10px] font-heading font-semibold text-amber-500 uppercase tracking-wider">Monitoring Commitments</span>
          </div>
          <div className="divide-y divide-br/30">
            {mock.monitoring_items.map((item, i) => (
              <div key={i} className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-[11px] text-br-text-primary">{item.commitment}</span>
                  <span className="text-[10px] text-br-text-muted">({item.topic})</span>
                </div>
                <span className="text-[10px] text-amber-500 font-medium">{item.expected}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Document Collection View ───────────────────────────────────────────────────

export function DocumentCollectionView({ mock, onNavigate, brandName }: { mock: typeof FOLLOW_UP_MOCK; onNavigate: (page: string) => void; brandName: string }) {
  const [emailExpanded, setEmailExpanded] = useState(false);

  const initialDocs = COLLECTION_DOCS.filter((d) => d.source === "Manager Upload").length;
  const followUpDocs = COLLECTION_DOCS.filter((d) => d.source.startsWith("Follow-Up")).length;

  return (
    <div className="space-y-5">
      {/* Phase 1: Document Request */}
      <div className="bg-br-card border border-br rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-br flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-emerald-400"><path d="M2 4l6 4 6-4" /><rect x="1" y="3" width="14" height="10" rx="1.5" /></svg>
            <h3 className="text-[13px] font-heading font-semibold text-br-text-primary">Document Request</h3>
            <button
              onClick={() => setEmailExpanded(!emailExpanded)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
            >
              Sent
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={`transition-transform ${emailExpanded ? "rotate-180" : ""}`}><path d="M3 4l2 2 2-2" /></svg>
            </button>
          </div>
          <button
            onClick={() => window.open("/portal/demo-ridgeline-token", "_blank")}
            className="text-[10px] text-alpine-violet hover:text-alpine-violet-light transition-colors flex items-center gap-1"
            title="Opens the manager upload portal (demo token)"
          >
            Open Manager Portal
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 3H3v10h10v-3" /><path d="M9 2h5v5" /><path d="M14 2L7 9" /></svg>
          </button>
        </div>
        <div className="px-4 py-2.5 flex items-center gap-6 text-[11px] text-br-text-secondary">
          <span>To: <span className="text-br-text-primary">david.chen@ridgelinecap.com</span></span>
          <span>Sent: <span className="text-br-text-primary">January 15, 2026</span></span>
          <span>Portal: <a href="#" onClick={(e) => { e.preventDefault(); window.open("/portal/demo-ridgeline-token", "_blank"); }} className="text-alpine-violet hover:underline">portal.alpinedd.com/ridgeline</a></span>
        </div>
        {emailExpanded && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="bg-br-surface rounded-lg p-4 text-[12px] text-br-text-secondary leading-relaxed border border-br/50">
              <p className="font-medium text-br-text-primary mb-2">Subject: Operational Due Diligence Document Request — Ridgeline Global Opportunities Fund, LP</p>
              <p className="mb-3">Dear David,</p>
              <p className="mb-3">Thank you for taking the time to discuss Ridgeline Global Opportunities Fund with our team. As part of our standard operational due diligence review process, we are requesting the following documents to support our assessment:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2 mb-3">
                <li>Due Diligence Questionnaire (DDQ) — current version</li>
                <li>Form ADV Part 2A (Brochure) — most recent filing</li>
                <li>Compliance Manual — current version</li>
                <li>Business Continuity Plan / Disaster Recovery Plan</li>
                <li>Organization Chart — current version</li>
                <li>Audited Financial Statements — two most recent fiscal years (FY2023 &amp; FY2024)</li>
                <li>Private Placement Memorandum (PPM)</li>
                <li>Trade Allocation Policy</li>
                <li>Valuation Policy</li>
                <li>Code of Ethics / Personal Trading Policy</li>
                <li>Insurance Summary (E&amp;O, D&amp;O, Cyber, Fidelity)</li>
              </ol>
              <p className="mb-2">Please upload documents via the secure portal: <a href="#" onClick={(e) => { e.preventDefault(); window.open("/portal/demo-ridgeline-token", "_blank"); }} className="text-alpine-violet hover:underline">portal.alpinedd.com/ridgeline</a></p>
              <p className="mb-2">If any documents are not available, please let us know the expected delivery date or provide an explanation via the portal.</p>
              <p className="text-br-text-muted">Best regards,<br />Sungwon Kim<br />{brandName} Alternative Investors — Operational Due Diligence</p>
            </div>
          </div>
        )}
      </div>

      {/* Phase 2: Received Documents */}
      <div className="bg-br-card border border-br rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-br flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-br-text-primary"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            <h3 className="text-[13px] font-heading font-semibold text-br-text-primary">Documents Received</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">{COLLECTION_DOCS.length} docs</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-br-text-muted">
            <span>{initialDocs} initial upload</span>
            <span>·</span>
            <span>{followUpDocs} from follow-up</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-br/30">
          {COLLECTION_DOCS.map((doc, i) => (
            <div key={i} className="px-3 py-2 bg-br-card flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-br-text-muted flex-shrink-0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <span className="text-[11px] text-br-text-primary truncate">{doc.name}</span>
              </div>
              <span className={`text-[9px] px-1 py-0.5 rounded flex-shrink-0 ml-1 ${
                doc.source === "Manager Upload" ? "text-br-text-muted bg-br-surface" : "text-alpine-violet bg-alpine-violet/8"
              }`}>{doc.source === "Manager Upload" ? "Initial" : doc.source.replace("Follow-Up ", "R")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 3: AI Follow-Up Agent */}
      <FollowUpSection mock={mock} />
    </div>
  );
}
