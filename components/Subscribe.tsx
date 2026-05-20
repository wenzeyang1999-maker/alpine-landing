"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";

type Variant = "band" | "compact";

export default function Subscribe({
  variant = "band",
  source = "landing",
  className = "",
}: {
  variant?: Variant;
  source?: string;
  className?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

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
      // Read body for diagnostics, but never surface server text to the user.
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Subscribe error:", res.status, data);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      // Always show the same generic message on success — never trust server text.
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

  if (variant === "compact") {
    return (
      <form onSubmit={onSubmit} className={`flex flex-col gap-2 w-full max-w-sm ${className}`}>
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Name"
          maxLength={120}
          className="rounded-btn px-3 py-2 font-body text-[13px] outline-none focus:ring-2 transition-all"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            color: INK,
            letterSpacing: LS_BODY,
          }}
        />
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="email"
            required
            placeholder="name@firm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email for newsletter"
            className="flex-1 rounded-btn px-3 py-2 font-body text-[13px] outline-none focus:ring-2 transition-all"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: INK,
              letterSpacing: LS_BODY,
            }}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="rounded-btn px-4 py-2 font-body text-[13px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {status === "success" ? (
              <>
                <Check size={14} /> Subscribed
              </>
            ) : status === "loading" ? (
              "Subscribing…"
            ) : (
              <>
                Subscribe <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 cursor-pointer"
            style={{ accentColor: INK }}
            aria-label="Accept newsletter terms"
          />
          <span className="font-mono text-[11px] leading-snug" style={{ color: MUTED }}>
            I accept the{" "}
            <Link href="/newsletter-terms" target="_blank" className="underline" style={{ color: VIOLET }}>
              terms and conditions
            </Link>
            .
          </span>
        </label>
        {message && status === "error" && (
          <span className="font-mono text-[11px]" style={{ color: "#DC2626" }}>
            {message}
          </span>
        )}
        {status === "success" && (
          <span className="font-mono text-[11px]" style={{ color: GREEN }}>
            {message}
          </span>
        )}
        {status === "success" && (
          <span className="font-mono text-[11px]" style={{ color: MUTED }}>
            If you don&apos;t see it in 2 minutes, check your spam folder.
          </span>
        )}
      </form>
    );
  }

  // band variant — used as a horizontal section in the page footer area.
  return (
    <section
      id="subscribe"
      className={`py-12 px-6 ${className}`}
      style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-md">
          <p className="font-mono text-[11px] uppercase mb-2" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
            Subscribe
          </p>
          <h3
            className="font-heading"
            style={{ fontSize: "1.25rem", fontWeight: 700, color: INK, letterSpacing: "-0.025em", lineHeight: 1.2 }}
          >
            ODD insights, monthly. Practitioner-grade.
          </h3>
          <p className="font-body mt-2" style={{ fontSize: "0.875rem", color: SECONDARY, lineHeight: 1.55, letterSpacing: LS_BODY }}>
            New chapter breakdowns, allocator playbooks, and Alpine product updates. No spam.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full md:w-auto md:min-w-[360px]">
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Name"
            maxLength={120}
            className="rounded-btn px-4 py-3 font-body text-[14px] outline-none focus:ring-2 transition-all"
            style={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              color: INK,
              letterSpacing: LS_BODY,
            }}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="name@firm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email for newsletter"
              className="flex-1 rounded-btn px-4 py-3 font-body text-[14px] outline-none focus:ring-2 transition-all"
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
              className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: INK, color: "#fff", fontWeight: 600 }}
            >
              {status === "success" ? (
                <>
                  <Check size={14} /> Subscribed
                </>
              ) : status === "loading" ? (
                "Subscribing…"
              ) : (
                <>
                  Subscribe <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 cursor-pointer"
              style={{ accentColor: INK }}
              aria-label="Accept newsletter terms"
            />
            <span className="font-mono text-[11px] leading-snug" style={{ color: MUTED }}>
              I accept the{" "}
              <Link href="/newsletter-terms" target="_blank" className="underline" style={{ color: VIOLET }}>
                terms and conditions
              </Link>
              .
            </span>
          </label>
          <span className="font-mono text-[11px]" style={{ color: MUTED }}>
            You&apos;ll receive a confirmation email — the link is valid for 7 days.
          </span>
          {message && (
            <span
              className="font-mono text-[11px]"
              style={{ color: status === "success" ? GREEN : status === "error" ? "#DC2626" : MUTED }}
            >
              {message}
            </span>
          )}
          {status === "success" && (
            <span className="font-mono text-[11px]" style={{ color: MUTED }}>
              If you don&apos;t see it in 2 minutes, check your spam folder.
            </span>
          )}
        </form>
      </div>
    </section>
  );
}
