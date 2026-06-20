"use client";

import { useEffect, useRef } from "react";

/**
 * One delegated hover/focus popover for glossary terms in the report viewer.
 * Term spans are emitted as <a class="gloss-term" data-gloss-term data-gloss-def>
 * by the report's inlineFormat pipeline. Desktop: hover or keyboard-focus shows
 * the definition; Esc / blur / scroll hides it. Mobile: tapping the term is a
 * normal link to /learning-center#id (the canonical definition).
 *
 * Fixed positioning + getBoundingClientRect (viewport coords) so it works inside
 * the scrollable report pane; it hides on scroll rather than tracking.
 */
export default function GlossaryHoverCards() {
  const popRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const defRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pop = popRef.current, termEl = termRef.current, defEl = defRef.current;
    if (!pop || !termEl || !defEl) return;
    let hideTimer: number | undefined;

    function show(el: HTMLElement) {
      termEl!.textContent = el.getAttribute("data-gloss-term") || "";
      defEl!.textContent = el.getAttribute("data-gloss-def") || "";
      pop!.style.visibility = "hidden";
      pop!.style.display = "block";
      const r = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const pw = Math.min(300, vw - 24);
      const ph = pop!.offsetHeight;
      let left = Math.min(r.left, vw - pw - 12);
      left = Math.max(8, left);
      let top = r.bottom + 6;
      if (r.bottom + ph + 12 > window.innerHeight) top = Math.max(8, r.top - ph - 6); // flip up near bottom
      pop!.style.left = `${left}px`;
      pop!.style.top = `${top}px`;
      pop!.style.visibility = "visible";
    }
    function hide() { if (pop) pop.style.display = "none"; }

    function onOver(e: Event) {
      const t = (e.target as HTMLElement)?.closest?.(".gloss-term") as HTMLElement | null;
      if (t) { window.clearTimeout(hideTimer); show(t); }
    }
    function onOut(e: Event) {
      const t = (e.target as HTMLElement)?.closest?.(".gloss-term");
      if (t) hideTimer = window.setTimeout(hide, 80);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") hide(); }

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onOut);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onOut);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", hide, true);
    };
  }, []);

  return (
    <div
      ref={popRef}
      role="tooltip"
      style={{ position: "fixed", display: "none", zIndex: 60, width: 300, maxWidth: "calc(100vw - 24px)", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, boxShadow: "0 8px 28px rgba(15,23,42,0.14)", padding: "12px 14px", pointerEvents: "none" }}
    >
      <div ref={termRef} style={{ fontWeight: 700, color: "#0F0F10", fontSize: 13, marginBottom: 4 }} />
      <div ref={defRef} style={{ color: "#374151", fontSize: 12.5, lineHeight: 1.5 }} />
      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: "#7B2CBF" }}>Open in glossary →</div>
    </div>
  );
}
