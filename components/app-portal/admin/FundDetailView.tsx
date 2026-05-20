import Link from "next/link";
import { supabase } from "@/lib/app-portal/supabase";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET, GREEN } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtRelative, fmtDateTime } from "@/components/app-portal/admin/shared";

// Same set of draft tables as the pipeline, plus a human label.
const FUND_TABLES = [
  { table: "overview_draft_edits",   label: "Overview" },
  { table: "assessment_draft_edits", label: "Assessment" },
  { table: "topic_rating_edits",     label: "Topic ratings" },
  { table: "flag_draft_edits",       label: "Flags" },
  { table: "risk_observation_edits", label: "Risk observations" },
  { table: "remediation_draft_edits", label: "Remediation" },
  { table: "reference_data_draft",   label: "Reference data" },
  { table: "report_draft_edits",     label: "Final report" },
  { table: "call_prep_notes",        label: "Call prep notes" },
] as const;

interface ActivityRow {
  table: string;
  label: string;
  count: number;
  lastEdit: string | null;
}

function pickTimestamp(row: Record<string, unknown>): string | null {
  const candidates = ["updated_at", "edited_at", "modified_at", "created_at", "inserted_at"];
  for (const k of candidates) {
    const v = row[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

export default async function FundDetailView({ slug }: { slug: string }) {
  const [tableResults, portalDocsRes] = await Promise.all([
    Promise.all(
      FUND_TABLES.map(async (t) => {
        // Most draft tables key on review_slug; call_prep_notes happens to use the same.
        const { data, error } = await supabase.from(t.table).select("*").eq("review_slug", slug).limit(1000);
        return { table: t.table, label: t.label, data: (data ?? []) as Record<string, unknown>[], error };
      }),
    ),
    supabase.from("portal_documents").select("filename, file_size, uploaded_at, token").eq("token", slug),
  ]);

  const activity: ActivityRow[] = tableResults.map((r) => {
    const count = r.data.length;
    let lastEdit: string | null = null;
    for (const row of r.data) {
      const ts = pickTimestamp(row);
      if (ts && (!lastEdit || new Date(ts) > new Date(lastEdit))) lastEdit = ts;
    }
    return { table: r.table, label: r.label, count, lastEdit };
  });

  const totalEdits = activity.reduce((sum, a) => sum + a.count, 0);
  const tablesTouched = activity.filter((a) => a.count > 0).length;
  const latestEdit = activity.reduce<string | null>((acc, a) => {
    if (!a.lastEdit) return acc;
    if (!acc) return a.lastEdit;
    return new Date(a.lastEdit) > new Date(acc) ? a.lastEdit : acc;
  }, null);

  const tableErrors = tableResults.filter((r) => r.error).map((r) => `${r.table}: ${r.error!.message}`);

  // Build recent activity (latest 10 edits across all tables)
  const recent: Array<{ table: string; label: string; ts: string; preview: string }> = [];
  for (const r of tableResults) {
    for (const row of r.data) {
      const ts = pickTimestamp(row);
      if (!ts) continue;
      // Best-effort preview: pick a meaningful string field
      const previewField =
        (row["chapter_id"] as string) ||
        (row["topic_id"] as string) ||
        (row["title"] as string) ||
        (row["author"] as string) ||
        "—";
      recent.push({ table: r.table, label: r.label, ts, preview: previewField });
    }
  }
  recent.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  const recentTop = recent.slice(0, 10);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <Stat label="Total edits" value={totalEdits} hint={`${tablesTouched} of ${FUND_TABLES.length} areas touched`} />
        <Stat label="Last activity" value={latestEdit ? fmtRelative(latestEdit) : "—"} hint={latestEdit ? fmtDateTime(latestEdit) : "no edits yet"} />
        <Stat label="Documents" value={(portalDocsRes.data ?? []).length} hint="files in matching portal token" />
      </div>

      <Section
        id="areas"
        title="Review areas"
        count={`${tablesTouched} active`}
        error={tableErrors.length > 0 ? tableErrors.join(" · ") : null}
        hint="status per workflow stage"
      >
        <Table
          headers={["Area", "Edits", "Last edit", "Status"]}
          rows={activity.map((a) => [
            a.label,
            <Muted key="c">{a.count}</Muted>,
            <Muted key="d">{a.lastEdit ? fmtRelative(a.lastEdit) : "—"}</Muted>,
            a.count === 0 ? (
              <Badge color="#94a3b8" bg="#F1F5F9">Not started</Badge>
            ) : (
              <Badge color={GREEN} bg="#ECFDF5">Active</Badge>
            ),
          ])}
        />
      </Section>

      <Section id="recent" title="Recent edits" count={recentTop.length} hint="latest 10 across all areas">
        {recentTop.length === 0 ? (
          <Empty>No edits yet for this fund.</Empty>
        ) : (
          <Table
            headers={["Area", "Preview", "When"]}
            rows={recentTop.map((r) => [
              <span key="l" className="font-body text-[13px]">{r.label}</span>,
              <span key="p" className="font-mono text-[12px]" style={{ color: SUBTLE }}>{r.preview}</span>,
              <Muted key="d">{fmtDateTime(r.ts)}</Muted>,
            ])}
          />
        )}
      </Section>

      <Section id="continue" title="Continue work">
        <div className="rounded-lg p-5 flex flex-wrap gap-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <Link
            href={`/review2/${encodeURIComponent(slug)}`}
            className="font-body text-sm px-4 py-2 rounded-md"
            style={{ background: INK, color: "#fff" }}
          >
            Open review workspace →
          </Link>
          <Link
            href={`/portal/${encodeURIComponent(slug)}`}
            className="font-body text-sm px-4 py-2 rounded-md"
            style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
          >
            View portal as customer →
          </Link>
        </div>
        <p className="mt-2 text-[12px] font-body" style={{ color: MUTED }}>
          The links above use the fund slug as the portal token. If your portal token differs, navigate via the Portals section on the main dashboard instead.
        </p>
      </Section>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return (
    <div className="rounded-lg p-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
        {label}
      </div>
      <div className="font-heading font-bold mt-1" style={{ fontSize: 22, color: INK }}>
        {value}
      </div>
      <div className="font-body text-[12px] mt-1" style={{ color: MUTED }}>
        {hint}
      </div>
    </div>
  );
}
