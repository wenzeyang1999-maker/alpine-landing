import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { email, note } = (await req.json()) as { email?: string; note?: string };
    const normalized = (email ?? "").trim().toLowerCase();
    if (!normalized || !EMAIL_RE.test(normalized)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("app_admins")
      .upsert({ email: normalized, added_by: adminEmail, note: note || null }, { onConflict: "email" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await logAudit({ actor: adminEmail, action: "admin.add", target: normalized, meta: { note } });
    return NextResponse.json({
      ok: true,
      email: normalized,
      note_for_human:
        "Recorded in DB. The runtime auth gate in middleware.ts still uses a hardcoded list — update that file to grant runtime access.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (email === adminEmail) {
      return NextResponse.json({ error: "Refusing to remove yourself." }, { status: 400 });
    }

    const { error } = await supabase.from("app_admins").delete().eq("email", email);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await logAudit({ actor: adminEmail, action: "admin.remove", target: email });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
