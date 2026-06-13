import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { earlyAccessRequests } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

const ALLOWED_STATUSES = new Set(["new", "contacted", "converted", "declined"]);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { status, notes } = (await req.json()) as { status?: string; notes?: string };
    if (!status || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid status. Allowed: new, contacted, converted, declined." }, { status: 400 });
    }

    const update: Record<string, unknown> = { status };
    if (status === "contacted") update.contactedAt = new Date().toISOString();
    if (typeof notes === "string") update.notes = notes;

    await db.update(earlyAccessRequests).set(update).where(eq(earlyAccessRequests.id, params.id));

    await logAudit({ actor: adminEmail, action: "request.status", target: params.id, meta: { status } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
