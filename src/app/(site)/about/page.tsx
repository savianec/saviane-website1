import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { team } from "@/lib/content/team";
import { TestimonialCarousel } from "@/components/ui/profile-card-testimonial-carousel";

export const metadata = {
  title: "About",
  description:
    "saviane is a small senior team focused on design systems, Next.js delivery, and responsible automation.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Studio"
        title="Built for teams that ship"
        description={`We're young, energetic co-founders who work directly with our clients.

No bait-and-switch. We're across every web, AI and social media marketing development. You get the makers, not managers.`}
      />
      <Container className="space-y-16 py-14 md:py-20">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-foreground text-2xl tracking-tight">
              Operating principles
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Every engagement starts with measurable outcomes. We document
              decisions, show progress weekly, and leave you with systems, not
              dependency. Our stack bias is modern TypeScript, accessible UI, and
              infrastructure you can audit.
            </p>
            <ul className="text-muted-foreground mt-6 list-inside list-disc space-y-2 text-sm leading-relaxed">
              <li>Radical transparency on risk, scope, and trade-offs</li>
              <li>Accessibility and performance as release criteria</li>
              <li>Automation only with logging, evals, and rollback paths</li>
            </ul>
          </div>
          <div className="border-border bg-card/40 rounded-xl border p-6">
            <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              Values
            </h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-foreground font-medium">Trust</dt>
                <dd className="text-muted-foreground text-sm">
                  Clear contracts, honest timelines, and security-first defaults.
                </dd>
              </div>
              <div>
                <dt className="text-foreground font-medium">Craft</dt>
                <dd className="text-muted-foreground text-sm">
                  Typography, motion, and engineering detail that hold up under
                  real traffic.
                </dd>
              </div>
              <div>
                <dt className="text-foreground font-medium">Momentum</dt>
                <dd className="text-muted-foreground text-sm">
                  Small batches, frequent integration, and demos you can share
                  internally.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h2 className="font-display text-foreground text-2xl tracking-tight">
            Meet the team
          </h2>
          <div className="mt-8">
            <TestimonialCarousel
              items={team.map((m) => ({
                name: m.name,
                title: m.role,
                description: m.bio,
                imageUrl: m.image,
                githubUrl: m.githubUrl,
                twitterUrl: m.twitterUrl,
                youtubeUrl: m.youtubeUrl,
                linkedinUrl: m.linkedinUrl,
              }))}
            />
          </div>
        </section>
      </Container>
    </>
  );
}
