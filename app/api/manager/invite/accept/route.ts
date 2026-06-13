import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerTeamInvites, usersInManager } from "@/lib/db/schema";
import { hashPassword, isAcceptablePassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

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

    const [inviteRaw] = await db
      .select({ id: managerTeamInvites.id, firmId: managerTeamInvites.firmId, createdBy: managerTeamInvites.createdBy, revokedAt: managerTeamInvites.revokedAt })
      .from(managerTeamInvites)
      .where(eq(managerTeamInvites.tokenHash, token_hash))
      .limit(1);

    if (!inviteRaw) {
      return NextResponse.json({ error: "This invite link is not valid." }, { status: 404 });
    }
    if (inviteRaw.revokedAt) {
      return NextResponse.json({ error: "This invite link has been revoked." }, { status: 410 });
    }

    // If email already has an account (same or different firm), reject
    const [existingUser] = await db
      .select({ id: usersInManager.id })
      .from(usersInManager)
      .where(eq(usersInManager.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email already exists. Please sign in instead." },
        { status: 409 },
      );
    }

    // Create the invitee — auto-verified
    const password_hash = hashPassword(password);
    try {
      await db.insert(usersInManager).values({
        firmId: inviteRaw.firmId,
        email,
        fullName: full_name,
        jobTitle: job_title || null,
        role: "member",
        invitedBy: inviteRaw.createdBy,
        passwordHash: password_hash,
        passwordSetAt: new Date().toISOString(),
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        verifiedBy: "invite_link",
      });
    } catch (insertErr) {
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
