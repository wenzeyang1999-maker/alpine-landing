"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, LS_BODY, LS_H1,
} from "@/lib/constants";

function ManagerSignupInner() {
  const router = useRouter();
  // Arriving from the secure upload portal's workspace banner carries the
  // portal token; signup claims it so the firm's portal documents attach.
  const portalToken = useSearchParams().get("portal") ?? "";
  const [form, setForm] = useState({ email: "", password: "", full_name: "", firm_name: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/manager/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portalToken ? { ...form, portal_token: portalToken } : form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign-up failed. Please try again.");
        return;
      }
      // The firm's portal was already linked to an existing workspace; carry
      // that through so the pending page can point them at a team invite.
      const dest = data.redirect ?? "/manager/pending";
      router.push(data.portal_already_claimed ? `${dest}?portal=claimed` : dest);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = form.email && form.password && form.full_name && form.firm_name;

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
        <Link href="/manager/login" className="font-body text-[13px] hover:underline" style={{ color: SECONDARY }}>
          Sign in →
        </Link>
      </nav>

      <section className="max-w-md mx-auto px-6 pt-12 pb-24">
        <p
          className="font-mono text-[11px] uppercase mb-4"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Create account
        </p>
        <h1
          className="font-heading mb-3"
          style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: LS_H1, color: INK }}
        >
          Set up your workspace.
        </h1>
        <p
          className="font-body mb-8"
          style={{ fontSize: "1rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          Create your firm&rsquo;s Alpine account. Your workspace will be ready
          once our team verifies your firm — usually within 1 business day.
        </p>

        {portalToken && (
          <div
            className="rounded-panel px-4 py-3 mb-6 font-body text-[13px]"
            style={{ background: `${VIOLET}0d`, border: `1px solid ${VIOLET}40`, color: SECONDARY, lineHeight: 1.55 }}
          >
            <strong style={{ color: INK }}>Secure portal detected.</strong>{" "}
            The documents your firm has uploaded through its Alpine secure portal
            will be linked to this workspace automatically.
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="rounded-panel p-6 flex flex-col gap-4"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase" style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}>
              Firm name
            </span>
            <input
              type="text"
              value={form.firm_name}
              onChange={(e) => set("firm_name", e.target.value)}
              required
              autoComplete="organization"
              placeholder="Acme Capital Management"
              className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
              style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase" style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}>
              Your full name
            </span>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              required
              autoComplete="name"
              placeholder="Jane Smith"
              className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
              style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase" style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}>
              Work email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
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
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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
            disabled={submitting || !canSubmit}
            className="rounded-btn px-4 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {submitting ? "Creating account…" : (<>Create account <ArrowRight size={14} /></>)}
          </button>

          <p className="font-body text-[12px] text-center" style={{ color: MUTED }}>
            Already have an account?{" "}
            <Link href="/manager/login" className="hover:underline" style={{ color: SECONDARY }}>
              Sign in →
            </Link>
          </p>
        </form>

        <p
          className="font-body text-[12px] mt-6 text-center"
          style={{ color: MUTED, lineHeight: 1.6, letterSpacing: LS_BODY }}
        >
          By creating an account you agree to Alpine&rsquo;s{" "}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}

export default function ManagerSignup() {
  return (
    <Suspense>
      <ManagerSignupInner />
    </Suspense>
  );
}
