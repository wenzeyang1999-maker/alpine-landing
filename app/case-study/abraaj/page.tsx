import AbraajView from "./AbraajView";

export const metadata = {
  title: "The Abraaj Case — Alpine Due Diligence",
  description:
    "Where did the money go? How Abraaj Group, a USD 13 billion impact private equity firm, collapsed once investors could no longer verify the cash. A structured ODD analysis of commingling, governance concentration, valuation oversight, and key person control.",
  robots: { index: true, follow: true },
};

export default function AbraajPage() {
  return <AbraajView />;
}
