import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getClientRow, getProfileRow } from "@/lib/portal/data";
import type { PortalClientRow, PortalProfileRow } from "@/lib/portal/types";

export type DashboardContext = {
  supabase: SupabaseClient;
  user: User;
  profile: PortalProfileRow;
  client: PortalClientRow | null;
};

export async function getDashboardContext(): Promise<DashboardContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/login");
  }

  const profile = await getProfileRow(supabase, user.id);
  if (!profile) {
    redirect("/app/setup");
  }

  const client = await getClientRow(supabase, profile.client_id);
  return { supabase, user, profile, client };
}
