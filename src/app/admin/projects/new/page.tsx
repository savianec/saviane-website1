import { redirect } from "next/navigation";
import { AdminNewProjectForm } from "@/components/admin/admin-new-project-form";
import { requireAdminSession } from "@/lib/admin/session";

export const metadata = {
  title: "New project · Admin",
  description: "Create a client portal project",
};

export default async function AdminNewProjectPage() {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/admin/login");
  }

  return <AdminNewProjectForm />;
}
