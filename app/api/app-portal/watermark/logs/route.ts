import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { watermarkDistributions } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select({
        id: watermarkDistributions.id,
        recipientName: watermarkDistributions.recipientName,
        filename: watermarkDistributions.filename,
        distributedBy: watermarkDistributions.distributedBy,
        watermarkedAt: watermarkDistributions.watermarkedAt,
      })
      .from(watermarkDistributions)
      .orderBy(desc(watermarkDistributions.watermarkedAt))
      .limit(100);

    const logs = rows.map((r) => ({
      id: r.id,
      recipient_name: r.recipientName,
      filename: r.filename,
      distributed_by: r.distributedBy,
      watermarked_at: r.watermarkedAt,
    }));

    return NextResponse.json({ logs });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
