"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, LS_BODY, LS_H1, LS_H3,
} from "@/lib/constants";
import { saveFirm } from "@/lib/manager/local-state";

// V1 PREVIEW NOTE: any token value is accepted in this client-side prototype.
// Production: server-side validation against manager.invites (token_hash, expiry, status).
// Invite metadata (invitedBy, hint) is mocked for demo.

const MOCK_INVITE = {
  email: "you@firm.com",
  firmNameHint: "",
  invitedBy: "An allocator using Alpine",
  expiresAt: "in 14 days",
};

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();

  const [firmName, setFirmName] = useState(MOCK_INVITE.firmNameHint);
  const [contactEmail, setContactEmail] = useState(MOCK_INVITE.email);
  const [domicile, setDomicile] = useState("");
  const [founded, setFounded] = useState("");
  const [aum, setAum] = useState("");
  const [strategy, setStrategy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    saveFirm({
      name: firmName.trim(),
      contactEmail: contactEmail.trim(),
      domicile: domicile.trim() || undefined,
      founded: founded.trim() || undefined,
      aum: aum.trim() || undefined,
      strategy: strategy.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    // Small delay so the button state reads as "Setting up…"
    setTimeout(() => router.push("/manager/workspace"), 300);
  }

  return (
    <main style={{ background: BG, color: INK }} className="min-h-screen">
      {/* Nav */}
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
              color: MUTED,
              fontWeight: 700,
              letterSpacing: "0.1em",
              borderLeft: `1px solid ${BORDER}`,
            }}
          >
            For Managers
          </span>
        </Link>
        <span
          className="font-mono text-[10px] uppercase"
          style={{ color: MUTED, letterSpacing: "0.1em", fontWeight: 600 }}
        >
          Invite · expires {MOCK_INVITE.expiresAt}
        </span>
      </nav>

      <section className="max-w-2xl mx-auto px-6 pt-8 pb-24">
        <p
          className="font-mono text-[11px] uppercase mb-4"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Welcome
        </p>
        <h1
          className="font-heading mb-3"
          style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: LS_H1,
            color: INK,
          }}
        >
          Let&rsquo;s set up your firm.
        </h1>
        <p
          className="font-body mb-10"
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.6,
            color: SECONDARY,
            letterSpacing: LS_BODY,
          }}
        >
          You&rsquo;re here because {MOCK_INVITE.invitedBy} invited you. This
          one-time setup creates your Living DDQ workspace. Takes about 90
          seconds. Everything else can be edited later.
        </p>

        <form
          onSubmit={onSubmit}
          className="rounded-panel p-6 sm:p-8 flex flex-col gap-5"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <Field label="Firm name" required>
            <input
              type="text"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              required
              placeholder="Aurora Capital Management"
              className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
              style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
            />
          </Field>

          <Field label="Contact email" required helper="We'll send all magic links here.">
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
              style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Domicile" helper="e.g. Delaware LP">
              <input
                type="text"
                value={domicile}
                onChange={(e) => setDomicile(e.target.value)}
                placeholder="Delaware LP + Cayman feeder"
                className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
                style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
              />
            </Field>

            <Field label="Founded" helper="Year and month">
              <input
                type="text"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="June 2018"
                className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
                style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="AUM" helper="Approximate, USD">
              <input
                type="text"
                value={aum}
                onChange={(e) => setAum(e.target.value)}
                placeholder="$250M"
                className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
                style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
              />
            </Field>

            <Field label="Primary strategy">
              <input
                type="text"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Early-stage venture"
                className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
                style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
              />
            </Field>
          </div>

          <p
            className="font-body text-[12px]"
            style={{ color: MUTED, lineHeight: 1.55, letterSpacing: LS_BODY }}
          >
            By continuing, you confirm you&rsquo;re authorized to share due
            diligence information on behalf of this firm. Your data is encrypted,
            never used to train any model, and only visible to allocators you
            explicitly share with.
          </p>

          <button
            type="submit"
            disabled={submitting || firmName.trim().length === 0}
            className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {submitting ? "Setting up workspace…" : (<>Continue <ArrowRight size={14} /></>)}
          </button>
        </form>

        <p
          className="font-mono text-[10px] uppercase mt-6 text-center"
          style={{ color: MUTED, letterSpacing: "0.1em" }}
        >
          Token · {params.token.slice(0, 8)}…
        </p>
      </section>
    </main>
  );
}

function Field({
  label, required, helper, children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between">
        <span
          className="font-mono text-[11px] uppercase"
          style={{ color: SECONDARY, fontWeight: 700, letterSpacing: "0.08em" }}
        >
          {label}{required && <span style={{ color: VIOLET }}> *</span>}
        </span>
        {helper && (
          <span className="font-body text-[11px]" style={{ color: MUTED }}>
            {helper}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
