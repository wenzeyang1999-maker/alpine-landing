import GreensillView from "./GreensillView";

export const metadata = {
  title: "The Credit Suisse Greensill Case — Alpine Due Diligence",
  description:
    "When the story was more confident than the records. How Credit Suisse's Greensill-linked supply-chain-finance funds — about USD 10 billion of client exposure — failed once the assets could not be verified at the claim level. A structured ODD analysis of asset verification, originator risk, insurance diligence, and governance.",
  robots: { index: true, follow: true },
};

export default function GreensillPage() {
  return <GreensillView />;
}
