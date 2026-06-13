import { NextRequest, NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { followupNotes, users } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/app-portal/slug-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

// GET /api/app-portal/notes?slug=trellis-capital-iv&user=demo@alpinedd.com
export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  const userEmail = req.nextUrl.searchParams.get("user");
  if (!slug || !userEmail) return NextResponse.json({}, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const rows = await db
    .select({ questionKey: followupNotes.questionKey, checked: followupNotes.checked, note: followupNotes.note })
    .from(followupNotes)
    .where(and(eq(followupNotes.userEmail, userEmail), eq(followupNotes.reviewSlug, slug)));

  // Convert rows → { [question_key]: { checked, note } }
  const state: Record<string, { checked: boolean; note: string }> = {};
  for (const row of rows) {
    state[row.questionKey] = { checked: row.checked, note: row.note };
  }
  return NextResponse.json(state);
}

// POST /api/app-portal/notes  body: { slug, user, state }
export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { slug, user: userEmail, state } = await req.json();
    if (!slug || !userEmail || !state) {
      return NextResponse.json({ error: "missing slug, user, or state" }, { status: 400 });
    }
    if (isBlockedSlug(slug)) return blockedResponse();

    // Ensure user row exists (insert-or-ignore)
    await db.insert(users).values({ email: userEmail }).onConflictDoNothing({ target: users.email });

    // Upsert each sub-item row
    const rows = Object.entries(state as Record<string, { checked: boolean; note: string }>).map(
      ([question_key, { checked, note }]) => ({
        userEmail,
        reviewSlug: slug,
        questionKey: question_key,
        checked,
        note,
      })
    );

    if (rows.length > 0) {
      await db
        .insert(followupNotes)
        .values(rows)
        .onConflictDoUpdate({
          target: [followupNotes.userEmail, followupNotes.reviewSlug, followupNotes.questionKey],
          set: { checked: sql`excluded.checked`, note: sql`excluded.note` },
        });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notes POST] Caught error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
