import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ODD Glossary — Alpine Due Diligence Learning Center",
  description:
    "Searchable glossary of operational due diligence terms, alternative fund management definitions, and institutional investment concepts — AIF, AIFMD, DDQ, NAV, MNPI, LPA, and more.",
  keywords: [
    "ODD glossary",
    "operational due diligence terms",
    "alternative investment fund definitions",
    "DDQ meaning",
    "NAV definition",
    "AIFMD",
    "hedge fund terminology",
    "institutional investment glossary",
  ],
};

export default function LearningCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
