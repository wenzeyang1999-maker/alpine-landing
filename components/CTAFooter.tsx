import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BG_ALT, INK, SECONDARY, MUTED, BORDER, LS_BODY } from "@/lib/constants";

const FOOTER_LINKS = ["privacy", "terms", "contact"] as const;

export default function CTAFooter() {
  return (
    <section className="py-24 px-6" style={{ background: BG_ALT }}>

      {/* CTA block */}
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="font-heading"
          style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.04em", color: INK }}
        >
          Your next ODD review starts here.
        </h2>
        <p className="font-body mt-4" style={{ fontSize: "1.0625rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
          See what strategy-specific due diligence can do for your portfolio.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href="/early-access"
            className="rounded-btn px-6 py-2.5 font-body text-[13px] hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
            style={{ background: INK, color: "#fff", fontWeight: 500 }}
          >
            Book a Call <ArrowUpRight size={13} />
          </Link>
          <Link
            href="/early-access"
            className="rounded-btn px-6 py-2.5 font-body text-[13px] hover:opacity-90 transition-opacity"
            style={{ color: INK, border: `1px solid ${BORDER}`, fontWeight: 500 }}
          >
            Request a Demo
          </Link>
        </div>
      </div>

      {/* Footer bar */}
      <div
        className="mt-20 pt-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2.5">
          <Image src="/alpine-icon.svg" alt="Alpine" width={18} height={18} />
          <span className="font-mono text-[11px]" style={{ color: MUTED, letterSpacing: LS_BODY }}>
            &copy; 2026 Alpine Due Diligence Inc.
          </span>
        </div>
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="font-mono text-[11px] hover:opacity-70 transition-opacity capitalize"
              style={{ color: MUTED, letterSpacing: LS_BODY }}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
