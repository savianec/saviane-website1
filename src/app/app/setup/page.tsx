import Link from "next/link";
import { redirect } from "next/navigation";
import { DEMO_CLIENT_ID } from "@/lib/portal/constants";
import { createClient } from "@/lib/supabase/server";

export default async function PortalSetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    redirect("/app");
  }

  const email = user.email ?? "you@company.com";
  const displayName =
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.trim()) ||
    email.split("@")[0] ||
    "Your Name";

  const sql = `insert into public.profiles (id, client_id, display_name, email)
values (
  '${user.id}',
  '${DEMO_CLIENT_ID}',
  '${displayName.replace(/'/g, "''")}',
  '${email.replace(/'/g, "''")}'
);`;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-6 text-center">
        <h1 className="font-display text-3xl tracking-tight">Finish account setup</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your account is signed in but is not linked to a client workspace yet. Link
          your Auth user to a client by inserting a row into{" "}
          <code className="text-foreground">public.profiles</code> (see below).
        </p>

        <div className="border-border bg-card text-left rounded-xl border p-6 text-sm">
          <p className="text-foreground font-medium">Your user id (already filled in)</p>
          <p className="text-muted-foreground mt-1 break-all font-mono text-xs">
            {user.id}
          </p>
        </div>

        <div className="border-border bg-card text-left rounded-xl border p-6 text-sm">
          <p className="text-foreground font-medium">
            SQL (run in Supabase → SQL Editor)
          </p>
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            Uses the demo seed client{" "}
            <code className="text-foreground">{DEMO_CLIENT_ID}</code> from your
            migration. If that client does not exist, run your portal migration/seed
            first.
          </p>
          <pre className="bg-muted text-foreground mt-3 overflow-x-auto rounded-lg p-3 text-xs">
            {sql}
          </pre>
        </div>

        <div className="border-border bg-muted/40 text-left rounded-xl border p-4 text-xs leading-relaxed">
          <p className="text-foreground font-medium">Other options</p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">New client:</strong> an admin can
              create the user + profile from{" "}
              <Link href="/admin" className="text-primary hover:underline">
                /admin
              </Link>{" "}
              (Provision) so you do not need SQL.
            </li>
            <li>
              <strong className="text-foreground">Wrong project?</strong> Confirm{" "}
              <code className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</code> in{" "}
              <code className="text-foreground">.env.local</code> matches the project
              where you run the SQL.
            </li>
          </ul>
        </div>

        <p className="text-muted-foreground text-xs">
          After the insert succeeds, open{" "}
          <Link href="/app" className="text-primary hover:underline">
            the dashboard
          </Link>{" "}
          again (refresh if needed).
        </p>
        <p>
          <Link href="/" className="text-primary text-sm hover:underline">
            ← Marketing site
          </Link>
        </p>
      </div>
    </div>
  );
}
