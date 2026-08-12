import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { DEMO_PORTAL_CONFIG, DEFAULT_DOC_TYPES } from "@/lib/portal-demo";

export const runtime = "nodejs";

// GET /api/portal/info?token=...
// Public, token-scoped: resolves a portal token to its fund name + requested
// document checklist. Possession of the (high-entropy) token is the credential,
// matching the manager-portal design; only the fund display name and checklist
// are returned, never customer contact details.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  const demo = DEMO_PORTAL_CONFIG[token];
  if (demo) {
    return NextResponse.json({ fund_name: demo.fund_name, document_types: demo.document_types, demo: true });
  }

  try {
    const [row] = await db
      .select({ name: customers.name, fundName: customers.fundName, status: customers.status })
      .from(customers)
      .where(eq(customers.portalToken, token))
      .limit(1);

    if (!row || row.status !== "active") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({
      fund_name: row.fundName || row.name,
      document_types: DEFAULT_DOC_TYPES,
      demo: false,
    });
  } catch (e) {
    console.error("[portal/info] DB error:", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
