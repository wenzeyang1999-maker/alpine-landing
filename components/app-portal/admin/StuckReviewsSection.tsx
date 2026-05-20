import Link from "next/link";
import { supabase } from "@/lib/app-portal/supabase";
import { VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtRelative } from "@/components/app-portal/admin/shared";

// Same set of draft tables as the pipeline.
const DRAFT_TABLES = [
  "report_draft_edits",
  "remediation_draft_edits",
  "flag_draft_edits",
  "topic_rating_edits",
  "risk_observation_edits",
  "assessment_draft_edits",
  "overview_draft_edits",
  "reference_data_draft",
  "call_prep_notes",
] as const;

const STALE_THRESHOLD_DAYS = 7;

function pickTimestamp(row: Record<string, unknown>): string | null {
  const candidates = ["updated_at", "edited_at", "modified_at", "created_at", "inserted_at"];
  for (const k of candidates) {
    const v = row[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

function ageBadge(days: number) {
  if (days >= 30) return <Badge color="#B91C1C" bg="#FEF2F2">{days}d stale</Badge>;
  if (days >= 14) return <Badge color="#B45309" bg="#FEF3C7">{days}d stale</Badge>;
  return <Badge color="#5B6470" bg="#F1F5F9">{days}d stale</Badge>;
}

export default async function StuckReviewsSection() {
  const results = await Promise.all(
    DRAFT_TABLES.map(async (t) => {
      const { data } = await supabase.from(t).select("*").limit(2000);
      return { table: t, data: (data ?? []) as Record<string, unknown>[] };
    }),
  );

  type Entry = { slug: string; lastEdit: string };
  const byFund = new Map<string, Entry>();
  for (const r of results) {
    for (const row of r.data) {
      const slug = (row as Record<string, unknown>)["review_slug"] ?? (row as Record<string, unknown>)["slug"];
      if (typeof slug !== "string" || !slug) continue;
      const ts = pickTimestamp(row);
      if (!ts) continue;
      const e = byFund.get(slug) ?? { slug, lastEdit: ts };
      if (new Date(ts) > new Date(e.lastEdit)) e.lastEdit = ts;
      byFund.set(slug, e);
    }
  }

  const now = Date.now();
  const stuck = Array.from(byFund.values())
    .map((e) => ({
      ...e,
      ageDays: Math.floor((now - new Date(e.lastEdit).getTime()) / (24 * 60 * 60 * 1000)),
    }))
    .filter((e) => e.ageDays >= STALE_THRESHOLD_DAYS)
    .sort((a, b) => b.ageDays - a.ageDays);

  return (
    <Section
      id="stuck-reviews"
      title="Stuck Reviews"
      count={stuck.length}
      hint={`no activity for ≥ ${STALE_THRESHOLD_DAYS} days`}
    >
      {stuck.length === 0 ? (
        <Empty>No stuck reviews — every fund has had activity within {STALE_THRESHOLD_DAYS} days.</Empty>
      ) : (
        <Table
          headers={["Slug", "Age", "Last activity", "Open"]}
          rows={stuck.map((e) => [
            <span key="s" className="font-mono text-[13px]">{e.slug}</span>,
            ageBadge(e.ageDays),
            <Muted key="d">{fmtRelative(e.lastEdit)}</Muted>,
            <span key="l" className="flex gap-3 font-mono text-[12px]">
              <Link href={`/admin/funds/${encodeURIComponent(e.slug)}`} style={{ color: VIOLET }}>detail →</Link>
              <Link href={`/review2/${encodeURIComponent(e.slug)}`} style={{ color: VIOLET }}>review →</Link>
            </span>,
          ])}
        />
      )}
    </Section>
  );
}
