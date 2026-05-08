"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BG_CARD, INK, MUTED, VIOLET, GREEN, AMBER, BORDER } from "@/lib/constants";

const ENGINE_DROPDOWN = [
  { label: "Engine",      href: "#engine",  disabled: false },
  { label: "Why Alpine",  href: "#",        disabled: true  },
  { label: "Team",        href: "#team",    disabled: false },
];

const SERVICE_DROPDOWN = [
  { label: "Process",     href: "#process", disabled: false },
  { label: "Pricing",     href: "#pricing", disabled: false },
];

const NAV_LINKS = [
  { label: "Alpine",      href: "#engine",  dropdown: "alpine"   },
  { label: "Service",     href: "#process", dropdown: "service"  },
  { label: "Blog",        href: "#blog"    },
  { label: "Alpine Space", href: "/login",  page: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [mobileEngineOpen, setMobileEngineOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const engineRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (engineRef.current && !engineRef.current.contains(e.target as Node)) {
        setEngineDropdownOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
            {NAV_LINKS.map(({ label, href, page, dropdown }) => {
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
              if (dropdown) {
                const isAlpine = dropdown === "alpine";
                const ddOpen = isAlpine ? engineDropdownOpen : serviceDropdownOpen;
                const setDdOpen = isAlpine ? setEngineDropdownOpen : setServiceDropdownOpen;
                const ddRef = isAlpine ? engineRef : serviceRef;
                const ddItems = isAlpine ? ENGINE_DROPDOWN : SERVICE_DROPDOWN;
                return (
                  <div
                    key={label}
                    ref={ddRef}
                    className="relative"
                    onMouseEnter={() => setDdOpen(true)}
                    onMouseLeave={() => setDdOpen(false)}
                  >
                    <button
                      type="button"
                      className="font-body text-[15.5px] transition-colors flex items-center gap-1"
                      style={{
                        color: isActive ? INK : MUTED,
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: "0",
                        minHeight: "44px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      onClick={() => setDdOpen((v) => !v)}
                    >
                      {label}
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{
                          transition: "transform 0.18s",
                          transform: ddOpen ? "rotate(180deg)" : "rotate(0deg)",
                          marginTop: 1,
                        }}
                      >
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <AnimatePresence>
                      {ddOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute top-full left-0 mt-1 rounded-xl py-1 min-w-[160px]"
                          style={{
                            background: BG_CARD,
                            border: `1px solid ${BORDER}`,
                            boxShadow: "0 8px 24px rgba(15,15,16,0.10)",
                          }}
                        >
                          {ddItems.map(({ label: dlabel, href: dhref, disabled }) => (
                            <a
                              key={dlabel}
                              href={disabled ? undefined : dhref}
                              onClick={disabled ? undefined : () => setDdOpen(false)}
                              className="flex items-center px-4 py-2.5 font-body text-[14.5px] transition-colors"
                              style={{
                                color: disabled ? MUTED : INK,
                                fontWeight: 500,
                                cursor: disabled ? "default" : "pointer",
                                pointerEvents: disabled ? "none" : "auto",
                                opacity: disabled ? 0.45 : 1,
                                textDecoration: "none",
                              }}
                            >
                              {dlabel}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="hidden md:inline-flex items-center rounded-btn px-5 py-2.5 text-[14px] font-body hover:opacity-90 transition-opacity"
              style={{
                background: "transparent",
                color: INK,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                border: `1px solid ${BORDER}`,
              }}
            >
              Subscribe
            </button>
            <Link
              href="/login"
              className="inline-flex items-center rounded-btn px-5 py-2.5 text-[14px] font-body hover:opacity-90 transition-opacity"
              style={{
                background: VIOLET,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "-0.01em",
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
              {NAV_LINKS.map(({ label, href, page, dropdown }, i) => {
                if (dropdown) {
                  const isAlpine = dropdown === "alpine";
                  const mobileOpen = isAlpine ? mobileEngineOpen : mobileServiceOpen;
                  const setMobileOpen = isAlpine ? setMobileEngineOpen : setMobileServiceOpen;
                  const ddItems = isAlpine ? ENGINE_DROPDOWN : SERVICE_DROPDOWN;
                  return (
                    <div key={label} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <motion.button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="flex items-center justify-between w-full py-3 font-body text-[16px]"
                        style={{ color: INK, fontWeight: 600, letterSpacing: "-0.01em", background: "none", border: "none", cursor: "pointer", padding: "12px 0" }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: i * 0.04 }}
                      >
                        {label}
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{ transition: "transform 0.18s", transform: mobileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                          <path d="M2 4l4 4 4-4" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                      <AnimatePresence>
                        {mobileOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ overflow: "hidden" }}
                          >
                            {ddItems.map(({ label: dlabel, href: dhref, disabled }) => (
                              <a
                                key={dlabel}
                                href={disabled ? undefined : dhref}
                                onClick={disabled ? undefined : () => setOpen(false)}
                                className="flex items-center pl-4 py-2.5 font-body text-[15px]"
                                style={{
                                  color: disabled ? MUTED : INK,
                                  fontWeight: 500,
                                  cursor: disabled ? "default" : "pointer",
                                  pointerEvents: disabled ? "none" : "auto",
                                  opacity: disabled ? 0.45 : 1,
                                  textDecoration: "none",
                                }}
                              >
                                {dlabel}
                              </a>
                            ))}
                            <div style={{ height: 8 }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
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
                );
              })}

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

      {/* Newsletter modal */}
      <AnimatePresence>
        {subscribeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{ background: "rgba(15,15,16,0.45)", backdropFilter: "blur(4px)" }}
            onClick={() => setSubscribeOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-md rounded-2xl p-8"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, boxShadow: "0 24px 64px rgba(15,15,16,0.14)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSubscribeOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>

              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${VIOLET}18` }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 4.5A1.5 1.5 0 013.5 3h13A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11z" stroke={VIOLET} strokeWidth="1.4"/>
                    <path d="M2 5l8 6 8-6" stroke={VIOLET} strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="font-body text-[22px] font-bold mb-1" style={{ color: INK, letterSpacing: "-0.02em" }}>
                  Newsletter
                </h2>
                <p className="font-body text-[14.5px]" style={{ color: MUTED }}>
                  Coming soon. Stay tuned for Alpine insights and updates.
                </p>
              </div>

              <div className="rounded-xl flex items-center justify-center py-12" style={{ background: "#F7F8F8", border: `1px dashed ${BORDER}` }}>
                <p className="font-body text-[13px] font-medium" style={{ color: MUTED }}>Newsletter sign-up — coming soon</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
