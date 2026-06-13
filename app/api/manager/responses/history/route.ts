import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerResponseHistory } from "@/lib/db/schema";
import { getCurrentManager } from "@/lib/manager/access";

export async function GET(req: NextRequest) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const questionId = req.nextUrl.searchParams.get("questionId");
  if (!questionId) return NextResponse.json({ error: "Missing questionId" }, { status: 400 });

  try {
    const rows = await db
      .select({
        id: managerResponseHistory.id,
        answerText: managerResponseHistory.answerText,
        answerChoice: managerResponseHistory.answerChoice,
        answerMulti: managerResponseHistory.answerMulti,
        uploadedFilename: managerResponseHistory.uploadedFilename,
        changedByEmail: managerResponseHistory.changedByEmail,
        changedByName: managerResponseHistory.changedByName,
        changedAt: managerResponseHistory.changedAt,
      })
      .from(managerResponseHistory)
      .where(and(eq(managerResponseHistory.firmId, user.firm_id), eq(managerResponseHistory.questionId, questionId)))
      .orderBy(desc(managerResponseHistory.changedAt))
      .limit(50);

    const history = rows.map((r) => ({
      id: r.id,
      answer_text: r.answerText,
      answer_choice: r.answerChoice,
      answer_multi: r.answerMulti,
      uploaded_filename: r.uploadedFilename,
      changed_by_email: r.changedByEmail,
      changed_by_name: r.changedByName,
      changed_at: r.changedAt,
    }));

    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
