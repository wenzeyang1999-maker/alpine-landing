"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET, GREEN } from "@/lib/app-portal/constants";

interface AdminRow {
  email: string;
  added_at: string;
  added_by: string | null;
  note: string | null;
}

export default function AdminsManager({
  admins,
  currentAdminEmail,
  hardcodedAllowlist,
}: {
  admins: AdminRow[];
  currentAdminEmail: string;
  hardcodedAllowlist: string[];
}) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  const hardcodedSet = new Set(hardcodedAllowlist);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/app-portal/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, note: newNote }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Add failed");
        return;
      }
      setSuccess(`Recorded ${data.email}. Remember to update middleware.ts to grant runtime access.`);
      setNewEmail("");
      setNewNote("");
      startTransition(() => router.refresh());
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(email: string) {
    setError(null);
    setSuccess(null);
    if (!confirm(`Remove ${email} from app_admins table?`)) return;
    const res = await fetch(`/api/app-portal/admins?email=${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Remove failed");
      return;
    }
    setSuccess(`Removed ${email}. Update middleware.ts to revoke runtime access.`);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded p-4 font-body text-[13px]"
        style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
      >
        <b>Heads-up:</b> Adding or removing here updates the DB record only. The runtime auth gate in <code>middleware.ts</code> uses a hardcoded list at the Edge. To actually grant or revoke access, also edit the <code>APP_ALLOWLIST</code> arrays in <code>middleware.ts</code>, <code>lib/auth-session.ts</code>, and <code>lib/app-portal/auth-session.ts</code> and redeploy.
      </div>

      <div className="rounded-lg p-5" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="font-heading font-semibold mb-3" style={{ fontSize: 16, color: INK }}>
          Add admin
        </h3>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: SUBTLE }}>
              Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="field-input"
              placeholder="newperson@alpinedd.com"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: SUBTLE }}>
              Note (optional)
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="field-input"
              placeholder="e.g. On-call analyst"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="font-body text-sm px-4 py-2 rounded-md disabled:opacity-50"
            style={{ background: INK, color: "#fff" }}
          >
            {submitting ? "Adding…" : "Add"}
          </button>
        </form>
        {error && <p className="mt-2 text-[13px]" style={{ color: "#B91C1C" }}>{error}</p>}
        {success && <p className="mt-2 text-[13px]" style={{ color: GREEN }}>{success}</p>}
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${BORDER}` }}>
              {["Email", "Runtime", "Note", "Added by", "Added", "Action"].map((h) => (
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
            {admins.map((a, i) => {
              const inHardcoded = hardcodedSet.has(a.email);
              const isMe = a.email === currentAdminEmail;
              return (
                <tr key={a.email} style={{ borderBottom: i < admins.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: INK }}>
                    {a.email}
                    {isMe && (
                      <span className="ml-2 font-mono text-[10px] uppercase" style={{ color: VIOLET }}>
                        you
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {inHardcoded ? (
                      <span
                        className="inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ color: GREEN, background: "#ECFDF5" }}
                      >
                        Enforced
                      </span>
                    ) : (
                      <span
                        className="inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ color: "#B45309", background: "#FEF3C7" }}
                      >
                        DB only
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-body text-[13px]" style={{ color: INK }}>
                    {a.note || <span style={{ color: MUTED }}>—</span>}
                  </td>
                  <td className="px-4 py-3 font-body text-[12px]" style={{ color: MUTED }}>
                    {a.added_by || "—"}
                  </td>
                  <td className="px-4 py-3 font-body text-[12px]" style={{ color: MUTED }}>
                    {new Date(a.added_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    {isMe ? (
                      <span style={{ color: MUTED }} className="font-body text-[12px]">—</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => remove(a.email)}
                        disabled={pending}
                        className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded disabled:opacity-50"
                        style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: "#B91C1C" }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
