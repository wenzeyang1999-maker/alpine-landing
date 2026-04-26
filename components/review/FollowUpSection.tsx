"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FOLLOW_UP_MOCK, COLLECTION_DOCS } from "@/lib/ridgeline-data";
import { TRELLIS_COLLECTION_DOCS } from "@/lib/trellis-data";
import { downloadDemoFile, getDemoFileUrl } from "@/lib/demo-downloads";

// ── PDF Viewer Modal ──────────────────────────────────────────────────────────

function PDFViewerModal({ name, filename, onClose }: { name: string; filename: string; onClose: () => void }) {
  const url = getDemoFileUrl(filename);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.75)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex-1 flex flex-col mx-auto w-full max-w-5xl my-8 rounded-xl overflow-hidden border border-br shadow-2xl" style={{ background: "var(--color-br-card, #18181b)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-br flex-shrink-0" style={{ background: "var(--color-br-surface, #111114)" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-alpine-violet"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            <span className="text-[13px] font-medium text-br-text-primary truncate">{name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              onClick={() => downloadDemoFile(filename)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-alpine-violet/15 text-alpine-violet hover:bg-alpine-violet/25 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-br-text-muted hover:text-br-text-primary hover:bg-br-surface transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12" /></svg>
            </button>
          </div>
        </div>
        {/* PDF iframe */}
        <div className="flex-1 min-h-0">
          {url ? (
            <iframe src={url} className="w-full h-full" style={{ minHeight: "70vh", border: "none" }} title={name} />
          ) : (
            <div className="flex items-center justify-center h-full text-br-text-muted text-[13px]">File not available</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Follow-Up Agent Section ────────────────────────────────────────────────────

type PendingState = Record<string, { checked: boolean; note: string }>;

const LS_KEY = (slug: string) => `alpine-followup-notes-${slug}`;
const TOKEN = process.env.NEXT_PUBLIC_NOTES_TOKEN ?? "";

function getUserEmail(): string {
  try {
    const raw = localStorage.getItem("alpine_demo_user");
    if (raw) return JSON.parse(raw)?.email ?? "";
  } catch { /* ignore */ }
  return "";
}

async function pushToServer(slug: string, state: PendingState, userEmail: string) {
  if (!userEmail) return;
  try {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-notes-token": TOKEN },
      body: JSON.stringify({ slug, user: userEmail, state }),
    });
  } catch { /* silent — localStorage still has it */ }
}

export function FollowUpSection({ mock, slug }: { mock: typeof FOLLOW_UP_MOCK; slug?: string }) {
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [expandedRound, setExpandedRound] = useState<number>(1);
  // key: `${questionId}-${subItemIndex}`
  const [pendingState, setPendingState] = useState<PendingState>({});
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Build state from all rounds (static answered + interactive pending)
  const buildFullState = (serverData: PendingState): PendingState => {
    const merged: PendingState = {};
    // Seed all rounds from mock (static answered data as defaults)
    for (const round of mock.rounds) {
      for (const q of round.questions) {
        q.sub_items.forEach((si, idx) => {
          const key = `${q.id}-${idx}`;
          merged[key] = {
            checked: si.resolved ?? false,
            note: (si as any).response_text ?? "",
          };
        });
      }
    }
    // Server data wins (user overrides)
    return { ...merged, ...serverData };
  };

  // Load: server first (source of truth), fallback to localStorage
  useEffect(() => {
    if (!slug) return;
    const lsKey = LS_KEY(slug);
    const userEmail = getUserEmail();

    // Immediately seed from mock so UI shows data right away
    const seedState = buildFullState({});
    setPendingState(seedState);
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) setPendingState(buildFullState(JSON.parse(cached)));
    } catch { /* ignore */ }

    if (!userEmail) {
      // No user — push seed data so DB gets populated even without login
      return;
    }
    fetch(`/api/notes?slug=${slug}&user=${encodeURIComponent(userEmail)}`, { headers: { "x-notes-token": TOKEN } })
      .then((r) => r.ok ? r.json() : Promise.resolve({}))
      .then((serverData: PendingState) => {
        const merged = buildFullState(serverData);
        setPendingState(merged);
        try { localStorage.setItem(lsKey, JSON.stringify(merged)); } catch { /* ignore */ }
        // If DB was empty, seed it now
        if (Object.keys(serverData).length === 0) {
          pushToServer(slug, merged, userEmail);
        }
      })
      .catch(() => { /* server unavailable — use localStorage */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const priorityStyle = (p: string) =>
    p === "critical" ? "text-red-500 bg-red-500/10" : p === "important" ? "text-amber-500 bg-amber-500/10" : "text-br-text-muted bg-br-surface";

  const getKey = (qId: string, idx: number) => `${qId}-${idx}`;

  const persist = (next: PendingState) => {
    setPendingState(next);
    if (!slug) return;
    try { localStorage.setItem(LS_KEY(slug), JSON.stringify(next)); } catch { /* ignore */ }
    setSyncStatus("saving");
    pushToServer(slug, next, getUserEmail()).then(() => {
      setSyncStatus("saved");
      setTimeout(() => setSyncStatus("idle"), 1800);
    });
  };

  const toggleCheck = (key: string) =>
    persist({ ...pendingState, [key]: { checked: !pendingState[key]?.checked, note: pendingState[key]?.note ?? "" } });

  const setNote = (key: string, note: string) =>
    persist({ ...pendingState, [key]: { checked: pendingState[key]?.checked ?? false, note } });

  const isPending = (roundStatus: string) => roundStatus !== "complete";

  // Count answered: static answered + pending items where all sub-items checked
  const totalQuestions = mock.rounds.reduce((s, r) => s + r.questions.length, 0);
  const totalResolved = mock.rounds.reduce((s, r) =>
    s + r.questions.filter((q) => {
      if (q.status === "answered") return true;
      return q.sub_items.every((_, idx) => pendingState[getKey(q.id, idx)]?.checked);
    }).length, 0);
  const docUploads = mock.rounds.flatMap((r) => r.questions.flatMap((q) => q.sub_items.filter((si) => si.response_type === "document"))).length;

  return (
    <div className="bg-br-card border border-br rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-br flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-alpine-violet"><path d="M8 2v4l2.5 1.5" /><circle cx="8" cy="8" r="6" /></svg>
          <h3 className="text-[13px] font-heading font-semibold text-br-text-primary">AI Follow-Up Agent</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">{mock.rounds.filter((r) => r.status === "complete").length} rounds complete</span>
        </div>
        <div className="flex items-center gap-3">
          {syncStatus !== "idle" && (
            <span className={`text-[10px] flex items-center gap-1 transition-opacity ${syncStatus === "saved" ? "text-emerald-500" : "text-br-text-muted"}`}>
              {syncStatus === "saving" ? (
                <><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="animate-spin"><path d="M8 2v3M8 11v3M2 8h3M11 8h3" /></svg>Saving…</>
              ) : (
                <><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 6l2.5 2.5L9.5 4" /></svg>Saved</>
              )}
            </span>
          )}
          <span className="text-[10px] text-br-text-muted">{totalResolved}/{totalQuestions} questions · {docUploads} docs uploaded</span>
        </div>
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
            Round {r.round_number} ({r.questions.length}){isPending(r.status) && <span className="ml-1 text-amber-400">·</span>}
          </button>
        ))}
      </div>

      {/* Questions */}
      {mock.rounds.filter((r) => r.round_number === expandedRound).map((round) => (
        <div key={round.round_number} className="divide-y divide-br/30">
          <div className="px-4 py-3 flex items-center justify-between border-b border-br/30 bg-br-surface/40">
            <span className="text-[11px] text-br-text-muted">Round {round.round_number} responses</span>
            <button
              onClick={() => {
                if (!slug) return;
                setSyncStatus("saving");
                pushToServer(slug, pendingState, getUserEmail()).then(() => {
                  setSyncStatus("saved");
                  setTimeout(() => setSyncStatus("idle"), 2000);
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-alpine-violet/10 text-alpine-violet hover:bg-alpine-violet/20 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2H5a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5l-3-3z"/><path d="M11 2v4H6"/><path d="M6 10h4"/></svg>
              Save
            </button>
          </div>
          {round.questions.map((q) => {
            const isExpanded = expandedQ === q.id;
            const isInteractive = isPending(round.status);
            const allChecked = isInteractive
              ? q.sub_items.every((_, idx) => pendingState[getKey(q.id, idx)]?.checked)
              : q.sub_items.every((si) => si.resolved);

            return (
              <div key={q.id}>
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-br-card-hover transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {allChecked ? (
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
                  <div className="px-4 pb-4 ml-[22px] space-y-2 animate-fade-in">
                    {q.sub_items.map((si, idx) => {
                      const key = getKey(q.id, idx);
                      const checked = isInteractive ? (pendingState[key]?.checked ?? false) : si.resolved;
                      const note = pendingState[key]?.note ?? "";

                      return (
                        <div key={idx} className={`rounded-lg border transition-colors ${
                          isInteractive
                            ? checked ? "border-emerald-500/30 bg-emerald-500/5" : "border-br/60 bg-br-surface/50"
                            : "border-transparent"
                        }`}>
                          <div className={`flex items-start gap-2.5 ${isInteractive ? "p-2.5" : "py-1"}`}>
                            {/* Checkbox / check icon */}
                            {isInteractive ? (
                              <button
                                onClick={() => toggleCheck(key)}
                                className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border transition-colors ${
                                  checked ? "bg-emerald-500 border-emerald-500" : "border-br-text-muted/40 hover:border-emerald-400 bg-transparent"
                                }`}
                              >
                                {checked && (
                                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2 5l2.5 2.5L8 3" /></svg>
                                )}
                              </button>
                            ) : checked ? (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><path d="M3 6l2 2 4-4" /></svg>
                            ) : (
                              <span className="w-3 h-3 rounded-full border border-br-text-muted/30 flex-shrink-0 mt-0.5" />
                            )}

                            <div className="flex-1 min-w-0">
                              <span className={`text-[11px] ${checked && isInteractive ? "text-br-text-primary" : "text-br-text-primary"}`}>{si.label}</span>

                              {/* Static answered content */}
                              {!isInteractive && si.resolved && (
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

                              {/* Interactive note input */}
                              {isInteractive && (
                                <div className="mt-1.5">
                                  {activeNote === key || note ? (
                                    <textarea
                                      autoFocus={activeNote === key && !note}
                                      value={note}
                                      onChange={(e) => setNote(key, e.target.value)}
                                      onFocus={() => setActiveNote(key)}
                                      onBlur={() => setActiveNote(null)}
                                      placeholder="Add note or manager response…"
                                      rows={note ? Math.min(6, note.split("\n").length + 1) : 2}
                                      className="w-full text-[11px] rounded-md px-2.5 py-1.5 resize-none outline-none transition-colors border"
                                      style={{
                                        background: "var(--color-br-card, #fff)",
                                        borderColor: activeNote === key ? "rgba(139,92,246,0.5)" : "var(--color-br-border, #e2e8f0)",
                                        color: "var(--color-br-text-primary, #0f172a)",
                                      }}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => setActiveNote(key)}
                                      className="text-[10px] text-br-text-muted hover:text-br-text-secondary flex items-center gap-1 transition-colors"
                                    >
                                      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3L11 2z" /></svg>
                                      Add note
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

const FUND_META: Record<string, { token: string; portalSlug: string; email: string; salutation: string; fundName: string; sentDate: string }> = {
  "ridgeline-capital": {
    token: "demo-ridgeline-token",
    portalSlug: "ridgeline",
    email: "david.chen@ridgelinecap.com",
    salutation: "David",
    fundName: "Ridgeline Global Opportunities Fund, LP",
    sentDate: "January 15, 2026",
  },
  "trellis-capital-iv": {
    token: "demo-trellis-token",
    portalSlug: "trellis",
    email: "arjun.mehta@trelliscapital.com",
    salutation: "Arjun",
    fundName: "Trellis Capital IV, L.P.",
    sentDate: "February 3, 2026",
  },
};

type DocEntry = { id?: string; name: string; type: string; date: string; source: string; filename?: string; url?: string };

export function DocumentCollectionView({ mock, onNavigate, brandName, slug }: { mock: typeof FOLLOW_UP_MOCK; onNavigate: (page: string) => void; brandName: string; slug?: string }) {
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{ name: string; filename: string } | null>(null);
  const [portalDocs, setPortalDocs] = useState<DocEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isTrellis = slug === "trellis-capital-iv";
  const meta = FUND_META[slug ?? "ridgeline-capital"] ?? FUND_META["ridgeline-capital"];

  useEffect(() => {
    fetch(`/api/portal/documents?token=${encodeURIComponent(meta.token)}`)
      .then((r) => r.json())
      .then((rows: Array<{ id: string; filename: string; uploaded_at: string; storage_path: string | null }>) => {
        if (!Array.isArray(rows)) return;
        setPortalDocs(rows.map((row) => ({
          id: row.id,
          name: row.filename,
          type: "Uploaded",
          date: row.uploaded_at.split("T")[0],
          source: "Manager Upload",
          url: row.storage_path
            ? `/api/portal/file?path=${encodeURIComponent(row.storage_path)}`
            : undefined,
        })));
      })
      .catch(() => {});
  }, [meta.token]);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    setUploadError("");
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setUploadError("Only PDF files supported.");
        continue;
      }
      const form = new FormData();
      form.append("file", file);
      form.append("token", meta.token);
      try {
        const res = await fetch("/api/portal/upload", { method: "POST", body: form });
        if (!res.ok) { setUploadError("Upload failed."); continue; }
        const row = await res.json();
        setPortalDocs((prev) => [{
          id: row.id,
          name: row.filename,
          type: "Uploaded",
          date: row.uploaded_at.split("T")[0],
          source: "Manager Upload",
          url: row.storage_path ? `/api/portal/file?path=${encodeURIComponent(row.storage_path)}` : undefined,
        }, ...prev]);
      } catch { setUploadError("Network error."); }
    }
    setUploading(false);
  }, [meta.token]);

  const handleRemove = useCallback(async (id: string) => {
    await fetch(`/api/portal/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setPortalDocs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const staticDocs: DocEntry[] = isTrellis ? TRELLIS_COLLECTION_DOCS : COLLECTION_DOCS;
  const staticFilenames = new Set(staticDocs.map((d) => d.filename).filter(Boolean));
  const extraPortalDocs = portalDocs.filter((d) => !staticFilenames.has(d.name));
  const ACTIVE_DOCS = [...staticDocs, ...extraPortalDocs];
  const initialDocs = ACTIVE_DOCS.filter((d) => d.source === "Manager Upload").length;
  const followUpDocs = ACTIVE_DOCS.filter((d) => d.source.startsWith("Follow-Up")).length;

  const portalUrl = `/portal/${meta.token}`;
  const portalDisplayUrl = `portal.alpinedd.com/${meta.portalSlug}`;

  return (
    <>
    {viewingDoc && (
      <PDFViewerModal
        name={viewingDoc.name}
        filename={viewingDoc.filename}
        onClose={() => setViewingDoc(null)}
      />
    )}
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
            onClick={() => window.open(portalUrl, "_blank")}
            className="text-[10px] text-alpine-violet hover:text-alpine-violet-light transition-colors flex items-center gap-1"
            title="Opens the manager upload portal"
          >
            Open Manager Portal
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 3H3v10h10v-3" /><path d="M9 2h5v5" /><path d="M14 2L7 9" /></svg>
          </button>
        </div>
        <div className="px-4 py-2.5 flex items-center gap-6 text-[11px] text-br-text-secondary">
          <span>To: <span className="text-br-text-primary">{meta.email}</span></span>
          <span>Sent: <span className="text-br-text-primary">{meta.sentDate}</span></span>
          <span>Portal: <a href="#" onClick={(e) => { e.preventDefault(); window.open(portalUrl, "_blank"); }} className="text-alpine-violet hover:underline">{portalDisplayUrl}</a></span>
        </div>
        {emailExpanded && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="bg-br-surface rounded-lg p-4 text-[12px] text-br-text-secondary leading-relaxed border border-br/50">
              <p className="font-medium text-br-text-primary mb-2">Subject: Operational Due Diligence Document Request — {meta.fundName}</p>
              <p className="mb-3">Dear {meta.salutation},</p>
              <p className="mb-3">Thank you for taking the time to discuss {meta.fundName} with our team. As part of our standard operational due diligence review process, we are requesting the following documents to support our assessment:</p>
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
              <p className="mb-2">Please upload documents via the secure portal: <a href="#" onClick={(e) => { e.preventDefault(); window.open(portalUrl, "_blank"); }} className="text-alpine-violet hover:underline">{portalDisplayUrl}</a></p>
              <p className="mb-2">If any documents are not available, please let us know the expected delivery date or provide an explanation via the portal.</p>
              <p className="text-br-text-muted">Best regards,<br />Priya Sharma<br />{brandName} Alternative Investors — Operational Due Diligence</p>
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
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">{ACTIVE_DOCS.length} docs</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-br-text-muted">
            <span>{initialDocs} initial upload</span>
            <span>·</span>
            <span>{followUpDocs} from follow-up</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-br/30">
          {ACTIVE_DOCS.map((doc, i) => {
            const filename = doc.filename;
            const docUrl = doc.url;
            const isClickable = !!filename || !!docUrl;
            const Wrapper = isClickable ? "button" : "div";
            const handleClick = docUrl
              ? () => setViewingDoc({ name: doc.name, filename: docUrl })
              : filename
                ? () => setViewingDoc({ name: doc.name, filename })
                : undefined;
            return (
            <Wrapper
              key={i}
              {...(isClickable && handleClick ? { onClick: handleClick } : {})}
              className={`px-3 py-2 bg-br-card flex items-center justify-between w-full text-left ${isClickable ? "hover:bg-br-card-hover cursor-pointer group transition-colors" : ""}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`flex-shrink-0 ${isClickable ? "text-alpine-violet" : "text-br-text-muted"}`}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <span className={`text-[11px] truncate ${isClickable ? "text-alpine-violet font-medium group-hover:underline" : "text-br-text-primary"}`}>{doc.name}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                {isClickable && !doc.id && (
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-alpine-violet opacity-60"><circle cx="8" cy="8" r="3"/><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/></svg>
                )}
                <span className={`text-[9px] px-1 py-0.5 rounded ${
                  doc.source === "Manager Upload" ? "text-br-text-muted bg-br-surface" : "text-alpine-violet bg-alpine-violet/8"
                }`}>{doc.source === "Manager Upload" ? "Initial" : doc.source.replace("Follow-Up ", "R")}</span>
                {doc.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(doc.id!); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 hover:text-red-500"
                    style={{ color: "var(--color-br-text-muted)", lineHeight: 1 }}
                    title="Remove"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </Wrapper>
            );
          })}
        </div>

      </div>

      {/* Phase 3: AI Follow-Up Agent */}
      <FollowUpSection mock={mock} slug={slug} />
    </div>
    </>
  );
}
