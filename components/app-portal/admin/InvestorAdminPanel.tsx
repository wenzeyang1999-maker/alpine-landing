"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BG_CARD,
  BG_ALT,
  INK,
  MUTED,
  SUBTLE,
  SECONDARY,
  BORDER,
  VIOLET,
  GREEN,
  AMBER,
  GREEN_TEXT,
  AMBER_TEXT,
} from "@/lib/app-portal/constants";

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = "reports" | "accounts" | "assignments" | "uploads";

interface AdminReport {
  slug: string;
  fundName: string;
  manager: string;
  rating: "GREEN" | "YELLOW" | "RED";
  oddScore: number;
  topicCount: number;
  published: boolean;
  publishedAt: string | null;
}
interface Account {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}
interface Assignment {
  investor_id: string;
  report_slug: string;
}
interface Upload {
  id: string;
  filename: string;
  file_size: number | null;
  status: "pending" | "processed";
  uploaded_at: string;
  processed_at: string | null;
  processed_by: string | null;
  investor_id: string;
  investors: { email: string; full_name: string | null; organization: string | null } | null;
}

const RATING_COLOR: Record<string, string> = { GREEN, YELLOW: AMBER, RED: "#EF4444" };

const REPORTS_API = "/api/app-portal/investor-admin/reports";
const ACCOUNTS_API = "/api/app-portal/investor-admin/accounts";
const ASSIGNMENTS_API = "/api/app-portal/investor-admin/assignments";
const DOCUMENTS_API = "/api/app-portal/investor-admin/documents";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-panel border p-5" style={{ background: BG_CARD, borderColor: BORDER }}>
      {children}
    </div>
  );
}

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-card font-mono text-[10px] font-bold uppercase tracking-wide"
      style={{ background: `${color}1A`, color }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden />
      {children}
    </span>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────

export default function InvestorAdminPanel() {
  const [tab, setTab] = useState<Tab>("reports");

  const [reports, setReports] = useState<AdminReport[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const loadCore = useCallback(async () => {
    setError("");
    try {
      const [r, a, asg] = await Promise.all([
        fetch(REPORTS_API),
        fetch(ACCOUNTS_API),
        fetch(ASSIGNMENTS_API),
      ]);
      if (!r.ok || !a.ok || !asg.ok) throw new Error("load failed");
      setReports(await r.json());
      setAccounts(await a.json());
      setAssignments(await asg.json());
    } catch {
      setError("Couldn't load investor portal data. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCore();
  }, [loadCore]);

  // ── Reports ────────────────────────────────────────────────────────────────
  const togglePublish = async (slug: string, publish: boolean) => {
    setBusy(`pub-${slug}`);
    try {
      const res = await fetch(REPORTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, publish }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.slug === slug ? { ...r, published: publish } : r)),
        );
      }
    } finally {
      setBusy(null);
    }
  };

  // ── Accounts ───────────────────────────────────────────────────────────────
  const [form, setForm] = useState({ email: "", full_name: "", organization: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch(ACCOUNTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setCreateError(data?.error || "Couldn't create the account.");
        return;
      }
      setAccounts((prev) => [data, ...prev]);
      setForm({ email: "", full_name: "", organization: "", password: "" });
    } catch {
      setCreateError("Couldn't create the account.");
    } finally {
      setCreating(false);
    }
  };

  const toggleAccount = async (id: string, isActive: boolean) => {
    setBusy(`acct-${id}`);
    try {
      const res = await fetch(ACCOUNTS_API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts((prev) => prev.map((a) => (a.id === id ? data : a)));
      }
    } finally {
      setBusy(null);
    }
  };

  // ── Assignments ────────────────────────────────────────────────────────────
  const publishedReports = useMemo(() => reports.filter((r) => r.published), [reports]);
  const [assignSlug, setAssignSlug] = useState("");
  useEffect(() => {
    if (!assignSlug && publishedReports.length > 0) setAssignSlug(publishedReports[0].slug);
  }, [publishedReports, assignSlug]);

  const isAssigned = (investorId: string, slug: string) =>
    assignments.some((a) => a.investor_id === investorId && a.report_slug === slug);

  const toggleAssignment = async (investorId: string, slug: string, assign: boolean) => {
    setBusy(`asg-${investorId}-${slug}`);
    try {
      const res = assign
        ? await fetch(ASSIGNMENTS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, investorId }),
          })
        : await fetch(
            `${ASSIGNMENTS_API}?slug=${encodeURIComponent(slug)}&investorId=${encodeURIComponent(investorId)}`,
            { method: "DELETE" },
          );
      if (res.ok) {
        setAssignments((prev) =>
          assign
            ? [...prev, { investor_id: investorId, report_slug: slug }]
            : prev.filter((a) => !(a.investor_id === investorId && a.report_slug === slug)),
        );
      }
    } finally {
      setBusy(null);
    }
  };

  // ── Uploads ────────────────────────────────────────────────────────────────
  const [uploadSlug, setUploadSlug] = useState("");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [uploadsError, setUploadsError] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!uploadSlug && reports.length > 0) setUploadSlug(reports[0].slug);
  }, [reports, uploadSlug]);

  const loadUploads = useCallback(async (slug: string) => {
    if (!slug) return;
    setUploadsLoading(true);
    setUploadsError("");
    setSelectedDocs(new Set());
    try {
      const res = await fetch(`${DOCUMENTS_API}?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error("failed");
      setUploads(await res.json());
    } catch {
      setUploadsError("Couldn't load uploads for this report.");
      setUploads([]);
    } finally {
      setUploadsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "uploads" && uploadSlug) loadUploads(uploadSlug);
  }, [tab, uploadSlug, loadUploads]);

  const incorporate = async (ids: string[]) => {
    if (ids.length === 0) return;
    setBusy("incorporate");
    try {
      const res = await fetch(DOCUMENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) await loadUploads(uploadSlug);
    } finally {
      setBusy(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "reports", label: "Reports" },
    { id: "accounts", label: "Accounts" },
    { id: "assignments", label: "Assignments" },
    { id: "uploads", label: "Uploads" },
  ];

  if (loading) {
    return (
      <p className="font-body text-sm mt-8" style={{ color: MUTED }}>
        Loading…
      </p>
    );
  }
  if (error) {
    return (
      <div className="mt-8">
        <p className="font-body text-sm" style={{ color: "#B91C1C" }}>
          {error}
        </p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            loadCore();
          }}
          className="mt-2 font-body text-sm font-emphasis underline"
          style={{ color: VIOLET }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className="font-body text-sm px-3.5 py-2 rounded-btn transition-colors"
              style={{
                background: active ? INK : BG_CARD,
                color: active ? "#fff" : SECONDARY,
                border: `1px solid ${active ? INK : BORDER}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Reports ── */}
      {tab === "reports" && (
        <div className="space-y-3">
          {reports.map((r) => {
            const color = RATING_COLOR[r.rating] ?? MUTED;
            return (
              <Card key={r.slug}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-emphasis text-base" style={{ color: INK }}>
                        {r.fundName}
                      </h3>
                      <Pill color={color}>{r.rating}</Pill>
                    </div>
                    <p className="font-body text-xs mt-0.5" style={{ color: MUTED }}>
                      {r.manager} · ODD {r.oddScore}/100 · {r.topicCount} chapters ·{" "}
                      <span className="font-mono">{r.slug}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.published ? (
                      <Pill color={GREEN}>Published</Pill>
                    ) : (
                      <span className="font-mono text-[10px] uppercase" style={{ color: SUBTLE }}>
                        Not published
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={busy === `pub-${r.slug}`}
                      onClick={() => togglePublish(r.slug, !r.published)}
                      className="font-body text-sm px-3 py-1.5 rounded-btn disabled:opacity-50"
                      style={
                        r.published
                          ? { border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }
                          : { background: INK, color: "#fff" }
                      }
                    >
                      {busy === `pub-${r.slug}`
                        ? "…"
                        : r.published
                          ? "Unpublish"
                          : "Publish"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Accounts ── */}
      {tab === "accounts" && (
        <div className="space-y-5">
          <Card>
            <h3 className="font-heading font-emphasis text-base mb-3" style={{ color: INK }}>
              Create investor account
            </h3>
            <form onSubmit={createAccount} className="grid sm:grid-cols-2 gap-3">
              <input
                type="email"
                required
                placeholder="Email"
                aria-label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field-input"
              />
              <input
                type="text"
                placeholder="Full name"
                aria-label="Full name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="field-input"
              />
              <input
                type="text"
                placeholder="Organization"
                aria-label="Organization"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="field-input"
              />
              <input
                type="text"
                required
                placeholder="Initial password (min 8 chars)"
                aria-label="Initial password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field-input"
              />
              <div className="sm:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="font-body font-emphasis text-sm px-4 py-2.5 rounded-btn text-white disabled:opacity-50"
                  style={{ background: INK }}
                >
                  {creating ? "Creating…" : "Create account"}
                </button>
                {createError && (
                  <span className="font-body text-sm" style={{ color: "#B91C1C" }} aria-live="polite">
                    {createError}
                  </span>
                )}
              </div>
            </form>
          </Card>

          <div className="space-y-2">
            {accounts.length === 0 ? (
              <p className="font-body text-sm" style={{ color: MUTED }}>
                No investor accounts yet.
              </p>
            ) : (
              accounts.map((a) => (
                <Card key={a.id}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-emphasis text-sm" style={{ color: INK }}>
                          {a.full_name || a.email}
                        </h3>
                        {a.is_active ? (
                          <Pill color={GREEN}>Active</Pill>
                        ) : (
                          <Pill color="#9CA3AF">Inactive</Pill>
                        )}
                      </div>
                      <p className="font-body text-xs mt-0.5" style={{ color: MUTED }}>
                        {a.email}
                        {a.organization ? ` · ${a.organization}` : ""} · created{" "}
                        {fmtDate(a.created_at)} · last login {fmtDate(a.last_login)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={busy === `acct-${a.id}`}
                      onClick={() => toggleAccount(a.id, !a.is_active)}
                      className="font-body text-sm px-3 py-1.5 rounded-btn disabled:opacity-50"
                      style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
                    >
                      {busy === `acct-${a.id}` ? "…" : a.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Assignments ── */}
      {tab === "assignments" && (
        <div className="space-y-4">
          {publishedReports.length === 0 ? (
            <p className="font-body text-sm" style={{ color: MUTED }}>
              Publish a report first — assignments are made per published report.
            </p>
          ) : (
            <>
              <div>
                <label
                  htmlFor="assign-report"
                  className="font-mono text-[10px] uppercase tracking-widest block mb-1"
                  style={{ color: SUBTLE }}
                >
                  Report
                </label>
                <select
                  id="assign-report"
                  value={assignSlug}
                  onChange={(e) => setAssignSlug(e.target.value)}
                  className="field-input max-w-md"
                >
                  {publishedReports.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.fundName}
                    </option>
                  ))}
                </select>
              </div>
              {accounts.length === 0 ? (
                <p className="font-body text-sm" style={{ color: MUTED }}>
                  Create an investor account before assigning reports.
                </p>
              ) : (
                <div className="space-y-2">
                  {accounts.map((a) => {
                    const assigned = isAssigned(a.id, assignSlug);
                    const key = `asg-${a.id}-${assignSlug}`;
                    return (
                      <Card key={a.id}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-body text-sm font-emphasis" style={{ color: INK }}>
                              {a.full_name || a.email}
                              {!a.is_active && (
                                <span className="ml-2 font-mono text-[10px]" style={{ color: SUBTLE }}>
                                  (inactive)
                                </span>
                              )}
                            </p>
                            <p className="font-body text-xs" style={{ color: MUTED }}>
                              {a.email}
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={busy === key}
                            onClick={() => toggleAssignment(a.id, assignSlug, !assigned)}
                            className="font-body text-sm px-3 py-1.5 rounded-btn disabled:opacity-50 shrink-0"
                            style={
                              assigned
                                ? { border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }
                                : { background: INK, color: "#fff" }
                            }
                          >
                            {busy === key ? "…" : assigned ? "Unassign" : "Assign"}
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Uploads ── */}
      {tab === "uploads" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="upload-report"
              className="font-mono text-[10px] uppercase tracking-widest block mb-1"
              style={{ color: SUBTLE }}
            >
              Report
            </label>
            <select
              id="upload-report"
              value={uploadSlug}
              onChange={(e) => setUploadSlug(e.target.value)}
              className="field-input max-w-md"
            >
              {reports.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.fundName}
                </option>
              ))}
            </select>
          </div>

          {uploadsLoading ? (
            <p className="font-body text-sm" style={{ color: MUTED }}>
              Loading uploads…
            </p>
          ) : uploadsError ? (
            <p className="font-body text-sm" style={{ color: "#B91C1C" }}>
              {uploadsError}
            </p>
          ) : uploads.length === 0 ? (
            <p className="font-body text-sm" style={{ color: MUTED }}>
              No documents have been uploaded for this report yet.
            </p>
          ) : (
            <>
              {selectedDocs.size > 0 && (
                <button
                  type="button"
                  disabled={busy === "incorporate"}
                  onClick={() => incorporate(Array.from(selectedDocs))}
                  className="font-body font-emphasis text-sm px-4 py-2 rounded-btn text-white disabled:opacity-50"
                  style={{ background: INK }}
                >
                  {busy === "incorporate"
                    ? "Incorporating…"
                    : `Incorporate ${selectedDocs.size} selected`}
                </button>
              )}
              <div className="space-y-2">
                {uploads.map((u) => {
                  const pending = u.status === "pending";
                  return (
                    <Card key={u.id}>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3 min-w-0">
                          {pending && (
                            <input
                              type="checkbox"
                              aria-label={`Select ${u.filename}`}
                              checked={selectedDocs.has(u.id)}
                              onChange={(e) => {
                                setSelectedDocs((prev) => {
                                  const next = new Set(prev);
                                  if (e.target.checked) next.add(u.id);
                                  else next.delete(u.id);
                                  return next;
                                });
                              }}
                              className="mt-1"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-body text-sm font-emphasis truncate" style={{ color: INK }}>
                              {u.filename}
                            </p>
                            <p className="font-body text-xs mt-0.5" style={{ color: MUTED }}>
                              {u.investors?.email ?? "unknown investor"}
                              {u.investors?.organization ? ` · ${u.investors.organization}` : ""}
                              {" · "}
                              {fmtBytes(u.file_size)} · uploaded {fmtDate(u.uploaded_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {pending ? (
                            <span
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase"
                              style={{ color: AMBER_TEXT }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: AMBER }}
                                aria-hidden
                              />
                              Pending
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase"
                              style={{ color: GREEN_TEXT }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: GREEN }}
                                aria-hidden
                              />
                              Processed
                            </span>
                          )}
                          <a
                            href={`/api/app-portal/investor-admin/document-file?id=${encodeURIComponent(u.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-sm underline"
                            style={{ color: VIOLET }}
                          >
                            View
                          </a>
                          {pending && (
                            <button
                              type="button"
                              disabled={busy === "incorporate"}
                              onClick={() => incorporate([u.id])}
                              className="font-body text-sm px-3 py-1.5 rounded-btn text-white disabled:opacity-50"
                              style={{ background: INK }}
                            >
                              Incorporate
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
