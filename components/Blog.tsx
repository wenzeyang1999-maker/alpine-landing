export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BG, BG_CARD, INK, SECONDARY, MUTED, SUBTLE, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";

type Post = {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  source: string;
  og_image: string | null;
  is_featured: boolean;
  published_at: string;
};

async function getPosts(): Promise<Post[]> {
  try {
    const rows = await db
      .select({
        id: blogPosts.id,
        url: blogPosts.url,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        source: blogPosts.source,
        ogImage: blogPosts.ogImage,
        isFeatured: blogPosts.isFeatured,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.isVisible, true))
      .orderBy(desc(blogPosts.isFeatured), desc(blogPosts.publishedAt))
      .limit(6);

    return rows.map((r) => ({
      id: r.id,
      url: r.url,
      title: r.title,
      excerpt: r.excerpt,
      source: r.source,
      og_image: r.ogImage,
      is_featured: r.isFeatured,
      published_at: r.publishedAt,
    }));
  } catch {
    return [];
  }
}

export default async function Blog() {
  const posts = await getPosts();
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="py-20 px-6" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-10">
          <p className="font-sans text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
            Blog
          </p>
          <h2 className="font-heading mb-3" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Founder commentary, grounded in live ODD issues.
          </h2>
          <p className="font-body text-[15px]" style={{ color: SECONDARY, lineHeight: 1.65, letterSpacing: LS_BODY }}>
            A mix of Alpine Team&apos;s recent thinking and current market signals shaping operational due diligence. Combining Alpine&apos;s research, team insights, and evolving market signals across the operational due diligence landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured post — large, left side */}
          <Link
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-card p-8 flex flex-col justify-between transition-shadow hover:shadow-md md:row-span-2"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <div>
              {featured.og_image && (
                <div className="mb-5 rounded-md overflow-hidden" style={{ aspectRatio: "16/5" }}>
                  <Image src={featured.og_image} alt={featured.title} width={800} height={250} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase" style={{ color: VIOLET, fontWeight: 500, letterSpacing: "0.08em" }}>
                  {featured.source}
                </span>
                <span className="font-mono text-[10px]" style={{ color: SUBTLE, letterSpacing: "0.06em" }}>
                  LinkedIn
                </span>
              </div>
              <h3 className="font-heading mb-4" style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em", color: INK }}>
                {featured.title}
              </h3>
              <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.7, color: SECONDARY, letterSpacing: LS_BODY }}>
                {featured.excerpt}
              </p>
            </div>
            <div className="mt-8 inline-flex items-center gap-1.5 font-body text-[14px]" style={{ color: MUTED, fontWeight: 500 }}>
              Read more <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Secondary posts — stacked on right */}
          {rest.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-card p-6 flex flex-col transition-shadow hover:shadow-md"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span
                  className="font-mono text-[10px] uppercase"
                  style={{ color: post.source === "Market Watch" ? GREEN : VIOLET, fontWeight: 500, letterSpacing: "0.08em" }}
                >
                  {post.source}
                </span>
                <span className="font-mono text-[10px]" style={{ color: SUBTLE, letterSpacing: "0.06em" }}>
                  LinkedIn
                </span>
              </div>
              <h3 className="font-heading mb-2" style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.025em", color: INK }}>
                {post.title}
              </h3>
              <p className="font-body flex-1 line-clamp-3" style={{ fontSize: "13px", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}>
                {post.excerpt}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px]" style={{ color: MUTED, fontWeight: 500 }}>
                Read more <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
