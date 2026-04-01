import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { caseStudies } from "@/lib/content/work";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";

export function WorkSection() {
  const featured = caseStudies.slice(0, 6);
  return (
    <Section className="bg-card/30" id="work">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-foreground text-3xl tracking-tight md:text-4xl">
            Selected work
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-lg">
            Recent projects where design, engineering, and operations lined up.
          </p>
        </div>
        <Link href="/work" className={buttonVariants({ variant: "outline" })}>
          View all case studies
        </Link>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((c) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            className="group border-border bg-card hover:border-primary/25 block overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={c.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-5">
              <Badge variant="secondary" className="mb-2 text-[0.65rem] uppercase">
                {c.industry}
              </Badge>
              <h3 className="font-display text-foreground group-hover:text-primary text-lg tracking-tight transition-colors">
                {c.title}
              </h3>
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                {c.teaser}
              </p>
              <span
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-primary mt-3 inline-flex h-auto p-0"
                )}
              >
                View case study →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
