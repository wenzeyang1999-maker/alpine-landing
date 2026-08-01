"use client";

import { useEffect, useMemo, useState } from "react";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER } from "@/lib/app-portal/constants";

const TEAL = "#1f6e78";

interface Subscriber { email: string; name: string | null; subscribed_at: string | null }
interface Pub { href: string; category: string; title: string; description: string }
interface SendResult { sent: number; failed: number; recipient_count: number }

function fmtDate(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AnnounceForm() {
  const [href, setHref] = useState("");
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [subs, setSubs] = useState<Subscriber[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  const pub = useMemo(() => pubs.find((p) => p.href === href), [pubs, href]);

  // Load active subscribers + publications; default to all selected.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/app-portal/announce", { method: "GET" });
        const data = await res.json();
        if (!alive) return;
        if (!res.ok) { setLoadErr(data.error || "Failed to load subscribers"); return; }
        const list: Subscriber[] = data.subscribers ?? [];
        const pubList: Pub[] = data.publications ?? [];
        setSubs(list);
        setPubs(pubList);
        setHref(pubList[0]?.href ?? "");
        setSelected(new Set(list.map((s) => s.email)));
      } catch {
        if (alive) setLoadErr("Network error loading subscribers.");
      }
    })();
    return () => { alive = false; };
  }, []);

  const allSelected = subs !== null && subs.length > 0 && selected.size === subs.length;

  function toggleAll() {
    if (!subs) return;
    setSelected(allSelected ? new Set() : new Set(subs.map((s) => s.email)));
  }
  function toggle(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  }

  async function send() {
    if (!pub) return;
    if (selected.size === 0) { setError("Select at least one recipient."); return; }
    if (!window.confirm(`Send "${pub.title}" to ${selected.size} subscriber(s)?`)) return;
    setSending(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/app-portal/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          href,
          recipients: Array.from(selected),
          idempotency_key: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Send failed"); return; }
      setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0, recipient_count: data.recipient_count ?? selected.size });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  }

  const inputStyle: React.CSSProperties = { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, color: INK, width: "100%" };

  return (
    <div className="grid gap-6">
      {/* 1 — Pick a publication */}
      <div className="rounded-lg p-6 grid gap-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>1 · Publication</label>
        <select value={href} onChange={(e) => setHref(e.target.value)} style={inputStyle}>
          {pubs.map((p) => (
            <option key={p.href} value={p.href}>{p.category} — {p.title}</option>
          ))}
        </select>

        {/* Email preview */}
        {pub && (
          <div className="mt-2 rounded-md" style={{ border: `1px solid ${BORDER}`, background: "#fbfaf7", padding: "18px 20px" }}>
            <div className="font-mono text-[10px] uppercase" style={{ color: TEAL, fontWeight: 700, letterSpacing: "0.12em" }}>New from Alpine · {pub.category}</div>
            <div className="font-heading mt-1" style={{ fontSize: 17, fontWeight: 700, color: "#17323b", lineHeight: 1.3 }}>{pub.title}</div>
            <p className="font-body mt-2" style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{pub.description}</p>
            <span className="inline-block mt-3 rounded-btn" style={{ background: INK, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 16px" }}>Read the case study →</span>
            <p className="font-mono mt-3" style={{ fontSize: 11, color: SUBTLE }}>Subject: New from Alpine: {pub.title}</p>
          </div>
        )}
      </div>

      {/* 2 — Choose recipients */}
      <div className="rounded-lg p-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-3">
          <label className="font-body text-[13px]" style={{ color: SUBTLE, fontWeight: 600 }}>2 · Recipients (active subscribers)</label>
          <span className="font-mono text-[12px]" style={{ color: selected.size ? TEAL : MUTED, fontWeight: 700 }}>
            {selected.size} selected{subs ? ` / ${subs.length}` : ""}
          </span>
        </div>

        {loadErr ? (
          <p className="font-body text-sm" style={{ color: "#B91C1C" }}>{loadErr}</p>
        ) : subs === null ? (
          <p className="font-body text-sm" style={{ color: MUTED }}>Loading subscribers…</p>
        ) : subs.length === 0 ? (
          <p className="font-body text-sm" style={{ color: MUTED }}>No confirmed subscribers yet.</p>
        ) : (
          <>
            <label className="flex items-center gap-2 pb-2 mb-2 cursor-pointer select-none" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: INK }} />
              <span className="font-body text-[13px]" style={{ color: INK, fontWeight: 600 }}>Select all</span>
            </label>
            <div style={{ maxHeight: 320, overflowY: "auto" }} className="grid gap-1">
              {subs.map((s) => (
                <label key={s.email} className="flex items-center gap-3 px-2 py-2 rounded cursor-pointer select-none hover:bg-gray-50" style={{ background: selected.has(s.email) ? "#F1F7F7" : "transparent" }}>
                  <input type="checkbox" checked={selected.has(s.email)} onChange={() => toggle(s.email)} style={{ accentColor: INK }} />
                  <span className="font-mono text-[13px] flex-1 truncate" style={{ color: INK }}>{s.email}</span>
                  {s.name && <span className="font-body text-[12px] truncate" style={{ color: MUTED, maxWidth: 140 }}>{s.name}</span>}
                  <span className="font-body text-[11px]" style={{ color: SUBTLE }}>{fmtDate(s.subscribed_at)}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3 — Send */}
      {error && <p className="text-sm" style={{ color: "#B91C1C" }}>{error}</p>}
      {result && (
        <div className="rounded p-3 font-body text-[13px]" style={{ background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" }}>
          ✓ Sent {result.sent} · failed {result.failed} · of {result.recipient_count} selected.
        </div>
      )}
      <div className="flex items-center justify-end">
        <button
          onClick={send}
          disabled={sending || !pub || selected.size === 0}
          className="font-body text-sm px-6 py-3 rounded-md"
          style={{ background: INK, color: "#fff", fontWeight: 600, opacity: sending || selected.size === 0 ? 0.6 : 1, cursor: sending || selected.size === 0 ? "not-allowed" : "pointer" }}
        >
          {sending ? "Sending…" : `Send announcement to ${selected.size}`}
        </button>
      </div>
      <p className="font-body text-[12px]" style={{ color: SUBTLE }}>
        Emails send from notifications@alpinedd.com with an unsubscribe footer. A summary is sent to the admin after sending.
      </p>
    </div>
  );
}
