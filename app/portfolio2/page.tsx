import { Suspense } from "react";
import Portfolio2Page from "@/components/Portfolio2Page";
import DemoAccessGate from "@/components/DemoAccessGate";

export default function Page() {
  return (
    <DemoAccessGate>
      <Suspense>
        <Portfolio2Page />
      </Suspense>
    </DemoAccessGate>
  );
}
