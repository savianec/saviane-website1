import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ProvisionClientDashboard,
  type AdminClientRow,
} from "@/components/admin/provision-client-form";
import { redirect } from "next/navigation";

export default async function AdminHomePage() {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/admin/login");
  }

  let initialClients: AdminClientRow[] = [];

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("clients")
      .select(
        `
        id,
        name,
        company,
        created_at,
        profiles ( id, email, display_name, phone )
      `
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      initialClients = data as AdminClientRow[];
    }
  } catch {
    initialClients = [];
  }

  return <ProvisionClientDashboard initialClients={initialClients} />;
}
