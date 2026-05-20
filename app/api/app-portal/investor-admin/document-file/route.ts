import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export const runtime = "nodejs";

const STORAGE_BUCKET = "portal-uploads";

// GET — analyst-gated fetch of an investor-uploaded file for review. ?id=
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const { data: doc } = await supabase
    .from("investor_documents")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!doc?.storage_path) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(doc.storage_path, 300);

  if (error || !data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.redirect(data.signedUrl);
}
