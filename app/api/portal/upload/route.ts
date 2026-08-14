import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const token = formData.get("token") as string | null;

    if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });
    if (!file) return NextResponse.json({ error: "missing file" }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${token}/${Date.now()}-${safeFilename}`;

    const { error: storageError } = await supabase.storage
      .from("portal-uploads")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (storageError) {
      console.error("[portal/upload] Storage error:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    const { data: row, error: dbError } = await supabase
      .from("portal_documents")
      .insert({
        token,
        filename: file.name,
        file_size: file.size,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[portal/upload] DB error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(row);
  } catch (e) {
    console.error("[portal/upload] Caught error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
