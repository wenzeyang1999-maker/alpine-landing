import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  const { data, error } = await supabase
    .from("portal_documents")
    .select("id, filename, file_size, uploaded_at, storage_path")
    .eq("token", token)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("[portal/documents] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const { data: doc } = await supabase
    .from("portal_documents")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (doc?.storage_path) {
    await supabase.storage.from("portal-uploads").remove([doc.storage_path]);
  }

  const { error } = await supabase.from("portal_documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
