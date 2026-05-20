"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, LS_BODY, LS_H1,
} from "@/lib/constants";
import { getFirm } from "@/lib/manager/local-state";

export default function ManagerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If a firm is already in localStorage, jump straight to the workspace.
  useEffect(() => {
    if (getFirm()) router.replace("/manager/workspace");
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // V1 preview: simulate magic-link send. Production: POST to
    // /api/manager/auth/request — server creates manager.magic_links row,
    // sends email via Resend, returns 200 on success.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 600);
  }

  return (
    <main style={{ background: BG, color: INK }} className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/alpine-logo-dark.svg?v=5"
            alt="Alpine Due Diligence"
            style={{ height: 32, width: "auto" }}
          />
          <span
            className="font-mono text-[10px] uppercase pl-3"
            style={{
              color: MUTED, fontWeight: 700, letterSpacing: "0.1em",
              borderLeft: `1px solid ${BORDER}`,
            }}
          >
            For Managers
          </span>
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
          {sent ? "Check your inbox." : "Welcome back."}
        </h1>
        <p
          className="font-body mb-8"
          style={{ fontSize: "1rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          {sent
            ? `We sent a one-time sign-in link to ${email}. It expires in 15 minutes.`
            : "Enter the email associated with your firm. We'll send a one-time sign-in link."}
        </p>

        {!sent ? (
          <form
            onSubmit={onSubmit}
            className="rounded-panel p-6 flex flex-col gap-4"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <label className="flex flex-col gap-2">
              <span
                className="font-mono text-[11px] uppercase"
                style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}
              >
                Work email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@firm.com"
                className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
                style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
              />
            </label>
            <button
              type="submit"
              disabled={submitting || !email}
              className="rounded-btn px-4 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: INK, color: "#fff", fontWeight: 600 }}
            >
              {submitting ? "Sending…" : (<>Send magic link <ArrowRight size={14} /></>)}
            </button>
            <p
              className="font-body text-[12px] text-center"
              style={{ color: MUTED }}
            >
              No account yet?{" "}
              <Link href="/" className="hover:underline" style={{ color: SECONDARY }}>
                Request an invite
              </Link>
            </p>
          </form>
        ) : (
          <div
            className="rounded-panel p-6 flex flex-col items-center text-center gap-3"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <Mail size={32} style={{ color: VIOLET }} />
            <p
              className="font-body"
              style={{ fontSize: "0.9375rem", color: SECONDARY, lineHeight: 1.55, letterSpacing: LS_BODY }}
            >
              Click the link in your email to sign in.<br />
              You can close this tab.
            </p>
            <button
              onClick={() => setSent(false)}
              className="font-body text-[12px] hover:underline mt-2"
              style={{ color: MUTED }}
            >
              Use a different email
            </button>
          </div>
        )}

        {/* V1 preview: jump straight to demo invite */}
        <div className="mt-10 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p
            className="font-mono text-[10px] uppercase mb-3"
            style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            V1 preview
          </p>
          <p
            className="font-body text-[13px]"
            style={{ color: SECONDARY, lineHeight: 1.55, letterSpacing: LS_BODY }}
          >
            Magic-link delivery isn&rsquo;t wired up yet in this preview build.
            You can try the workspace by accepting a{" "}
            <Link
              href="/manager/invite/demo-token"
              className="hover:underline"
              style={{ color: VIOLET, fontWeight: 600 }}
            >
              demo invite →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
