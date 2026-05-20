// Server component — reads searchParams synchronously so the print/no-print
// decision is made BEFORE the HTML is sent. This matters for headless Chrome
// PDF generation, which captures the page before client-side hydration runs.

import WhitepaperView from "./WhitepaperView";

type Search = { [key: string]: string | string[] | undefined };

export default function WhitepaperPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const isPrint = searchParams.print === "true";
  return <WhitepaperView isPrint={isPrint} />;
}
