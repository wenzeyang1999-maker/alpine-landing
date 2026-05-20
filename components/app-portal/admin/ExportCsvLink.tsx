import { VIOLET } from "@/lib/app-portal/constants";

export default function ExportCsvLink({ table }: { table: "users" | "subscribers" | "customers" | "requests" }) {
  return (
    <a
      href={`/api/app-portal/export?table=${table}`}
      className="font-mono text-[11px] uppercase tracking-widest"
      style={{ color: VIOLET }}
      download
    >
      Export CSV →
    </a>
  );
}
