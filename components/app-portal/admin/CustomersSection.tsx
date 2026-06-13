import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { VIOLET, GREEN } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtDate } from "@/components/app-portal/admin/shared";
import ExportCsvLink from "@/components/app-portal/admin/ExportCsvLink";

interface CustomerRow {
  id: string;
  name: string;
  email: string | null;
  organization: string | null;
  portal_token: string | null;
  fund_name: string | null;
  plan: string;
  status: string;
  onboarded_by: string | null;
  created_at: string;
}

function planBadge(plan: string) {
  const color = plan === "enterprise" ? GREEN : plan === "pro" ? VIOLET : "#5B6470";
  const bg = plan === "enterprise" ? "#ECFDF5" : plan === "pro" ? "#F5F1FC" : "#F1F5F9";
  return <Badge color={color} bg={bg}>{plan}</Badge>;
}

function statusBadge(status: string) {
  if (status === "active")   return <Badge color={GREEN}    bg="#ECFDF5">Active</Badge>;
  if (status === "paused")   return <Badge color="#B45309"  bg="#FEF3C7">Paused</Badge>;
  if (status === "churned")  return <Badge color="#94a3b8"  bg="#F1F5F9">Churned</Badge>;
  return <Badge color="#5B6470" bg="#F1F5F9">{status}</Badge>;
}

export default async function CustomersSection() {
  let rows: CustomerRow[] = [];
  let errorMessage: string | null = null;
  let tableMissing = false;
  try {
    const data = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        organization: customers.organization,
        portal_token: customers.portalToken,
        fund_name: customers.fundName,
        plan: customers.plan,
        status: customers.status,
        onboarded_by: customers.onboardedBy,
        created_at: customers.createdAt,
      })
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(100);
    rows = data as CustomerRow[];
  } catch (e) {
    const err = e as { code?: string; message?: string };
    tableMissing = err.code === "42P01" || !!err.message?.includes("does not exist");
    if (!tableMissing) errorMessage = err.message ?? "error";
  }

  const active = rows.filter((r) => r.status === "active").length;

  return (
    <Section
      id="customers"
      title="Customers"
      count={`${active} active · ${rows.length} total`}
      error={errorMessage}
      hint={<ExportCsvLink table="customers" />}
    >
      {tableMissing ? (
        <div
          className="rounded p-3 font-body text-[13px]"
          style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
        >
          Table <code>customers</code> not found. Run <code>migrations/002_customers.sql</code> in Supabase to enable this section.
        </div>
      ) : rows.length === 0 ? (
        <Empty>No customers onboarded yet. Use the &quot;Onboard customer&quot; button at the top to create one.</Empty>
      ) : (
        <Table
          headers={["Customer", "Fund / Token", "Plan", "Status", "Onboarded", "Open"]}
          rows={rows.map((c) => [
            <div key="c">
              <div className="font-body text-[13px]">{c.name}</div>
              {c.email && (
                <div className="font-mono text-[11px]" style={{ color: "#5B6470" }}>
                  {c.email}
                </div>
              )}
            </div>,
            <div key="f">
              {c.fund_name && <div className="font-body text-[13px]">{c.fund_name}</div>}
              {c.portal_token ? (
                <Link href={`/portal/${c.portal_token}`} className="font-mono text-[11px]" style={{ color: VIOLET }}>
                  {c.portal_token}
                </Link>
              ) : (
                <Muted>—</Muted>
              )}
            </div>,
            planBadge(c.plan),
            statusBadge(c.status),
            <Muted key="d">{fmtDate(c.created_at)}</Muted>,
            c.portal_token ? (
              <span key="l" className="flex gap-3 font-mono text-[12px]">
                <Link href={`/portal/${c.portal_token}`} style={{ color: VIOLET }}>portal →</Link>
                <Link href={`/admin/funds/${c.portal_token}`} style={{ color: VIOLET }}>detail →</Link>
              </span>
            ) : (
              <Muted>—</Muted>
            ),
          ])}
        />
      )}
    </Section>
  );
}
