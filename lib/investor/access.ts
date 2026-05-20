/**
 * Investor access control — the SINGLE SOURCE of the IDOR check.
 *
 * An investor sees report X  ⟺  X is published  AND  X is assigned to them
 * AND the investor is active.
 *
 * Every report page load and every document API call routes through this
 * module. The middleware cookie check is NOT authorization — a deactivated or
 * unassigned investor still holds a structurally valid cookie that passes
 * middleware. Authorization happens here.
 *
 * Node runtime (Supabase + next/headers). Never imported by middleware.
 */

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { verifySession, INVESTOR_SESSION } from "@/lib/investor/auth-session";
import {
  isValidReportSlug,
  getReportEntry,
  type ReportRegistryEntry,
} from "@/lib/investor/report-registry";

export interface InvestorUser {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
}

/**
 * Resolve the current investor from the `investor_session` cookie.
 * Returns null if there is no valid session, the investor row is missing,
 * or the investor has been deactivated.
 */
export async function getCurrentInvestor(): Promise<InvestorUser | null> {
  const token = cookies().get(INVESTOR_SESSION.COOKIE_NAME)?.value ?? null;
  const email = await verifySession(token);
  if (!email) return null;

  const { data, error } = await supabase
    .from("investors")
    .select("id, email, full_name, organization, is_active")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data || !data.is_active) return null;
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name ?? null,
    organization: data.organization ?? null,
  };
}

/**
 * Reports an investor may see: published ∩ assigned ∩ valid registry slug.
 * Returns registry entries (report metadata) ready for the home page cards.
 */
export async function getVisibleReports(investorId: string): Promise<ReportRegistryEntry[]> {
  const [{ data: assigned }, { data: published }] = await Promise.all([
    supabase.from("investor_reports").select("report_slug").eq("investor_id", investorId),
    supabase.from("report_publications").select("report_slug"),
  ]);

  if (!assigned || assigned.length === 0) return [];
  const publishedSlugs = new Set((published ?? []).map((r) => r.report_slug as string));

  const seen = new Set<string>();
  const out: ReportRegistryEntry[] = [];
  for (const row of assigned) {
    const slug = row.report_slug as string;
    if (seen.has(slug)) continue;
    seen.add(slug);
    if (!publishedSlugs.has(slug)) continue;
    const entry = getReportEntry(slug);
    if (entry) out.push(entry);
  }
  return out;
}

/**
 * IDOR guard. True only if the report is a valid registry slug, is published,
 * is assigned to this investor, and the investor is active.
 */
export async function canAccessReport(investorId: string, slug: string): Promise<boolean> {
  if (!investorId || !isValidReportSlug(slug)) return false;

  const [{ data: investor }, { data: pub }, { data: assignment }] = await Promise.all([
    supabase.from("investors").select("is_active").eq("id", investorId).maybeSingle(),
    supabase.from("report_publications").select("report_slug").eq("report_slug", slug).maybeSingle(),
    supabase
      .from("investor_reports")
      .select("report_slug")
      .eq("investor_id", investorId)
      .eq("report_slug", slug)
      .maybeSingle(),
  ]);

  if (!investor || !investor.is_active) return false;
  if (!pub) return false;
  if (!assignment) return false;
  return true;
}
