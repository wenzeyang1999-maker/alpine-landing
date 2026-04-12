import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BG, BG_CARD, INK, SECONDARY, MUTED, SUBTLE, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";

type Post = {
  source: string;
  tone: string;
  title: string;
  excerpt: string;
  href: string;
};

const POSTS: Post[] = [
  {
    source: "Founder Activity",
    tone: "LinkedIn",
    title: "What recent ODD failures reveal about allocator blind spots",
    excerpt:
      "Allen's recent activity focuses on how operational failures can compound into multi-billion-dollar investor and counterparty losses, and why allocators need to treat ODD as loss prevention rather than box-checking.",
    href: "https://www.linkedin.com/in/kaishen-allen-zhang/",
  },
  {
    source: "Founder Activity",
    tone: "LinkedIn",
    title: "In ODD, who sent the document is not the same as who authored it",
    excerpt:
      "A recent post digs into chain-of-custody and source-of-truth questions, making the case that operational diligence should distinguish between distribution channels and true document ownership.",
    href: "https://www.linkedin.com/in/kaishen-allen-zhang/",
  },
  {
    source: "Market Watch",
    tone: "Industry",
    title: "The operational bar for allocators keeps getting higher",
    excerpt:
      "Industry commentary this month keeps pointing in the same direction: institutional infrastructure, service-provider quality, and repeatable controls are increasingly part of the allocation decision, not post-investment cleanup.",
    href: "https://www.aima.org/article/what-emerging-managers-get-wrong-when-launching-a-hedge-fund.html",
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
          <h2 className="font-heading mb-3" style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Founder commentary, grounded in live ODD issues.
          </h2>
          <p className="font-body text-[15px]" style={{ color: SECONDARY, lineHeight: 1.65, letterSpacing: LS_BODY }}>
            A mix of Allen&apos;s recent thinking and current market signals shaping operational due diligence in 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-card p-6 flex flex-col transition-shadow hover:shadow-md"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
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
                className="font-heading mb-3"
                style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.025em", color: INK }}
              >
                {post.title}
              </h3>

              <p
                className="font-body flex-1"
                style={{ fontSize: "13px", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}
              >
                {post.excerpt}
              </p>

              <div className="mt-6 inline-flex items-center gap-1.5 font-body text-[13px]" style={{ color: MUTED, fontWeight: 500 }}>
                Read more <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
