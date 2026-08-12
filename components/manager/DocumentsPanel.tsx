"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Trash2, Download, Loader2 } from "lucide-react";
import {
  BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, BORDER_SUBTLE, LS_BODY,
} from "@/lib/constants";

interface Doc {
  id: string;
  filename: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
  url: string | null;
  // "portal" rows arrived via the firm's secure upload portal (read-only here);
  // "workspace" (or absent) rows are the manager's own uploads.
  source?: "portal" | "workspace";
}

function fmtBytes(n: number | null): string {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DocumentsPanel() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/manager/documents");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setDocs(data.docs ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load documents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/manager/documents/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch("/api/manager/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Could not delete document.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div
      className="rounded-panel overflow-hidden"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <p className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
          Documents
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-btn px-3 py-1.5 font-body text-[12px] hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ background: INK, color: "#fff", fontWeight: 600 }}
        >
          {uploading
            ? <Loader2 size={12} className="animate-spin" />
            : <Upload size={12} />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
          onChange={handleUpload}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-2 font-body text-[12px]" style={{ color: "#B91C1C", background: "#FEF2F2" }}>
          {error}
        </div>
      )}

      {/* List */}
      <div className="divide-y" style={{ borderColor: BORDER_SUBTLE }}>
        {loading ? (
          <div className="px-5 py-8 flex items-center justify-center">
            <Loader2 size={18} className="animate-spin" style={{ color: MUTED }} />
          </div>
        ) : docs.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <FileText size={22} style={{ color: MUTED, margin: "0 auto 8px" }} />
            <p className="font-body text-[13px]" style={{ color: MUTED, letterSpacing: LS_BODY }}>
              No files uploaded yet.
            </p>
          </div>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="px-5 py-3 flex items-center gap-3 group">
              <FileText size={15} className="shrink-0" style={{ color: VIOLET }} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-[13px] truncate" style={{ color: INK, fontWeight: 500 }}>
                  {doc.filename}
                </p>
                <p className="font-mono text-[10px]" style={{ color: MUTED, letterSpacing: "0.04em" }}>
                  {fmtBytes(doc.file_size)} · {fmtDate(doc.uploaded_at)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {doc.source === "portal" && (
                  <span
                    className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-full mr-1"
                    style={{ background: `${VIOLET}12`, color: VIOLET, fontWeight: 700, letterSpacing: "0.06em" }}
                    title="Received via your firm's secure upload portal"
                  >
                    via secure portal
                  </span>
                )}
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download size={13} style={{ color: SECONDARY }} />
                  </a>
                )}
                {doc.source !== "portal" && (
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-40"
                  title="Delete"
                >
                  {deletingId === doc.id
                    ? <Loader2 size={13} className="animate-spin" style={{ color: MUTED }} />
                    : <Trash2 size={13} style={{ color: "#EF4444" }} />}
                </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-5 py-2.5 flex items-center justify-between" style={{ borderTop: `1px solid ${BORDER_SUBTLE}` }}>
        <p className="font-mono text-[10px]" style={{ color: MUTED, letterSpacing: "0.04em" }}>
          max 20 MB per file
        </p>
        <span
          className="font-mono text-[11px] px-2 py-0.5 rounded-full"
          style={{
            background: docs.filter((d) => d.source !== "portal").length >= 14 ? `${VIOLET}15` : `${BORDER}`,
            color: docs.filter((d) => d.source !== "portal").length >= 14 ? VIOLET : MUTED,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {/* Portal-received docs do not count toward the upload cap */}
          {docs.filter((d) => d.source !== "portal").length}/14
        </span>
      </div>
    </div>
  );
}
