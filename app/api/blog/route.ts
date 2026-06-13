import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

type BlogRow = typeof blogPosts.$inferSelect;

// Preserve the snake_case API shape that clients consume (Drizzle rows are camelCase).
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

function isAuthorized(req: NextRequest) {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("x-blog-secret") === secret;
}

// Public: visible posts only. Admin (with secret header): all posts.
export async function GET(req: NextRequest) {
  const admin = isAuthorized(req);

  try {
    const base = db.select().from(blogPosts);
    const rows = admin
      ? await base.orderBy(desc(blogPosts.isFeatured), desc(blogPosts.publishedAt))
      : await base.where(eq(blogPosts.isVisible, true)).orderBy(desc(blogPosts.isFeatured), desc(blogPosts.publishedAt));
    return NextResponse.json(rows.map(toApi));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// Admin: create a new post
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { url, title, excerpt, source, og_image, is_featured, published_at } = body;

  if (!url || !title || !excerpt || !source) {
    return NextResponse.json({ error: "url, title, excerpt, source are required" }, { status: 400 });
  }

  try {
    const [row] = await db
      .insert(blogPosts)
      .values({
        url,
        title,
        excerpt,
        source,
        ogImage: og_image || null,
        isFeatured: !!is_featured,
        publishedAt: published_at || new Date().toISOString(),
      })
      .returning();
    return NextResponse.json(toApi(row), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
