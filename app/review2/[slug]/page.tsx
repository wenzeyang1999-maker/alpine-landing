import { Suspense } from "react";
import Review2Page from "@/components/Review2Page";
import DemoAccessGate from "@/components/DemoAccessGate";

export default function Page() {
  return (
    <DemoAccessGate>
      <Suspense>
        <Review2Page />
      </Suspense>
    </DemoAccessGate>
  );
}
