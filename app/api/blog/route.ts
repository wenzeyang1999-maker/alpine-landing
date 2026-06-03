import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isAuthorized(req: NextRequest) {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("x-blog-secret") === secret;
}

// Public: visible posts only. Admin (with secret header): all posts.
export async function GET(req: NextRequest) {
  const admin = isAuthorized(req);

  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (!admin) query = query.eq("is_visible", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Admin: create a new post
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { url, title, excerpt, source, og_image, is_featured, published_at } = body;

  if (!url || !title || !excerpt || !source) {
    return NextResponse.json({ error: "url, title, excerpt, source are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ url, title, excerpt, source, og_image: og_image || null, is_featured: !!is_featured, published_at: published_at || new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
