export function PlaceholderTab({ label, detail }: { label: string; detail?: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 rounded-full bg-br-card border border-br flex items-center justify-center mx-auto mb-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-br-text-muted">
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M7 7h6M7 10h6M7 13h4" />
        </svg>
      </div>
      <p className="text-[14px] font-heading font-semibold text-br-text-primary capitalize">{label.replace(/-/g, " ")}</p>
      <p className="text-[12px] text-br-text-muted mt-1">{detail || "This section uses demo data for the presentation."}</p>
    </div>
  );
}
