import Link from "next/link";
import { Bot, LayoutTemplate, Video } from "lucide-react";
import { Section } from "@/components/site/section";
import { FlippingCard } from "@/components/ui/flipping-card";
import { services, type Service } from "@/lib/content/services";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  layout: LayoutTemplate,
  bot: Bot,
  video: Video,
};

const CARD_HEIGHT = 400;

function ServiceCardFront({ service }: { service: Service }) {
  const Icon = icons[service.icon] ?? LayoutTemplate;
  return (
    <div className="flex h-full flex-col p-5">
      <div className="bg-primary/10 text-primary mb-4 inline-flex size-12 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-6" aria-hidden />
      </div>
      <h3 className="font-display text-foreground text-lg leading-snug tracking-tight">
        {service.title}
      </h3>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {service.short}
      </p>
      <p className="text-muted-foreground mt-auto pt-4 text-xs">
        Hover or focus to see how we help
      </p>
    </div>
  );
}

function ServiceCardBack({ service }: { service: Service }) {
  return (
    <div className="flex h-full flex-col p-6">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {service.solution}
      </p>
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Link
          href={`/services/${service.slug}`}
          className={cn(buttonVariants({ size: "default" }), "w-full sm:w-auto")}
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <Section id="services" className="pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-foreground text-3xl tracking-tight md:text-4xl">
          Our services
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Everything you need to modernize your digital presence, without the
          agency theater.
        </p>
      </div>
      <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.slug}
            className="flex min-h-0 w-full items-stretch justify-center"
          >
            <FlippingCard
              className="w-full"
              height={CARD_HEIGHT}
              frontContent={<ServiceCardFront service={s} />}
              backContent={<ServiceCardBack service={s} />}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
