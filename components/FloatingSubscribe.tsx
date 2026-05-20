"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { BG_CARD, INK, MUTED, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";

export default function FloatingSubscribe({
  source = "whitepaper",
  heading = "Subscribe for our bi-weekly case analysis",
}: {
  source?: string;
  heading?: string;
}) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!agreed) {
      setStatus("error");
      setMessage("Please accept the terms to continue.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, name }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Subscribe error:", res.status, data);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("Almost there. Check your email to confirm your subscription.");
      try {
        localStorage.setItem("alpine_last_contact", JSON.stringify({ name, email }));
      } catch { /* ignore */ }
      setName("");
      setEmail("");
      setAgreed(false);
    } catch (err) {
      console.error("Subscribe network error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setStatus("idle"); setMessage(""); }}
        className="fixed bottom-6 right-6 z-50 rounded-full px-5 py-3 font-body text-[13px] shadow-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        style={{ background: INK, color: "#fff", fontWeight: 600, letterSpacing: LS_BODY }}
        aria-label="Open subscribe widget"
      >
        Subscribe <ArrowRight size={13} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-card overflow-hidden"
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 12px 36px rgba(15,15,16,0.15)",
        width: 340,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <div className="relative px-5 pt-5 pb-4">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          style={{ color: MUTED }}
          aria-label="Dismiss subscribe widget"
        >
          <X size={14} />
        </button>
        <p
          className="font-mono text-[10px] uppercase mb-2"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.12em" }}
        >
          Subscribe
        </p>
        <p
          className="font-heading"
          style={{ fontSize: 15, fontWeight: 700, color: INK, letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 12 }}
        >
          {heading}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Name"
            disabled={status === "success"}
            maxLength={120}
            className="w-full rounded-btn px-3 py-2 font-body text-[13px] outline-none focus:ring-2 transition-all"
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
            aria-label="Email for newsletter"
            disabled={status === "success"}
            className="w-full rounded-btn px-3 py-2 font-body text-[13px] outline-none focus:ring-2 transition-all"
            style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              color: INK,
              letterSpacing: LS_BODY,
            }}
          />
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={status === "success"}
              className="mt-0.5 cursor-pointer"
              style={{ accentColor: INK }}
              aria-label="Accept newsletter terms"
            />
            <span className="font-mono text-[10px] leading-snug" style={{ color: MUTED }}>
              I agree to Alpine&apos;s{" "}
              <Link href="/newsletter-terms" target="_blank" className="underline" style={{ color: VIOLET }}>
                newsletter terms
              </Link>
              , including use by Alpine and partners.
            </span>
          </label>
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full rounded-btn px-4 py-2.5 font-body text-[13px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {status === "success" ? (
              <><Check size={14} /> Subscribed</>
            ) : status === "loading" ? (
              "Subscribing…"
            ) : (
              <>Subscribe <ArrowRight size={13} /></>
            )}
          </button>

          {status === "idle" && (
            <span className="font-mono text-[10px]" style={{ color: MUTED }}>
              You&apos;ll receive a confirmation email — the link is valid for 7 days.
            </span>
          )}
          {message && (
            <span
              className="font-mono text-[10px] leading-relaxed"
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
  );
}
