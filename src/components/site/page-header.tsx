import type { ReactNode } from "react";
import { Container } from "@/components/site/container";

export function PageHeader({
  eyebrow,
  title,
  description,
  titleMedia,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Renders to the right of the title on md+; stacks below on small screens. */
  titleMedia?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-card/30">
      <Container className="py-14 md:py-20">
        {eyebrow ? (
          <p className="text-primary mb-3 text-sm font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        {titleMedia ? (
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
            <h1 className="font-display text-foreground min-w-0 flex-1 text-4xl tracking-tight md:text-5xl">
              {title}
            </h1>
            <div className="shrink-0 md:max-w-[min(100%,280px)] md:pt-1">
              {titleMedia}
            </div>
          </div>
        ) : (
          <h1 className="font-display text-foreground text-4xl tracking-tight md:text-5xl">
            {title}
          </h1>
        )}
        {description ? (
          <p className="text-muted-foreground mt-4 max-w-2xl text-left text-lg leading-relaxed whitespace-pre-line">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
