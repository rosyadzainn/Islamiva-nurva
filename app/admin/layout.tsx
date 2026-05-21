import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--islametra-bg-1)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}
