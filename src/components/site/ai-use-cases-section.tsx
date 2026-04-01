"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import HolographicCard from "@/components/ui/holographic-card";
import {
  aiUseCaseTabs,
  isLegalUseCaseTab,
} from "@/lib/content/ai-use-cases";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

function UseCaseCardGrid({
  tabId,
  cards,
}: {
  tabId: string;
  cards: { num: string; name: string; description: string; tag: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <HolographicCard
          key={`${tabId}-${card.num}`}
          className="ring-1 ring-border/80"
        >
          <Card className="flex h-full flex-col border-0 bg-transparent shadow-none ring-0">
            <CardHeader className="space-y-2">
              <p className="text-primary/70 font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase">
                {card.num}
              </p>
              <CardTitle className="font-display text-foreground text-base leading-snug">
                {card.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 pt-0">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {card.description}
              </p>
            </CardContent>
            <CardFooter className="mt-auto border-0 bg-transparent p-4 pt-0">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary"
              >
                {card.tag}
              </Badge>
            </CardFooter>
          </Card>
        </HolographicCard>
      ))}
    </div>
  );
}

export function AiUseCasesSection() {
  const baseId = useId();
  const legalMainTab = aiUseCaseTabs.find(isLegalUseCaseTab);
  const [activeId, setActiveId] = useState(aiUseCaseTabs[0]!.id);
  const [legalNestedId, setLegalNestedId] = useState(
    () => legalMainTab?.nestedTabs[0]?.id ?? "legal-documents"
  );

  return (
    <section
      className="border-border relative overflow-hidden rounded-2xl border bg-card/40 p-6 md:p-10"
      aria-labelledby={`${baseId}-heading`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.06) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 -right-24 size-[min(100vw,28rem)] rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 size-[min(100vw,22rem)] rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <div className="relative z-[1] space-y-8">
        <header className="space-y-3">
          <p className="text-primary flex items-center gap-2.5 text-xs font-medium tracking-[0.22em] uppercase">
            <span className="bg-primary h-px w-7 shrink-0" aria-hidden />
            AI-Powered Solutions
          </p>
          <h2
            id={`${baseId}-heading`}
            className="font-display text-foreground text-3xl tracking-tight md:text-4xl"
          >
            Automate the work.
            <br />
            <span className="text-primary">Scale the results.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
            Purpose-built AI agents and automation systems for businesses ready
            to move faster, without adding headcount.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Use case categories"
          className="flex flex-wrap gap-1"
        >
          {aiUseCaseTabs.map((tab) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-medium tracking-wide transition-colors",
                  selected
                    ? "border-primary/35 bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {aiUseCaseTabs.map((tab) => {
          if (isLegalUseCaseTab(tab)) {
            const nestedActive =
              tab.nestedTabs.find((t) => t.id === legalNestedId) ??
              tab.nestedTabs[0]!;
            return (
              <div
                key={tab.id}
                id={`${baseId}-panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${tab.id}`}
                hidden={tab.id !== activeId}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <p className="text-primary flex items-center gap-2.5 text-xs font-medium tracking-[0.22em] uppercase">
                    <span className="bg-primary h-px w-7 shrink-0" aria-hidden />
                    {tab.intro.eyebrow}
                  </p>
                  <h3 className="font-display text-foreground text-2xl tracking-tight md:text-3xl">
                    {tab.intro.titleLine1}
                    <br />
                    <span className="text-primary">{tab.intro.titleLine2}</span>
                  </h3>
                  <p className="text-muted-foreground max-w-xl text-sm leading-relaxed md:text-base">
                    {tab.intro.subtitle}
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Legal use case categories"
                  className="flex flex-wrap gap-1"
                >
                  {tab.nestedTabs.map((nt) => {
                    const subSelected = nt.id === nestedActive.id;
                    return (
                      <button
                        key={nt.id}
                        type="button"
                        role="tab"
                        aria-selected={subSelected}
                        tabIndex={subSelected ? 0 : -1}
                        onClick={() => setLegalNestedId(nt.id)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-[0.7rem] font-medium tracking-wide transition-colors md:px-4 md:py-2 md:text-xs",
                          subSelected
                            ? "border-primary/35 bg-primary/10 text-primary"
                            : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        {nt.label}
                      </button>
                    );
                  })}
                </div>

                <UseCaseCardGrid
                  tabId={nestedActive.id}
                  cards={nestedActive.cards}
                />
              </div>
            );
          }

          return (
            <div
              key={tab.id}
              id={`${baseId}-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              hidden={tab.id !== activeId}
            >
              <UseCaseCardGrid tabId={tab.id} cards={tab.cards} />
            </div>
          );
        })}

        <Separator className="bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t see your use case?{" "}
            <strong className="text-foreground font-medium">
              We build custom systems too.
            </strong>
          </p>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Book a discovery call ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
