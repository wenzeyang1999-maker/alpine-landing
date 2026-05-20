import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

const EXPORTS = {
  users: {
    table: "users",
    columns: ["email", "full_name", "organization", "role", "created_at"],
    orderBy: "created_at",
  },
  subscribers: {
    table: "newsletter_subscribers",
    columns: ["email", "source", "confirmed_at", "unsubscribed_at", "created_at"],
    orderBy: "created_at",
  },
  customers: {
    table: "customers",
    columns: ["name", "email", "organization", "fund_name", "portal_token", "plan", "status", "onboarded_by", "created_at"],
    orderBy: "created_at",
  },
  requests: {
    table: "early_access_requests",
    columns: ["full_name", "email", "organization", "phone", "source", "status", "created_at", "contacted_at"],
    orderBy: "created_at",
  },
} as const;

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
  const { data, error } = await supabase
    .from(cfg.table)
    .select(cfg.columns.join(","))
    .order(cfg.orderBy, { ascending: false })
    .limit(5000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const csv = toCsv((data ?? []) as unknown as Record<string, unknown>[], cfg.columns);
  const filename = `alpine_${tableKey}_${new Date().toISOString().slice(0, 10)}.csv`;

  await logAudit({
    actor: adminEmail,
    action: "export.csv",
    target: tableKey,
    meta: { row_count: (data ?? []).length },
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
