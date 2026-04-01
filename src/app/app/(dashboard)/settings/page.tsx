import { Container } from "@/components/site/container";
import { getDashboardContext } from "@/lib/portal/session";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const { profile, client } = await getDashboardContext();
  const prefs = profile.notification_prefs as {
    project_updates?: boolean;
    invoice_reminders?: boolean;
    marketing_digest?: boolean;
  };

  return (
    <div className="flex-1 py-8">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Profile and notification preferences are saved to your account.
        </p>

        <SettingsForm
          displayName={profile.display_name}
          email={profile.email ?? ""}
          phoneLabel={profile.phone?.trim() ? profile.phone : "-"}
          companyLabel={client?.company ?? "-"}
          prefs={prefs}
        />
      </Container>
    </div>
  );
}
