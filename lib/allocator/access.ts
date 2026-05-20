/**
 * Allocator access control — the SINGLE SOURCE of the IDOR check.
 *
 * An allocator sees report X  ⟺  X is published  AND  X is assigned to them
 * AND the allocator is active.
 *
 * Every report page load and every document API call routes through this
 * module. The middleware cookie check is NOT authorization — a deactivated or
 * unassigned allocator still holds a structurally valid cookie that passes
 * middleware. Authorization happens here.
 *
 * Node runtime (Supabase + next/headers). Never imported by middleware.
 */

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { verifySession, ALLOCATOR_SESSION } from "@/lib/allocator/auth-session";
import {
  isValidReportSlug,
  getReportEntry,
  type ReportRegistryEntry,
} from "@/lib/allocator/report-registry";

export interface AllocatorUser {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
}

/**
 * Resolve the current allocator from the `allocator_session` cookie.
 * Returns null if there is no valid session, the allocator row is missing,
 * or the allocator has been deactivated.
 */
export async function getCurrentAllocator(): Promise<AllocatorUser | null> {
  const token = cookies().get(ALLOCATOR_SESSION.COOKIE_NAME)?.value ?? null;
  const email = await verifySession(token);
  if (!email) return null;

  const { data, error } = await supabase
    .from("allocators")
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
 * Reports an allocator may see: published ∩ assigned ∩ valid registry slug.
 * Returns registry entries (report metadata) ready for the home page cards.
 */
export async function getVisibleReports(allocatorId: string): Promise<ReportRegistryEntry[]> {
  const [{ data: assigned }, { data: published }] = await Promise.all([
    supabase.from("allocator_reports").select("report_slug").eq("allocator_id", allocatorId),
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
 * is assigned to this allocator, and the allocator is active.
 */
export async function canAccessReport(allocatorId: string, slug: string): Promise<boolean> {
  if (!allocatorId || !isValidReportSlug(slug)) return false;

  const [{ data: allocator }, { data: pub }, { data: assignment }] = await Promise.all([
    supabase.from("allocators").select("is_active").eq("id", allocatorId).maybeSingle(),
    supabase.from("report_publications").select("report_slug").eq("report_slug", slug).maybeSingle(),
    supabase
      .from("allocator_reports")
      .select("report_slug")
      .eq("allocator_id", allocatorId)
      .eq("report_slug", slug)
      .maybeSingle(),
  ]);

  if (!allocator || !allocator.is_active) return false;
  if (!pub) return false;
  if (!assignment) return false;
  return true;
}
