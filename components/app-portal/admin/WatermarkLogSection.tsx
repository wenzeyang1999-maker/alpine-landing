import { supabase } from "@/lib/app-portal/supabase";
import { SUBTLE, GREEN } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtRelative } from "@/components/app-portal/admin/shared";

const LOG_LIMIT = 30;

interface RawDist {
  [key: string]: unknown;
}

function pickString(row: RawDist, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

function pickNumber(row: RawDist, keys: string[]): number | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number") return v;
  }
  return null;
}

export default async function WatermarkLogSection() {
  // Schema-tolerant: select * and pull whichever common fields exist.
  const { data, error } = await supabase
    .from("watermark_distributions")
    .select("*")
    .limit(LOG_LIMIT * 4); // overfetch then sort/limit client-side

  const rows: RawDist[] = (data ?? []) as RawDist[];

  // Normalize across possible column names
  const normalized = rows.map((r) => ({
    raw: r,
    recipient: pickString(r, ["recipient_email", "recipient", "email", "to", "to_email"]) ?? "—",
    recipientName: pickString(r, ["recipient_name", "name", "full_name"]),
    fund: pickString(r, ["fund_slug", "slug", "fund", "doc_slug"]),
    distributedAt:
      pickString(r, ["distributed_at", "sent_at", "created_at", "issued_at"]) ?? null,
    status: pickString(r, ["status", "state"]),
    opens: pickNumber(r, ["open_count", "opens", "view_count"]),
  }));

  normalized.sort((a, b) => {
    const da = a.distributedAt ? new Date(a.distributedAt).getTime() : 0;
    const db = b.distributedAt ? new Date(b.distributedAt).getTime() : 0;
    return db - da;
  });

  const top = normalized.slice(0, LOG_LIMIT);

  function statusBadge(s: string | null) {
    if (!s) return <Muted>—</Muted>;
    const lower = s.toLowerCase();
    if (lower.includes("deliver") || lower.includes("sent") || lower.includes("issued")) {
      return <Badge color={GREEN} bg="#ECFDF5">{s}</Badge>;
    }
    if (lower.includes("revok") || lower.includes("fail") || lower.includes("error")) {
      return <Badge color="#B91C1C" bg="#FEF2F2">{s}</Badge>;
    }
    return <Badge color="#5B6470" bg="#F1F5F9">{s}</Badge>;
  }

  return (
    <Section
      id="watermark"
      title="Watermark Log"
      count={top.length}
      error={error?.message ?? null}
      hint={`latest ${LOG_LIMIT} watermarked distributions`}
    >
      {top.length === 0 ? (
        <Empty>No watermark distributions logged yet.</Empty>
      ) : (
        <Table
          headers={["Recipient", "Fund", "Status", "Opens", "Sent"]}
          rows={top.map((d) => [
            <span key="r" className="font-mono text-[13px]">
              {d.recipient}
              {d.recipientName && (
                <span className="ml-2 font-body text-[12px]" style={{ color: SUBTLE }}>
                  ({d.recipientName})
                </span>
              )}
            </span>,
            d.fund ? <span key="f" className="font-mono text-[12px]">{d.fund}</span> : <Muted>—</Muted>,
            statusBadge(d.status),
            <Muted key="o">{d.opens != null ? d.opens : "—"}</Muted>,
            <Muted key="d">{fmtRelative(d.distributedAt)}</Muted>,
          ])}
        />
      )}
    </Section>
  );
}
