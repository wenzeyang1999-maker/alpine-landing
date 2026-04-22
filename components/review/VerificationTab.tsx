"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DemoApi } from "@/lib/demo-api-factory";
import type { VerificationPoint } from "@/lib/ridgeline-data";

export function VerificationTab({ reviewId, api }: { reviewId: string; api: DemoApi }) {
  const [points, setPoints] = useState<VerificationPoint[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [overridePoint, setOverridePoint] = useState<string | null>(null);
  const [overrideStatus, setOverrideStatus] = useState("");
  const [overrideNote, setOverrideNote] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [rawPts, sum] = await Promise.all([
        api.getVerifications(reviewId),
        api.getVerificationSummary(reviewId),
      ]);
      const flat: VerificationPoint[] = [];
      if (Array.isArray(rawPts)) {
        flat.push(...rawPts);
      } else {
        for (const [, items] of Object.entries(rawPts)) {
          if (Array.isArray(items)) flat.push(...(items as VerificationPoint[]));
        }
      }
      setPoints(flat);
      setSummary(sum);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, [reviewId, api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOverride = async () => {
    if (!overridePoint || !overrideStatus) return;
    try {
      await api.overrideVerification(reviewId, overridePoint, overrideStatus, overrideNote);
      setOverridePoint(null);
      setOverrideStatus("");
      setOverrideNote("");
      await fetchData();
    } catch {
      /* noop */
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "verified": return "text-emerald-400 bg-emerald-500/10";
      case "flagged": return "text-red-400 bg-red-500/10";
      case "pending": return "text-amber-400 bg-amber-500/10";
      case "not_applicable": return "text-br-text-muted bg-br-surface";
      default: return "text-br-text-muted bg-br-surface";
    }
  };

  const categories = useMemo(() => {
    const cats: Record<string, VerificationPoint[]> = {};
    for (const p of points) {
      if (!cats[p.category]) cats[p.category] = [];
      cats[p.category].push(p);
    }
    return cats;
  }, [points]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-alpine-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const registryPoints = points.filter((p) =>
    p.title.includes("Registration") || p.title.includes("Registry") || p.title.includes("License")
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-heading font-semibold text-br-text-primary">Verification & Registry</h2>
        <p className="text-[12px] text-br-text-muted mt-0.5">
          Regulatory registration, company registry, and independent verification results
        </p>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: summary.total, color: "text-br-text-primary" },
            { label: "Verified", value: summary.verified, color: "text-emerald-400" },
            { label: "Flagged", value: summary.flagged, color: "text-red-400" },
            { label: "Pending", value: summary.pending, color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="bg-br-card border border-br rounded-xl px-4 py-3 text-center">
              <p className={`text-[20px] font-mono font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-br-text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Registration Map */}
      <div className="bg-br-card border border-br rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-br">
          <h3 className="text-[13px] font-heading font-semibold text-br-text-primary flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="5.5" /><path d="M2.5 8h11M8 2.5c-2 2-2 9 0 11M8 2.5c2 2 2 9 0 11" /></svg>
            Registration & Registry Map
          </h3>
          <p className="text-[11px] text-br-text-muted mt-0.5">Manager and affiliate registrations across jurisdictions</p>
        </div>
        <div className="divide-y divide-br/50">
          {[
            { entity: "Ridgeline Capital Partners, LLC", type: "Investment Adviser", jurisdiction: "United States — SEC", registry: "SEC IAPD (CRD 298741)", status: "verified", since: "April 2018" },
            { entity: "Ridgeline Capital Partners, LLC", type: "Limited Liability Company", jurisdiction: "United States — Delaware", registry: "Delaware Division of Corporations", status: "verified", since: "March 2018" },
            { entity: "Ridgeline Global Opportunities Fund, Ltd", type: "Regulated Mutual Fund", jurisdiction: "Cayman Islands — CIMA", registry: "Cayman Islands Monetary Authority", status: "verified", since: "April 2018" },
            { entity: "Ridgeline Global Opportunities Fund, Ltd", type: "Exempted Company", jurisdiction: "Cayman Islands", registry: "Cayman Registrar of Companies", status: "verified", since: "March 2018" },
          ].map((reg, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-alpine-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#7B2CBF" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2l5 3v4c0 3-2.5 4.5-5 5.5-2.5-1-5-2.5-5-5.5V5L8 2z" /></svg>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-br-text-primary">{reg.entity}</p>
                  <p className="text-[11px] text-br-text-muted">{reg.type} &middot; {reg.jurisdiction}</p>
                  <p className="text-[10px] text-br-text-muted mt-0.5">
                    Registry: <span className="text-br-text-secondary">{reg.registry}</span> &middot; Since {reg.since}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${statusColor(reg.status)}`}>
                {reg.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category groups */}
      {Object.entries(categories).map(([cat, pts]) => {
        const filteredPts = pts.filter((p) => !registryPoints.includes(p));
        if (filteredPts.length === 0) return null;
        return (
          <div key={cat} className="bg-br-card border border-br rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-br">
              <h3 className="text-[13px] font-heading font-semibold text-br-text-primary capitalize">
                {cat.replace(/_/g, " ")} Verification
              </h3>
              <p className="text-[11px] text-br-text-muted">{filteredPts.length} points</p>
            </div>
            <div className="divide-y divide-br/50">
              {filteredPts.map((point, idx) => {
                const effectiveStatus = point.override_status || point.status;
                return (
                  <div key={point.id || point.point_id || idx} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-br-text-muted">{point.point_id}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor(effectiveStatus)}`}>
                            {effectiveStatus.toUpperCase()}
                          </span>
                          {point.override_status && (
                            <span className="text-[9px] text-amber-400">(overridden)</span>
                          )}
                        </div>
                        <p className="text-[12px] font-medium text-br-text-primary mt-1">{point.title}</p>
                        {point.description && (
                          <p className="text-[11px] text-br-text-muted mt-0.5">{point.description}</p>
                        )}
                        {point.override_note && (
                          <p className="text-[11px] text-amber-400/70 mt-1 italic">Note: {point.override_note}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setOverridePoint(point.point_id);
                          setOverrideStatus(point.override_status || "verified");
                          setOverrideNote(point.override_note || "");
                        }}
                        className="text-[10px] text-br-text-muted hover:text-alpine-violet transition-colors flex-shrink-0"
                      >
                        Override
                      </button>
                    </div>

                    {overridePoint === point.point_id && (
                      <div className="mt-3 p-3 bg-br-surface rounded-lg space-y-2">
                        <select
                          value={overrideStatus}
                          onChange={(e) => setOverrideStatus(e.target.value)}
                          className="w-full bg-br-card border border-br rounded-lg px-3 py-1.5 text-[12px] text-br-text-primary focus:outline-none"
                        >
                          <option value="verified">Verified</option>
                          <option value="flagged">Flagged</option>
                          <option value="pending">Pending</option>
                          <option value="not_applicable">Not Applicable</option>
                        </select>
                        <input
                          type="text"
                          value={overrideNote}
                          onChange={(e) => setOverrideNote(e.target.value)}
                          placeholder="Override note"
                          className="w-full bg-br-card border border-br rounded-lg px-3 py-1.5 text-[12px] text-br-text-primary placeholder:text-br-text-muted focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleOverride}
                            className="px-3 py-1.5 rounded-lg bg-alpine-violet text-white text-[12px] font-medium hover:bg-alpine-violet-light transition-colors"
                          >
                            Apply Override
                          </button>
                          <button
                            onClick={() => setOverridePoint(null)}
                            className="px-3 py-1.5 rounded-lg bg-br-card border border-br text-br-text-secondary text-[12px] hover:text-br-text-primary transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
