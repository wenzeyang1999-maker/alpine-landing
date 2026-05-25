"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { INK, BORDER, BG_CARD } from "@/lib/app-portal/constants";

export default function ManagerVerifyButton({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    if (!confirm(`Approve ${email} and send them an approval email?`)) return;
    setError(null);

    const res = await fetch("/api/app-portal/admin/manager-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || `HTTP ${res.status}`);
      return;
    }

    setDone(true);
    startTransition(() => router.refresh());
  }

  if (done) {
    return <span className="font-mono text-[11px]" style={{ color: "#16a34a" }}>Approved ✓</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={approve}
        className="font-mono text-[11px] uppercase tracking-widest px-2.5 py-1 rounded disabled:opacity-50"
        style={{ background: INK, color: "#fff", border: `1px solid ${BORDER}` }}
      >
        {pending ? "…" : "Approve"}
      </button>
      {error && (
        <span className="font-body text-[11px]" style={{ color: "#dc2626" }}>{error}</span>
      )}
    </div>
  );
}
