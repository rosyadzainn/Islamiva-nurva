import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/admin-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--islametra-bg-1)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}
