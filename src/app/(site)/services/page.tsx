import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { services } from "@/lib/content/services";
import { buttonVariants } from "@/lib/button-variants";
import HolographicCard from "@/components/ui/holographic-card";
import { AnimatedShaderBackground } from "@/components/ui/animated-shader-background";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Services",
  description:
    "Web design, AI automation, and social content, scoped for serious teams.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title="Services built for momentum"
        description="Pick a lane to see how we work end-to-end. Every engagement includes clear milestones, accessible delivery, and documentation your team can reuse."
      />
      <Container className="relative isolate overflow-hidden py-14 md:py-20">
        <AnimatedShaderBackground className="opacity-35 mix-blend-screen" />
        <div className="relative z-10 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <HolographicCard key={s.slug} className="ring-1 ring-border/80">
              <Card className="border-0 bg-transparent shadow-none ring-0 flex flex-col">
                <CardHeader>
                  <CardTitle className="font-display text-xl">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {s.short}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/services/${s.slug}`}
                    className={cn(buttonVariants({ variant: "secondary" }))}
                  >
                    View details
                  </Link>
                </CardFooter>
              </Card>
            </HolographicCard>
          ))}
        </div>
      </Container>
    </>
  );
}
