import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { hashPassword } from "@/lib/investor/password";

export const runtime = "nodejs";

// GET — list investor accounts.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("investors")
    .select("id, email, full_name, organization, is_active, created_at, last_login")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[investor-admin/accounts] list error:", error);
    return NextResponse.json({ error: "Couldn't load accounts." }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST — create an investor account. { email, full_name, organization, password }
export async function POST(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const fullName = typeof body?.full_name === "string" ? body.full_name.trim() : "";
  const organization = typeof body?.organization === "string" ? body.organization.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "The initial password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("investors")
    .insert({
      email,
      password_hash: hashPassword(password),
      full_name: fullName || null,
      organization: organization || null,
    })
    .select("id, email, full_name, organization, is_active, created_at, last_login")
    .single();

  if (error) {
    // 23505 = unique violation on the email column.
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    console.error("[investor-admin/accounts] create error:", error);
    return NextResponse.json({ error: "Couldn't create the account." }, { status: 500 });
  }

  await logAudit({ actor: admin, action: "investor.account.create", target: email });
  return NextResponse.json(data);
}

// PATCH — activate / deactivate an account. { id, is_active }
export async function PATCH(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { id?: string; is_active?: boolean } | null;
  const id = body?.id ?? "";
  if (!id || typeof body?.is_active !== "boolean") {
    return NextResponse.json({ error: "id and is_active are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("investors")
    .update({ is_active: body.is_active })
    .eq("id", id)
    .select("id, email, full_name, organization, is_active, created_at, last_login")
    .single();

  if (error || !data) {
    console.error("[investor-admin/accounts] patch error:", error);
    return NextResponse.json({ error: "Couldn't update the account." }, { status: 500 });
  }

  await logAudit({
    actor: admin,
    action: body.is_active ? "investor.account.activate" : "investor.account.deactivate",
    target: data.email,
  });
  return NextResponse.json(data);
}
