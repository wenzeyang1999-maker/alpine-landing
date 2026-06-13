import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerResponses } from "@/lib/db/schema";
import { getCurrentManager } from "@/lib/manager/access";

export async function POST() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.delete(managerResponses).where(eq(managerResponses.firmId, user.firm_id));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
