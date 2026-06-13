import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { managerResponses } from "@/lib/db/schema";
import { getCurrentManager } from "@/lib/manager/access";

export async function POST(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ error: "No firm" }, { status: 400 });

  const { questionId, chapterNum, status } = await req.json();
  if (!questionId || !chapterNum) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (status !== null && status !== "flagged" && status !== "reviewed") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await db
      .insert(managerResponses)
      .values({
        firmId: user.firm_id,
        questionId,
        chapterNum,
        reviewStatus: status ?? null,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: [managerResponses.firmId, managerResponses.questionId],
        set: { reviewStatus: status ?? null, updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
