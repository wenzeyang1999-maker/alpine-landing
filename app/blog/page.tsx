import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import SubpageLayout from "@/components/SubpageLayout";
import { supabase } from "@/lib/supabase";
import { INK, SECONDARY, MUTED, SUBTLE, VIOLET, GREEN, BORDER, BG_CARD, LS_BODY } from "@/lib/constants";

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
  noStore();
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, url, title, excerpt, source, og_image, is_featured, published_at")
      .eq("is_visible", true)
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false });

    if (error || !data?.length) return [];
    return data;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <SubpageLayout>
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-5xl px-6 py-16">

          {/* Header */}
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
              Alpine Space · Blog
            </p>
            <h1 className="font-heading mb-3" style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: INK }}>
              Founder commentary, grounded in live ODD issues.
            </h1>
            <p className="font-body" style={{ fontSize: "1rem", lineHeight: 1.65, color: MUTED }}>
              Alpine team&apos;s recent thinking and market signals shaping operational due diligence.
            </p>
          </div>

          {/* Empty state */}
          {posts.length === 0 && (
            <p className="font-body text-[15px]" style={{ color: MUTED }}>
              No posts yet.
            </p>
          )}

          {/* Posts grid */}
          {posts.length > 0 && (
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
                  <h2 className="font-heading mb-4" style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em", color: INK }}>
                    {featured.title}
                  </h2>
                  <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.7, color: SECONDARY, letterSpacing: LS_BODY }}>
                    {featured.excerpt}
                  </p>
                </div>
                <div className="mt-8 inline-flex items-center gap-1.5 font-body text-[14px]" style={{ color: MUTED, fontWeight: 500 }}>
                  Read more <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>

              {/* Secondary posts */}
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-card overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                  style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                >
                  {post.og_image && (
                    <div className="w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
                      <Image src={post.og_image} alt={post.title} width={600} height={263} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`flex flex-col flex-1 p-6`}>
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
                  <h2 className="font-heading mb-2" style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.025em", color: INK }}>
                    {post.title}
                  </h2>
                  <p className="font-body flex-1 line-clamp-3" style={{ fontSize: "13px", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px]" style={{ color: MUTED, fontWeight: 500 }}>
                    Read more <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </SubpageLayout>
  );
}
