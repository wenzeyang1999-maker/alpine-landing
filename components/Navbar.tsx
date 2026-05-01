"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BG, BG_CARD, INK, MUTED, VIOLET, GREEN, AMBER, BORDER } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Engine",      href: "#engine"  },
  { label: "Process",     href: "#process" },
  { label: "Pricing",     href: "#pricing" },
  { label: "Blog",        href: "#blog"    },
  { label: "Team",        href: "#team"    },
  { label: "White Paper", href: "/login",  page: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll spy — highlight active nav link (section links only)
  useEffect(() => {
    const ids = NAV_LINKS.filter((l) => !l.page).map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Show nav CTA only between hero CTA and footer CTA
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      // Hide when near top (hero CTA visible) or near bottom (footer CTA visible)
      const pastHero = y > 600;
      const nearBottom = y + viewHeight > docHeight - 400;
      setScrolledPastHero(pastHero && !nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Summit gradient accent — Alpine brand colors */}
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
            {NAV_LINKS.map(({ label, href, page }) => {
              const isActive = !page && activeSection === href.slice(1);
              if (page) {
                return (
                  <Link
                    key={label}
                    href={href}
                    className="font-body text-[15.5px] transition-colors flex items-center gap-1.5"
                    style={{ color: INK, fontWeight: 600, letterSpacing: "0", minHeight: "44px" }}
                  >
                    {label}
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: VIOLET, color: "#fff", letterSpacing: "0.08em" }}
                    >
                      New
                    </span>
                  </Link>
                );
              }
              return (
                <a
                  key={label}
                  href={href}
                  className="font-body text-[15.5px] transition-colors flex items-center"
                  style={{
                    color: isActive ? INK : MUTED,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "0",
                    minHeight: "44px",
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA (appears on scroll) + Login + mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/early-access"
              className="hidden md:inline-flex items-center rounded-btn px-5 py-3 text-[14px] font-body hover:opacity-90 transition-all duration-200"
              style={{
                background: INK,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                opacity: scrolledPastHero ? 1 : 0,
                pointerEvents: scrolledPastHero ? "auto" : "none",
                transform: scrolledPastHero ? "translateY(0)" : "translateY(-4px)",
              }}
            >
              Request Early Access
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-btn px-4 py-2 text-[14px] font-body hover:opacity-90 transition-opacity"
              style={{
                background: "transparent",
                color: INK,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                border: `1px solid ${BORDER}`,
              }}
            >
              Login
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
              {NAV_LINKS.map(({ label, href, page }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3 font-body text-[16px] border-b last:border-b-0"
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
                  {page && (
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: VIOLET, color: "#fff", letterSpacing: "0.08em" }}
                    >
                      New
                    </span>
                  )}
                </motion.a>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 pb-2">
                <Link
                  href="/early-access"
                  onClick={() => setOpen(false)}
                  className="w-full text-center rounded-btn px-5 py-3 font-body text-[15px] hover:opacity-90 transition-opacity block"
                  style={{
                    background: INK,
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Request Early Access
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
