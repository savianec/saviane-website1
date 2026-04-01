import Link from "next/link";
import { Container } from "@/components/site/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { listProjectsForClient } from "@/lib/portal/data";
import { getDashboardContext } from "@/lib/portal/session";

const statusLabel: Record<string, string> = {
  discovery: "Discovery",
  design: "Design",
  development: "Development",
  review: "Review",
  delivered: "Delivered",
};

export default async function ProjectsListPage() {
  const { supabase, profile } = await getDashboardContext();
  const projects = await listProjectsForClient(supabase, profile.client_id);

  return (
    <div className="flex-1 py-8">
      <Container>
        <h1 className="font-display text-3xl tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm">
          All engagements in one place. Status reflects our internal workflow
          columns.
        </p>
        <div className="border-border mt-8 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-[140px]">Progress</TableHead>
                <TableHead className="hidden md:table-cell">Lead</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center text-sm">
                    No projects yet.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        href={`/app/projects/${p.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="text-muted-foreground text-xs">
                        Updated {p.lastUpdate}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{statusLabel[p.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={p.progress} className="h-2" />
                      <span className="text-muted-foreground text-xs">
                        {p.progress}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                      {p.teamLead}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/app/projects/${p.id}`}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Open
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </div>
  );
}
