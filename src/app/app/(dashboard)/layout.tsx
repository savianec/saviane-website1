import { PortalShell } from "@/components/portal/portal-shell";
import { createClient } from "@/lib/supabase/server";
import {
  getClientRow,
  getProfileRow,
} from "@/lib/portal/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | undefined;
  let userEmail: string | undefined;
  let clientCompany: string | undefined;
  let billingCity: string | undefined;

  if (user) {
    userEmail = user.email ?? undefined;
    const profile = await getProfileRow(supabase, user.id);
    if (profile) {
      displayName = profile.display_name;
      const client = await getClientRow(supabase, profile.client_id);
      clientCompany = client?.company ?? undefined;
      billingCity = client?.billing_city ?? undefined;
    }
  }

  return (
    <PortalShell
      displayName={displayName}
      userEmail={userEmail}
      clientCompany={clientCompany}
      billingCity={billingCity}
    >
      {children}
    </PortalShell>
  );
}
