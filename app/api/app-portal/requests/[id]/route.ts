import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
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
    if (status === "contacted") update.contacted_at = new Date().toISOString();
    if (typeof notes === "string") update.notes = notes;

    const { error } = await supabase
      .from("early_access_requests")
      .update(update)
      .eq("id", params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await logAudit({ actor: adminEmail, action: "request.status", target: params.id, meta: { status } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
