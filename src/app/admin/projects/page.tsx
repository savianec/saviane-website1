import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminProjectsList } from "@/components/admin/admin-projects-list";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import {
  normalizeAdminProjectRow,
  type AdminProjectRow,
} from "@/components/admin/admin-project-types";
import { ADMIN_PROJECT_EMBED_SELECT } from "@/lib/admin/admin-project-select";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Projects · Admin",
  description: "Manage client portal projects",
};

export default async function AdminProjectsPage() {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/admin/login");
  }

  let projects: AdminProjectRow[] = [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
      .select(ADMIN_PROJECT_EMBED_SELECT)
      .order("last_update", { ascending: false });

    if (!error && data) {
      projects = data.map((r) => normalizeAdminProjectRow(r));
    }
  } catch {
    projects = [];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Client projects
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create projects, reassign clients on the edit screen, and update
            portal fields.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className={cn(buttonVariants({ variant: "default" }), "shrink-0")}
        >
          New project
        </Link>
      </div>

      <AdminProjectsList projects={projects} />

      <p className="text-muted-foreground text-sm">
        <Link href="/admin" className="text-primary hover:underline">
          ← Back to provision
        </Link>
      </p>
    </div>
  );
}
