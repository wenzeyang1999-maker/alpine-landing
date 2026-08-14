import AllianzView from "./AllianzView";

export const metadata = {
  title: "The Allianz Structured Alpha Case — Alpine Due Diligence",
  description:
    "How altered risk reports hid the portfolios investors actually owned. A structured ODD analysis of risk report integrity, hedge verification, and data governance, drawn solely from the public SEC and DOJ record (File No. 3-20855).",
  robots: { index: true, follow: true },
};

export default function AllianzPage() {
  return <AllianzView />;
}
