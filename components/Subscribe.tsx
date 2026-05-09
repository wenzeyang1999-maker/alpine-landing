"use client";

import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.detail || "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(data.message || "You're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (variant === "compact") {
    return (
      <form onSubmit={onSubmit} className={`flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-sm ${className}`}>
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
        {message && status === "error" && (
          <span className="font-mono text-[11px] sm:ml-2 self-center" style={{ color: "#DC2626" }}>
            {message}
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
          {message && (
            <span
              className="font-mono text-[11px]"
              style={{ color: status === "success" ? GREEN : status === "error" ? "#DC2626" : MUTED }}
            >
              {message}
            </span>
          )}
        </form>
      </div>
    </section>
  );
}
