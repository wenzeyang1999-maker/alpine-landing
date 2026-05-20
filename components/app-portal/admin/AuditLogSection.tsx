import { supabase } from "@/lib/app-portal/supabase";
import { VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtDateTime } from "@/components/app-portal/admin/shared";

interface AuditRow {
  id: string;
  actor_email: string;
  action: string;
  target: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

const LIMIT = 50;

export default async function AuditLogSection() {
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, actor_email, action, target, meta, created_at")
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  // Supabase REST returns PGRST205 with "schema cache" message for missing tables;
  // direct Postgres errors use 42P01. Cover both.
  const tableMissing =
    !!error &&
    (error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message?.includes("does not exist") ||
      error.message?.includes("schema cache"));

  const rows: AuditRow[] = (data ?? []) as AuditRow[];

  function actionBadge(a: string) {
    if (a.startsWith("auth."))      return <Badge color={VIOLET} bg="#F5F1FC">{a}</Badge>;
    if (a.startsWith("admin."))     return <Badge color="#B45309" bg="#FEF3C7">{a}</Badge>;
    if (a.startsWith("broadcast.")) return <Badge color="#0E7C66" bg="#ECFDF5">{a}</Badge>;
    if (a.startsWith("watermark.")) return <Badge color="#B91C1C" bg="#FEF2F2">{a}</Badge>;
    if (a.startsWith("onboard."))   return <Badge color={VIOLET} bg="#F5F1FC">{a}</Badge>;
    return <Badge color="#5B6470" bg="#F1F5F9">{a}</Badge>;
  }

  function metaSummary(meta: Record<string, unknown> | null): string {
    if (!meta) return "";
    const keys = Object.keys(meta);
    if (keys.length === 0) return "";
    // Show up to 3 short k/v pairs
    return keys
      .slice(0, 3)
      .map((k) => {
        const v = meta[k];
        if (v == null) return `${k}=—`;
        if (typeof v === "string" && v.length > 30) return `${k}="${v.slice(0, 30)}…"`;
        return `${k}=${typeof v === "object" ? JSON.stringify(v).slice(0, 40) : String(v)}`;
      })
      .join(" · ");
  }

  return (
    <Section
      id="audit"
      title="Audit Log"
      count={rows.length}
      error={error && !tableMissing ? error.message : null}
      hint={`last ${LIMIT} admin actions`}
    >
      {tableMissing ? (
        <div
          className="rounded p-3 font-body text-[13px]"
          style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
        >
          Table <code>audit_log</code> not found. Run <code>migrations/004_audit_log.sql</code> in Supabase to enable this section.
        </div>
      ) : rows.length === 0 ? (
        <Empty>No actions audited yet.</Empty>
      ) : (
        <Table
          headers={["When", "Actor", "Action", "Target", "Meta"]}
          rows={rows.map((r) => [
            <Muted key="d">{fmtDateTime(r.created_at)}</Muted>,
            <span key="a" className="font-mono text-[12px]">{r.actor_email}</span>,
            actionBadge(r.action),
            r.target ? <span key="t" className="font-mono text-[12px]">{r.target}</span> : <Muted>—</Muted>,
            <Muted key="m">{metaSummary(r.meta)}</Muted>,
          ])}
        />
      )}
    </Section>
  );
}
