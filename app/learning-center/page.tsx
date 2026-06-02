import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, BORDER, BG_CARD, VIOLET } from "@/lib/constants";

export const metadata = {
  title: "Learning Center — Alpine Due Diligence",
  description: "Glossary of operational due diligence terms and institutional investment definitions.",
};

export default function LearningCenterPage() {
  return (
    <SubpageLayout>
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-12">
            <p
              className="font-mono text-[11px] uppercase mb-3"
              style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
            >
              Alpine Space · Learning Center
            </p>
            <h1
              className="font-heading mb-4"
              style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: INK }}
            >
              Learning Center
            </h1>
            <p className="font-body max-w-xl" style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: MUTED }}>
              Glossary of operational due diligence terms, institutional definitions, and industry frameworks.
            </p>
          </div>

          {/* Placeholder */}
          <div
            className="rounded-panel p-10 flex flex-col items-center text-center"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
              Coming soon
            </p>
            <h2 className="font-heading mb-3" style={{ fontSize: "1.25rem", fontWeight: 700, color: INK }}>
              Glossary & Definitions
            </h2>
            <p className="font-body text-[14px] max-w-md" style={{ color: MUTED, lineHeight: 1.6 }}>
              We&apos;re building a comprehensive glossary of ODD terms, regulatory definitions, and institutional investment concepts. Check back soon.
            </p>
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
