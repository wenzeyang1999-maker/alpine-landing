import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

type BlogRow = typeof blogPosts.$inferSelect;

function toApi(row: BlogRow) {
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    excerpt: row.excerpt,
    source: row.source,
    og_image: row.ogImage,
    is_featured: row.isFeatured,
    is_visible: row.isVisible,
    published_at: row.publishedAt,
    created_at: row.createdAt,
  };
}

// Map incoming snake_case patch keys → Drizzle camelCase columns.
function toUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if ("url" in body) out.url = body.url;
  if ("title" in body) out.title = body.title;
  if ("excerpt" in body) out.excerpt = body.excerpt;
  if ("source" in body) out.source = body.source;
  if ("og_image" in body) out.ogImage = body.og_image;
  if ("is_featured" in body) out.isFeatured = body.is_featured;
  if ("is_visible" in body) out.isVisible = body.is_visible;
  if ("published_at" in body) out.publishedAt = body.published_at;
  return out;
}

function isAuthorized(req: NextRequest) {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("x-blog-secret") === secret;
}

// Admin: toggle visibility or update a post
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const [row] = await db.update(blogPosts).set(toUpdate(body)).where(eq(blogPosts.id, params.id)).returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(toApi(row));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// Admin: delete a post
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, params.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
