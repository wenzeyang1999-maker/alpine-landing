import Link from "next/link";
import Image from "next/image";
import { BG_CARD, INK, MUTED, VIOLET, GREEN, AMBER, BORDER } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Engine",  href: "#engine"  },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Team",    href: "#team"    },
  { label: "Blog",    href: "#blog"    },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Linear-style gradient bar — 1px, Alpine colors */}
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${VIOLET})`
      }} />

      <div style={{
        background: `${BG_CARD}f2`,
        borderBottom: `1px solid ${BORDER}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto px-6 h-[5rem]">
          {/* Logo */}
          <Link href="/" className="flex h-full items-center">
            <Image
              src="/alpine-logo-new.png"
              alt="Alpine Due Diligence"
              width={200}
              height={64}
              style={{ height: 46, width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-body text-[15px] transition-colors hover:opacity-100"
                style={{
                  color: MUTED,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/early-access"
              className="hidden sm:inline-flex text-[15px] font-body transition-colors hover:opacity-80"
              style={{ color: MUTED, fontWeight: 600 }}
            >
              Request Demo
            </Link>
            <Link
              href="/early-access"
              className="inline-flex items-center rounded-btn px-5 py-2.5 text-[15px] font-body hover:opacity-90 transition-opacity"
              style={{
                background: VIOLET,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
