import Link from "next/link";
import { Section } from "@/components/site/section";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <Section className="pb-20 md:pb-28">
      <div className="from-primary/15 via-background to-background border-primary/20 relative overflow-hidden rounded-2xl border bg-gradient-to-br px-8 py-14 text-center md:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,var(--primary)_0%,transparent_50%)]" />
        <div className="relative">
          <h2 className="font-display text-foreground text-3xl tracking-tight md:text-4xl">
            Ready to transform how you ship?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Tell us what you are building. We will reply with a clear plan, not a
            generic capabilities deck.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
              Schedule a consultation
            </Link>
            <Link
              href="/services"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Explore services
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
