/**
 * Shared demo file download utility.
 *
 * Maps source/document references to actual PDF files in /public/demo-docs/.
 * Use this consistently across all download points to avoid broken links.
 */

/** Map from reference key → actual filename in /public/demo-docs/ */
export const DEMO_FILES: Record<string, string> = {
  // Full filenames (exact match)
  "ridgeline_ppm.pdf": "ridgeline_ppm.pdf",
  "ridgeline_ddq_2025.pdf": "ridgeline_ddq_2026.pdf", // alias — 2025 maps to 2026 file
  "ridgeline_ddq_2026.pdf": "ridgeline_ddq_2026.pdf",
  "ridgeline_form_adv_excerpt.pdf": "ridgeline_form_adv_2a.pdf",
  "ridgeline_form_adv_2a.pdf": "ridgeline_form_adv_2a.pdf",
  "ridgeline_form_adv_2b.pdf": "ridgeline_form_adv_2b.pdf",
  "ridgeline_lpa.pdf": "ridgeline_lpa.pdf",
  "ridgeline_org_chart.pdf": "ridgeline_org_chart.pdf",
  "ridgeline_compliance_manual.pdf": "ridgeline_compliance_manual.pdf",
  "ridgeline_code_of_ethics.pdf": "ridgeline_code_of_ethics.pdf",
  "ridgeline_financials_fy2024.pdf": "ridgeline_financials_fy2024.pdf",
  "ridgeline_financials_fy2023.pdf": "ridgeline_financials_fy2023.pdf",
  "ridgeline_valuation_policy.pdf": "ridgeline_valuation_policy.pdf",
  "ridgeline_bcp.pdf": "ridgeline_bcp.pdf",
  "ridgeline_bcp_plan.pdf": "ridgeline_bcp.pdf", // alias
  "ridgeline_insurance.pdf": "ridgeline_insurance.pdf",
  "ridgeline_insurance_summary.pdf": "ridgeline_insurance.pdf", // alias
  "ridgeline_trade_allocation.pdf": "ridgeline_trade_allocation.pdf",
  "ridgeline_pb_agreement.pdf": "ridgeline_pb_agreement.pdf",
  "ridgeline_side_letters.pdf": "ridgeline_side_letters.pdf",
  "ridgeline_side_letter_summary.pdf": "ridgeline_side_letters.pdf", // alias
  "ridgeline_admin_engagement.pdf": "ridgeline_admin_engagement.pdf",
  "ridgeline_admin_transparency_2025.pdf": "ridgeline_admin_engagement.pdf", // alias
  "ridgeline_annual_report_2024.pdf": "ridgeline_annual_report_2024.pdf",
  "ridgeline_conflict_policy.pdf": "ridgeline_conflict_policy.pdf",
  "ridgeline_sec_exam_response.pdf": "ridgeline_sec_exam_response.pdf",
  "ridgeline_ic_charter.pdf": "ridgeline_conflict_policy.pdf", // closest proxy
  // Trellis Capital IV
  "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf": "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf",
  "sample_vc_fund_iv_alt.pdf": "sample_vc_fund_iv_alt.pdf",
  "trellis_ddq_2026.pdf": "sample_vc_fund_iv_alt.pdf",
  "trellis_form_adv.pdf": "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",
  "trellis_lpa.pdf": "Trellis-Capital-IV-LPA.pdf",
  "Trellis-Capital-IV-LPA.pdf": "Trellis-Capital-IV-LPA.pdf",
  "trellis_ppm.pdf": "Trellis-Capital-IV-PPM.pdf",
  "trellis_subscription_agreement.pdf": "trellis_subscription_agreement.pdf",
  "trellis_valuation_policy.pdf": "Trellis-Capital-Valuation-Policy.pdf",
  "Trellis-Capital-Valuation-Policy.pdf": "Trellis-Capital-Valuation-Policy.pdf",
  "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf": "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",
  "trellis_form_adv_era.pdf": "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf",
  "Trellis-Capital-IV-PPM.pdf": "Trellis-Capital-IV-PPM.pdf",
  "Trellis-Capital-III-Audited-FS-FY2024.pdf": "Trellis-Capital-III-Audited-FS-FY2024.pdf",
  "Trellis-Capital-III-Audited-FS-FY2023.pdf": "Trellis-Capital-III-Audited-FS-FY2023.pdf",
  "Trellis-Capital-Compliance-Binder-2025.pdf": "Trellis-Capital-Compliance-Binder-2025.pdf",
  "Trellis-Capital-Apex-Service-Description-Fund-III.pdf": "Trellis-Capital-Apex-Service-Description-Fund-III.pdf",
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
