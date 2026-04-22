"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface WorkflowStep {
  id: string;
  label: string;
  status: "complete" | "active" | "pending";
  detail?: string;
}

interface WorkflowStepperProps {
  onNavigate: (id: string) => void;
  reviewData: any;
}

function deriveSteps(reviewData: any): WorkflowStep[] {
  const hasDocuments = (reviewData?.document_count ?? 0) > 0 || (reviewData?.odd_summary != null);
  const hasAnalysis = reviewData?.odd_summary != null;
  const hasVerification = reviewData?.verification_status === "completed" || reviewData?.odd_summary != null;
  const hasReport = reviewData?.report_status === "completed";

  // For the demo, Ridgeline has documents, analysis, and verification pre-seeded
  const steps: WorkflowStep[] = [
    {
      id: "collection",
      label: "Collection",
      status: hasDocuments ? "complete" : "active",
      detail: hasDocuments ? `${reviewData?.document_count ?? 14} docs` : "Request documents",
    },
    {
      id: "verification",
      label: "Verification",
      status: hasVerification ? "complete" : hasDocuments ? "active" : "pending",
      detail: hasVerification ? "Ready" : hasDocuments ? "Ready" : "Pending",
    },
    {
      id: "analysis",
      label: "Analysis",
      status: hasAnalysis ? "complete" : hasDocuments ? "active" : "pending",
      detail: hasAnalysis ? "Complete" : hasDocuments ? "Ready" : "Pending",
    },
    {
      id: "wf-call",
      label: "Call Prep",
      status: hasAnalysis ? "complete" : hasVerification ? "active" : "pending",
      detail: hasAnalysis ? "Ready" : hasVerification ? "In Progress" : "Pending",
    },
    {
      id: "report",
      label: "Report",
      status: hasReport ? "complete" : "active",
      detail: hasReport ? "Generated" : "Pending",
    },
  ];

  return steps;
}

function StepIcon({ status }: { status: WorkflowStep["status"] }) {
  if (status === "complete") {
    return (
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6l3 3 5-5" />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-6 h-6 rounded-full bg-alpine-violet/20 flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-alpine-violet animate-pulse" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-br-card border border-br flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-br-text-muted/40" />
    </div>
  );
}

export default function WorkflowStepper({ onNavigate, reviewData }: WorkflowStepperProps) {
  const steps = deriveSteps(reviewData);

  return (
    <div className="bg-br-card border border-br rounded-xl px-4 py-3 mb-4">
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => onNavigate(step.id)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
            >
              <StepIcon status={step.status} />
              <div className="min-w-0">
                <span className={`text-[12px] font-heading font-medium block truncate ${
                  step.status === "complete" ? "text-emerald-400"
                  : step.status === "active" ? "text-alpine-violet-light"
                  : "text-br-text-muted"
                }`}>
                  {step.label}
                </span>
                {step.detail && (
                  <span className="text-[10px] text-br-text-muted block truncate">{step.detail}</span>
                )}
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${
                step.status === "complete" ? "bg-emerald-500/30" : "bg-br-card-hover"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
