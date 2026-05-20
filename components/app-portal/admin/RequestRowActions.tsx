"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { INK, MUTED, BORDER, BG_CARD, VIOLET } from "@/lib/app-portal/constants";

type Status = "new" | "contacted" | "converted" | "declined";

export default function RequestRowActions({ id, currentStatus }: { id: string; currentStatus: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: Status) {
    setError(null);
    const res = await fetch(`/api/app-portal/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || `HTTP ${res.status}`);
      return;
    }
    startTransition(() => router.refresh());
  }

  const choices: { label: string; value: Status }[] = [
    { label: "Contacted",  value: "contacted" },
    { label: "Converted",  value: "converted" },
    { label: "Decline",    value: "declined" },
    { label: "Reopen",     value: "new" },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {choices
        .filter((c) => c.value !== currentStatus)
        .map((c) => (
          <button
            key={c.value}
            type="button"
            disabled={pending}
            onClick={() => setStatus(c.value)}
            className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded disabled:opacity-50"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: INK }}
          >
            {c.label}
          </button>
        ))}
      {error && (
        <span className="font-body text-[11px]" style={{ color: VIOLET }}>
          {error}
        </span>
      )}
      {pending && (
        <span className="font-body text-[11px]" style={{ color: MUTED }}>
          …
        </span>
      )}
    </div>
  );
}
