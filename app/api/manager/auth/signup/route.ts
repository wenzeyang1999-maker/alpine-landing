import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { usersInManager, firmsInManager } from "@/lib/db/schema";
import { hashPassword, isAcceptablePassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";
import { validateClaimableToken } from "@/lib/manager/portal-link";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";
    const full_name: string = (body.full_name ?? "").trim();
    const firm_name: string = (body.firm_name ?? "").trim();
    const portal_token: string = (body.portal_token ?? "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid work email." }, { status: 400 });
    }
    if (!full_name) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!firm_name) {
      return NextResponse.json({ error: "Firm name is required." }, { status: 400 });
    }
    const pwCheck = isAcceptablePassword(password);
    if (!pwCheck.ok) {
      return NextResponse.json({ error: pwCheck.reason }, { status: 400 });
    }

    // Reject duplicate emails early
    const [existing] = await db
      .select({ id: usersInManager.id })
      .from(usersInManager)
      .where(eq(usersInManager.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists. Please sign in." },
        { status: 409 },
      );
    }

    // Create firm row (slug must be unique — append random suffix if taken)
    let slug = slugify(firm_name);
    const [slugConflict] = await db
      .select({ id: firmsInManager.id })
      .from(firmsInManager)
      .where(eq(firmsInManager.slug, slug))
      .limit(1);

    if (slugConflict) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
    }

    // Claim the secure-portal token the signup arrived with (from the portal
    // page's workspace banner). Invalid or already-claimed tokens are ignored
    // rather than blocking signup — the portal link is a bonus, not a gate.
    const claimedToken = portal_token && (await validateClaimableToken(portal_token)) ? portal_token : null;

    let firmId: string;
    try {
      const [firmRaw] = await db
        .insert(firmsInManager)
        .values({ name: firm_name, slug, portalToken: claimedToken })
        .returning({ id: firmsInManager.id });
      firmId = firmRaw.id;
    } catch (firmErr) {
      console.error("Firm insert error:", firmErr);
      return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 500 });
    }

    // Hash password + create user (owner role, pending verification)
    const password_hash = hashPassword(password);
    try {
      await db.insert(usersInManager).values({
        firmId,
        email,
        fullName: full_name,
        role: "owner",
        passwordHash: password_hash,
        passwordSetAt: new Date().toISOString(),
        isVerified: false,
      });
    } catch (userErr) {
      console.error("User insert error:", userErr);
      await db.delete(firmsInManager).where(eq(firmsInManager.id, firmId));
      return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 500 });
    }

    const token = await signSession(email);
    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true, redirect: "/manager/pending" }, { status: 201 });
    res.cookies.set(MANAGER_SESSION.COOKIE_NAME, token, managerCookieOptions(isProd));
    return res;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
