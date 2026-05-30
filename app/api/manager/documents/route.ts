import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

const BUCKET = "manager-docs";
const SIGNED_URL_EXPIRY = 3600;

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await db()
    .from("manager_uploads")
    .select("id, filename, storage_path, file_size, uploaded_at")
    .eq("user_email", user.email)
    .order("uploaded_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const docs = await Promise.all(
    (data ?? []).map(async (doc: { id: string; filename: string; storage_path: string; file_size: number; uploaded_at: string }) => {
      const { data: signed } = await db().storage
        .from(BUCKET)
        .createSignedUrl(doc.storage_path, SIGNED_URL_EXPIRY);
      return { ...doc, url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ docs });
}

export async function DELETE(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: doc, error: findErr } = await db()
    .from("manager_uploads")
    .select("id, storage_path")
    .eq("id", id)
    .eq("user_email", user.email)
    .single();

  if (findErr || !doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db().storage.from(BUCKET).remove([doc.storage_path]);
  await db().from("manager_uploads").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
