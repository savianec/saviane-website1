import Link from "next/link";
import { SavianeLogo } from "@/components/site/logo";

export const metadata = {
  title: "Portal configuration",
  description: "Supabase environment variables are not set.",
};

export default function PortalMisconfiguredPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="text-foreground mb-10 flex items-center gap-2 text-lg font-semibold"
      >
        <SavianeLogo showWordmark markSize={28} />
      </Link>
      <div className="border-border bg-card w-full max-w-lg rounded-xl border p-8 shadow-sm">
        <h1 className="font-display text-2xl tracking-tight">Supabase not configured</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          The client portal needs your project URL and anon key. Add them locally, then restart the dev
          server.
        </p>
        <ol className="text-muted-foreground mt-6 list-decimal space-y-2 pl-5 text-sm">
          <li>
            In <code className="text-foreground">apps/web</code>, copy{" "}
            <code className="text-foreground">.env.example</code> to{" "}
            <code className="text-foreground">.env.local</code>.
          </li>
          <li>
            Set <code className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> from{" "}
            <a
              href="https://supabase.com/dashboard/project/_/settings/api"
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Supabase → Project Settings → API
            </a>
            .
          </li>
          <li>Stop and run <code className="text-foreground">npm run dev</code> again.</li>
        </ol>
        <p className="text-muted-foreground mt-8 text-center text-xs">
          <Link href="/" className="text-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
