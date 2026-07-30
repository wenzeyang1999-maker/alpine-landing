import ChathamView from "./ChathamView";

export const metadata = {
  title: "The Chatham Asset Management Case — Alpine Due Diligence",
  description:
    "How internal bond trades raised prices, fund values, and fees. A structured ODD analysis of conflicted trading, NAV integrity, and fee diligence, drawn solely from the public SEC administrative record (File No. 3-21355).",
  robots: { index: true, follow: true },
};

export default function ChathamPage() {
  return <ChathamView />;
}
