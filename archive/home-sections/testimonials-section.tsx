"use client";

import { Section } from "@/components/site/section";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/lib/content/testimonials";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-foreground text-3xl tracking-tight md:text-4xl">
          What clients say
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Direct feedback from product and marketing leaders we have shipped with.
        </p>
      </div>
      <div className="relative mx-auto mt-12 max-w-4xl px-10 md:px-14">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i} className="md:basis-1/1">
                <Card className="border-border/80 bg-card/60 border-l-primary border-l-4">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-primary mb-4 flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-foreground text-lg leading-relaxed italic">
                      “{t.quote}”
                    </blockquote>
                    <footer className="mt-6">
                      <p className="font-display text-sm font-semibold">
                        {t.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {t.role}, {t.company}
                      </p>
                    </footer>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-border bg-background" />
          <CarouselNext className="border-border bg-background" />
        </Carousel>
      </div>
    </Section>
  );
}
