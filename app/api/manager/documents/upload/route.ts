import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { managerUploads } from "@/lib/db/schema";
import { ensureContainer, uploadObject, removeObject } from "@/lib/storage";
import { getCurrentManager } from "@/lib/manager/access";

const BUCKET = "manager-docs";
const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 413 });
  }

  await ensureContainer(BUCKET);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${user.email}/${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  try {
    await uploadObject(BUCKET, storagePath, arrayBuffer, file.type || "application/octet-stream", { upsert: false });
  } catch (uploadErr) {
    return NextResponse.json({ error: (uploadErr as Error).message }, { status: 500 });
  }

  try {
    const [doc] = await db
      .insert(managerUploads)
      .values({
        userEmail: user.email,
        filename: file.name,
        storagePath,
        fileSize: file.size,
      })
      .returning({
        id: managerUploads.id,
        filename: managerUploads.filename,
        storagePath: managerUploads.storagePath,
        fileSize: managerUploads.fileSize,
        uploadedAt: managerUploads.uploadedAt,
      });

    return NextResponse.json({
      doc: {
        id: doc.id,
        filename: doc.filename,
        storage_path: doc.storagePath,
        file_size: doc.fileSize,
        uploaded_at: doc.uploadedAt,
      },
    });
  } catch (dbErr) {
    await removeObject(BUCKET, storagePath);
    return NextResponse.json({ error: (dbErr as Error).message }, { status: 500 });
  }
}
