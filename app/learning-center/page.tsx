import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, VIOLET } from "@/lib/constants";

export default function LearningCenterPage() {
  return (
    <SubpageLayout>
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="text-center px-6 py-32">
          <p
            className="font-mono text-[11px] uppercase mb-4"
            style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            Alpine Space · Learning Center
          </p>
          <h1
            className="font-heading mb-4"
            style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: INK }}
          >
            Coming Soon
          </h1>
          <p className="font-body" style={{ fontSize: "1rem", color: MUTED }}>
            This section is under construction. Check back soon.
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
