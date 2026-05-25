/**
 * Shown to owners after signup, while Alpine reviews their firm.
 * Verified owners and invitees are redirected away by middleware before
 * reaching this page.
 */
import Link from "next/link";
import { Clock } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, AMBER, BORDER, LS_BODY,
} from "@/lib/constants";

export default function ManagerPending() {
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
        <form action="/api/manager/auth/logout" method="POST">
          <button
            type="submit"
            className="font-body text-[13px] hover:underline"
            style={{ color: MUTED, background: "none", border: "none", cursor: "pointer" }}
          >
            Sign out
          </button>
        </form>
      </nav>

      <section className="max-w-lg mx-auto px-6 pt-16 pb-24 text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
          style={{ background: `${AMBER}22` }}
        >
          <Clock size={26} style={{ color: AMBER }} />
        </div>

        <p
          className="font-mono text-[11px] uppercase mb-4"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Account under review
        </p>
        <h1
          className="font-heading mb-4"
          style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: INK }}
        >
          Your account is pending verification.
        </h1>
        <p
          className="font-body mb-8"
          style={{ fontSize: "1rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          The Alpine team reviews new accounts before granting workspace access.
          This usually takes less than 1 business day. You&rsquo;ll receive an
          email at the address you registered with once your account is approved.
        </p>

        <div
          className="rounded-panel p-6 text-left"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <h2
            className="font-heading mb-3"
            style={{ fontSize: "1rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}
          >
            While you wait
          </h2>
          <ul className="flex flex-col gap-2.5">
            {[
              "Check your email for a confirmation from the Alpine team.",
              "If you have questions, reply directly to azhang@alpinedd.com.",
              "Review the Alpine manager framework to prepare your DDQ responses.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span style={{ color: VIOLET, marginTop: 2, flexShrink: 0 }}>·</span>
                <span className="font-body text-[14px]" style={{ color: SECONDARY, lineHeight: 1.6, letterSpacing: LS_BODY }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-body text-[13px] mt-8" style={{ color: MUTED }}>
          Questions?{" "}
          <a href="mailto:azhang@alpinedd.com" className="hover:underline" style={{ color: SECONDARY }}>
            azhang@alpinedd.com
          </a>
        </p>
      </section>
    </main>
  );
}
