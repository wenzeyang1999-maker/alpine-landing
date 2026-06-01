"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, X, Check, Loader2 } from "lucide-react";
import { VIOLET, MUTED, INK, SECONDARY, BG_CARD, BORDER } from "@/lib/constants";

export interface Doc {
  id: string;
  filename: string;
  file_size: number | null;
  uploaded_at: string;
  url: string | null;
}

interface Props {
  questionId: string;
  chapterNum: number;
  sourceDocumentId?: string;
  sourceDocumentName?: string;
  sourceQuote?: string;
  docs: Doc[];
  onSave: (sourceDocumentId: string | null, sourceQuote: string | null) => Promise<void>;
}

export function AnswerRef({
  questionId,
  chapterNum,
  sourceDocumentId,
  sourceDocumentName,
  sourceQuote,
  docs,
  onSave,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(sourceDocumentId ?? "");
  const [quote, setQuote] = useState(sourceQuote ?? "");
  const [saving, setSaving] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dotRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const hasRef = !!sourceDocumentId;

  // Sync props → local state when they change (e.g. after save)
  useEffect(() => {
    if (!open) {
      setSelectedDocId(sourceDocumentId ?? "");
      setQuote(sourceQuote ?? "");
      setEditing(false);
    }
  }, [open, sourceDocumentId, sourceQuote]);

  function handleOpen() {
    if (dotRef.current) {
      const rect = dotRef.current.getBoundingClientRect();
      const popW = 340;
      let left = rect.left + rect.width / 2 - popW / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
      let top = rect.bottom + 8;
      if (top + 320 > window.innerHeight) top = rect.top - 328;
      setPos({ top, left });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (
        popRef.current && !popRef.current.contains(e.target as Node) &&
        dotRef.current && !dotRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(selectedDocId || null, quote.trim() || null);
      setEditing(false);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setSaving(true);
    try {
      await onSave(null, null);
      setSelectedDocId("");
      setQuote("");
      setEditing(false);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const showEdit = !hasRef || editing;
  const refDocName = sourceDocumentName ?? docs.find((d) => d.id === sourceDocumentId)?.filename;

  return (
    <>
      <button
        ref={dotRef}
        type="button"
        onClick={handleOpen}
        title={hasRef ? `Source: ${refDocName}` : "Add source reference"}
        className="inline-flex items-center justify-center align-middle ml-1.5 transition-all"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: hasRef ? VIOLET : "transparent",
          border: hasRef ? "none" : `1.5px solid ${MUTED}`,
          cursor: "pointer",
          opacity: hasRef ? 1 : 0.4,
          flexShrink: 0,
        }}
        aria-label="Document reference"
      />

      {open && (
        <div
          ref={popRef}
          className="fixed z-[200] shadow-2xl overflow-hidden"
          style={{
            top: pos.top,
            left: pos.left,
            width: 340,
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            animation: "refPopIn 0.12s ease-out",
          }}
        >
          <style>{`
            @keyframes refPopIn {
              from { opacity: 0; transform: translateY(-4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: hasRef ? VIOLET : MUTED }}
              />
              <span className="font-mono text-[11px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                Source Reference
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-0.5 rounded hover:opacity-60"
            >
              <X size={13} style={{ color: MUTED }} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {!showEdit && hasRef ? (
              // View mode
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <FileText size={14} className="mt-0.5 shrink-0" style={{ color: VIOLET }} />
                  <div>
                    <p className="font-body text-[13px]" style={{ color: INK, fontWeight: 600, lineHeight: 1.4 }}>
                      {refDocName ?? "Document"}
                    </p>
                    {sourceQuote && (
                      <p
                        className="font-body text-[12px] mt-1 italic"
                        style={{ color: SECONDARY, lineHeight: 1.5, borderLeft: `2px solid ${VIOLET}`, paddingLeft: 8 }}
                      >
                        "{sourceQuote}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedDocId(sourceDocumentId ?? ""); setQuote(sourceQuote ?? ""); setEditing(true); }}
                    className="font-body text-[12px] px-3 py-1.5 rounded-btn hover:opacity-80 transition-opacity"
                    style={{ border: `1px solid ${BORDER}`, color: SECONDARY, fontWeight: 500 }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={saving}
                    className="font-body text-[12px] px-3 py-1.5 rounded-btn hover:opacity-80 transition-opacity disabled:opacity-40"
                    style={{ border: `1px solid #fca5a5`, color: "#ef4444", fontWeight: 500 }}
                  >
                    {saving ? <Loader2 size={11} className="animate-spin" /> : "Remove"}
                  </button>
                </div>
              </div>
            ) : (
              // Edit / add mode
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                    Document
                  </label>
                  {docs.length === 0 ? (
                    <p className="font-body text-[12px]" style={{ color: MUTED }}>
                      No documents uploaded yet. Upload a PDF from the workspace.
                    </p>
                  ) : (
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="w-full rounded-btn px-3 py-2 font-body text-[13px]"
                      style={{ background: "transparent", border: `1px solid ${BORDER}`, color: INK }}
                    >
                      <option value="">— Select a document —</option>
                      {docs.map((d) => (
                        <option key={d.id} value={d.id}>{d.filename}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                    Excerpt <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Paste the relevant passage from the document…"
                    className="w-full rounded-btn px-3 py-2 font-body text-[12px] resize-none"
                    style={{ background: "transparent", border: `1px solid ${BORDER}`, color: INK, lineHeight: 1.5 }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!selectedDocId || saving}
                    className="flex-1 rounded-btn px-3 py-2 font-body text-[12px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40"
                    style={{ background: INK, color: "#fff", fontWeight: 600 }}
                  >
                    {saving
                      ? <Loader2 size={11} className="animate-spin" />
                      : <Check size={11} />}
                    {saving ? "Saving…" : "Save reference"}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-btn px-3 py-2 font-body text-[12px] hover:opacity-80"
                      style={{ border: `1px solid ${BORDER}`, color: SECONDARY }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
