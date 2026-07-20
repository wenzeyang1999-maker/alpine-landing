import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, SUBTLE, BORDER, BG_CARD, VIOLET } from "@/lib/constants";
import { PUBLICATIONS } from "@/lib/publications";

export const metadata = {
  title: "Publications — Alpine Due Diligence",
  description: "Whitepapers, case studies, and research from Alpine's operational due diligence team.",
};


export default function PublicationsPage() {
  return (
    <SubpageLayout>
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-4xl px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <p
              className="font-mono text-[11px] uppercase mb-3"
              style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
            >
              Alpine Space · Publications
            </p>
            <h1
              className="font-heading mb-4"
              style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: INK }}
            >
              Research & Publications
            </h1>
            <p className="font-body max-w-xl" style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: MUTED }}>
              Whitepapers, case studies, and institutional research from Alpine&apos;s operational due diligence team.
            </p>
          </div>

          {/* Publication cards */}
          <div className="flex flex-col gap-5">
            {PUBLICATIONS.map((pub) => (
              <div
                key={pub.title}
                className="rounded-panel p-6 flex flex-col sm:flex-row sm:items-start gap-5"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="inline-block font-mono text-[10px] uppercase px-2 py-1 rounded-full"
                      style={{ background: `${VIOLET}15`, color: VIOLET, fontWeight: 700, letterSpacing: "0.08em" }}
                    >
                      {pub.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase" style={{ color: SUBTLE, letterSpacing: "0.08em" }}>
                      {pub.date}
                    </span>
                  </div>
                  <h2
                    className="font-heading mb-2"
                    style={{ fontSize: "1.125rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}
                  >
                    {pub.title}
                  </h2>
                  <p className="font-body text-[14px]" style={{ color: MUTED, lineHeight: 1.6 }}>
                    {pub.description}
                  </p>
                </div>
                <div className="shrink-0 sm:pt-1">
                  {pub.available ? (
                    pub.external ? (
                      <a
                        href={pub.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-btn px-4 py-2.5 font-body text-[13px] hover:opacity-90 transition-opacity"
                        style={{ background: INK, color: "#fff", fontWeight: 600 }}
                      >
                        {pub.cta}
                      </a>
                    ) : (
                    <Link
                      href={pub.href}
                      className="inline-flex items-center rounded-btn px-4 py-2.5 font-body text-[13px] hover:opacity-90 transition-opacity"
                      style={{ background: INK, color: "#fff", fontWeight: 600 }}
                    >
                      {pub.cta}
                    </Link>
                    )
                  ) : (
                    <span
                      className="inline-flex items-center rounded-btn px-4 py-2.5 font-body text-[13px]"
                      style={{ border: `1px solid ${BORDER}`, color: SUBTLE, fontWeight: 500, cursor: "default" }}
                    >
                      {pub.cta}
                    </span>
                  )
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
