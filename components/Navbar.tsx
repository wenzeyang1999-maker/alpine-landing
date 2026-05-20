"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BG, BG_CARD, INK, MUTED, VIOLET, GREEN, AMBER, BORDER } from "@/lib/constants";

type NavChild = { label: string; href: string };
type NavItem =
  | { kind: "link";    label: string; href: string }
  | { kind: "menu";    label: string; href: string; children: NavChild[] }
  | { kind: "page";    label: string; href: string; badge?: "NEW" };

const NAV_ITEMS: NavItem[] = [
  {
    kind: "menu",
    label: "Alpine",
    href: "#framework",
    children: [
      { label: "How it works", href: "#framework" },
      { label: "Sample output", href: "#sample-output" },
      { label: "Framework", href: "#framework" },
      { label: "Engine", href: "#engine" },
      { label: "Team", href: "#team" },
    ],
  },
  {
    kind: "menu",
    label: "Services",
    href: "#services",
    children: [
      { label: "Three Products", href: "#services" },
    ],
  },
  { kind: "link", label: "Blog",            href: "#blog" },
  { kind: "page", label: "Alpine Space",    href: "/whitepaper", badge: "NEW" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems: NavItem[] = NAV_ITEMS;

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll spy across all anchored ids on the page
  useEffect(() => {
    const ids = new Set<string>();
    for (const item of NAV_ITEMS) {
      if (item.kind === "link" && item.href.startsWith("#")) ids.add(item.href.slice(1));
      if (item.kind === "menu" && item.href.startsWith("#")) ids.add(item.href.slice(1));
      if (item.kind === "menu") item.children.forEach((c) => c.href.startsWith("#") && ids.add(c.href.slice(1)));
    }
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleMenuEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }
  function handleMenuLeave() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

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
        <div className="relative flex items-center max-w-6xl mx-auto px-6 h-[5rem]">
          {/* Logo */}
          <Link href="/" className="flex h-full items-center flex-none" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/alpine-logo-dark.svg?v=5"
              alt="Alpine Due Diligence"
              style={{ height: 48, width: "auto" }}
            />
          </Link>

          {/* Desktop nav — absolutely centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive =
                (item.kind === "link" && item.href.startsWith("#") && activeSection === item.href.slice(1)) ||
                (item.kind === "menu" && (
                  activeSection === item.href.slice(1) ||
                  item.children.some((c) => c.href.startsWith("#") && activeSection === c.href.slice(1))
                ));

              if (item.kind === "page") {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="font-body text-[15.5px] transition-colors flex items-center gap-1.5"
                    style={{ color: INK, fontWeight: 600, letterSpacing: "0", minHeight: "44px" }}
                  >
                    {item.label}
                    {item.badge && (
                      <span
                        className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ background: VIOLET, color: "#fff", letterSpacing: "0.08em" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              if (item.kind === "menu") {
                const showDropdown = openMenu === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(item.label)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <a
                      href={item.href}
                      className="font-body text-[15.5px] transition-colors flex items-center gap-1"
                      style={{
                        color: isActive ? INK : MUTED,
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: "0",
                        minHeight: "44px",
                      }}
                    >
                      {item.label}
                      <ChevronDown size={13} style={{ opacity: 0.7 }} />
                    </a>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.14 }}
                          className="absolute left-0 top-full pt-2 min-w-[200px]"
                        >
                          <div
                            className="rounded-card overflow-hidden"
                            style={{
                              background: BG_CARD,
                              border: `1px solid ${BORDER}`,
                              boxShadow: "0 8px 24px rgba(15,15,16,0.10)",
                            }}
                          >
                            {item.children.map((c) => (
                              <a
                                key={c.label}
                                href={c.href}
                                onClick={() => setOpenMenu(null)}
                                className="block px-4 py-2.5 font-body text-[14px] transition-colors hover:bg-gray-50"
                                style={{ color: INK, fontWeight: 500, letterSpacing: "-0.01em" }}
                              >
                                {c.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // link
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-body text-[15.5px] transition-colors flex items-center"
                  style={{
                    color: isActive ? INK : MUTED,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "0",
                    minHeight: "44px",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Login (filled, persistent) + mobile hamburger */}
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center rounded-btn px-5 py-2.5 text-[14px] font-body hover:opacity-90 transition-opacity"
              style={{
                color: INK,
                border: `1px solid ${BORDER}`,
                background: "transparent",
                fontWeight: 500,
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

      {/* Mobile menu drawer — flat list, dropdown children expanded inline */}
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
              maxHeight: "calc(100vh - 5rem)",
              overflowY: "auto",
            }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col">
              {navItems.map((item, i) => {
                if (item.kind === "menu") {
                  return (
                    <div key={item.label} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <div className="py-3 font-body text-[16px]" style={{ color: INK, fontWeight: 600, letterSpacing: "-0.01em" }}>
                        {item.label}
                      </div>
                      <div className="pb-3 pl-3 flex flex-col gap-2">
                        {item.children.map((c) => (
                          <a
                            key={c.label}
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className="font-body text-[14px]"
                            style={{ color: MUTED, fontWeight: 500, letterSpacing: "-0.01em" }}
                          >
                            {c.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
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
                    {item.label}
                    {item.kind === "page" && item.badge && (
                      <span
                        className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ background: VIOLET, color: "#fff", letterSpacing: "0.08em" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                );
              })}

              {/* Mobile Login button — ghost */}
              <div className="pt-4 pb-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full text-center rounded-btn px-5 py-3 font-body text-[15px] hover:opacity-90 transition-opacity block"
                  style={{
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    background: "transparent",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
