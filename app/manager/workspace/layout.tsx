import { redirect } from "next/navigation";
import { getCurrentManager } from "@/lib/manager/access";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentManager();

  if (!user) {
    redirect("/manager/login");
  }

  if (!user.is_verified) {
    redirect("/manager/pending");
  }

  return <>{children}</>;
}
