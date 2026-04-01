import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { HowWeWorkTimeline } from "@/components/site/how-we-work-timeline";
import { getServiceBySlug, services } from "@/lib/content/services";
import { caseStudies } from "@/lib/content/work";
import { Separator } from "@/components/ui/separator";
import { FlowButton } from "@/components/ui/flow-button";
import { AiUseCasesSection } from "@/components/site/ai-use-cases-section";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  return {
    title: s?.title ?? "Service",
    description: s?.short,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = caseStudies.filter((c) =>
    c.serviceTags.includes(service.slug)
  );

  return (
    <>
      <PageHeader
        title={service.title}
        description={service.short}
        titleMedia={
          service.slug === "ai-automation" ? (
            <CpuArchitecture
              className="aspect-[2/1] w-full max-w-[280px]"
              text="AI"
            />
          ) : undefined
        }
      />
      <Container className="space-y-16 py-14 md:py-20">
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-foreground text-2xl tracking-tight">
              The problem
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {service.problem}
            </p>
          </div>
          <div>
            <h2 className="font-display text-foreground text-2xl tracking-tight">
              Our approach
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {service.solution}
            </p>
          </div>
        </section>

        {service.slug === "ai-automation" ? <AiUseCasesSection /> : null}

        <Separator />

        <HowWeWorkTimeline steps={service.process} subtitle={service.short} />

        {related.length > 0 ? (
          <>
            <Separator />
            <section>
              <h2 className="font-display text-foreground text-2xl tracking-tight">
                Representative outcomes
              </h2>
              <ul className="text-muted-foreground mt-6 list-inside list-disc space-y-2 text-sm leading-relaxed">
                {related.map((c) => (
                  <li key={c.slug}>
                    <span className="text-foreground font-medium">{c.title}</span>
                    <span>, {c.industry}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        <div className="border-border bg-card/50 flex flex-col items-start justify-between gap-4 rounded-xl border p-6 md:flex-row md:items-center">
          <div>
            <p className="text-foreground font-medium">
              Download: {service.resourceLabel}
            </p>
            <p className="text-muted-foreground text-sm">
              Placeholder, asset delivery hooks up once your CMS is connected.
            </p>
          </div>
          <FlowButton href="/contact" text="Start your project" />
        </div>
      </Container>
    </>
  );
}
