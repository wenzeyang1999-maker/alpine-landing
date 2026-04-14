"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BG, BG_CARD, INK, MUTED, VIOLET, GREEN, AMBER, BORDER } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Engine",  href: "#engine"  },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog",    href: "#blog"    },
  { label: "Team",    href: "#team"    },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
          <Link href="/" className="flex h-full items-center" onClick={() => setOpen(false)}>
            <Image
              src="/alpine-logo-dark.svg"
              alt="Alpine Due Diligence"
              width={200}
              height={64}
              style={{ height: 48, width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-body text-[15.5px] transition-opacity hover:opacity-100"
                style={{
                  color: MUTED,
                  fontWeight: 500,
                  letterSpacing: "0",
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs + mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/early-access"
              className="hidden md:inline-flex text-[15px] font-body transition-colors hover:opacity-80"
              style={{ color: MUTED, fontWeight: 600 }}
            >
              Request Demo
            </Link>
            <Link
              href="/early-access"
              className="hidden md:inline-flex items-center rounded-btn px-5 py-2.5 text-[15px] font-body hover:opacity-90 transition-opacity"
              style={{
                background: VIOLET,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Book a Call
            </Link>

            {/* Hamburger button — mobile only */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-btn transition-colors hover:bg-gray-100"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <motion.span
                className="block w-5 h-px rounded-full"
                style={{ background: INK }}
                animate={open ? { rotate: 45, y: 1.5 } : { rotate: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-px rounded-full"
                style={{ background: INK }}
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block w-5 h-px rounded-full"
                style={{ background: INK }}
                animate={open ? { rotate: -45, y: -1.5 } : { rotate: 0, y: 3 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden"
            style={{
              background: BG_CARD,
              borderBottom: `1px solid ${BORDER}`,
              boxShadow: "0 8px 24px rgba(15,15,16,0.08)",
            }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center py-3 font-body text-[16px] border-b last:border-b-0"
                  style={{
                    color: INK,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    borderColor: BORDER,
                  }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.04 }}
                >
                  {label}
                </motion.a>
              ))}

              {/* Mobile CTAs */}
              <div className="flex flex-col gap-2 pt-4 pb-2">
                <Link
                  href="/early-access"
                  onClick={() => setOpen(false)}
                  className="w-full text-center rounded-btn px-5 py-3 font-body text-[15px] hover:opacity-90 transition-opacity"
                  style={{
                    background: VIOLET,
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Book a Call
                </Link>
                <Link
                  href="/early-access"
                  onClick={() => setOpen(false)}
                  className="w-full text-center rounded-btn px-5 py-3 font-body text-[15px] hover:opacity-80 transition-opacity"
                  style={{
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    background: BG,
                  }}
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
