"use client";

import { useEffect, useState } from "react";
import { X, Check, Download } from "lucide-react";
import { BG_CARD, INK, MUTED, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";

const CONTACT_KEY = "alpine_last_contact";

export default function DownloadWhitepaperModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    // Always start with empty fields so placeholders ("Your name" / "name@firm.com")
    // are visible. Avoids leaking demo-session identities into the form.
    setName("");
    setEmail("");
    setStatus("idle");
    setMessage("");
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/whitepaper/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setStatus("error");
        setMessage((data?.error as string) || "Something went wrong. Please try again.");
        return;
      }
      try {
        localStorage.setItem(CONTACT_KEY, JSON.stringify({ name, email }));
      } catch { /* ignore */ }
      setStatus("success");
      setMessage("Sent. Check your inbox for the white paper.");
    } catch (err) {
      console.error("Whitepaper download network error:", err);
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
      style={{ background: "rgba(15,15,16,0.5)", backdropFilter: "blur(2px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-card overflow-hidden w-full max-w-md"
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 24px 64px rgba(15,15,16,0.25)",
        }}
      >
        <div className="relative px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            style={{ color: MUTED }}
            aria-label="Close download dialog"
          >
            <X size={16} />
          </button>
          <p
            className="font-mono text-[10px] uppercase mb-2"
            style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.12em" }}
          >
            White Paper · Download
          </p>
          <p
            className="font-heading"
            style={{ fontSize: 18, fontWeight: 700, color: INK, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 6 }}
          >
            Get your personal copy
          </p>
          <p className="font-body text-[13px]" style={{ color: MUTED, lineHeight: 1.55, marginBottom: 16 }}>
            Enter your name and email — we&apos;ll send a watermarked PDF straight to your inbox.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Name"
              disabled={status === "success"}
              maxLength={120}
              className="w-full rounded-btn px-3 py-2.5 font-body text-[14px] outline-none focus:ring-2 transition-all"
              style={{
                background: "#fff",
                border: `1px solid ${BORDER}`,
                color: INK,
                letterSpacing: LS_BODY,
              }}
            />
            <input
              type="email"
              required
              placeholder="name@firm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              disabled={status === "success"}
              className="w-full rounded-btn px-3 py-2.5 font-body text-[14px] outline-none focus:ring-2 transition-all"
              style={{
                background: "#fff",
                border: `1px solid ${BORDER}`,
                color: INK,
                letterSpacing: LS_BODY,
              }}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="mt-1 w-full rounded-btn px-4 py-3 font-body text-[14px] inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: INK, color: "#fff", fontWeight: 600 }}
            >
              {status === "success" ? (
                <><Check size={15} /> Sent</>
              ) : status === "loading" ? (
                "Sending…"
              ) : (
                <><Download size={15} /> Email me the PDF</>
              )}
            </button>

            {status === "idle" && (
              <span className="font-mono text-[10px]" style={{ color: MUTED }}>
                Each copy is watermarked with your name and email for confidentiality.
              </span>
            )}
            {message && (
              <span
                className="font-mono text-[11px] leading-relaxed"
                style={{ color: status === "success" ? GREEN : status === "error" ? "#DC2626" : MUTED }}
              >
                {message}
              </span>
            )}
            {status === "success" && (
              <span className="font-mono text-[10px]" style={{ color: MUTED }}>
                If you don&apos;t see it in 2 minutes, check your spam folder.
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
