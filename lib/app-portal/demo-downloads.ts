/**
 * Shared demo file download utility.
 *
 * Maps source/document references to actual PDF files in /public/demo-docs/.
 * Use this consistently across all download points to avoid broken links.
 */

/** Map from reference key → actual path under /public/demo-docs/ */
export const DEMO_FILES: Record<string, string> = {
  // ── Ridgeline ─────────────────────────────────────────────────────────────
  "ridgeline_ppm.pdf":                    "ridgeline/ridgeline_ppm.pdf",
  "ridgeline_ddq_2025.pdf":               "ridgeline/ridgeline_ddq_2026.pdf",
  "ridgeline_ddq_2026.pdf":               "ridgeline/ridgeline_ddq_2026.pdf",
  "ridgeline_form_adv_excerpt.pdf":       "ridgeline/ridgeline_form_adv_2a.pdf",
  "ridgeline_form_adv_2a.pdf":            "ridgeline/ridgeline_form_adv_2a.pdf",
  "ridgeline_form_adv_2b.pdf":            "ridgeline/ridgeline_form_adv_2b.pdf",
  "ridgeline_lpa.pdf":                    "ridgeline/ridgeline_lpa.pdf",
  "ridgeline_org_chart.pdf":              "ridgeline/ridgeline_org_chart.pdf",
  "ridgeline_compliance_manual.pdf":      "ridgeline/ridgeline_compliance_manual.pdf",
  "ridgeline_code_of_ethics.pdf":         "ridgeline/ridgeline_code_of_ethics.pdf",
  "ridgeline_financials_fy2024.pdf":      "ridgeline/ridgeline_financials_fy2024.pdf",
  "ridgeline_financials_fy2023.pdf":      "ridgeline/ridgeline_financials_fy2023.pdf",
  "ridgeline_valuation_policy.pdf":       "ridgeline/ridgeline_valuation_policy.pdf",
  "ridgeline_bcp.pdf":                    "ridgeline/ridgeline_bcp.pdf",
  "ridgeline_bcp_plan.pdf":               "ridgeline/ridgeline_bcp.pdf",
  "ridgeline_insurance.pdf":              "ridgeline/ridgeline_insurance.pdf",
  "ridgeline_insurance_summary.pdf":      "ridgeline/ridgeline_insurance.pdf",
  "ridgeline_trade_allocation.pdf":       "ridgeline/ridgeline_trade_allocation.pdf",
  "ridgeline_pb_agreement.pdf":           "ridgeline/ridgeline_pb_agreement.pdf",
  "ridgeline_side_letters.pdf":           "ridgeline/ridgeline_side_letters.pdf",
  "ridgeline_side_letter_summary.pdf":    "ridgeline/ridgeline_side_letters.pdf",
  "ridgeline_admin_engagement.pdf":       "ridgeline/ridgeline_admin_engagement.pdf",
  "ridgeline_admin_transparency_2025.pdf":"ridgeline/ridgeline_admin_engagement.pdf",
  "ridgeline_annual_report_2024.pdf":     "ridgeline/ridgeline_annual_report_2024.pdf",
  "ridgeline_conflict_policy.pdf":        "ridgeline/ridgeline_conflict_policy.pdf",
  "ridgeline_sec_exam_response.pdf":      "ridgeline/ridgeline_sec_exam_response.pdf",
  "ridgeline_ic_charter.pdf":             "ridgeline/ridgeline_conflict_policy.pdf",

  // ── Trellis Capital IV ────────────────────────────────────────────────────
  "sample_vc_fund_iv_alt.pdf":                          "trellis/sample_vc_fund_iv_alt.pdf",
  "trellis_ddq_2026.pdf":                               "trellis/sample_vc_fund_iv_alt.pdf",
  "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf":                "trellis/Trellis-Capital-IV-ILPA-DDQ-2.0.pdf",
  "trellis_form_adv.pdf":                               "trellis/Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",
  "trellis_form_adv_era.pdf":                           "trellis/Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",
  "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf":   "trellis/Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",
  "trellis_lpa.pdf":                                    "trellis/Trellis-Capital-IV-LPA.pdf",
  "Trellis-Capital-IV-LPA.pdf":                         "trellis/Trellis-Capital-IV-LPA.pdf",
  "trellis_ppm.pdf":                                    "trellis/Trellis-Capital-IV-PPM.pdf",
  "Trellis-Capital-IV-PPM.pdf":                         "trellis/Trellis-Capital-IV-PPM.pdf",
  "trellis_subscription_agreement.pdf":                 "trellis/trellis_subscription_agreement.pdf",
  "trellis_valuation_policy.pdf":                       "trellis/Trellis-Capital-Valuation-Policy.pdf",
  "Trellis-Capital-Valuation-Policy.pdf":               "trellis/Trellis-Capital-Valuation-Policy.pdf",
  "Trellis-Capital-III-Audited-FS-FY2024.pdf":          "trellis/Trellis-Capital-III-Audited-FS-FY2024.pdf",
  "Trellis-Capital-III-Audited-FS-FY2023.pdf":          "trellis/Trellis-Capital-III-Audited-FS-FY2023.pdf",
  "Trellis-Capital-Compliance-Binder-2025.pdf":         "trellis/Trellis-Capital-Compliance-Binder-2025.pdf",
  "Trellis-Capital-Apex-Service-Description-Fund-III.pdf": "trellis/Trellis-Capital-Apex-Service-Description-Fund-III.pdf",

  // ── Aurora Capital IV ─────────────────────────────────────────────────────
  "sample_vc_aurora_iv.pdf":                  "aurora/sample_vc_aurora_iv.pdf",
  // Collection docs — Aurora-branded PDFs generated for this demo
  "aurora-ilpa-ddq-2026.pdf":                 "aurora/aurora-ilpa-ddq-2026.pdf",
  "aurora-form-adv-era-2026.pdf":             "aurora/aurora-form-adv-era-2026.pdf",
  "aurora-lpa-fund-iv.pdf":                   "aurora/aurora-lpa-fund-iv.pdf",
  "aurora-ppm-fund-iv.pdf":                   "aurora/aurora-ppm-fund-iv.pdf",
  "aurora-compliance-manual-2026.pdf":        "aurora/aurora-compliance-manual-2026.pdf",
  "aurora-valuation-policy.pdf":              "aurora/aurora-valuation-policy.pdf",
  "aurora-financials-fy2025.pdf":             "aurora/aurora-financials-fy2025.pdf",
  "aurora-firm-overview.pdf":                 "aurora/aurora-firm-overview.pdf",
  "aurora-wisp-2025.pdf":                     "aurora/aurora-wisp-2025.pdf",
  "aurora-incident-response-plan.pdf":        "aurora/aurora-incident-response-plan.pdf",
  "aurora-bcp-2025.pdf":                      "aurora/aurora-bcp-2025.pdf",
  "aurora-admin-agreement-meridian.pdf":      "aurora/aurora-admin-agreement-meridian.pdf",
  "aurora-insightsphere-agreement.pdf":       "aurora/aurora-insightsphere-agreement.pdf",
  "aurora-vantage-tech-engagement.pdf":       "aurora/aurora-vantage-tech-engagement.pdf",
};

/** Sources that are NOT downloadable files (show info text instead) */
export const NON_FILE_SOURCES = new Set([
  "SEC_EDGAR",
  "ALPINE_ANALYSIS",
  "MANAGER_CALL",
  "ADMIN_VERIFICATION",
]);

/**
 * Download a demo file from /demo-docs/.
 * Returns false if the file doesn't exist in the map.
 */
export function downloadDemoFile(filename: string, saveAs?: string): boolean {
  const realFile = DEMO_FILES[filename];
  if (!realFile) return false;

  const link = document.createElement("a");
  link.href = `/demo-docs/${realFile}`;
  link.download = saveAs || realFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

/**
 * Check if a source key maps to a downloadable file.
 */
export function hasDownloadableFile(source: string): boolean {
  if (NON_FILE_SOURCES.has(source)) return false;
  return source in DEMO_FILES;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Return the public URL for a demo file, or null if not found.
 * Uses Supabase Storage when NEXT_PUBLIC_SUPABASE_URL is set, else local /demo-docs/.
 */
export function getDemoFileUrl(filename: string): string | null {
  // Pass through direct API or absolute URLs (e.g. portal uploads)
  if (filename.startsWith("/api/") || filename.startsWith("http")) return filename;
  const realFile = DEMO_FILES[filename];
  if (!realFile) return null;
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/demo-docs/${realFile}`;
  }
  return `/demo-docs/${realFile}`;
}
