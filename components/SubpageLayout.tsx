import Link from "next/link";
import Image from "next/image";
import { BG, BG_ALT, INK, MUTED, GREEN, AMBER, VIOLET, BORDER } from "@/lib/constants";

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
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/alpine-icon.svg" alt="Alpine" width={32} height={32} />
              <div>
                <span className="font-heading font-emphasis text-[14px] block leading-none" style={{ color: INK }}>ALPINE</span>
                <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: GREEN }}>Due Diligence</span>
              </div>
            </Link>
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
