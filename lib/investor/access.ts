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
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { investors, investorReports, reportPublications } from "@/lib/db/schema";
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

  const [row] = await db
    .select({
      id: investors.id,
      email: investors.email,
      fullName: investors.fullName,
      organization: investors.organization,
      isActive: investors.isActive,
    })
    .from(investors)
    .where(eq(investors.email, email.trim().toLowerCase()))
    .limit(1);

  if (!row || !row.isActive) return null;
  return {
    id: row.id,
    email: row.email,
    full_name: row.fullName ?? null,
    organization: row.organization ?? null,
  };
}

/**
 * Reports an investor may see: published ∩ assigned ∩ valid registry slug.
 * Returns registry entries (report metadata) ready for the home page cards.
 */
export async function getVisibleReports(investorId: string): Promise<ReportRegistryEntry[]> {
  const [assigned, published] = await Promise.all([
    db.select({ reportSlug: investorReports.reportSlug }).from(investorReports).where(eq(investorReports.investorId, investorId)),
    db.select({ reportSlug: reportPublications.reportSlug }).from(reportPublications),
  ]);

  if (!assigned || assigned.length === 0) return [];
  const publishedSlugs = new Set(published.map((r) => r.reportSlug));

  const seen = new Set<string>();
  const out: ReportRegistryEntry[] = [];
  for (const row of assigned) {
    const slug = row.reportSlug;
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

  const [investorRows, pubRows, assignmentRows] = await Promise.all([
    db.select({ isActive: investors.isActive }).from(investors).where(eq(investors.id, investorId)).limit(1),
    db.select({ reportSlug: reportPublications.reportSlug }).from(reportPublications).where(eq(reportPublications.reportSlug, slug)).limit(1),
    db
      .select({ reportSlug: investorReports.reportSlug })
      .from(investorReports)
      .where(and(eq(investorReports.investorId, investorId), eq(investorReports.reportSlug, slug)))
      .limit(1),
  ]);

  const investor = investorRows[0];
  if (!investor || !investor.isActive) return false;
  if (!pubRows[0]) return false;
  if (!assignmentRows[0]) return false;
  return true;
}
