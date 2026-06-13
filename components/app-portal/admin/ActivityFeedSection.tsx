import Link from "next/link";
import { sql, gte, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { portalDocuments, watermarkDistributions, customers as customersTable } from "@/lib/db/schema";
import { VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtDateTime } from "@/components/app-portal/admin/shared";

const FEED_HOURS = 24;
const FEED_LIMIT = 50;

function pickTimestamp(row: Record<string, unknown>): string | null {
  const candidates = ["updated_at", "edited_at", "modified_at", "created_at", "inserted_at", "uploaded_at", "watermarked_at"];
  for (const k of candidates) {
    const v = row[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

function pickString(row: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

interface FeedEvent {
  kind: string;
  ts: string;
  primary: string;
  secondary: string;
  href?: string;
}

const DRAFT_TABLES = [
  ["report_draft_edits", "Report draft"],
  ["remediation_draft_edits", "Remediation"],
  ["flag_draft_edits", "Flag"],
  ["topic_rating_edits", "Topic rating"],
  ["risk_observation_edits", "Risk obs"],
  ["assessment_draft_edits", "Assessment"],
  ["overview_draft_edits", "Overview"],
  ["reference_data_draft", "Reference data"],
  ["call_prep_notes", "Call prep"],
] as const;

export default async function ActivityFeedSection() {
  const since = new Date(Date.now() - FEED_HOURS * 60 * 60 * 1000).toISOString();

  const safe = async <T,>(p: Promise<T>, fallback: T): Promise<T> => {
    try { return await p; } catch { return fallback; }
  };

  const [draftResults, docsData, watermarksData, customersData] = await Promise.all([
    Promise.all(
      DRAFT_TABLES.map(async ([table, label]) => {
        // table is from a hardcoded const list (not user input) — safe to inline.
        const data = await safe(
          db.execute(sql.raw(`SELECT * FROM ${table} LIMIT 200`)) as unknown as Promise<Record<string, unknown>[]>,
          [] as Record<string, unknown>[],
        );
        return { table, label, data };
      }),
    ),
    safe(
      db
        .select({ token: portalDocuments.token, filename: portalDocuments.filename, uploaded_at: portalDocuments.uploadedAt })
        .from(portalDocuments)
        .where(gte(portalDocuments.uploadedAt, since))
        .orderBy(desc(portalDocuments.uploadedAt))
        .limit(50),
      [] as { token: string; filename: string; uploaded_at: string }[],
    ),
    safe(
      db
        .select({
          recipient_name: watermarkDistributions.recipientName,
          recipient_email: watermarkDistributions.recipientEmail,
          filename: watermarkDistributions.filename,
          watermarked_at: watermarkDistributions.watermarkedAt,
        })
        .from(watermarkDistributions)
        .where(gte(watermarkDistributions.watermarkedAt, since))
        .orderBy(desc(watermarkDistributions.watermarkedAt))
        .limit(50),
      [] as { recipient_name: string | null; recipient_email: string | null; filename: string; watermarked_at: string | null }[],
    ),
    safe(
      db
        .select({
          name: customersTable.name,
          fund_name: customersTable.fundName,
          portal_token: customersTable.portalToken,
          onboarded_by: customersTable.onboardedBy,
          created_at: customersTable.createdAt,
        })
        .from(customersTable)
        .where(gte(customersTable.createdAt, since))
        .orderBy(desc(customersTable.createdAt))
        .limit(50),
      [] as { name: string; fund_name: string | null; portal_token: string | null; onboarded_by: string | null; created_at: string }[],
    ),
  ]);

  const events: FeedEvent[] = [];

  // Draft edits — most tables don't have proper "updated_at"; filter by client-side
  for (const r of draftResults) {
    for (const row of r.data) {
      const ts = pickTimestamp(row);
      if (!ts || new Date(ts) < new Date(since)) continue;
      const slug = pickString(row, ["review_slug", "slug"]);
      const primary = `${r.label} edit`;
      const secondary = slug ?? "—";
      events.push({
        kind: r.label,
        ts,
        primary,
        secondary,
        href: slug ? `/admin/funds/${encodeURIComponent(slug)}` : undefined,
      });
    }
  }

  for (const d of docsData) {
    events.push({
      kind: "Upload",
      ts: d.uploaded_at as string,
      primary: `Customer upload`,
      secondary: `${d.filename} · ${d.token}`,
      href: `/portal/${encodeURIComponent(d.token as string)}`,
    });
  }

  for (const w of watermarksData) {
    const ts = w.watermarked_at as string | undefined;
    if (!ts) continue;
    events.push({
      kind: "Watermark",
      ts,
      primary: `Distributed to ${(w.recipient_name as string) || (w.recipient_email as string) || "—"}`,
      secondary: (w.filename as string) ?? "",
    });
  }

  for (const c of customersData) {
    events.push({
      kind: "Onboard",
      ts: c.created_at as string,
      primary: `Onboarded ${c.name as string}`,
      secondary: `${(c.fund_name as string) ?? ""} · ${(c.portal_token as string) ?? "—"} (by ${(c.onboarded_by as string) ?? "?"})`,
      href: c.portal_token ? `/admin/funds/${encodeURIComponent(c.portal_token as string)}` : undefined,
    });
  }

  events.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  const top = events.slice(0, FEED_LIMIT);

  function kindBadge(kind: string) {
    const cmap: Record<string, [string, string]> = {
      Upload:     ["#7B2CBF", "#F5F1FC"],
      Watermark:  ["#92400E", "#FEF3C7"],
      Onboard:    ["#0E7C66", "#ECFDF5"],
    };
    const [color, bg] = cmap[kind] ?? ["#5B6470", "#F1F5F9"];
    return <Badge color={color} bg={bg}>{kind}</Badge>;
  }

  return (
    <Section
      id="activity"
      title="Activity Feed"
      count={top.length}
      hint={`last ${FEED_HOURS}h across all activity`}
    >
      {top.length === 0 ? (
        <Empty>No activity in the last {FEED_HOURS} hours.</Empty>
      ) : (
        <Table
          headers={["Kind", "What", "Detail", "When", ""]}
          rows={top.map((e) => [
            kindBadge(e.kind),
            <span key="p" className="font-body text-[13px]">{e.primary}</span>,
            <Muted key="s">{e.secondary}</Muted>,
            <Muted key="d">{fmtDateTime(e.ts)}</Muted>,
            e.href ? (
              <Link key="l" href={e.href} className="font-mono text-[12px]" style={{ color: VIOLET }}>
                open →
              </Link>
            ) : (
              <Muted key="l">—</Muted>
            ),
          ])}
        />
      )}
    </Section>
  );
}
