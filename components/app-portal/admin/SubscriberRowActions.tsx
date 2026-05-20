"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { INK, MUTED, BORDER, BG_CARD, VIOLET } from "@/lib/app-portal/constants";

type Action = "confirm" | "unsubscribe" | "reactivate";

export default function SubscriberRowActions({
  email,
  status,
}: {
  email: string;
  status: "active" | "pending" | "unsubscribed";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function patch(action: Action) {
    setError(null);
    const res = await fetch(`/api/app-portal/subscribers/${encodeURIComponent(email)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || `HTTP ${res.status}`);
      return;
    }
    startTransition(() => router.refresh());
  }

  const actions: { label: string; value: Action }[] = [];
  if (status === "pending") actions.push({ label: "Confirm", value: "confirm" });
  if (status === "active") actions.push({ label: "Unsubscribe", value: "unsubscribe" });
  if (status === "unsubscribed") actions.push({ label: "Reactivate", value: "reactivate" });

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {actions.map((a) => (
        <button
          key={a.value}
          type="button"
          disabled={pending}
          onClick={() => patch(a.value)}
          className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded disabled:opacity-50"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: INK }}
        >
          {a.label}
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
