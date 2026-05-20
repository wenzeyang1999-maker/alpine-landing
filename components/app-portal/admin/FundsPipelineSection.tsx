import Link from "next/link";
import { supabase } from "@/lib/app-portal/supabase";
import { VIOLET, GREEN } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtRelative } from "@/components/app-portal/admin/shared";

// Tables that carry per-fund (slug-keyed) review work. Order matters for status heuristic:
// the latest stage of activity wins.
const DRAFT_TABLES = [
  { table: "report_draft_edits",     label: "report",     stage: "Drafting report" },
  { table: "remediation_draft_edits", label: "remediation", stage: "Drafting remediation" },
  { table: "flag_draft_edits",       label: "flags",      stage: "Flagging" },
  { table: "topic_rating_edits",     label: "ratings",    stage: "Rating topics" },
  { table: "risk_observation_edits", label: "risk-obs",   stage: "Logging risks" },
  { table: "assessment_draft_edits", label: "assessment", stage: "Assessing" },
  { table: "overview_draft_edits",   label: "overview",   stage: "Drafting overview" },
  { table: "reference_data_draft",   label: "reference",  stage: "Collecting references" },
  { table: "call_prep_notes",        label: "call-prep",  stage: "Call prep" },
] as const;

interface FundActivity {
  slug: string;
  totalEdits: number;
  tablesTouched: Set<string>;
  lastEdit: string;
  highestStage: string;
}

function pickTimestamp(row: Record<string, unknown>): string | null {
  const candidates = ["updated_at", "edited_at", "modified_at", "created_at", "inserted_at"];
  for (const k of candidates) {
    const v = row[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

export default async function FundsPipelineSection() {
  const results = await Promise.all(
    DRAFT_TABLES.map(async (t) => {
      const { data, error } = await supabase.from(t.table).select("*").limit(2000);
      return { table: t.table, stage: t.stage, data: (data ?? []) as Record<string, unknown>[], error };
    }),
  );

  const tableErrors = results.filter((r) => r.error).map((r) => `${r.table}: ${r.error!.message}`);

  const fundMap = new Map<string, FundActivity>();
  // Track the highest stage encountered per fund (DRAFT_TABLES is ordered most-advanced → least)
  const stageRankByTable = new Map(DRAFT_TABLES.map((t, i) => [t.table, i]));

  for (const r of results) {
    for (const row of r.data) {
      const slug = (row as Record<string, unknown>)["review_slug"] ?? (row as Record<string, unknown>)["slug"];
      if (typeof slug !== "string" || !slug) continue;
      const ts = pickTimestamp(row);
      if (!ts) continue;

      const entry = fundMap.get(slug) ?? {
        slug,
        totalEdits: 0,
        tablesTouched: new Set<string>(),
        lastEdit: ts,
        highestStage: r.stage,
      };
      entry.totalEdits += 1;
      entry.tablesTouched.add(r.table);
      if (new Date(ts) > new Date(entry.lastEdit)) entry.lastEdit = ts;

      // If this row's table is a more-advanced stage than the current highestStage, upgrade.
      const incomingRank = stageRankByTable.get(r.table) ?? 99;
      const currentTable = DRAFT_TABLES.find((t) => t.stage === entry.highestStage)?.table;
      const currentRank = currentTable ? (stageRankByTable.get(currentTable) ?? 99) : 99;
      if (incomingRank < currentRank) entry.highestStage = r.stage;

      fundMap.set(slug, entry);
    }
  }

  const funds = Array.from(fundMap.values()).sort(
    (a, b) => new Date(b.lastEdit).getTime() - new Date(a.lastEdit).getTime(),
  );

  function stageBadge(stage: string) {
    if (stage === "Drafting report" || stage === "Drafting remediation") {
      return <Badge color={GREEN} bg="#ECFDF5">{stage}</Badge>;
    }
    if (stage === "Flagging" || stage === "Rating topics" || stage === "Logging risks") {
      return <Badge color="#B45309" bg="#FEF3C7">{stage}</Badge>;
    }
    return <Badge color={VIOLET} bg="#F5F1FC">{stage}</Badge>;
  }

  return (
    <Section
      id="funds"
      title="Funds Pipeline"
      count={funds.length}
      error={tableErrors.length > 0 ? tableErrors.join(" · ") : null}
      hint="all funds with any review activity"
    >
      {funds.length === 0 ? (
        <Empty>No funds in active review.</Empty>
      ) : (
        <Table
          headers={["Slug", "Stage", "Areas active", "Edits", "Last activity", "Open"]}
          rows={funds.map((f) => [
            <span key="s" className="font-mono text-[13px]">{f.slug}</span>,
            stageBadge(f.highestStage),
            <Muted key="t">{f.tablesTouched.size} / {DRAFT_TABLES.length}</Muted>,
            <Muted key="e">{f.totalEdits}</Muted>,
            <Muted key="d">{fmtRelative(f.lastEdit)}</Muted>,
            <span key="l" className="flex gap-3 font-mono text-[12px]">
              <Link href={`/admin/funds/${encodeURIComponent(f.slug)}`} style={{ color: VIOLET }}>detail →</Link>
              <Link href={`/review2/${encodeURIComponent(f.slug)}`} style={{ color: VIOLET }}>review →</Link>
            </span>,
          ])}
        />
      )}
    </Section>
  );
}
