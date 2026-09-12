import { DashboardShell } from "@/components/layout/dashboard-shell";
export default function POSLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
