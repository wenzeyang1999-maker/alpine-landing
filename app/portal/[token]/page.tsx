"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PortalDoc {
  id: string;
  filename: string;
  file_size: number | null;
  page_count: number | null;
  uploaded_at: string;
}

interface CoveredItem {
  doc_type: string;
  matched_file: string;
  confidence: string;
}

interface ReviewResults {
  covered: CoveredItem[];
  missing: { doc_type: string; note: string }[];
  follow_up_questions: string[];
  summary: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PORTAL_CONFIG: Record<string, { fund_name: string; document_types: string[] }> = {
  "demo-ridgeline-token": {
    fund_name: "Ridgeline Capital Partners",
    document_types: [
      "Due Diligence Questionnaire (DDQ)",
      "Compliance Manual",
      "Form ADV Part 2A",
      "Audited Financial Statements",
      "Valuation Policy",
      "Business Continuity Plan (BCP)",
      "Organizational Chart",
      "Expert Network Policy",
      "IC Charter",
      "Private Placement Memorandum",
      "Penetration Test Summary",
      "Incident Response Plan",
      "IC Meeting Minutes",
      "CompliySci Configuration Overview",
    ],
  },
  "demo-trellis-token": {
    fund_name: "Trellis Capital IV, L.P.",
    document_types: [
      "ILPA Due Diligence Questionnaire (DDQ)",
      "Form ADV Part 1 / ERA Filing",
      "Limited Partnership Agreement (LPA)",
      "Private Placement Memorandum (PPM)",
      "Subscription Agreement Template",
      "Audited Financial Statements FY2024",
      "Audited Financial Statements FY2023",
      "Valuation Policy",
      "Compliance Binder",
      "Fund Administrator Service Description",
    ],
  },
};

// Keywords used to match an uploaded filename against a requested document type
const DOC_TYPE_KEYWORDS: Record<string, string[]> = {
  // Ridgeline
  "Due Diligence Questionnaire (DDQ)":  ["ddq", "due_diligence"],
  "Compliance Manual":                  ["compliance_manual"],
  "Form ADV Part 2A":                   ["form_adv", "adv_part2", "adv_2a"],
  "Audited Financial Statements":       ["audited_financials", "audited_fs"],
  "Valuation Policy":                   ["valuation_policy", "valuation-policy"],
  "Business Continuity Plan (BCP)":     ["bcp", "business_continuity"],
  "Organizational Chart":               ["org_chart", "organizational_chart"],
  "Expert Network Policy":              ["expert_network"],
  "IC Charter":                         ["ic_charter"],
  "Private Placement Memorandum":       ["private_placement_memo", "ppm"],
  "Penetration Test Summary":           ["pen_test", "pentest", "penetration"],
  "Incident Response Plan":             ["incident_response"],
  "IC Meeting Minutes":                 ["ic_meeting", "meeting_minutes"],
  "CompliySci Configuration Overview":  ["compliysc"],
  // Trellis
  "ILPA Due Diligence Questionnaire (DDQ)": ["ilpa-ddq", "ilpa_ddq"],
  "Form ADV Part 1 / ERA Filing":           ["adv-era", "form_adv_era"],
  "Limited Partnership Agreement (LPA)":    ["iv-lpa", "iv_lpa"],
  "Private Placement Memorandum (PPM)":     ["iv-ppm", "iv_ppm"],
  "Subscription Agreement Template":        ["subscription_agreement", "subscription-agreement"],
  "Audited Financial Statements FY2024":    ["fs-fy2024", "audited-fy2024", "fs_fy2024"],
  "Audited Financial Statements FY2023":    ["fs-fy2023", "audited-fy2023", "fs_fy2023"],
  "Compliance Binder":                      ["compliance-binder", "compliance_binder"],
  "Fund Administrator Service Description": ["apex-service", "apex_service", "service-description"],
};

function getMatchedFile(docType: string, docs: PortalDoc[]): string | null {
  const keywords = DOC_TYPE_KEYWORDS[docType] ?? [];
  for (const doc of docs) {
    const lower = doc.filename.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw))) return doc.filename;
  }
  return null;
}

const FOLLOW_UP_ROUNDS = [
  {
    label: "Round 1",
    questions: [
      "Q1. The Compliance Manual (§4.2) references a dedicated CCO role, but the DDQ lists compliance as a shared responsibility of the PM. Please clarify the current compliance oversight structure.",
      "Q2. The BCP document does not include a succession plan for the founder/PM. Please confirm whether a board-approved succession plan exists and provide it if available.",
    ],
  },
  {
    label: "Round 2",
    questions: [
      "Q1. The CompliySci configuration does not show pre-trade compliance rules enabled. Please confirm whether pre-trade checks are enforced and describe the manual fallback procedure.",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function AlpineAppIcon({ size = 36 }: { size?: number }) {
  const r = Math.round(size * 0.2);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="summit-bg" x1="0" y1="120" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#7B2CBF" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx={r} fill="url(#summit-bg)" />
      <path d="M38 78 L60 36 L82 78" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function PortalPage() {
  const params = useParams();
  const token = params.token as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDemo = token in PORTAL_CONFIG;
  const portalInfo = PORTAL_CONFIG[token] ?? PORTAL_CONFIG["demo-ridgeline-token"];

  const [docs, setDocs] = useState<PortalDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Follow-up rounds display (demo shows completed rounds)
  const [activeRound] = useState(isDemo ? 2 : 0);

  // Dynamically computed from uploaded docs
  const coveredCount = portalInfo.document_types.filter(
    (dt) => getMatchedFile(dt, docs) !== null
  ).length;
  const allCovered = coveredCount === portalInfo.document_types.length;

  // On mount: load real uploaded docs from DB
  useEffect(() => {
    fetch(`/api/portal/documents?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((rows: PortalDoc[]) => {
        if (Array.isArray(rows)) setDocs(rows);
      })
      .catch(() => {});
  }, [token]);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    setUploadError("");
    setUploading(true);

    const newDocs: PortalDoc[] = [];
    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setUploadError("Only PDF files are supported.");
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);

      try {
        const res = await fetch("/api/portal/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }));
          setUploadError(err.error ?? "Upload failed");
          continue;
        }
        const row = await res.json();
        newDocs.push({
          id: row.id,
          filename: row.filename,
          file_size: row.file_size,
          page_count: null,
          uploaded_at: row.uploaded_at,
        });
      } catch {
        setUploadError("Network error — please try again.");
      }
    }

    if (newDocs.length > 0) setDocs((prev) => [...newDocs, ...prev]);
    setUploading(false);
  }, [token]);

  // ── Invalid token ──────────────────────────────────────────────────────────
  if (!isDemo) {
    return (
      <div className="min-h-screen bg-alpine-snow">
        <header className="bg-white border-b border-alpine-border/60">
          <div className="mx-auto max-w-3xl px-6 py-4 flex items-center gap-3">
            <AlpineAppIcon size={40} />
            <div>
              <div className="font-heading font-bold text-base text-alpine-ink leading-tight">Alpine ODD</div>
              <div className="text-xs text-alpine-slate">Powered by Alpine</div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="font-heading text-xl font-bold text-alpine-ink">Invalid Link</h1>
          <p className="text-sm text-alpine-slate mt-2">
            This portal link is not valid. Please check the URL or contact the requesting party.
          </p>
        </main>
      </div>
    );
  }

  const INPUT_CLASS =
    "w-full px-3 py-2 border border-alpine-border rounded-lg text-sm text-alpine-ink placeholder:text-alpine-slate/50 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 focus:border-alpine-violet";

  return (
    <div className="min-h-screen bg-alpine-snow">
      {/* Header */}
      <header className="bg-white border-b border-alpine-border/60">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlpineAppIcon size={40} />
            <div>
              <div className="font-heading font-bold text-base text-alpine-ink leading-tight">Alpine ODD</div>
              <div className="text-xs text-alpine-slate">Powered by Alpine</div>
            </div>
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{ color: "#10B981", borderColor: "rgba(16,185,129,0.3)", backgroundColor: "rgba(16,185,129,0.1)" }}
          >
            Secure Upload Portal
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">

        {/* Context */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-alpine-ink">Document Upload Portal</h1>
          <p className="text-sm text-alpine-slate mt-2">
            <strong>Alpine Due Diligence</strong> is conducting operational due diligence on{" "}
            <strong>{portalInfo.fund_name}</strong> and has requested the following documents.
          </p>
        </div>

        {/* Completion banner — only shown when all docs received */}
        {allCovered && (
          <div
            className="rounded-xl p-4 mb-6 flex items-start gap-3"
            style={{ backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)", border: "1px solid" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <h3 className="font-heading font-semibold text-sm text-alpine-ink">Submission Complete</h3>
              <p className="text-xs text-alpine-slate mt-0.5">
                All {portalInfo.document_types.length} requested documents received and verified. Alpine has been notified and will proceed to review.
              </p>
            </div>
          </div>
        )}

        {/* Requested documents checklist */}
        <div className="bg-white rounded-xl border border-alpine-border p-5 mb-6">
          <h2 className="font-heading font-semibold text-sm text-alpine-ink mb-3">
            Requested Documents
            <span className="ml-2 text-xs font-normal text-alpine-slate">
              {coveredCount} / {portalInfo.document_types.length} received
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {portalInfo.document_types.map((docType, i) => {
              const matched = getMatchedFile(docType, docs);
              return (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 shrink-0">
                  {matched ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-alpine-slate/40">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </span>
                <span className={matched ? "text-alpine-ink" : "text-alpine-slate/60"}>{docType}</span>
              </div>
              );
            })}
          </div>
        </div>

        {/* Upload zone */}
        <div className="bg-white rounded-xl border border-alpine-border p-5 mb-6">
          <h2 className="font-heading font-semibold text-sm text-alpine-ink mb-3">Upload Documents</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragOver ? "border-alpine-violet bg-alpine-violet/5" : "border-alpine-border hover:border-alpine-violet/40"
            }`}
          >
            <svg
              width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              className={`mx-auto mb-3 ${dragOver ? "text-alpine-violet" : "text-alpine-slate"}`}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm font-medium text-alpine-ink">
              {uploading ? "Uploading..." : "Drag and drop PDF files here, or click to browse"}
            </p>
            <p className="text-xs text-alpine-slate mt-1">PDF files only, up to 50 MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); e.target.value = ""; }}
            />
          </div>
          {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
        </div>

        {/* Uploaded documents list */}
        {docs.length > 0 && (
          <div className="bg-white rounded-xl border border-alpine-border p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-sm text-alpine-ink">
                Documents Received
                <span className="ml-2 text-xs font-mono bg-alpine-violet/10 text-alpine-violet px-1.5 py-0.5 rounded">
                  {docs.length} docs
                </span>
              </h2>
              {isDemo && (
                <span className="text-[10px] text-alpine-slate">
                  {docs.filter((_, i) => i < 8).length} initial upload · {docs.length - 8 > 0 ? `${docs.length - 8} from follow-up` : ""}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2.5 py-2 border-b border-alpine-border/40 last:border-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-alpine-ink truncate">{doc.filename}</p>
                    <p className="text-[10px] text-alpine-slate">
                      {formatFileSize(doc.file_size)}{doc.page_count ? ` · ${doc.page_count}pp` : ""}
                      {" · "}{formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Follow-Up Agent (demo: shows completed rounds) */}
        {isDemo && (
          <div className="bg-white rounded-xl border border-alpine-border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-sm text-alpine-ink flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                AI Follow-Up Agent
              </h2>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}
              >
                {activeRound} rounds complete
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              {FOLLOW_UP_ROUNDS.map((round, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: "rgba(16,185,129,0.08)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                >
                  {round.label} ✓
                </span>
              ))}
            </div>

            {FOLLOW_UP_ROUNDS.map((round, ri) => (
              <div key={ri} className="mb-4 last:mb-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-2">{round.label} Questions — Answered</p>
                <div className="space-y-2">
                  {round.questions.map((q, qi) => (
                    <div
                      key={qi}
                      className="rounded-lg p-3 text-xs"
                      style={{ backgroundColor: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}
                    >
                      <div className="flex items-start gap-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-alpine-ink">{q}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Compliance commitment */}
        <div className="bg-white rounded-xl border border-alpine-border p-5 mt-2">
          <h2 className="font-heading font-semibold text-sm text-alpine-ink mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
            </svg>
            Our Compliance Commitment
          </h2>
          <ul className="space-y-2 text-xs text-alpine-slate leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-alpine-green mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span>
                <strong className="text-alpine-ink">Zero AI Training</strong> — Your data is never used to train, fine-tune, or modify any AI model. This is a contractual prohibition under our Data Processing Agreement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-alpine-green mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span>
                <strong className="text-alpine-ink">Encrypted End-to-End</strong> — Documents are encrypted in transit (TLS 1.3) and at rest (AES-256) on dedicated, access-controlled servers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-alpine-green mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span>
                <strong className="text-alpine-ink">Audit Trail</strong> — Every upload, access, and action is logged with timestamp, IP, and user identity. You can request a full audit log at any time.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-alpine-green mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span>
                <strong className="text-alpine-ink">Right to Delete</strong> — You may request deletion of all uploaded documents at any time by contacting support@alpinedd.com.
              </span>
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
}
