import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen admin-shell">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
