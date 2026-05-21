"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReferencedDoc } from "@/lib/investor/report-content";
import { INK, MUTED, SUBTLE, BORDER, BG_CARD, BG_ALT, VIOLET, GREEN, AMBER } from "@/lib/constants";

interface InvestorDoc {
  id: string;
  filename: string;
  file_size: number | null;
  status: "pending" | "processed";
  uploaded_at: string;
  processed_at: string | null;
}

const MAX_BYTES = 50 * 1024 * 1024;

// Light keyword doc-type detection — surfaces what a manager likely uploaded.
const DOC_TYPE_KEYWORDS: Array<[string, string[]]> = [
  ["Due Diligence Questionnaire", ["ddq", "due_diligence", "due-diligence"]],
  ["Form ADV", ["form_adv", "form-adv", "adv-era", "adv_era", "formadv"]],
  ["Limited Partnership Agreement", ["lpa"]],
  ["Private Placement Memorandum", ["ppm", "placement"]],
  ["Compliance Manual", ["compliance"]],
  ["Valuation Policy", ["valuation"]],
  ["Audited Financials", ["financial", "audit", "fy2024", "fy2025", "fy2023"]],
  ["Business Continuity Plan", ["bcp", "continuity"]],
  ["Incident Response Plan", ["incident"]],
  ["Information Security Policy", ["wisp", "infosec", "security"]],
  ["Subscription Agreement", ["subscription"]],
];

function guessDocType(filename: string): string | null {
  const f = filename.toLowerCase();
  for (const [label, kws] of DOC_TYPE_KEYWORDS) {
    if (kws.some((kw) => f.includes(kw))) return label;
  }
  return null;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function FileIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={VIOLET} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function StatusBadge({ status }: { status: "pending" | "processed" }) {
  if (status === "processed") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-card text-[11px] font-emphasis"
        style={{ background: `${GREEN}1A`, color: "#047857" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Processed into the report
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-card text-[11px] font-emphasis"
      style={{ background: `${AMBER}1F`, color: "#B45309" }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      Not yet processed into the report
    </span>
  );
}

export default function DocumentsPanel({
  slug,
  referencedDocs,
}: {
  slug: string;
  referencedDocs: ReferencedDoc[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<InvestorDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const loadDocs = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch(`/api/investor/documents?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error("load failed");
      const rows = await res.json();
      setDocs(Array.isArray(rows) ? rows : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      setUploadError("");
      const list = Array.from(files);
      if (list.length === 0) return;
      setUploading(true);
      for (const file of list) {
        if (file.size > MAX_BYTES) {
          setUploadError(`"${file.name}" is too large — the limit is 50 MB.`);
          continue;
        }
        if (!file.name.toLowerCase().endsWith(".pdf")) {
          setUploadError("Only PDF files can be uploaded.");
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", slug);
        try {
          const res = await fetch("/api/investor/documents", { method: "POST", body: formData });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            setUploadError(data?.error || "Upload failed — try again.");
            continue;
          }
          const row: InvestorDoc = await res.json();
          setDocs((prev) => [row, ...prev]);
        } catch {
          setUploadError("Upload failed — check your connection and try again.");
        }
      }
      setUploading(false);
    },
    [slug],
  );

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/investor/documents?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch {
      /* leave the row in place on failure */
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
          Documents
        </h3>
        <p className="font-body text-sm mt-1" style={{ color: MUTED }}>
          The source documents behind this report, and a place to send Alpine
          anything further.
        </p>
      </div>

      {/* ── Referenced documents ───────────────────────────────────────── */}
      {referencedDocs.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: SUBTLE }}>
            Referenced Documents
          </p>
          <p className="font-body text-[13px] mb-2.5" style={{ color: MUTED }}>
            {referencedDocs.length} source document{referencedDocs.length === 1 ? "" : "s"} Alpine
            reviewed to produce this report.
          </p>
          <ul className="space-y-2">
            {referencedDocs.map((doc) => (
              <li
                key={doc.filename}
                className="rounded-panel border p-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: BG_CARD, borderColor: BORDER }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileIcon />
                  <div className="min-w-0">
                    <p className="font-body text-sm font-emphasis truncate" style={{ color: INK }}>
                      {doc.name}
                    </p>
                    <p className="font-body text-xs" style={{ color: SUBTLE }}>
                      {doc.type}
                    </p>
                  </div>
                </div>
                <a
                  href={doc.url}
                  download={doc.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 font-body text-[13px] font-emphasis px-3 py-1.5 rounded-btn min-h-[36px] transition-opacity hover:opacity-80"
                  style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Your uploads ───────────────────────────────────────────────── */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: SUBTLE }}>
          Your Uploads
        </p>
        <p className="font-body text-[13px] mb-2.5" style={{ color: MUTED }}>
          Send Alpine supporting documents for this review. Your analyst is
          notified and will incorporate them — each shows whether it has been
          processed into the report yet.
        </p>

        {/* Upload zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a PDF document"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
          }}
          className="rounded-panel border-2 border-dashed p-6 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragOver ? VIOLET : BORDER,
            background: dragOver ? `${VIOLET}0D` : BG_ALT,
          }}
        >
          <svg
            width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragOver ? VIOLET : SUBTLE}
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"
            aria-hidden
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-body text-sm font-emphasis" style={{ color: INK }}>
            {uploading ? "Uploading…" : "Drag a PDF here, or click to browse"}
          </p>
          <p className="font-body text-xs mt-1" style={{ color: SUBTLE }}>
            PDF only · up to 50 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {uploadError && (
          <p className="font-body text-sm mt-2" style={{ color: "#B91C1C" }} aria-live="polite">
            {uploadError}
          </p>
        )}

        {/* Uploaded document list */}
        <div className="mt-3">
          {loading ? (
            <p className="font-body text-sm" style={{ color: MUTED }}>
              Loading documents…
            </p>
          ) : loadError ? (
            <div className="flex items-center gap-3">
              <p className="font-body text-sm" style={{ color: MUTED }}>
                Couldn&apos;t load your documents.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  loadDocs();
                }}
                className="font-body text-sm font-emphasis underline"
                style={{ color: VIOLET }}
              >
                Try again
              </button>
            </div>
          ) : docs.length === 0 ? (
            <p className="font-body text-sm" style={{ color: MUTED }}>
              No documents uploaded yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {docs.map((doc) => {
                const docType = guessDocType(doc.filename);
                return (
                  <li
                    key={doc.id}
                    className="rounded-panel border p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    style={{ background: BG_CARD, borderColor: BORDER }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileIcon />
                        <span className="font-body text-sm font-emphasis truncate" style={{ color: INK }}>
                          {doc.filename}
                        </span>
                      </div>
                      <p className="font-body text-xs mt-1" style={{ color: SUBTLE }}>
                        {[docType, formatBytes(doc.file_size), formatDate(doc.uploaded_at)]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={doc.status} />
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        aria-label={`Remove ${doc.filename}`}
                        className="font-body text-xs underline transition-opacity hover:opacity-70 min-h-[36px] px-1"
                        style={{ color: MUTED }}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
