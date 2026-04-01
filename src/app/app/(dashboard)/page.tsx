import Link from "next/link";
import { Container } from "@/components/site/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import {
  listAnnouncementsForClient,
  listInvoicesForClient,
  listProjectsForClient,
} from "@/lib/portal/data";
import { getDashboardContext } from "@/lib/portal/session";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const { supabase, profile, client } = await getDashboardContext();
  const clientId = profile.client_id;
  const projects = await listProjectsForClient(supabase, clientId);
  const invoices = await listInvoicesForClient(supabase, clientId);
  const announcements = await listAnnouncementsForClient(supabase, clientId);

  const active = projects.filter((p) => p.status !== "delivered");
  const pendingInv = invoices.filter((i) => i.status !== "paid");
  const welcomeName = client?.name ?? profile.display_name;

  return (
    <div className="flex-1 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="font-display text-3xl tracking-tight">
            Welcome back, {welcomeName}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Your projects, invoices, and updates for {client?.company ?? "your workspace"}.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Active projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl">{active.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Open invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl">{pendingInv.length}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {pendingInv.length
                  ? `Next due ${pendingInv[0]?.dueDate}`
                  : "All paid up"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl">
                {projects.filter((p) => p.status === "delivered").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/contact" className={cn(buttonVariants())}>
            New request
          </Link>
          <Link href="/app/projects" className={cn(buttonVariants({ variant: "outline" }))}>
            View projects
          </Link>
          <Link href="/app/invoices" className={cn(buttonVariants({ variant: "outline" }))}>
            Invoices
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg">Active projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {active.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active projects.</p>
              ) : (
                active.map((p) => (
                  <div
                    key={p.id}
                    className="border-border border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/app/projects/${p.id}`}
                        className="font-display hover:text-primary font-semibold"
                      >
                        {p.name}
                      </Link>
                      <Badge variant="secondary">{p.status}</Badge>
                    </div>
                    <Progress value={p.progress} className="mt-3 h-2" />
                    <p className="text-muted-foreground mt-2 text-xs">
                      Next: {p.nextMilestone} · Due {p.nextMilestoneDue}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-sm">No announcements yet.</p>
              ) : (
                announcements.map((a, i) => (
                  <div key={`${a.title}-${i}`}>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-muted-foreground text-sm">{a.body}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
