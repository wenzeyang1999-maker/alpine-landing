import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import { users, newsletterSubscribers, customers, earlyAccessRequests } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

// Each export maps CSV column names (snake_case, preserved in output) → Drizzle columns.
type ExportConfig = {
  table: PgTable;
  columns: readonly string[];
  select: Record<string, PgColumn>;
  orderBy: PgColumn;
};

const EXPORTS: Record<string, ExportConfig> = {
  users: {
    table: users,
    columns: ["email", "full_name", "organization", "role", "created_at"],
    select: { email: users.email, full_name: users.fullName, organization: users.organization, role: users.role, created_at: users.createdAt },
    orderBy: users.createdAt,
  },
  subscribers: {
    table: newsletterSubscribers,
    columns: ["email", "source", "confirmed_at", "unsubscribed_at", "created_at"],
    select: { email: newsletterSubscribers.email, source: newsletterSubscribers.source, confirmed_at: newsletterSubscribers.confirmedAt, unsubscribed_at: newsletterSubscribers.unsubscribedAt, created_at: newsletterSubscribers.createdAt },
    orderBy: newsletterSubscribers.createdAt,
  },
  customers: {
    table: customers,
    columns: ["name", "email", "organization", "fund_name", "portal_token", "plan", "status", "onboarded_by", "created_at"],
    select: { name: customers.name, email: customers.email, organization: customers.organization, fund_name: customers.fundName, portal_token: customers.portalToken, plan: customers.plan, status: customers.status, onboarded_by: customers.onboardedBy, created_at: customers.createdAt },
    orderBy: customers.createdAt,
  },
  requests: {
    table: earlyAccessRequests,
    columns: ["full_name", "email", "organization", "phone", "source", "status", "created_at", "contacted_at"],
    select: { full_name: earlyAccessRequests.fullName, email: earlyAccessRequests.email, organization: earlyAccessRequests.organization, phone: earlyAccessRequests.phone, source: earlyAccessRequests.source, status: earlyAccessRequests.status, created_at: earlyAccessRequests.createdAt, contacted_at: earlyAccessRequests.contactedAt },
    orderBy: earlyAccessRequests.createdAt,
  },
};

type ExportKey = keyof typeof EXPORTS;

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  const needsQuotes = /[",\n\r]/.test(s);
  return needsQuotes ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Record<string, unknown>[], columns: readonly string[]): string {
  const header = columns.join(",");
  const lines = rows.map((r) => columns.map((c) => csvCell(r[c])).join(","));
  return `${header}\n${lines.join("\n")}\n`;
}

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tableKey = req.nextUrl.searchParams.get("table") as ExportKey | null;
  if (!tableKey || !(tableKey in EXPORTS)) {
    return NextResponse.json(
      { error: `Invalid table. Allowed: ${Object.keys(EXPORTS).join(", ")}` },
      { status: 400 },
    );
  }

  const cfg = EXPORTS[tableKey];
  let rows: Record<string, unknown>[];
  try {
    rows = (await db.select(cfg.select).from(cfg.table).orderBy(desc(cfg.orderBy)).limit(5000)) as Record<string, unknown>[];
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const csv = toCsv(rows, cfg.columns);
  const filename = `alpine_${tableKey}_${new Date().toISOString().slice(0, 10)}.csv`;

  await logAudit({
    actor: adminEmail,
    action: "export.csv",
    target: tableKey,
    meta: { row_count: rows.length },
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
