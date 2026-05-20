import Link from "next/link";
import Image from "next/image";
import { BG, BG_ALT, INK, MUTED, GREEN, AMBER, VIOLET, BORDER } from "@/lib/app-portal/constants";

interface SubpageLayoutProps {
  children: React.ReactNode;
}

export default function SubpageLayout({ children }: SubpageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Header */}
      <header>
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${VIOLET})` }} />
        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" style={{
                display: "flex", alignItems: "center", gap: 6, textDecoration: "none",
                fontSize: 13, fontWeight: 600, color: INK,
                padding: "6px 14px", borderRadius: 6,
                border: `1px solid ${BORDER}`,
                background: "rgba(0,0,0,0.03)",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Home
              </Link>
              <span style={{ width: 1, height: 20, background: BORDER }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 40, width: "auto" }} />
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      {children}

      {/* Footer */}
      <footer style={{ background: BG_ALT }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2.5">
            <Image src="/alpine-icon.svg" alt="Alpine" width={20} height={20} />
            <span className="font-mono text-[11px]" style={{ color: MUTED }}>&copy; 2026 Alpine Due Diligence Inc.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="font-sans text-[11px] hover:opacity-70 transition-opacity py-2" style={{ color: MUTED }}>Privacy</Link>
            <Link href="/terms" className="font-sans text-[11px] hover:opacity-70 transition-opacity py-2" style={{ color: MUTED }}>Terms</Link>
            <Link href="/contact" className="font-sans text-[11px] hover:opacity-70 transition-opacity py-2" style={{ color: MUTED }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
