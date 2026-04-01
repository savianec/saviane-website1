import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProjectDetailTabs } from "@/components/portal/project-detail-tabs";
import { getProjectForClient } from "@/lib/portal/data";
import { getDashboardContext } from "@/lib/portal/session";

const statusLabel: Record<string, string> = {
  discovery: "Discovery",
  design: "Design",
  development: "Development",
  review: "Review",
  delivered: "Delivered",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await getDashboardContext();
  const project = await getProjectForClient(supabase, profile.client_id, id);
  if (!project) notFound();

  return (
    <div className="flex-1 py-8">
      <Container>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/app/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {project.startDate} to {project.endDate}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{statusLabel[project.status]}</Badge>
            <span className="text-muted-foreground text-sm">
              Lead: {project.teamLead}
            </span>
          </div>
        </div>
        <div className="mt-6 max-w-md">
          <Progress value={project.progress} className="h-2" />
          <p className="text-muted-foreground mt-2 text-xs">
            {project.progress}% complete
          </p>
        </div>

        <ProjectDetailTabs project={project} />
      </Container>
    </div>
  );
}
