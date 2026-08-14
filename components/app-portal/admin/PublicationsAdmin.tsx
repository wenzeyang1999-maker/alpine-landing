"use client";

import { useEffect, useRef, useState } from "react";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER } from "@/lib/app-portal/constants";

const TEAL = "#1f6e78";

interface Pub {
  id: string;
  category: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  date_label: string;
  is_external: boolean;
  is_visible: boolean;
  pdf_path: string | null;
  published_at: string;
}

const inputStyle: React.CSSProperties = {
  background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8,
  padding: "10px 12px", fontSize: 14, color: INK, width: "100%",
};

export default function PublicationsAdmin() {
  const [pubs, setPubs] = useState<Pub[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [cta, setCta] = useState("Read publication →");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // Hand-authored readers (e.g. /case-study/allianz) are linked, not uploaded.
  const [href, setHref] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/app-portal/publications", { method: "GET" });
      const data = await res.json();
      if (!res.ok) { setLoadErr(data.error || "Failed to load"); return; }
      setPubs(data.publications ?? []);
    } catch {
      setLoadErr("Network error loading publications.");
    }
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setOk(null);
    const link = href.trim();
    if (!file && !link) { setError("Upload a PDF, or enter an internal link."); return; }
    if (link && !link.startsWith("/")) { setError("Internal link must start with / (e.g. /case-study/allianz)."); return; }
    if (!category.trim() || !title.trim() || !description.trim() || !publishedAt) {
      setError("Category, title, description, and publish date are required."); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      if (link) fd.append("href", link);
      else if (file) fd.append("file", file);
      fd.append("category", category.trim());
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("published_at", publishedAt);
      fd.append("cta", cta.trim());
      const res = await fetch("/api/app-portal/publications", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); return; }
      setOk(`Published "${data.publication.title}".`);
      setCategory(""); setTitle(""); setDescription(""); setPublishedAt(""); setCta("Read publication →");
      setFile(null); setHref(""); if (fileRef.current) fileRef.current.value = "";
      load();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(p: Pub) {
    await fetch(`/api/app-portal/publications/${p.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !p.is_visible }),
    });
    load();
  }

  async function remove(p: Pub) {
    if (!window.confirm(`Delete "${p.title}"? This removes it from the site${p.pdf_path ? " and deletes the PDF" : ""}.`)) return;
    await fetch(`/api/app-portal/publications/${p.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8">
      {/* Upload form */}
      <form onSubmit={submit} className="rounded-lg p-6 grid gap-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="font-body text-[15px]" style={{ color: INK, fontWeight: 700 }}>Add a publication</div>
        <p className="font-body text-[12.5px]" style={{ color: SUBTLE, marginTop: -8, lineHeight: 1.55 }}>
          Either upload a PDF, or link a hand-authored reader already built on the
          site (for example <code>/case-study/allianz</code>). Fill in one, not both.
        </p>

        <div className="grid gap-1.5">
          <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>PDF file</label>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            disabled={!!href.trim()}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="font-body text-[13px]"
            style={{ color: INK, opacity: href.trim() ? 0.45 : 1 }}
          />
        </div>

        <div className="grid gap-1.5">
          <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>
            or internal link
          </label>
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="/case-study/allianz"
            disabled={!!file}
            style={{ ...inputStyle, opacity: file ? 0.45 : 1 }}
          />
        </div>

        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-1.5">
            <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Case Study 6 / Whitepaper" style={inputStyle} />
          </div>
          <div className="grid gap-1.5">
            <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>Publish date &amp; time</label>
            <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The … Case: …" style={inputStyle} />
        </div>

        <div className="grid gap-1.5">
          <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="A structured analysis of …" style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div className="grid gap-1.5">
          <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>Button label</label>
          <input value={cta} onChange={(e) => setCta(e.target.value)} style={inputStyle} />
        </div>

        {error && <p className="text-sm" style={{ color: "#B91C1C" }}>{error}</p>}
        {ok && (
          <div className="rounded p-3 font-body text-[13px]" style={{ background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" }}>
            ✓ {ok}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="font-body text-sm px-6 py-3 rounded-md"
            style={{ background: INK, color: "#fff", fontWeight: 600, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </form>

      {/* Existing list */}
      <div className="rounded-lg p-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="font-body text-[15px] mb-4" style={{ color: INK, fontWeight: 700 }}>Current publications</div>
        {loadErr ? (
          <p className="font-body text-sm" style={{ color: "#B91C1C" }}>{loadErr}</p>
        ) : pubs === null ? (
          <p className="font-body text-sm" style={{ color: MUTED }}>Loading…</p>
        ) : pubs.length === 0 ? (
          <p className="font-body text-sm" style={{ color: MUTED }}>No publications yet.</p>
        ) : (
          <div className="grid gap-2">
            {pubs.map((p) => (
              <div key={p.id} className="flex items-start gap-3 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full" style={{ background: `${TEAL}15`, color: TEAL, fontWeight: 700, letterSpacing: "0.06em" }}>
                      {p.category}
                    </span>
                    <span className="font-mono text-[11px]" style={{ color: SUBTLE }}>{p.date_label}</span>
                    {!p.is_visible && <span className="font-mono text-[10px] uppercase" style={{ color: "#B91C1C" }}>hidden</span>}
                    {p.is_external && <span className="font-mono text-[10px] uppercase" style={{ color: MUTED }}>PDF</span>}
                  </div>
                  <div className="font-body text-[14px] mt-1 truncate" style={{ color: INK, fontWeight: 600 }}>{p.title}</div>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] underline truncate block" style={{ color: MUTED }}>{p.href}</a>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => toggleVisible(p)} className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: INK }}>
                    {p.is_visible ? "Hide" : "Show"}
                  </button>
                  <button type="button" onClick={() => remove(p)} className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: "#B91C1C" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
