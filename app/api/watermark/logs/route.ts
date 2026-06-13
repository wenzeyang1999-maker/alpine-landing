import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { watermarkDistributions } from "@/lib/db/schema";

const ADMIN_KEY = process.env.WATERMARK_ADMIN_KEY ?? "alpine-admin-2026";

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
