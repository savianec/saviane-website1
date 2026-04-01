import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { FlowButton } from "@/components/ui/flow-button";
import { Container } from "@/components/site/container";
import { HeroWebGLBackground } from "@/components/marketing/hero-webgl-background";
import { HeroGlobeVisual } from "@/components/marketing/hero-globe-visual";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <HeroWebGLBackground />
      {/* Readability scrim: site background into transparent */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-br from-background via-background/85 to-background/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.1] [background-image:radial-gradient(circle_at_1px_1px,rgba(184,168,130,0.35)_1px,transparent_0)] [background-size:28px_28px]"
        aria-hidden
      />

      <Container className="relative z-10 grid items-start gap-10 py-14 md:grid-cols-2 md:gap-12 md:py-16 lg:py-20">
        <div className="max-w-xl">
          <p className="text-primary mb-4 text-sm font-medium tracking-wide uppercase">
            Web design · AI automation · Social media content, made easy
          </p>
          <h1 className="font-display text-foreground text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            Design + automation at web scale
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed italic">
            Forward thinking. Ethically built. Precisely delivered.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/services" className={cn(buttonVariants({ size: "lg" }))}>
              View services
            </Link>
            <FlowButton href="/contact" text="Start a project" />
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Typical kickoff: 1-week discovery, then phased delivery with weekly
            demos.
          </p>
        </div>
        <HeroGlobeVisual />
      </Container>
    </section>
  );
}
