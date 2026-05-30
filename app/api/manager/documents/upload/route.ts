import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

const BUCKET = "manager-docs";
const MAX_BYTES = 20 * 1024 * 1024;

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function ensureBucket() {
  const { data: buckets } = await db().storage.listBuckets();
  const exists = (buckets ?? []).some((b: { name: string }) => b.name === BUCKET);
  if (!exists) {
    await db().storage.createBucket(BUCKET, { public: false });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 413 });
  }

  await ensureBucket();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${user.email}/${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadErr } = await db().storage
    .from(BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  const { data: doc, error: dbErr } = await db()
    .from("manager_uploads")
    .insert({
      user_email: user.email,
      filename: file.name,
      storage_path: storagePath,
      file_size: file.size,
    })
    .select("id, filename, storage_path, file_size, uploaded_at")
    .single();

  if (dbErr) {
    await db().storage.from(BUCKET).remove([storagePath]);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ doc });
}
