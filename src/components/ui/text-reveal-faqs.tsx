"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqCategory } from "@/lib/content/faq";

export function BlurredStagger({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <p
        className={
          className ??
          "text-muted-foreground text-base leading-relaxed break-words"
        }
      >
        {text}
      </p>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <div className="w-full">
      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className={
          className ??
          "text-muted-foreground text-base leading-relaxed break-words whitespace-normal"
        }
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={`${index}-${char}`}
            variants={letterAnimation}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}

export default function FAQs({ categories }: { categories: FaqCategory[] }) {
  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-0 sm:px-2">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="font-display text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
              FAQs
            </h2>
            <p className="text-muted-foreground mt-4 text-balance text-lg">
              Process, pricing, timelines, and how we work with your team.
            </p>
            <p className="text-muted-foreground mt-6 hidden md:block">
              Can&apos;t find what you&apos;re looking for? Reach out via our{" "}
              <Link
                href="/contact"
                className="text-primary font-medium hover:underline"
              >
                contact form
              </Link>{" "}
              We respond within one business day.
            </p>
          </div>

          <div className="space-y-10 md:col-span-3">
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="font-display text-foreground mb-3 text-lg font-medium tracking-tight">
                  {cat.label}
                </h3>
                <Accordion multiple={false} className="w-full">
                  {cat.items.map((item, i) => (
                    <AccordionItem
                      key={item.q}
                      value={`${cat.id}-${i}`}
                      className="border-border"
                    >
                      <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <BlurredStagger text={item.a} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground col-span-full mt-2 md:hidden">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
