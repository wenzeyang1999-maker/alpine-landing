"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, LS_BODY, LS_H1,
} from "@/lib/constants";

export default function ManagerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/manager/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed. Please try again.");
        return;
      }
      window.location.href = data.redirect ?? "/manager/workspace";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ background: BG, color: INK }} className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/manager/landing" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 32, width: "auto" }} />
          <span
            className="font-mono text-[10px] uppercase pl-3"
            style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", borderLeft: `1px solid ${BORDER}` }}
          >
            For Managers
          </span>
        </Link>
        <Link
          href="/manager/signup"
          className="font-body text-[13px] hover:underline"
          style={{ color: SECONDARY }}
        >
          Create account →
        </Link>
      </nav>

      <section className="max-w-md mx-auto px-6 pt-12 pb-24">
        <p
          className="font-mono text-[11px] uppercase mb-4"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Sign in
        </p>
        <h1
          className="font-heading mb-3"
          style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: LS_H1, color: INK }}
        >
          Welcome back.
        </h1>
        <p
          className="font-body mb-8"
          style={{ fontSize: "1rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          Sign in to your manager workspace.
        </p>

        <form
          onSubmit={onSubmit}
          className="rounded-panel p-6 flex flex-col gap-4"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase" style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}>
              Work email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@firm.com"
              className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
              style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase" style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}>
              Password
            </span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-btn px-4 py-3 pr-11 font-body text-[14px]"
                style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: MUTED }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <p className="font-body text-[13px]" style={{ color: "#dc2626" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="rounded-btn px-4 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {submitting ? "Signing in…" : (<>Sign in <ArrowRight size={14} /></>)}
          </button>

          <p className="font-body text-[12px] text-center" style={{ color: MUTED }}>
            No account?{" "}
            <Link href="/manager/signup" className="hover:underline" style={{ color: SECONDARY }}>
              Create one →
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
