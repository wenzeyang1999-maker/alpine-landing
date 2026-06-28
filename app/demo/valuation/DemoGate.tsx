"use client";
/** Password gate (DD9). Posts to the server-enforced auth route; on success, reloads
 *  so the server component re-checks the cookie and renders the workspace. */
import { useState } from "react";
import { BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER } from "@/lib/constants";

export default function DemoGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/demo/valuation/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setError(res.status === 401 ? "Incorrect password." : "Something went wrong.");
        setBusy(false);
      }
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: VIOLET }} />
          <span style={{ fontWeight: 500, color: INK, letterSpacing: "-0.2px" }}>Alpine ODD</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: INK, margin: "0 0 6px", letterSpacing: "-0.24px" }}>Chapter 4 demo</h1>
        <p style={{ fontSize: 13, color: SECONDARY, margin: "0 0 18px", lineHeight: 1.5 }}>
          Fund Structure, Terms &amp; Alignment, extracted from public SEC filings. Enter the access password to continue.
        </p>
        <label htmlFor="demo-pw" style={{ display: "block", fontSize: 12, color: MUTED, marginBottom: 6 }}>Access password</label>
        <input
          id="demo-pw" type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", height: 42, padding: "0 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: INK, background: "#fff", boxSizing: "border-box" }}
        />
        {error && <p role="alert" style={{ fontSize: 12.5, color: "#B45309", margin: "8px 0 0" }}>{error}</p>}
        <button type="submit" disabled={busy || !password} style={{ width: "100%", height: 42, marginTop: 16, background: VIOLET, color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: busy ? "default" : "pointer", opacity: busy || !password ? 0.6 : 1 }}>
          {busy ? "Checking…" : "Enter demo"}
        </button>
        <p style={{ fontSize: 11, color: MUTED, margin: "14px 0 0", lineHeight: 1.5 }}>
          Public filings only. Documents are processed by our AI sub-processor under zero-retention terms.
        </p>
      </form>
    </main>
  );
}
