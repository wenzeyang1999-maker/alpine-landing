import { NextRequest, NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { followupNotes, users } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

const VALID_TOKEN = process.env.NOTES_TOKEN;

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function checkToken(req: NextRequest): boolean {
  const token = req.headers.get("x-notes-token") ?? req.nextUrl.searchParams.get("token");
  return !!VALID_TOKEN && token === VALID_TOKEN;
}

// GET /api/notes?slug=trellis-capital-iv&user=demo@alpinedd.com
export async function GET(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();

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

// POST /api/notes  body: { slug, user, state }
export async function POST(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();

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
