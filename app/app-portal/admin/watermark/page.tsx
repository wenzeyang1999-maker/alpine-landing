"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const ADMIN_KEY = "alpine-admin-2026";

interface LogEntry {
  id: string;
  recipient_name: string;
  filename: string;
  distributed_by: string;
  watermarked_at: string;
}

type AuthState = "locked" | "unlocked";

export default function WatermarkPage() {
  const [auth, setAuth] = useState<AuthState>("locked");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [distributedBy, setDistributedBy] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/app-portal/watermark/logs", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth === "unlocked") fetchLogs();
  }, [auth, fetchLogs]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuth("unlocked");
    } else {
      setPasswordError("Incorrect password.");
    }
  };

  const handleFile = (f: File | null) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setStatus("idle");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !recipientName.trim()) return;

    setStatus("processing");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("recipientName", recipientName.trim());
      fd.append("distributedBy", distributedBy.trim() || "admin");
      if (recipientEmail.trim()) fd.append("recipientEmail", recipientEmail.trim());

      const res = await fetch("/api/app-portal/watermark", { method: "POST", body: fd });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Server error");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = recipientName.trim().replace(/\s+/g, "_");
      a.download = `${file.name.replace(".pdf", "")}_${safeName}_WATERMARKED.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setEmailSent(res.headers.get("X-Email-Sent") === "true");
      setStatus("done");
      setRecipientName("");
      setRecipientEmail("");
      fetchLogs();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  if (auth === "locked") {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "40px 40px", width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
              Alpine Due Diligence
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Admin Access</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Enter your admin password to continue.</div>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="Password"
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
            />
            {passwordError && (
              <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>{passwordError}</div>
            )}
            <button
              type="submit"
              style={{ width: "100%", padding: "11px", fontSize: 14, fontWeight: 600, color: "#fff", background: "#7c3aed", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.14em", textTransform: "uppercase" }}>Alpine Due Diligence</div>
            <div style={{ width: 1, height: 14, background: "#e2e8f0" }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>PDF Watermark Tool</div>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Admin Portal</div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Left — Upload + Form */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Generate Watermarked PDF</div>

            {/* Drop zone */}
            <div
              ref={dragRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${file ? "#7c3aed" : "#cbd5e1"}`,
                borderRadius: 10,
                padding: "28px 20px",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 20,
                background: file ? "#faf5ff" : "#f8fafc",
                transition: "all 0.15s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>{file.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>⬆️</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Drop PDF here or click to upload</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>PDF files only</div>
                </>
              )}
            </div>

            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. James Whitfield"
                  style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                  Recipient Email
                  <span style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8", textTransform: "none", letterSpacing: 0, marginLeft: 6 }}>— leave blank to download only</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="james@example.com"
                  style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                  Distributed By
                </label>
                <input
                  type="text"
                  value={distributedBy}
                  onChange={(e) => setDistributedBy(e.target.value)}
                  placeholder="Your name (optional)"
                  style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {status === "error" && (
                <div style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px" }}>
                  {errorMsg}
                </div>
              )}

              {status === "done" && (
                <div style={{ fontSize: 12, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px" }}>
                  ✓ Watermarked PDF downloaded and distribution logged.
                  {emailSent && " Email sent to recipient."}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || !recipientName.trim() || status === "processing"}
                style={{
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background: !file || !recipientName.trim() || status === "processing" ? "#94a3b8" : "#7c3aed",
                  border: "none",
                  borderRadius: 8,
                  cursor: !file || !recipientName.trim() || status === "processing" ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.15s",
                }}
              >
                {status === "processing" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Generate & Download Watermarked PDF
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right — Distribution Log */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Distribution Log</div>
              <button
                onClick={fetchLogs}
                style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                Refresh
              </button>
            </div>

            {logsLoading ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 13 }}>Loading…</div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>No distributions yet.</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recipient</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>File</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>By</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "8px 8px", color: "#0f172a", fontWeight: 600 }}>{log.recipient_name}</td>
                        <td style={{ padding: "8px 8px", color: "#64748b", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.filename}</td>
                        <td style={{ padding: "8px 8px", color: "#64748b" }}>{log.distributed_by}</td>
                        <td style={{ padding: "8px 8px", color: "#94a3b8" }}>
                          {new Date(log.watermarked_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
