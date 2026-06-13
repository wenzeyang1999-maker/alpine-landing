import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { investors } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { hashPassword } from "@/lib/investor/password";

export const runtime = "nodejs";

type InvestorRow = typeof investors.$inferSelect;

// Preserve the snake_case API shape clients consume.
function toApi(row: InvestorRow) {
  return {
    id: row.id,
    email: row.email,
    full_name: row.fullName,
    organization: row.organization,
    is_active: row.isActive,
    created_at: row.createdAt,
    last_login: row.lastLogin,
  };
}

// GET — list investor accounts.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const rows = await db.select().from(investors).orderBy(desc(investors.createdAt));
    return NextResponse.json(rows.map(toApi));
  } catch (error) {
    console.error("[investor-admin/accounts] list error:", error);
    return NextResponse.json({ error: "Couldn't load accounts." }, { status: 500 });
  }
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

  try {
    const [row] = await db
      .insert(investors)
      .values({
        email,
        passwordHash: hashPassword(password),
        fullName: fullName || null,
        organization: organization || null,
      })
      .returning();

    await logAudit({ actor: admin, action: "investor.account.create", target: email });
    return NextResponse.json(toApi(row));
  } catch (error) {
    // 23505 = unique violation on the email column.
    if ((error as { code?: string })?.code === "23505") {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    console.error("[investor-admin/accounts] create error:", error);
    return NextResponse.json({ error: "Couldn't create the account." }, { status: 500 });
  }
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

  try {
    const [row] = await db.update(investors).set({ isActive: body.is_active }).where(eq(investors.id, id)).returning();
    if (!row) {
      return NextResponse.json({ error: "Couldn't update the account." }, { status: 500 });
    }
    await logAudit({
      actor: admin,
      action: body.is_active ? "investor.account.activate" : "investor.account.deactivate",
      target: row.email,
    });
    return NextResponse.json(toApi(row));
  } catch (error) {
    console.error("[investor-admin/accounts] patch error:", error);
    return NextResponse.json({ error: "Couldn't update the account." }, { status: 500 });
  }
}
