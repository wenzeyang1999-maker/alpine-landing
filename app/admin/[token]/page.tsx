"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────

type Screen = "gate" | "welcome" | "questionnaire" | "review" | "done";
type ResponseType = "confirm" | "caveat" | "decline" | "contradict" | null;

interface QuestionResponse {
  type: ResponseType;
  freeText: string;
  declineReason: string;
  uploadedFile: string | null;
}

interface Question {
  id: string;
  num: number;
  category: string;
  title: string;
  tag: "baseline" | "additional" | "conditional" | "strategy";
  managerClaim: string;
  prompt: string;
  subItems?: { label: string; claim: string }[];
  hasUpload: boolean;
  hasNdaUpload?: boolean;
}

const DECLINE_REASONS = [
  { code: "scope", label: "Outside engagement scope" },
  { code: "confidentiality", label: "Confidentiality restriction" },
  { code: "no_records", label: "No records on file" },
  { code: "other", label: "Other" },
];

// ── Engagement data ────────────────────────────────────────────────────────────

const ENGAGEMENT = {
  fund: "Trellis Capital IV, L.P.",
  manager: "Trellis Capital Management, LLC",
  administrator: "Apex Fund Services, LLC",
  contact: "James Whitfield",
  title: "Director of Fund Administration",
  requesting_org: "Alpine Due Diligence",
  reporting_date: "December 31, 2025",
  expires: "May 16, 2026",
  engagement_id: "ENG-2026-TC-04",
  issued: "May 2, 2026",
};

// ── 10 Questions ───────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "q01", num: 1, category: "AUM Confirmation", title: "AUM as of Reporting Date", tag: "baseline",
    managerClaim: "The Manager has represented net assets of $280.3 million as of December 31, 2025, with $113.7 million in uncalled capital and $274 million in total aggregate commitments to Fund IV.",
    prompt: "Please confirm whether these figures align with your records as administrator. If they do not, please provide the correct figures and describe any variance.",
    hasUpload: true,
  },
  {
    id: "q02", num: 2, category: "Investor Account Count", title: "Investor Accounts on Record", tag: "baseline",
    managerClaim: "The Manager has represented that Trellis Capital IV, L.P. currently has 47 limited partner accounts on record as of the reporting date.",
    prompt: "Please confirm the number of active investor accounts you hold on record for this fund as of December 31, 2025.",
    hasUpload: false,
  },
  {
    id: "q03", num: 3, category: "NAV Errors (24 months)", title: "NAV Errors and Restatements", tag: "baseline",
    managerClaim: "The Manager has represented that there have been no NAV errors, restatements, or material corrections in the prior fund vehicles (Fund I, Fund II, Fund III) within the last 24 months.",
    prompt: "Please disclose any NAV errors, restatements, or corrections processed in prior Trellis Capital vehicles for which you serve as administrator during the period January 2024 through December 2025.",
    hasUpload: false,
  },
  {
    id: "q04", num: 4, category: "Fee Calculation", title: "Fee Terms and Calculation", tag: "baseline",
    managerClaim: "The Manager has represented the following fee terms for Fund IV: management fee of 2.5% on commitments during the commitment period and 1.5% on invested capital thereafter; carried interest of 20% via American waterfall; no preferred return; no high water mark; clawback provision applies; recycling permitted up to 120% of aggregate commitments; organizational expenses capped at $350,000.",
    prompt: "Please confirm whether the fee terms as described are consistent with the LPA and your calculation methodology. Note any side letter departures or variations you administer.",
    hasUpload: false,
  },
  {
    id: "q05", num: 5, category: "Reporting Timeliness", title: "Reporting Frequency and Delivery", tag: "baseline",
    managerClaim: "The Manager has represented that quarterly reports are delivered within 45 business days of quarter-end via the FundPanel LP Portal, and audited financials are delivered within 120 days of year-end under U.S. GAAP. The Manager and Administrator jointly represented that prior funds have never had an investor reporting error.",
    prompt: "Please confirm the reporting schedule you administer and identify any instances in the prior 12 months where reports were delivered outside the stated delivery window.",
    hasUpload: false,
  },
  {
    id: "q06", num: 6, category: "AML and KYC Procedures", title: "AML and KYC Procedures", tag: "baseline",
    managerClaim: "The Manager has represented that AML and KYC policies are maintained as required for an Exempt Reporting Adviser. The Manager's DDQ describes standard KYC collection for new investors and references ongoing monitoring procedures, though no formal periodic recertification program is documented.",
    prompt: "Please describe the AML and KYC procedures you apply at the point of investor onboarding and on an ongoing basis. Confirm whether you apply enhanced due diligence for high-risk investor categories.",
    hasUpload: false,
  },
  {
    id: "q07", num: 7, category: "Valuation Involvement", title: "Valuation Involvement and Independence", tag: "additional",
    managerClaim: "The Manager has represented that Apex Fund Services is notably hands-on with valuation guidance. The Manager's valuation policy describes a VC cost-basis approach for Level 3 assets, with adjustment triggers based on observable transactions. No formal internal valuation committee exists — pricing is controlled by the front office and reviewed by Apex.",
    prompt: "Please describe your role in the portfolio pricing process, including: (a) independence of your pricing sources from the Manager; (b) your authority to override a Manager-proposed price and frequency of exercise; (c) your escalation procedure for disputed valuations; and (d) your treatment of Level 3 assets per the Manager's stated valuation policy.",
    hasUpload: false,
  },
  {
    id: "q08", num: 8, category: "Cash Controls", title: "Cash Controls — Three Flows", tag: "additional",
    managerClaim: "The Manager has represented that wire authorizations require dual approval via Bill.com. Apex Fund Services receives all investment wire instructions from the Manager and independently verifies wire details directly with portfolio companies before initiating. Subscriptions and redemptions are processed through Pacific Commerce / JP Morgan banking relationships.",
    prompt: "For each of the three cash flows below, please confirm whether the controls described align with your operational procedures, or describe the actual control in place.",
    subItems: [
      { label: "(a) Investment cash movements", claim: "Apex receives wire instructions from Manager and independently verifies details with portfolio companies via direct contact before initiating. Dual authorization via Bill.com required." },
      { label: "(b) Operating expense disbursements", claim: "Fund-level expenses and manager reimbursements require dual authorization. Organizational expenses are capped at $350,000 per LPA. No formal back-office override procedure documented." },
      { label: "(c) Investor capital flows", claim: "Subscription receipts processed through Pacific Commerce / JP Morgan. Apex processes all LP subscription and redemption documentation. No capital transaction errors reported in prior funds." },
    ],
    hasUpload: false,
  },
  {
    id: "q09", num: 9, category: "SOC 1 / SOC 2 Attestation", title: "SOC Report — Current Attestation", tag: "conditional",
    managerClaim: "No current SOC 1 Type II or SOC 2 Type II report covering Apex Fund Services is held in the Alpine library for the engagement period.",
    prompt: "Please upload the most recent SOC 1 Type II or SOC 2 Type II report covering the engagement period (report period end within the last 15 months). If you require a mutual NDA prior to releasing the report, please use the option below to upload your NDA template for Alpine countersignature.",
    hasUpload: true,
    hasNdaUpload: true,
  },
  {
    id: "q10", num: 10, category: "Asset Existence", title: "Asset Existence — Portfolio Company Equity", tag: "strategy",
    managerClaim: "The Manager has represented that Apex Fund Services obtains share certificates and equity documentation directly from portfolio companies via Carta, independently of the Manager. Baker Thompson & Co. issues audit confirmations to approximately 50% of portfolio companies annually.",
    prompt: "Please confirm your role in verifying the existence of portfolio company equity positions held by the fund. Specifically: (a) confirm that share certificates or equivalent equity documentation are obtained directly by Apex from portfolio companies or cap table platforms independent of Manager instruction; and (b) describe any reconciliation procedure you perform against the Manager's schedule of investments.",
    hasUpload: true,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildInitialResponses(): Record<string, QuestionResponse> {
  const r: Record<string, QuestionResponse> = {};
  for (const q of QUESTIONS) r[q.id] = { type: null, freeText: "", declineReason: "", uploadedFile: null };
  return r;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  baseline:    { bg: "rgba(123,44,191,0.10)", text: "#7B2CBF" },
  additional:  { bg: "rgba(245,158,11,0.10)", text: "#D97706" },
  conditional: { bg: "rgba(14,165,233,0.10)", text: "#0284C7" },
  strategy:    { bg: "rgba(16,185,129,0.10)", text: "#059669" },
};

const TAG_LABELS: Record<string, string> = {
  baseline: "Baseline", additional: "Additional Baseline",
  conditional: "Conditional", strategy: "Strategy-Gated",
};

const RESPONSE_OPTIONS = [
  { value: "confirm",    label: "Confirm",             desc: "Representation matches our records",          color: "#10B981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.3)"  },
  { value: "caveat",     label: "Confirm with caveat", desc: "Broadly correct, with qualification",         color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)"  },
  { value: "decline",    label: "Decline to confirm",  desc: "Cannot confirm — reason required",            color: "#64748B", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.3)" },
  { value: "contradict", label: "Contradict",          desc: "Representation does not match our records",   color: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)"   },
] as const;

function AlpineIcon({ size = 36 }: { size?: number }) {
  const r = Math.round(size * 0.2);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="alp-bg" x1="0" y1="120" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" /><stop offset="50%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#7B2CBF" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx={r} fill="url(#alp-bg)" />
      <path d="M38 78 L60 36 L82 78" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-alpine-border/60 sticky top-0 z-10">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
        <AlpineIcon size={36} />
        <div>
          <div className="font-heading font-bold text-sm text-alpine-ink">Alpine ODD</div>
          <div className="text-[11px] text-alpine-slate">Administrator Verification Portal</div>
        </div>
      </div>
    </header>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AdminPortalPage() {
  const params = useParams();
  const token = params.token as string;
  const isDemo = token === "demo-apex-admin";

  const [screen, setScreen] = useState<Screen>("gate");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [respondingName, setRespondingName] = useState(ENGAGEMENT.contact);
  const [respondingTitle, setRespondingTitle] = useState(ENGAGEMENT.title);

  // Stable reference ID generated once at submission time
  const [refId] = useState(() => `${ENGAGEMENT.engagement_id}-${Date.now().toString(36).toUpperCase()}`);

  const [responses, setResponses] = useState<Record<string, QuestionResponse>>(buildInitialResponses);
  const [ndaUploaded, setNdaUploaded] = useState(false);
  const [activeQ, setActiveQ] = useState("q01");
  const [submitting, setSubmitting] = useState(false);

  const socFileRef = useRef<HTMLInputElement>(null);
  const ndaFileRef = useRef<HTMLInputElement>(null);
  const questionFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setResponse = (qid: string, patch: Partial<QuestionResponse>) =>
    setResponses(prev => ({ ...prev, [qid]: { ...prev[qid], ...patch } }));

  const answeredCount = QUESTIONS.filter(q => responses[q.id].type !== null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  if (!isDemo) {
    return (
      <div className="min-h-screen bg-alpine-snow">
        <Header />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="font-heading text-xl font-bold text-alpine-ink">Invalid Link</h1>
          <p className="text-sm text-alpine-slate mt-2">This verification link is not valid or has expired. Please contact Alpine Due Diligence.</p>
        </main>
      </div>
    );
  }

  // ── Screen 1: Email gate ───────────────────────────────────────────────────

  if (screen === "gate") {
    const handleVerify = async () => {
      if (!email.trim()) { setEmailError("Please enter your email address."); return; }
      if (!email.includes("@")) { setEmailError("Please enter a valid email address."); return; }
      setVerifying(true);
      await new Promise(r => setTimeout(r, 900));
      setVerifying(false);
      setScreen("welcome");
    };

    return (
      <div className="min-h-screen bg-alpine-snow flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white border border-alpine-border rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-alpine-violet/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="font-heading text-lg font-bold text-alpine-ink">Verify your identity</h1>
              <p className="text-sm text-alpine-slate mt-1 mb-5">Enter the email address associated with this verification request to access the portal.</p>

              <div className="p-3 rounded-lg bg-alpine-snow border border-alpine-border mb-5">
                <p className="text-[11px] text-alpine-slate font-medium uppercase tracking-wide mb-1">Engagement</p>
                <p className="text-sm font-semibold text-alpine-ink">{ENGAGEMENT.fund}</p>
                <p className="text-xs text-alpine-slate mt-0.5">Requested by {ENGAGEMENT.requesting_org} · Expires {ENGAGEMENT.expires}</p>
              </div>

              <div className="space-y-3">
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleVerify()}
                  placeholder="your@apex.com"
                  className="w-full px-3 py-2.5 border border-alpine-border rounded-lg text-sm text-alpine-ink placeholder:text-alpine-slate/50 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 focus:border-alpine-violet"
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                <button onClick={handleVerify} disabled={verifying}
                  className="w-full py-2.5 rounded-lg bg-alpine-violet text-white text-sm font-semibold hover:bg-alpine-violet/90 transition-colors disabled:opacity-60">
                  {verifying ? "Verifying…" : "Access Portal"}
                </button>
              </div>

              <p className="text-[11px] text-alpine-slate mt-4 text-center">All responses are timestamped and tied to your contact identity for audit trail purposes.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Screen 2: Welcome / Engagement Overview ────────────────────────────────

  if (screen === "welcome") {
    const daysLeft = 13;
    return (
      <div className="min-h-screen bg-alpine-snow flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl px-6 py-10 flex flex-col gap-6">

          {/* Verified banner */}
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Identity verified — responding as <strong className="ml-1">{email}</strong>
          </div>

          {/* Engagement card */}
          <div className="bg-white border border-alpine-border rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-alpine-border">
              <p className="text-[11px] font-semibold text-alpine-slate uppercase tracking-wide mb-1">Administrator Verification Request</p>
              <h1 className="font-heading text-2xl font-bold text-alpine-ink">{ENGAGEMENT.fund}</h1>
              <p className="text-sm text-alpine-slate mt-1">
                {ENGAGEMENT.requesting_org} requests independent confirmation from <strong className="text-alpine-ink">{ENGAGEMENT.administrator}</strong>
              </p>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Manager", value: "Trellis Capital Mgmt." },
                { label: "Reporting Date", value: ENGAGEMENT.reporting_date },
                { label: "Engagement ID", value: ENGAGEMENT.engagement_id },
                { label: "Issued", value: ENGAGEMENT.issued },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-alpine-slate">{s.label}</p>
                  <p className="text-xs font-medium text-alpine-ink mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Responding contact */}
          <div className="bg-white border border-alpine-border rounded-2xl px-6 py-5">
            <h2 className="font-heading text-sm font-semibold text-alpine-ink mb-4">Confirm your contact details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1.5">Full Name</label>
                <input type="text" value={respondingName} onChange={e => setRespondingName(e.target.value)}
                  className="w-full px-3 py-2 border border-alpine-border rounded-lg text-sm text-alpine-ink focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 focus:border-alpine-violet" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1.5">Title</label>
                <input type="text" value={respondingTitle} onChange={e => setRespondingTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-alpine-border rounded-lg text-sm text-alpine-ink focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 focus:border-alpine-violet" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1.5">Email</label>
                <input type="email" value={email} readOnly
                  className="w-full px-3 py-2 border border-alpine-border rounded-lg text-sm text-alpine-slate bg-alpine-snow cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Expiry + progress */}
          <div className="bg-white border border-alpine-border rounded-2xl px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-sm font-semibold text-alpine-ink">Verification Overview</h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 bg-amber-50">
                Expires in {daysLeft} days
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Sections", value: "10" },
                { label: "Completed", value: "0" },
                { label: "Expiry", value: ENGAGEMENT.expires },
              ].map(s => (
                <div key={s.label} className="text-center rounded-xl bg-alpine-snow p-3">
                  <p className="text-xl font-mono font-bold text-alpine-ink">{s.value}</p>
                  <p className="text-[10px] text-alpine-slate mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="w-full h-1.5 rounded-full bg-alpine-border overflow-hidden">
              <div className="h-full rounded-full bg-alpine-violet" style={{ width: "0%" }} />
            </div>
            <p className="text-[11px] text-alpine-slate mt-2">0 of 10 sections complete</p>
          </div>

          <button onClick={() => setScreen("questionnaire")}
            className="w-full py-3.5 rounded-xl bg-alpine-violet text-white text-sm font-semibold hover:bg-alpine-violet/90 transition-colors flex items-center justify-center gap-2">
            Start Verification
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </main>
      </div>
    );
  }

  // ── Screen 3: Questionnaire ────────────────────────────────────────────────

  if (screen === "questionnaire") {
    const currentQ = QUESTIONS.find(q => q.id === activeQ) ?? QUESTIONS[0];
    const currentIdx = QUESTIONS.findIndex(q => q.id === activeQ);
    const resp = responses[currentQ.id];
    const isLast = currentIdx === QUESTIONS.length - 1;

    const canProceed = resp.type !== null
      && (resp.type !== "caveat" || resp.freeText.trim().length > 0)
      && (resp.type !== "contradict" || resp.freeText.trim().length > 0)
      && (resp.type !== "decline" || resp.declineReason.length > 0);

    const handleNext = () => {
      if (isLast) { setScreen("review"); return; }
      setActiveQ(QUESTIONS[currentIdx + 1].id);
    };

    const getSidebarStatus = (q: Question) => {
      const r = responses[q.id];
      if (r.type === "confirm")    return { icon: "✓", color: "#10B981" };
      if (r.type === "caveat")     return { icon: "~", color: "#F59E0B" };
      if (r.type === "decline")    return { icon: "—", color: "#64748B" };
      if (r.type === "contradict") return { icon: "!", color: "#EF4444" };
      return null;
    };

    return (
      <div className="min-h-screen bg-alpine-snow flex flex-col">
        {/* Sticky header with progress */}
        <header className="bg-white border-b border-alpine-border/60 sticky top-0 z-10">
          <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlpineIcon size={32} />
              <div>
                <div className="font-heading font-bold text-sm text-alpine-ink">Alpine ODD</div>
                <div className="text-[11px] text-alpine-slate hidden sm:block">Administrator Verification Portal</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-alpine-slate">{answeredCount}/{QUESTIONS.length} answered</span>
              <div className="w-28 h-1.5 rounded-full bg-alpine-border overflow-hidden hidden sm:block">
                <div className="h-full rounded-full bg-alpine-violet transition-all" style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }} />
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-alpine-border text-alpine-slate">
                Expires {ENGAGEMENT.expires}
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl w-full px-6 py-8 flex gap-6">

          {/* Left sidebar nav */}
          <aside className="w-52 shrink-0 hidden lg:block">
            <div className="bg-white border border-alpine-border rounded-xl overflow-hidden sticky top-20">
              <div className="px-3 py-2.5 border-b border-alpine-border">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-alpine-slate">Questions</p>
              </div>
              <div className="p-1">
                {QUESTIONS.map((q, i) => {
                  const st = getSidebarStatus(q);
                  const isActive = q.id === activeQ;
                  return (
                    <button key={q.id} onClick={() => setActiveQ(q.id)}
                      className="w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center gap-2"
                      style={{ background: isActive ? "rgba(123,44,191,0.08)" : "transparent" }}>
                      <span className="text-[10px] font-mono font-bold shrink-0"
                        style={{ color: isActive ? "#7B2CBF" : "#94A3B8" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[11px] font-medium truncate"
                        style={{ color: isActive ? "#0F172A" : "#475569" }}>
                        {q.category}
                      </span>
                      {st && (
                        <span className="text-[10px] font-bold shrink-0" style={{ color: st.color }}>{st.icon}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main question panel */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Question card */}
            <div className="bg-white border border-alpine-border rounded-xl overflow-hidden">
              {/* Question header */}
              <div className="px-5 py-4 border-b border-alpine-border flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ background: "rgba(123,44,191,0.1)", color: "#7B2CBF" }}>
                    {String(currentQ.num).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-alpine-slate">{currentQ.category}</p>
                    <h2 className="font-heading font-semibold text-sm text-alpine-ink mt-0.5">{currentQ.title}</h2>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: TAG_COLORS[currentQ.tag].bg, color: TAG_COLORS[currentQ.tag].text }}>
                  {TAG_LABELS[currentQ.tag]}
                </span>
              </div>

              <div className="px-5 py-5 space-y-4">
                {/* Manager claim */}
                <div className="border-l-2 pl-3" style={{ borderColor: "rgba(123,44,191,0.4)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#7B2CBF" }}>Manager representation</p>
                  <p className="text-xs text-alpine-slate leading-relaxed italic">{currentQ.managerClaim}</p>
                </div>

                {/* Sub-items for Q08 */}
                {currentQ.subItems && (
                  <div className="space-y-2">
                    {currentQ.subItems.map((sub, i) => (
                      <div key={i} className="rounded-lg bg-alpine-snow p-3">
                        <p className="text-xs font-semibold text-alpine-ink mb-1">{sub.label}</p>
                        <p className="text-xs text-alpine-slate italic">{sub.claim}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prompt */}
                <p className="text-xs text-alpine-ink leading-relaxed">{currentQ.prompt}</p>

                {/* 4-option response */}
                <div className="grid grid-cols-2 gap-2">
                  {RESPONSE_OPTIONS.map(opt => {
                    const selected = resp.type === opt.value;
                    return (
                      <button key={opt.value}
                        onClick={() => setResponse(currentQ.id, { type: opt.value as ResponseType, freeText: "", declineReason: "" })}
                        className="text-left rounded-lg p-3 border transition-all"
                        style={selected
                          ? { backgroundColor: opt.bg, borderColor: opt.border }
                          : { backgroundColor: "transparent", borderColor: "rgba(203,213,225,0.6)" }}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={selected ? { borderColor: opt.color, backgroundColor: opt.color } : { borderColor: "#CBD5E1" }}>
                            {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <p className="text-xs font-semibold text-alpine-ink">{opt.label}</p>
                        </div>
                        <p className="text-[10px] text-alpine-slate pl-5">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Free text for caveat / contradict */}
                {(resp.type === "caveat" || resp.type === "contradict") && (
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1">
                      {resp.type === "contradict" ? "Describe the actual position (required)" : "Describe the qualification (required)"}
                    </label>
                    <textarea value={resp.freeText} onChange={e => setResponse(currentQ.id, { freeText: e.target.value })}
                      rows={3} placeholder={resp.type === "contradict" ? "Please describe the correct position…" : "Please describe the caveat or qualification…"}
                      className="w-full px-3 py-2 border border-alpine-border rounded-lg text-xs text-alpine-ink placeholder:text-alpine-slate/50 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 focus:border-alpine-violet resize-none" />
                  </div>
                )}

                {/* Decline reason */}
                {resp.type === "decline" && (
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1">Reason (required)</label>
                    <select value={resp.declineReason} onChange={e => setResponse(currentQ.id, { declineReason: e.target.value })}
                      className="w-full px-3 py-2 border border-alpine-border rounded-lg text-xs text-alpine-ink focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 focus:border-alpine-violet bg-white">
                      <option value="">Select a reason…</option>
                      {DECLINE_REASONS.map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                    </select>
                  </div>
                )}

                {/* File upload */}
                {currentQ.hasUpload && (
                  <div className="space-y-2">
                    {currentQ.id === "q09" ? (
                      <>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1">Upload SOC Report</label>
                          <div className="border border-dashed border-alpine-border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-alpine-violet/40 transition-colors"
                            onClick={() => socFileRef.current?.click()}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <span className="text-xs text-alpine-slate">{resp.uploadedFile ?? "Click to upload SOC 1 or SOC 2 Type II report (PDF)"}</span>
                            <input ref={socFileRef} type="file" accept=".pdf" className="hidden" onChange={e => { if (e.target.files?.[0]) setResponse(currentQ.id, { uploadedFile: e.target.files[0].name }); }} />
                          </div>
                        </div>
                        <div className="rounded-lg border border-dashed border-alpine-border/80 px-4 py-3 bg-alpine-snow">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-alpine-violet mb-1">NDA Accommodation</p>
                          <p className="text-xs text-alpine-slate mb-2">If you require a mutual NDA before releasing the SOC report, upload your template here. Alpine will review and countersign.</p>
                          <div className="border border-dashed border-alpine-border rounded-lg px-3 py-2 flex items-center gap-3 cursor-pointer hover:border-alpine-violet/40 transition-colors"
                            onClick={() => ndaFileRef.current?.click()}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ndaUploaded ? "#10B981" : "#64748B"} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span className="text-xs text-alpine-slate">{ndaUploaded ? "NDA template uploaded — awaiting Alpine countersignature" : "Upload NDA template for Alpine countersignature"}</span>
                            <input ref={ndaFileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) setNdaUploaded(true); }} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wide text-alpine-slate mb-1">Supporting document (optional)</label>
                        <div className="border border-dashed border-alpine-border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-alpine-violet/40 transition-colors"
                          onClick={() => questionFileRefs.current[currentQ.id]?.click()}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span className="text-xs text-alpine-slate">{resp.uploadedFile ?? "Attach supporting evidence (PDF)"}</span>
                          <input ref={el => { questionFileRefs.current[currentQ.id] = el; }} type="file" accept=".pdf" className="hidden"
                            onChange={e => { if (e.target.files?.[0]) setResponse(currentQ.id, { uploadedFile: e.target.files[0].name }); }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={() => currentIdx > 0 && setActiveQ(QUESTIONS[currentIdx - 1].id)}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 text-sm font-medium text-alpine-slate hover:text-alpine-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Previous
              </button>
              <span className="text-xs text-alpine-slate">{currentIdx + 1} of {QUESTIONS.length}</span>
              <button onClick={handleNext} disabled={!canProceed}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-alpine-violet px-4 py-2 rounded-lg hover:bg-alpine-violet/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {isLast ? "Review & Submit" : "Save & Next"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Screen 4: Review & Submit ──────────────────────────────────────────────

  if (screen === "review") {
    const handleSubmit = async () => {
      if (!allAnswered) return;
      setSubmitting(true);
      await new Promise(r => setTimeout(r, 1200));
      setSubmitting(false);
      setScreen("done");
    };

    const RESPONSE_LABEL: Record<string, { label: string; color: string }> = {
      confirm:    { label: "Confirmed",          color: "#10B981" },
      caveat:     { label: "Confirmed w/ caveat", color: "#F59E0B" },
      decline:    { label: "Declined",            color: "#64748B" },
      contradict: { label: "Contradicted",        color: "#EF4444" },
    };

    return (
      <div className="min-h-screen bg-alpine-snow flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl px-6 py-10 flex flex-col gap-6">

          <div>
            <h1 className="font-heading text-xl font-bold text-alpine-ink">Review &amp; Submit</h1>
            <p className="text-sm text-alpine-slate mt-1">Review all responses before final submission. Use the edit links to make changes.</p>
          </div>

          {/* Summary table */}
          <div className="bg-white border border-alpine-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-alpine-border flex items-center justify-between">
              <p className="text-xs font-semibold text-alpine-ink">All {QUESTIONS.length} Questions</p>
              <p className="text-xs text-alpine-slate">{answeredCount} answered</p>
            </div>
            {QUESTIONS.map((q, i) => {
              const r = responses[q.id];
              const rl = r.type ? RESPONSE_LABEL[r.type] : null;
              return (
                <div key={q.id} className="px-4 py-3 border-b border-alpine-border last:border-0 flex items-start gap-3">
                  <span className="text-[10px] font-mono font-bold text-alpine-violet bg-alpine-violet/10 rounded px-1.5 py-0.5 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-alpine-ink">{q.title}</p>
                    {r.freeText && <p className="text-[11px] text-alpine-slate mt-0.5 truncate">{r.freeText}</p>}
                    {r.uploadedFile && <p className="text-[11px] text-alpine-violet mt-0.5">📎 {r.uploadedFile}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {rl
                      ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: rl.color, background: rl.color + "15" }}>{rl.label}</span>
                      : <span className="text-[10px] text-red-500 font-semibold">Not answered</span>
                    }
                    <button onClick={() => { setActiveQ(q.id); setScreen("questionnaire"); }}
                      className="text-[11px] text-alpine-violet hover:underline font-medium">Edit</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission confirmation */}
          <div className="bg-white border border-alpine-border rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-xs text-alpine-slate leading-relaxed">
                <strong className="text-alpine-ink">Once submitted, this becomes part of the engagement record.</strong>{" "}
                Responses are logged with your email address, IP address, and timestamp, and will be incorporated into Alpine&apos;s ODD report for {ENGAGEMENT.fund}.
              </p>
            </div>
            <button onClick={handleSubmit} disabled={!allAnswered || submitting}
              className="w-full py-3 rounded-lg bg-alpine-violet text-white text-sm font-semibold hover:bg-alpine-violet/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? "Submitting…" : !allAnswered ? `${QUESTIONS.length - answeredCount} question(s) still unanswered` : "Submit Final Response"}
            </button>
          </div>

          <button onClick={() => setScreen("questionnaire")} className="text-sm text-alpine-slate hover:text-alpine-ink transition-colors text-center">
            ← Back to questionnaire
          </button>
        </main>
      </div>
    );
  }

  // ── Screen 5: Confirmation ─────────────────────────────────────────────────

  const contradictions = QUESTIONS.filter(q => responses[q.id].type === "contradict");
  const caveats = QUESTIONS.filter(q => responses[q.id].type === "caveat");
  const confirmed = QUESTIONS.filter(q => responses[q.id].type === "confirm");
  const declined = QUESTIONS.filter(q => responses[q.id].type === "decline");
  const timestamp = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-alpine-snow">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-6">

        {/* Receipt card */}
        <div className="bg-white border border-alpine-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(16,185,129,0.12)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-alpine-ink">Submission received</h1>
              <p className="text-xs text-alpine-slate">Submitted {timestamp} · {ENGAGEMENT.engagement_id}</p>
            </div>
          </div>

          {/* Summary counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Confirmed",    count: confirmed.length,     color: "#10B981", bg: "rgba(16,185,129,0.08)"  },
              { label: "With Caveat",  count: caveats.length,       color: "#F59E0B", bg: "rgba(245,158,11,0.08)"  },
              { label: "Declined",     count: declined.length,      color: "#64748B", bg: "rgba(100,116,139,0.08)" },
              { label: "Contradicted", count: contradictions.length, color: "#EF4444", bg: "rgba(239,68,68,0.08)"  },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: s.bg }}>
                <p className="text-xl font-mono font-bold" style={{ color: s.color }}>{s.count}</p>
                <p className="text-[10px] font-medium text-alpine-slate mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {contradictions.length > 0 && (
            <div className="rounded-lg p-3 mb-4 border" style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-semibold text-red-500 mb-1">Flagged for Alpine review</p>
              {contradictions.map(q => (
                <p key={q.id} className="text-xs text-alpine-ink">• {q.category}: {responses[q.id].freeText}</p>
              ))}
            </div>
          )}

          {caveats.length > 0 && (
            <div className="rounded-lg p-3 mb-4 border" style={{ backgroundColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
              <p className="text-xs font-semibold text-amber-600 mb-1">Caveats — routed to exception register</p>
              {caveats.map(q => (
                <p key={q.id} className="text-xs text-alpine-ink">• {q.category}: {responses[q.id].freeText}</p>
              ))}
            </div>
          )}

          <p className="text-sm text-alpine-slate">
            A signed PDF acknowledgement has been issued to <strong className="text-alpine-ink">{email}</strong>. Alpine will incorporate these responses into the administrator verification section of the ODD report for <strong className="text-alpine-ink">{ENGAGEMENT.fund}</strong>.
          </p>
        </div>

        {/* Download / reference */}
        <div className="bg-white border border-alpine-border rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-alpine-ink">Download acknowledgement</p>
            <p className="text-xs text-alpine-slate mt-0.5">Signed PDF with submission timestamp and reference ID</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-semibold text-alpine-violet border border-alpine-violet/30 px-3 py-2 rounded-lg hover:bg-alpine-violet/5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
        </div>

        <p className="text-center text-[11px] text-alpine-slate">
          Reference ID: <span className="font-mono">{refId}</span>
        </p>

        {/* Print-only receipt ── invisible on screen, shown only when window.print() fires */}
        <style>{`
          @media print {
            body > * { display: none !important; }
            #print-receipt { display: block !important; }
            @page { margin: 2cm; }
          }
        `}</style>
        <div id="print-receipt" style={{ display: "none", fontFamily: "Georgia, serif", color: "#000", fontSize: 12, lineHeight: 1.6 }}>
          <div style={{ borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Alpine ODD — Administrator Verification Receipt</div>
            <div style={{ fontSize: 11, marginTop: 4, color: "#555" }}>This document confirms submission of administrator verification responses.</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 11 }}>
            <tbody>
              {[
                ["Fund", ENGAGEMENT.fund],
                ["Manager", ENGAGEMENT.manager],
                ["Administrator", ENGAGEMENT.administrator],
                ["Responding Contact", `${respondingName}, ${respondingTitle}`],
                ["Email", email],
                ["Engagement ID", ENGAGEMENT.engagement_id],
                ["Reference ID", refId],
                ["Submitted", new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 700, width: "30%", verticalAlign: "top" }}>{label}</td>
                  <td style={{ padding: "6px 8px" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Response Summary</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ccc" }}>#</th>
                <th style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ccc" }}>Category</th>
                <th style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ccc" }}>Response</th>
                <th style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ccc" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {QUESTIONS.map((q, i) => {
                const r = responses[q.id];
                const label = r.type ? { confirm: "Confirmed", caveat: "Confirmed w/ caveat", decline: "Declined", contradict: "Contradicted" }[r.type] : "—";
                return (
                  <tr key={q.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "5px 8px", border: "1px solid #eee" }}>{i + 1}</td>
                    <td style={{ padding: "5px 8px", border: "1px solid #eee" }}>{q.category}</td>
                    <td style={{ padding: "5px 8px", border: "1px solid #eee", fontWeight: 600 }}>{label}</td>
                    <td style={{ padding: "5px 8px", border: "1px solid #eee", color: "#555" }}>{r.freeText || (r.declineReason ? `Reason: ${r.declineReason}` : "")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginTop: 24, fontSize: 10, color: "#888", borderTop: "1px solid #ccc", paddingTop: 8 }}>
            Alpine Due Diligence · alpinedd.com · This document was generated automatically upon submission and constitutes a record of the administrator&apos;s responses for the engagement referenced above.
          </div>
        </div>
      </main>
    </div>
  );
}
