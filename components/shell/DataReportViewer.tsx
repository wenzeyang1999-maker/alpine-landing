"use client";

interface DataPoint {
  label: string;
  value: string;
}

interface SubTopicEvidence {
  sub_topic_id: string;
  name: string;
  rating: string;
  finding: string;
  data_points: DataPoint[];
  remediation: string | null;
}

interface TopicEvidence {
  topic_number: number;
  topic_name: string;
  rating: string;
  coverage_percentage: number;
  sub_topics: SubTopicEvidence[];
}

interface VerificationItem {
  item: string;
  method: string;
  status: string;
  source: string;
  detail: string;
  type: string;
}

interface DocInventoryItem {
  filename: string;
  upload_date: string;
  page_count: number | null;
  file_size: number | null;
}

interface CrossRef {
  document: string;
  topics_referenced: number[];
}

interface Methodology {
  platform: string;
  pipeline: string;
  models: { analysis: string; review: string; revision: string };
  retrieval: string;
  verification_sources: string[];
  data_retention: string;
  framework: string;
  report_date: string;
}

export interface DataReportData {
  fund_name: string;
  manager_name: string;
  overall_rating: string;
  client_name: string;
  report_date: string;
  review_date: string;
  sections: {
    document_inventory: DocInventoryItem[];
    missing_documents: string[];
    verification_registry: VerificationItem[];
    sec_edgar_data: Record<string, unknown>;
    admin_verification: Record<string, unknown>[];
    topic_evidence: TopicEvidence[];
    cross_reference: CrossRef[];
    source_references: unknown[];
    methodology: Methodology;
  };
}

function ratingColor(rating: string): string {
  const r = (rating || "").toUpperCase();
  if (r === "GREEN") return "#10B981";
  if (r === "YELLOW") return "#F59E0B";
  if (r === "RED" || r === "FLAGGED") return "#EF4444";
  if (r === "WATCHLIST") return "#F59E0B";
  return "#64748B";
}

const FILE_DISPLAY_NAMES: Record<string, string> = {
  "ridgeline_lpa_delaware.pdf": "Limited Partnership Agreement (Delaware)",
  "ridgeline_ppm_2025.pdf": "Private Placement Memorandum (2025)",
  "ridgeline_ddq_2025.pdf": "Due Diligence Questionnaire (2025)",
  "ridgeline_ddq_2026.pdf": "Due Diligence Questionnaire (2026)",
  "ridgeline_form_adv_part1.pdf": "Form ADV Part 1A — Annual Filing",
  "ridgeline_form_adv_part2.pdf": "Form ADV Part 2A — Brochure",
  "ridgeline_form_adv_2a.pdf": "Form ADV Part 2A — Brochure",
  "ridgeline_compliance_manual.pdf": "Compliance Manual (Dec 2025)",
  "ridgeline_code_of_ethics.pdf": "Code of Ethics & Personal Trading Policy",
  "ridgeline_valuation_policy.pdf": "Valuation Policy (2026)",
  "ridgeline_bcp_dr_plan.pdf": "Business Continuity / DR Plan",
  "ridgeline_bcp.pdf": "Business Continuity / DR Plan",
  "ridgeline_trade_allocation.pdf": "Trade Allocation Policy",
  "ridgeline_financials_fy2024.pdf": "Audited Financial Statements — FY2024",
  "ridgeline_financials_fy2023.pdf": "Audited Financial Statements — FY2023",
  "ridgeline_insurance_certificates.pdf": "Insurance Certificates (E&O / D&O / Cyber)",
  "ridgeline_side_letters_summary.pdf": "Side Letter Summary (Redacted)",
  "ridgeline_lpa.pdf": "Limited Partnership Agreement",
  "ridgeline_ppm.pdf": "Private Placement Memorandum",
  "ridgeline_org_chart.pdf": "Organization Chart (November 2025)",
  "ridgeline_ic_charter.pdf": "Investment Committee Charter (Jan 2026)",
  "ridgeline_admin_engagement.pdf": "Citco Administrator Transparency Report",
};
function getDisplayName(filename: string): string {
  return FILE_DISPLAY_NAMES[filename] || filename.replace(/ridgeline_/g, "").replace(/_/g, " ").replace(/\.pdf$/i, "").replace(/\b\w/g, c => c.toUpperCase());
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  const color = s === "CONFIRMED" || s === "VERIFIED" || s === "COMPLETE" || s === "RECEIVED"
    ? "#10B981"
    : s === "EXCEPTION" || s === "FLAGGED" || s === "FAILED"
    ? "#EF4444"
    : s === "PENDING" || s === "PARTIAL"
    ? "#F59E0B"
    : "#64748B";

  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
      style={{ color, border: `1px solid ${color}30`, background: `${color}08` }}
    >
      {s || "-"}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 mt-8 first:mt-0">
      <h3 className="text-[15px] font-heading font-bold text-alpine-ink">{children}</h3>
      <div className="flex gap-0.5 mt-1">
        <div className="h-[2px] w-[24px] bg-alpine-green rounded-full" />
        <div className="h-[2px] w-[12px] bg-alpine-amber rounded-full" />
        <div className="h-[2px] w-[12px] bg-alpine-violet rounded-full" />
      </div>
    </div>
  );
}

export const RIDGELINE_DATA_REPORT: DataReportData = {
  fund_name: "Ridgeline Global Opportunities Fund, LP",
  manager_name: "Ridgeline Capital Partners, LLC",
  overall_rating: "WATCHLIST",
  client_name: "Alpine Demo ODD Team",
  report_date: "2026-03-24",
  review_date: "2026-01-20",
  sections: {
    document_inventory: [
      { filename: "ridgeline_lpa_delaware.pdf", upload_date: "2026-01-21", page_count: 92, file_size: 2300000 },
      { filename: "ridgeline_ppm_2025.pdf", upload_date: "2026-01-21", page_count: 68, file_size: 1900000 },
      { filename: "ridgeline_ddq_2025.pdf", upload_date: "2026-01-22", page_count: 42, file_size: 1050000 },
      { filename: "ridgeline_form_adv_part1.pdf", upload_date: "2026-01-22", page_count: 30, file_size: 780000 },
      { filename: "ridgeline_form_adv_part2.pdf", upload_date: "2026-01-22", page_count: 48, file_size: 1200000 },
      { filename: "ridgeline_compliance_manual.pdf", upload_date: "2026-01-23", page_count: 28, file_size: 720000 },
      { filename: "ridgeline_code_of_ethics.pdf", upload_date: "2026-01-23", page_count: 14, file_size: 340000 },
      { filename: "ridgeline_valuation_policy.pdf", upload_date: "2026-01-24", page_count: 20, file_size: 510000 },
      { filename: "ridgeline_bcp_dr_plan.pdf", upload_date: "2026-01-24", page_count: 18, file_size: 440000 },
      { filename: "ridgeline_trade_allocation.pdf", upload_date: "2026-01-25", page_count: 10, file_size: 260000 },
      { filename: "ridgeline_financials_fy2024.pdf", upload_date: "2026-01-25", page_count: 62, file_size: 1500000 },
      { filename: "ridgeline_financials_fy2023.pdf", upload_date: "2026-01-25", page_count: 58, file_size: 1400000 },
      { filename: "ridgeline_insurance_certificates.pdf", upload_date: "2026-01-26", page_count: 8, file_size: 200000 },
      { filename: "ridgeline_side_letters_summary.pdf", upload_date: "2026-01-26", page_count: 16, file_size: 410000 },
    ],
    missing_documents: [
      "Bank signature card - unable to verify authorized wire signatories",
      "Expert network usage policy - no formalized policy per manager confirmation",
      "ISDA/CSA schedule - manager states limited derivatives usage",
      "Updated BCP test results - last test conducted over 24 months ago",
    ],
    verification_registry: [
      { item: "SEC Registration", method: "SEC EDGAR", status: "VERIFIED", source: "IAPD", detail: "CRD #312489 - registered since June 2016", type: "sec_iapd" },
      { item: "Form ADV Filing", method: "SEC EDGAR", status: "VERIFIED", source: "IAPD", detail: "Part 1 & 2 current as of March 2026", type: "sec_iapd" },
      { item: "Regulatory Disclosures", method: "SEC EDGAR", status: "VERIFIED", source: "IAPD", detail: "No disciplinary disclosures - clean record", type: "sec_iapd" },
      { item: "AUM Confirmation", method: "Direct Confirmation", status: "VERIFIED", source: "Citco Fund Services", detail: "$3.2B as of Dec 31, 2025 - within 0.3% of manager-reported", type: "admin" },
      { item: "Audit Confirmation", method: "Document Review", status: "VERIFIED", source: "PricewaterhouseCoopers", detail: "Unqualified opinion - FY2023 and FY2024", type: "document" },
      { item: "CCO Independence", method: "Document Review", status: "FLAGGED", source: "Compliance manual", detail: "No dedicated CCO - COO dual-hatting since inception", type: "document" },
      { item: "Cybersecurity Policy", method: "Document Review", status: "FLAGGED", source: "BCP/DR plan", detail: "Policy dated 2022 - not updated for current threat landscape", type: "document" },
      { item: "Business Continuity", method: "Document Review", status: "FLAGGED", source: "BCP/DR plan", detail: "Plan not tested in 24 months - stale procedures", type: "document" },
      { item: "Valuation Committee", method: "Document Review", status: "FLAGGED", source: "Valuation policy", detail: "Committee includes investment personnel - independence concern", type: "document" },
      { item: "Media Screening", method: "AI-Assisted", status: "VERIFIED", source: "Alpine Analysis", detail: "No adverse media findings in 24-month lookback", type: "media" },
    ],
    sec_edgar_data: {},
    admin_verification: [],
    topic_evidence: [
      {
        topic_number: 1,
        topic_name: "Governance & Oversight",
        rating: "YELLOW",
        coverage_percentage: 52,
        sub_topics: [
          {
            sub_topic_id: "1.1",
            name: "Entity Structure",
            rating: "GREEN",
            finding: "Delaware LP with Cayman feeder",
            data_points: [
              { label: "Entity Type", value: "Delaware LP + Cayman Ltd" },
              { label: "Formation Date", value: "May 2016" },
              { label: "Jurisdiction", value: "Delaware / Cayman Islands" },
            ],
            remediation: null,
          },
          {
            sub_topic_id: "1.2",
            name: "Ownership & Control",
            rating: "YELLOW",
            finding: "CIO David Chen holds 78% ownership",
            data_points: [
              { label: "Majority Owner", value: "David Chen (78%)" },
              { label: "Minority Holders", value: "Sarah Martinez (12%), James Park (10%)" },
            ],
            remediation: "Document succession plan",
          },
        ],
      },
      {
        topic_number: 2,
        topic_name: "Compliance & Regulatory",
        rating: "RED",
        coverage_percentage: 38,
        sub_topics: [
          {
            sub_topic_id: "2.1",
            name: "Registrations",
            rating: "GREEN",
            finding: "SEC registered since 2016, CRD #312489",
            data_points: [
              { label: "SEC Status", value: "Registered - CRD #312489" },
              { label: "CIMA Status", value: "Regulated Mutual Fund" },
            ],
            remediation: null,
          },
          {
            sub_topic_id: "2.2",
            name: "CCO Independence",
            rating: "RED",
            finding: "No dedicated CCO - COO dual-hatting",
            data_points: [
              { label: "CCO", value: "Sarah Martinez (also COO)" },
              { label: "Dedicated", value: "No - dual-hatted since inception" },
              { label: "Compliance Staff", value: "2 junior analysts" },
            ],
            remediation: "Appoint independent CCO within 90 days",
          },
        ],
      },
      {
        topic_number: 5,
        topic_name: "Service Providers",
        rating: "GREEN",
        coverage_percentage: 92,
        sub_topics: [
          {
            sub_topic_id: "5.1",
            name: "Administrator",
            rating: "GREEN",
            finding: "Citco Fund Services - institutional grade",
            data_points: [
              { label: "Admin", value: "Citco Fund Services" },
              { label: "NAV", value: "Independent monthly" },
            ],
            remediation: null,
          },
          {
            sub_topic_id: "5.2",
            name: "Auditor",
            rating: "GREEN",
            finding: "PricewaterhouseCoopers - Big 4",
            data_points: [
              { label: "Auditor", value: "PricewaterhouseCoopers" },
              { label: "Opinion", value: "Unqualified (FY2023, FY2024)" },
            ],
            remediation: null,
          },
        ],
      },
    ],
    cross_reference: [
      { document: "ridgeline_lpa_delaware.pdf", topics_referenced: [1, 6, 10] },
      { document: "ridgeline_ppm_2025.pdf", topics_referenced: [1, 5, 6, 11] },
      { document: "ridgeline_ddq_2025.pdf", topics_referenced: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      { document: "ridgeline_form_adv_part1.pdf", topics_referenced: [1, 2, 5, 10] },
      { document: "ridgeline_compliance_manual.pdf", topics_referenced: [2, 7, 10] },
      { document: "ridgeline_valuation_policy.pdf", topics_referenced: [3, 8] },
      { document: "ridgeline_bcp_dr_plan.pdf", topics_referenced: [7, 9] },
      { document: "ridgeline_financials_fy2024.pdf", topics_referenced: [8, 12] },
    ],
    source_references: [],
    methodology: {
      platform: "Alpine Due Diligence Inc.",
      pipeline: "Document Analysis + Gap Assessment + Independent Verification + Report Generation",
      models: { analysis: "claude-sonnet-4-6", review: "claude-opus-4-6", revision: "claude-sonnet-4-6" },
      retrieval: "TF-IDF semantic retrieval (800-char chunks, top-3 per topic)",
      verification_sources: [
        "SEC EDGAR / IAPD",
        "Form ADV Historical Comparison",
        "Fund Administrator Direct Confirmation (Citco)",
        "NFA BASIC",
        "CIMA (Cayman Islands Monetary Authority)",
        "Delaware Division of Corporations",
        "Alpine Media Screen (24-month lookback)",
      ],
      data_retention: "Zero Data Retention (ZDR) - Anthropic Commercial API under DPA",
      framework: "12-topic, 54 sub-topic ODD framework across 3 assessment Acts",
      report_date: "2026-03-24",
    },
  },
};

export default function DataReportViewer({ data }: { data: DataReportData }) {
  const s = data.sections;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 w-full space-y-6 text-[13px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ODD DATA & VERIFICATION REPORT</p>
          <p className="text-[16px] font-heading font-bold text-alpine-ink mt-1">{data.fund_name}</p>
          <p className="text-[11px] text-slate-500">{data.manager_name} - {data.report_date}</p>
        </div>
        <div
          className="px-3 py-1 rounded-md text-[11px] font-mono font-bold"
          style={{ color: ratingColor(data.overall_rating), border: `1px solid ${ratingColor(data.overall_rating)}40` }}
        >
          {data.overall_rating}
        </div>
      </div>

      <SectionTitle>1. Document Inventory</SectionTitle>
      <p className="text-[11px] text-slate-500 mb-2">{s.document_inventory.length} documents received</p>
      <div className="rounded-lg overflow-hidden overflow-x-auto border border-slate-200">
        <table className="w-full text-[11px] min-w-[500px]">
          <thead>
            <tr className="bg-[#1E2A3A] text-[#F5F0E8]">
              <th className="text-left px-3 py-2 font-mono text-[10px]">DOCUMENT</th>
              <th className="text-left px-3 py-2 font-mono text-[10px]">UPLOAD DATE</th>
              <th className="text-left px-3 py-2 font-mono text-[10px]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {s.document_inventory.map((doc, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50" : ""}>
                <td className="px-3 py-1.5 text-alpine-ink">{getDisplayName(doc.filename)}</td>
                <td className="px-3 py-1.5 text-slate-500">{doc.upload_date}</td>
                <td className="px-3 py-1.5"><StatusBadge status="Received" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {s.missing_documents.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold text-alpine-ink mb-1">Documents Requested but Not Provided</p>
          {s.missing_documents.map((m, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-alpine-amber" />
              <span className="text-[11px] text-slate-500">{m}</span>
            </div>
          ))}
        </div>
      )}

      <SectionTitle>2. Verification Registry</SectionTitle>
      <div className="rounded-lg overflow-hidden overflow-x-auto border border-slate-200">
        <table className="w-full text-[11px] min-w-[500px]">
          <thead>
            <tr className="bg-[#1E2A3A] text-[#F5F0E8]">
              <th className="text-left px-3 py-2 font-mono text-[10px]">ITEM</th>
              <th className="text-left px-3 py-2 font-mono text-[10px]">METHOD</th>
              <th className="text-left px-3 py-2 font-mono text-[10px]">STATUS</th>
              <th className="text-left px-3 py-2 font-mono text-[10px]">DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {s.verification_registry.map((v, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50" : ""}>
                <td className="px-3 py-1.5 text-alpine-ink font-medium">{v.item}</td>
                <td className="px-3 py-1.5 text-slate-500">{v.method}</td>
                <td className="px-3 py-1.5"><StatusBadge status={v.status} /></td>
                <td className="px-3 py-1.5 text-slate-500 text-[10px] max-w-[260px] truncate">{v.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {s.topic_evidence.length > 0 && (
        <>
          <SectionTitle>3. Sub-Topic Evidence</SectionTitle>
          <div className="space-y-4">
            {s.topic_evidence.map((topic) => (
              <div key={topic.topic_number} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-heading font-bold text-alpine-ink">
                    Topic {topic.topic_number}: {topic.topic_name}
                  </span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: ratingColor(topic.rating) }}>
                    {(topic.rating || "").toUpperCase()}
                  </span>
                </div>
                {topic.sub_topics.map((st) => (
                  <div key={st.sub_topic_id} className="ml-2 mb-2 pl-2 border-l-2" style={{ borderColor: `${ratingColor(st.rating)}40` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-alpine-ink">[{st.sub_topic_id}] {st.name}</span>
                      <span className="text-[9px] font-mono" style={{ color: ratingColor(st.rating) }}>
                        {(st.rating || "").toUpperCase()}
                      </span>
                    </div>
                    {st.data_points.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {st.data_points.slice(0, 5).map((dp, j) => (
                          <div key={j} className="flex gap-2 text-[10px]">
                            <span className="font-mono text-alpine-violet min-w-[120px]">{dp.label}</span>
                            <span className="text-slate-500">{dp.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {s.cross_reference.length > 0 && (
        <>
          <SectionTitle>4. Document Cross-Reference</SectionTitle>
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#1E2A3A] text-[#F5F0E8]">
                  <th className="text-left px-3 py-2 font-mono text-[10px]">DOCUMENT</th>
                  <th className="text-left px-3 py-2 font-mono text-[10px]">TOPICS REFERENCED</th>
                </tr>
              </thead>
              <tbody>
                {s.cross_reference.map((ref, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50" : ""}>
                    <td className="px-3 py-1.5 text-alpine-ink">{getDisplayName(ref.document)}</td>
                    <td className="px-3 py-1.5 text-slate-500">{ref.topics_referenced.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <SectionTitle>5. Methodology</SectionTitle>
      <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/40 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div>
            <span className="font-mono text-slate-500">Pipeline</span>
            <p className="text-alpine-ink mt-0.5">{s.methodology.pipeline}</p>
          </div>
          <div>
            <span className="font-mono text-slate-500">Framework</span>
            <p className="text-alpine-ink mt-0.5">{s.methodology.framework}</p>
          </div>
          <div>
            <span className="font-mono text-slate-500">Models</span>
            <p className="text-alpine-ink mt-0.5">
              {s.methodology.models.analysis} / {s.methodology.models.review}
            </p>
          </div>
          <div>
            <span className="font-mono text-slate-500">Data Retention</span>
            <p className="text-alpine-ink mt-0.5">{s.methodology.data_retention}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
