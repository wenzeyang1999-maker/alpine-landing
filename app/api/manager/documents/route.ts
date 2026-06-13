import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerUploads } from "@/lib/db/schema";
import { signedUrl, removeObject } from "@/lib/storage";
import { getCurrentManager } from "@/lib/manager/access";

const BUCKET = "manager-docs";
const SIGNED_URL_EXPIRY = 3600;

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let rows: { id: string; filename: string; storagePath: string; fileSize: number | null; uploadedAt: string }[];
  try {
    rows = await db
      .select({
        id: managerUploads.id,
        filename: managerUploads.filename,
        storagePath: managerUploads.storagePath,
        fileSize: managerUploads.fileSize,
        uploadedAt: managerUploads.uploadedAt,
      })
      .from(managerUploads)
      .where(eq(managerUploads.userEmail, user.email))
      .orderBy(desc(managerUploads.uploadedAt));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const docs = await Promise.all(
    rows.map(async (doc) => {
      let url: string | null = null;
      try {
        url = await signedUrl(BUCKET, doc.storagePath, SIGNED_URL_EXPIRY);
      } catch {
        url = null;
      }
      return {
        id: doc.id,
        filename: doc.filename,
        storage_path: doc.storagePath,
        file_size: doc.fileSize,
        uploaded_at: doc.uploadedAt,
        url,
      };
    })
  );

  return NextResponse.json({ docs });
}

export async function DELETE(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const [doc] = await db
    .select({ id: managerUploads.id, storagePath: managerUploads.storagePath })
    .from(managerUploads)
    .where(and(eq(managerUploads.id, id), eq(managerUploads.userEmail, user.email)))
    .limit(1);

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeObject(BUCKET, doc.storagePath);
  await db.delete(managerUploads).where(eq(managerUploads.id, id));

  return NextResponse.json({ ok: true });
}
