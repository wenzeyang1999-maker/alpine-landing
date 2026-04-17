import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BG, BG_CARD, INK, SECONDARY, MUTED, SUBTLE, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";

type Post = {
  source: string;
  tone: string;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
};

const POSTS: Post[] = [
  {
    source: "Partnership Announcement",
    tone: "LinkedIn",
    title: "Emerging managers lose LP mandates not because of weak performance — but because their operations don't hold up",
    excerpt:
      "Acephalt powers deal intelligence for VC funds. Alpine powers LP readiness through institutional-grade operational due diligence. Together, we cover the full diligence stack for VCs — from sourcing to institutional close. Co-publishing: The LP Readiness Gap: Why Emerging VCs Stall at the Diligence Stage.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7450574333204135936/",
    image: "/blog-acephalt.jpg",
  },
  {
    source: "Founder Activity",
    tone: "LinkedIn",
    title: "What recent ODD failures reveal about allocator blind spots",
    excerpt:
      "Allen's recent activity focuses on how operational failures can compound into multi-billion-dollar investor and counterparty losses, and why allocators need to treat ODD as loss prevention rather than box-checking.",
    href: "https://www.linkedin.com/posts/kaishen-allen-zhang_operationalduediligence-institutionalinvesting-activity-7448450921853837312-iTKB",
  },
  {
    source: "Founder Activity",
    tone: "LinkedIn",
    title: "In ODD, who sent the document is not the same as who authored it",
    excerpt:
      "A recent post digs into chain-of-custody and source-of-truth questions, making the case that operational diligence should distinguish between distribution channels and true document ownership.",
    href: "https://www.linkedin.com/posts/kaishen-allen-zhang_duediligence-operationalduediligence-odd-activity-7447280645858353154-gssz",
  },
];

export default function Blog() {
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
            A mix of Allen&apos;s recent thinking and current market signals shaping operational due diligence in 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured post — large, left side */}
          {POSTS.slice(0, 1).map((post) => (
            <Link
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-card p-8 flex flex-col justify-between transition-shadow hover:shadow-md md:row-span-2"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div>
                {post.image && (
                  <div className="mb-5 rounded-md overflow-hidden" style={{ aspectRatio: "16/5" }}>
                    <Image src={post.image} alt={post.title} width={800} height={250} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span
                    className="font-mono text-[10px] uppercase"
                    style={{ color: VIOLET, fontWeight: 500, letterSpacing: "0.08em" }}
                  >
                    {post.source}
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: SUBTLE, letterSpacing: "0.06em" }}>
                    {post.tone}
                  </span>
                </div>

                <h3
                  className="font-heading mb-4"
                  style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.03em", color: INK }}
                >
                  {post.title}
                </h3>

                <p
                  className="font-body"
                  style={{ fontSize: "15px", lineHeight: 1.7, color: SECONDARY, letterSpacing: LS_BODY }}
                >
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-8 inline-flex items-center gap-1.5 font-body text-[14px]" style={{ color: MUTED, fontWeight: 500 }}>
                Read more <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}

          {/* Secondary posts — stacked on right */}
          {POSTS.slice(1).map((post) => (
            <Link
              key={post.title}
              href={post.href}
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
                  {post.tone}
                </span>
              </div>

              <h3
                className="font-heading mb-2"
                style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.025em", color: INK }}
              >
                {post.title}
              </h3>

              <p
                className="font-body flex-1 line-clamp-3"
                style={{ fontSize: "13px", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}
              >
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
