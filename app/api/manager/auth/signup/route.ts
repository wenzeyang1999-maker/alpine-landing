import { NextRequest, NextResponse } from "next/server";
import { hashPassword, isAcceptablePassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";
import { managerDb } from "@/lib/manager/db";

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

    const db = managerDb();

    // Reject duplicate emails early
    const { data: existing } = await db
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle() as { data: { id: string } | null };

    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists. Please sign in." },
        { status: 409 },
      );
    }

    // Create firm row (slug must be unique — append random suffix if taken)
    let slug = slugify(firm_name);
    const { data: slugConflict } = await db
      .from("firms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle() as { data: { id: string } | null };

    if (slugConflict) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
    }

    const { data: firmRaw, error: firmErr } = await db
      .from("firms")
      .insert({ name: firm_name, slug })
      .select("id")
      .single() as { data: { id: string } | null; error: unknown };

    if (firmErr || !firmRaw) {
      console.error("Firm insert error:", firmErr);
      return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 500 });
    }

    // Hash password + create user (owner role, pending verification)
    const password_hash = hashPassword(password);
    const { error: userErr } = await db.from("users").insert({
      firm_id: firmRaw.id,
      email,
      full_name,
      role: "owner",
      password_hash,
      password_set_at: new Date().toISOString(),
      is_verified: false,
    }) as { error: unknown };

    if (userErr) {
      console.error("User insert error:", userErr);
      await db.from("firms").delete().eq("id", firmRaw.id);
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
