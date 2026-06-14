import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { earlyAccessRequests } from "@/lib/db/schema";
import { GREEN, VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtRelative } from "@/components/app-portal/admin/shared";
import RequestRowActions from "@/components/app-portal/admin/RequestRowActions";
import ExportCsvLink from "@/components/app-portal/admin/ExportCsvLink";

type Status = "new" | "contacted" | "converted" | "declined";

interface RequestRow {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: Status;
  created_at: string;
  contacted_at: string | null;
}

function statusBadge(s: Status) {
  switch (s) {
    case "new":       return <Badge color="#B45309" bg="#FEF3C7">New</Badge>;
    case "contacted": return <Badge color={VIOLET}  bg="#F5F1FC">Contacted</Badge>;
    case "converted": return <Badge color={GREEN}   bg="#ECFDF5">Converted</Badge>;
    case "declined":  return <Badge color="#94a3b8" bg="#F1F5F9">Declined</Badge>;
  }
}

export default async function RequestsSection() {
  let rows: RequestRow[] = [];
  let errorMessage: string | null = null;
  let tableMissing = false;
  try {
    const data = await db
      .select({
        id: earlyAccessRequests.id,
        full_name: earlyAccessRequests.fullName,
        email: earlyAccessRequests.email,
        organization: earlyAccessRequests.organization,
        phone: earlyAccessRequests.phone,
        message: earlyAccessRequests.message,
        source: earlyAccessRequests.source,
        status: earlyAccessRequests.status,
        created_at: earlyAccessRequests.createdAt,
        contacted_at: earlyAccessRequests.contactedAt,
      })
      .from(earlyAccessRequests)
      .orderBy(desc(earlyAccessRequests.createdAt))
      .limit(100);
    rows = data as RequestRow[];
  } catch (e) {
    const err = e as { code?: string; message?: string };
    tableMissing = err.code === "42P01" || !!err.message?.includes("does not exist");
    if (!tableMissing) errorMessage = err.message ?? "error";
  }

  const newCount = rows.filter((r) => r.status === "new").length;

  return (
    <Section
      id="requests"
      title="Requests"
      count={`${newCount} new · ${rows.length} total`}
      error={errorMessage}
      hint={<ExportCsvLink table="requests" />}
    >
      {tableMissing ? (
        <div
          className="rounded p-3 font-body text-[13px]"
          style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
        >
          Table <code>early_access_requests</code> not found in the database. Apply the latest schema (see <code>lib/db</code>) to enable this section.
        </div>
      ) : rows.length === 0 ? (
        <Empty>No early-access requests yet.</Empty>
      ) : (
        <Table
          headers={["Name / Org", "Email", "Source", "Status", "Received", "Action"]}
          rows={rows.map((r) => [
            <div key="n">
              <div className="font-body text-[13px]">{r.full_name}</div>
              {r.organization && (
                <div className="font-body text-[11px]" style={{ color: "#5B6470" }}>
                  {r.organization}
                </div>
              )}
            </div>,
            <span key="e" className="font-mono text-[13px]">{r.email}</span>,
            r.source ? <span key="s" className="font-mono text-[11px]">{r.source}</span> : <Muted>—</Muted>,
            statusBadge(r.status),
            <Muted key="d">{fmtRelative(r.created_at)}</Muted>,
            <RequestRowActions key="a" id={r.id} currentStatus={r.status} />,
          ])}
        />
      )}
    </Section>
  );
}
