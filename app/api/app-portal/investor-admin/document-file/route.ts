import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { investorDocuments } from "@/lib/db/schema";
import { signedUrl } from "@/lib/storage";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export const runtime = "nodejs";

const STORAGE_BUCKET = "portal-uploads";

// GET — analyst-gated fetch of an investor-uploaded file for review. ?id=
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const [doc] = await db
    .select({ storagePath: investorDocuments.storagePath })
    .from(investorDocuments)
    .where(eq(investorDocuments.id, id))
    .limit(1);

  if (!doc?.storagePath) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  try {
    const url = await signedUrl(STORAGE_BUCKET, doc.storagePath, 300);
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
