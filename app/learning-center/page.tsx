import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, VIOLET } from "@/lib/constants";
import { GLOSSARY } from "@/lib/glossary";
import GlossaryExplorer from "@/components/learning/GlossaryExplorer";

const SITE = "https://alpinedd.com";

// JSON-LD DefinedTermSet so each definition is eligible for search rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "ODD Glossary — Alpine Due Diligence",
  url: `${SITE}/learning-center`,
  hasDefinedTerm: GLOSSARY.map((t) => ({
    "@type": "DefinedTerm",
    name: t.expansion ? `${t.term} (${t.expansion})` : t.term,
    termCode: t.term,
    description: t.meaning,
    url: `${SITE}/learning-center#${t.id}`,
  })),
};

export default function LearningCenterPage() {
  return (
    <SubpageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-3xl px-6 py-16">
          {/* Header */}
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
              Alpine Space · Learning Center
            </p>
            <h1 className="font-heading mb-4" style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: INK }}>
              ODD Glossary
            </h1>
            <p className="font-body max-w-xl" style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: MUTED }}>
              Plain-English definitions of the terms in an Alpine operational due
              diligence report — what each means, and why it matters in diligence.
            </p>
          </div>

          {/* Searchable, interlinked glossary (SSR-rendered list, hydrated for filtering) */}
          <GlossaryExplorer />
        </div>
      </div>
    </SubpageLayout>
  );
}
