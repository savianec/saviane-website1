import { notFound, redirect } from "next/navigation";
import { AdminEditProjectForm } from "@/components/admin/admin-edit-project-form";
import {
  normalizeAdminProjectRow,
  type AdminProjectRow,
} from "@/components/admin/admin-project-types";
import { ADMIN_PROJECT_EMBED_SELECT } from "@/lib/admin/admin-project-select";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPostgresUuid } from "@/lib/validation/postgres-uuid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Edit project · Admin`,
    description: `Admin edit project ${id}`,
  };
}

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/admin/login");
  }

  const { id } = await params;
  if (!isPostgresUuid(id)) {
    notFound();
  }

  let row: AdminProjectRow | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
      .select(ADMIN_PROJECT_EMBED_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      row = normalizeAdminProjectRow(data);
    }
  } catch {
    row = null;
  }

  if (!row) {
    notFound();
  }

  return <AdminEditProjectForm initial={row} />;
}
