import React from "react";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER } from "@/lib/app-portal/constants";

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return fmtDate(iso);
}

export function fmtBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function Section({
  id,
  title,
  count,
  error,
  children,
  hint,
}: {
  id: string;
  title: string;
  count?: number | string;
  error?: string | null;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-heading font-semibold" style={{ fontSize: 18, color: INK }}>
          {title}
          {count !== undefined && (
            <span className="ml-2 font-mono text-[12px]" style={{ color: SUBTLE }}>
              {count}
            </span>
          )}
        </h2>
        {hint && <div className="font-body text-[12px]" style={{ color: MUTED }}>{hint}</div>}
      </div>
      {error ? (
        <div
          className="rounded p-3 font-mono text-[12px]"
          style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
        >
          DB error: {error}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${BORDER}` }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left font-mono text-[10px] uppercase tracking-widest px-4 py-2.5"
                style={{ color: SUBTLE }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 font-body" style={{ color: INK }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-6 font-body text-sm text-center"
      style={{ background: BG_CARD, border: `1px dashed ${BORDER}`, color: MUTED }}
    >
      {children}
    </div>
  );
}

export function Muted({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-body text-[13px]" style={{ color: MUTED }}>
      {children}
    </span>
  );
}

export function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color, background: bg }}
    >
      {children}
    </span>
  );
}
