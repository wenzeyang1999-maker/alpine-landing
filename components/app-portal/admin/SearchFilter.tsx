"use client";

import { useEffect, useState } from "react";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER } from "@/lib/app-portal/constants";

/**
 * Global client-side filter for the admin page.
 *
 * Wraps the page content and, on each keystroke, hides any table row
 * whose text content does not contain the query (case-insensitive).
 *
 * Pure DOM-only — no need to refetch or pass state down to each section.
 * If the user clears the input, all rows reappear.
 */
export default function SearchFilter({ children }: { children: React.ReactNode }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const query = q.trim().toLowerCase();
    const rows = document.querySelectorAll<HTMLTableRowElement>("section[id] table tbody tr");
    let visibleBySection = new Map<string, number>();

    rows.forEach((row) => {
      const text = row.textContent?.toLowerCase() ?? "";
      const matches = query === "" || text.includes(query);
      row.style.display = matches ? "" : "none";
      if (matches) {
        const section = row.closest("section[id]")?.id ?? "";
        visibleBySection.set(section, (visibleBySection.get(section) ?? 0) + 1);
      }
    });
  }, [q]);

  return (
    <div>
      <div
        className="sticky top-[5rem] z-10 -mx-6 px-6 pb-3 pt-1"
        style={{ background: "#F7F8F8" }}
      >
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Filter visible rows (email, fund, token, action…)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 rounded-md px-3 py-2 font-body text-sm"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: INK }}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: MUTED }}
            >
              Clear
            </button>
          )}
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
            {q ? "filtering" : "showing all"}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
