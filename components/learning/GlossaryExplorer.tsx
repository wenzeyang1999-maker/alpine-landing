"use client";

import { useEffect, useMemo, useState } from "react";
import { INK, MUTED, SUBTLE, VIOLET, BORDER, BG_CARD, BG } from "@/lib/constants";
import { GLOSSARY, GROUP_LABELS, type GlossaryGroup, type GlossaryTerm } from "@/lib/glossary";
import GlossaryCard from "./GlossaryCard";

type Filter = "all" | GlossaryGroup;

const sortKey = (t: GlossaryTerm) => t.term.toUpperCase();
const letterOf = (t: GlossaryTerm) => {
  const c = t.term.toUpperCase()[0];
  return /[A-Z]/.test(c) ? c : "#";
};

const SORTED = [...GLOSSARY].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

// First term id for each letter (from the full list) — drives the A–Z jump strip.
const LETTERS: string[] = [];
const FIRST_ID_BY_LETTER: Record<string, string> = {};
for (const t of SORTED) {
  const l = letterOf(t);
  if (!(l in FIRST_ID_BY_LETTER)) { FIRST_ID_BY_LETTER[l] = t.id; LETTERS.push(l); }
}

function matches(t: GlossaryTerm, q: string): boolean {
  if (!q) return true;
  const hay = `${t.term} ${t.expansion || ""} ${t.category} ${t.meaning}`.toLowerCase();
  return hay.includes(q);
}

export default function GlossaryExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => SORTED.filter((t) => (filter === "all" || t.group === filter) && matches(t, q)),
    [q, filter],
  );

  // Deep-link handling. Native hash-scroll is unreliable in the App Router with a
  // hydrating client island, so scroll explicitly. If the target is hidden by an
  // active filter, clear filters first, then scroll once it paints.
  useEffect(() => {
    function goToHash(smooth: boolean) {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id || !GLOSSARY.some((t) => t.id === id)) return;
      const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      if (document.getElementById(id)) {
        scroll();
      } else {
        setQuery("");
        setFilter("all");
        window.setTimeout(scroll, 0);
      }
    }
    // On mount, defer past hydration + full-list layout so the target's final
    // position is known (an immediate scroll lands short for terms near the end).
    const t = window.setTimeout(() => goToHash(false), 200);
    const onHash = () => goToHash(true);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  function jumpToLetter(letter: string) {
    const id = FIRST_ID_BY_LETTER[letter];
    if (!id) return;
    setQuery("");
    setFilter("all");
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }, 0);
  }

  const filters: Filter[] = ["all", "investment-terms", "capital-commitment"];

  return (
    <div>
      {/* :target flash for deep-links and chip clicks */}
      <style>{`@keyframes termflash{0%{background:${VIOLET}1f}100%{background:${BG_CARD}}}[data-term-card]:target{animation:termflash 1.6s ease-out}`}</style>

      {/* Sticky controls: search + group filter + A–Z strip */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: BG, paddingTop: 8, paddingBottom: 12 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the glossary"
          placeholder="Search 56 terms — acronym or topic"
          className="font-body w-full"
          style={{ fontSize: 16, color: INK, background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", outline: "none" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 12 }}>
          {filters.map((f) => {
            const active = filter === f;
            const label = f === "all" ? "All" : GROUP_LABELS[f];
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className="font-body"
                style={{ fontSize: 13, fontWeight: 600, color: active ? "#fff" : MUTED, background: active ? INK : BG_CARD, border: `1px solid ${active ? INK : BORDER}`, borderRadius: 999, padding: "7px 14px", cursor: "pointer", minHeight: 36 }}
              >
                {label}
              </button>
            );
          })}
          <span className="font-mono" style={{ fontSize: 11, color: SUBTLE, marginLeft: "auto", letterSpacing: "0.04em" }}>
            Showing {visible.length} of {GLOSSARY.length}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 10, overflowX: "auto" }} aria-label="Jump to letter">
          {LETTERS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => jumpToLetter(l)}
              aria-label={`Jump to ${l}`}
              className="font-mono"
              style={{ fontSize: 12, fontWeight: 700, color: VIOLET, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", minWidth: 24, minHeight: 32 }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Single-column alphabetical list */}
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 16px" }}>
          <p className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: INK }}>
            No terms match {query.trim() ? `“${query.trim()}”` : "that filter"}
          </p>
          <p className="font-body" style={{ fontSize: "0.9rem", color: MUTED, marginTop: 6 }}>
            Try an acronym (AIFMD) or a topic (waterfall).
          </p>
          <button
            type="button"
            onClick={() => { setQuery(""); setFilter("all"); }}
            className="font-body"
            style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: "#fff", background: INK, border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer" }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
          {visible.map((t) => <GlossaryCard key={t.id} term={t} />)}
        </div>
      )}
    </div>
  );
}
