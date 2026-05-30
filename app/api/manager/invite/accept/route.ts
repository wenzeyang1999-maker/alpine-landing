import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { hashPassword, isAcceptablePassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";
import { managerDb } from "@/lib/manager/db";

function publicDb() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

type InviteRow = { id: string; firm_id: string; created_by: string; revoked_at: string | null };
type UserRow = { id: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawToken: string = body.token ?? "";
    const email: string = (body.email ?? "").trim().toLowerCase();
    const full_name: string = (body.full_name ?? "").trim();
    const job_title: string = (body.job_title ?? "").trim();
    const password: string = body.password ?? "";

    if (!rawToken) {
      return NextResponse.json({ error: "Invalid invite link." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!full_name) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    const pwCheck = isAcceptablePassword(password);
    if (!pwCheck.ok) {
      return NextResponse.json({ error: pwCheck.reason }, { status: 400 });
    }

    const token_hash = hashToken(rawToken);

    const { data: inviteRaw } = await publicDb()
      .from("manager_team_invites")
      .select("id, firm_id, created_by, revoked_at")
      .eq("token_hash", token_hash)
      .maybeSingle() as { data: InviteRow | null };

    if (!inviteRaw) {
      return NextResponse.json({ error: "This invite link is not valid." }, { status: 404 });
    }
    if (inviteRaw.revoked_at) {
      return NextResponse.json({ error: "This invite link has been revoked." }, { status: 410 });
    }

    // If email already has an account (same or different firm), reject
    const db = managerDb();
    const { data: existingUser } = await db
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle() as { data: UserRow | null };

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email already exists. Please sign in instead." },
        { status: 409 },
      );
    }

    // Create the invitee — auto-verified
    const password_hash = hashPassword(password);
    const { error: insertErr } = await db.from("users").insert({
      firm_id: inviteRaw.firm_id,
      email,
      full_name,
      job_title: job_title || null,
      role: "member",
      invited_by: inviteRaw.created_by,
      password_hash,
      password_set_at: new Date().toISOString(),
      is_verified: true,
      verified_at: new Date().toISOString(),
      verified_by: "invite_link",
    }) as { error: unknown };

    if (insertErr) {
      console.error("Invite accept insert error:", insertErr);
      return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 500 });
    }

    const token = await signSession(email);
    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true, redirect: "/manager/workspace" }, { status: 201 });
    res.cookies.set(MANAGER_SESSION.COOKIE_NAME, token, managerCookieOptions(isProd));
    return res;
  } catch (err) {
    console.error("Invite accept error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
