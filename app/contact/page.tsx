import type { Metadata } from "next";
import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import Subscribe from "@/components/Subscribe";
import { ArrowUpRight } from "lucide-react";
import { INK, SECONDARY, MUTED, VIOLET, BG_CARD, BORDER, LS_BODY, LS_H3 } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact | Alpine Due Diligence",
};

const FOUNDERS = [
  { role: "Co-Founder · CEO",             name: "Allen Zhang", email: "azhang@alpinedd.com" },
  { role: "Co-Founder · Managing Partner", name: "Eva Yang",    email: "eva.yang@alpinedd.com" },
];

export default function ContactPage() {
  return (
    <SubpageLayout>
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <h1 className="font-heading font-emphasis text-3xl" style={{ color: INK }}>Contact</h1>
        <p className="mt-2 text-sm font-mono" style={{ color: MUTED }}>Alpine Due Diligence Inc.</p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/early-access"
            className="rounded-btn px-6 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            Book a Demo <ArrowUpRight size={13} />
          </Link>
          <a
            href="https://www.linkedin.com/company/alpine-due-diligence/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-btn px-6 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ color: INK, border: `1px solid ${BORDER}`, background: BG_CARD, fontWeight: 500 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
            </svg>
            Company LinkedIn
          </a>
        </div>

        {/* Founder emails */}
        <div className="mt-10">
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
            Founders
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FOUNDERS.map((f) => (
              <div
                key={f.email}
                className="rounded-card p-4"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                <p className="font-mono text-[10px] uppercase mb-1" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
                  {f.role}
                </p>
                <p className="font-heading mb-2" style={{ fontSize: "1rem", fontWeight: 700, color: INK, letterSpacing: LS_H3 }}>
                  {f.name}
                </p>
                <a
                  href={`mailto:${f.email}`}
                  className="font-body text-[13px] hover:underline"
                  style={{ color: VIOLET, letterSpacing: LS_BODY }}
                >
                  {f.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12">
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
            Stay in the loop
          </p>
          <p className="font-body text-[14px] mb-4" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
            ODD insights, monthly. Practitioner-grade. No spam.
          </p>
          <Subscribe variant="compact" source="contact" />
        </div>
      </main>
    </SubpageLayout>
  );
}
