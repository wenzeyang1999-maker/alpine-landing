"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SubpageLayout from "@/components/app-portal/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/app-portal/constants";

interface PortalLink {
  id: string;
  status: "pending" | "approved" | "revoked";
  suggestedBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  firmName: string;
  firmSlug: string;
  customerName: string;
  customerEmail: string | null;
  customerFund: string | null;
  customerStatus: string;
}

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  pending: { bg: "#F59E0B18", fg: "#B45309", label: "Pending review" },
  approved: { bg: "#10B98118", fg: "#047857", label: "Approved" },
  revoked: { bg: "#EF444418", fg: "#B91C1C", label: "Revoked" },
};

export default function PortalLinksAdmin() {
  const [links, setLinks] = useState<PortalLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/app-portal/portal-links");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not load portal links.");
      setLinks(data.links ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load portal links.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(id: string, action: "approve" | "revoke") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/app-portal/portal-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not update the link.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the link.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = links.filter((l) => l.status === "pending");
  const settled = links.filter((l) => l.status !== "pending");

  function row(l: PortalLink) {
    const s = STATUS_STYLE[l.status] ?? STATUS_STYLE.pending;
    return (
      <div
        key={l.id}
        className="rounded-panel p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
              style={{ background: s.bg, color: s.fg, fontWeight: 700, letterSpacing: "0.06em" }}
            >
              {s.label}
            </span>
            {l.customerStatus !== "active" && (
              <span
                className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
                style={{ background: "#EF444418", color: "#B91C1C", fontWeight: 700, letterSpacing: "0.06em" }}
              >
                Customer {l.customerStatus}
              </span>
            )}
          </div>
          <p className="font-body text-[14px]" style={{ color: INK, fontWeight: 600 }}>
            {l.firmName} <span style={{ color: SUBTLE, fontWeight: 400 }}>&rarr;</span> {l.customerName}
          </p>
          <p className="font-body text-[13px] mt-1" style={{ color: MUTED, lineHeight: 1.5 }}>
            {l.customerFund ?? "No fund on record"}
            {l.customerEmail ? ` · onboarded as ${l.customerEmail}` : ""}
          </p>
          <p className="font-mono text-[10px] mt-1.5" style={{ color: SUBTLE }}>
            {l.status === "approved" && l.approvedBy
              ? `approved by ${l.approvedBy}`
              : l.suggestedBy
              ? `suggested by ${l.suggestedBy}`
              : "no provenance recorded"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {l.status !== "approved" && (
            <button
              type="button"
              onClick={() => act(l.id, "approve")}
              disabled={busyId === l.id}
              className="rounded-btn px-4 py-2 font-body text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: INK, color: "#fff", fontWeight: 600 }}
            >
              {busyId === l.id ? "Working…" : "Approve"}
            </button>
          )}
          {l.status !== "revoked" && (
            <button
              type="button"
              onClick={() => act(l.id, "revoke")}
              disabled={busyId === l.id}
              className="rounded-btn px-4 py-2 font-body text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ border: `1px solid ${BORDER}`, color: "#B91C1C", fontWeight: 600 }}
            >
              Revoke
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <SubpageLayout>
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link href="/admin" className="font-mono text-[11px] hover:underline" style={{ color: MUTED }}>
            ← Admin
          </Link>
          <h1
            className="font-heading mt-4 mb-3"
            style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.03em", color: INK }}
          >
            Portal links
          </h1>
          <p className="font-body max-w-2xl mb-8" style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: MUTED }}>
            Approving a link lets a manager firm read the documents uploaded through that
            customer&rsquo;s secure portal. Suggestions are raised automatically when a manager
            signs up with a matching email or through a portal link, and grant nothing until
            approved here. Revoking takes effect immediately.
          </p>

          {error && (
            <div
              className="rounded-panel px-4 py-3 mb-6 font-body text-[13px]"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C" }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <p className="font-body text-[14px]" style={{ color: MUTED }}>Loading…</p>
          ) : links.length === 0 ? (
            <p className="font-body text-[14px]" style={{ color: MUTED }}>
              No portal links yet. One appears when a manager signs up through a portal link
              or with an email matching an onboarded customer.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {pending.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p
                    className="font-mono text-[10px] uppercase"
                    style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
                  >
                    Awaiting review ({pending.length})
                  </p>
                  {pending.map(row)}
                </div>
              )}
              {settled.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p
                    className="font-mono text-[10px] uppercase"
                    style={{ color: SUBTLE, fontWeight: 700, letterSpacing: "0.1em" }}
                  >
                    Decided ({settled.length})
                  </p>
                  {settled.map(row)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SubpageLayout>
  );
}
