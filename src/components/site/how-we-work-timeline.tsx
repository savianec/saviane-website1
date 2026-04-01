"use client";

import { motion } from "framer-motion";
import { FlowButton } from "@/components/ui/flow-button";
import { cn } from "@/lib/utils";

export type HowWeWorkTimelineStep = {
  title: string;
  description: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.08 * i,
      ease: easeOut,
    },
  }),
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.2, ease: easeOut },
  },
};

export type HowWeWorkTimelineCta = {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
};

export function HowWeWorkTimeline({
  steps,
  heading = "How we work",
  subtitle,
  cta,
  className,
  headingClassName,
}: {
  steps: HowWeWorkTimelineStep[];
  heading?: string;
  subtitle?: string;
  cta?: HowWeWorkTimelineCta;
  className?: string;
  /** Extra classes for the gradient title (e.g. `lg:text-6xl` on About). */
  headingClassName?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background via-card/30 to-card/60 px-3 py-6 sm:px-5 md:py-9",
        className
      )}
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          className={cn(
            "text-center",
            subtitle ? "mb-6 md:mb-8" : "mb-5 md:mb-6"
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerVariants}
        >
          <h2
            className={cn(
              "font-display bg-gradient-to-br from-primary to-foreground bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl",
              headingClassName
            )}
          >
            {heading}
          </h2>
          {subtitle ? (
            <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-sm leading-relaxed md:text-base">
              {subtitle}
            </p>
          ) : null}
        </motion.div>

        <div className="relative py-2 md:py-4">
          <div
            className="absolute bottom-0 left-6 top-11 w-px md:left-7 md:top-12"
            style={{
              background:
                "linear-gradient(180deg, var(--primary) 0%, var(--primary) 50%, transparent 100%)",
            }}
            aria-hidden
          />

          <ol className="relative list-none space-y-5 md:space-y-7">
            {steps.map((step, i) => (
              <motion.li
                key={`${step.title}-${i}`}
                className="group flex gap-3 md:gap-5"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={stepVariants}
              >
                <div
                  className="bg-primary text-primary-foreground relative z-[2] flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-[0_0_16px_color-mix(in_oklab,var(--primary)_35%,transparent)] transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_45%,transparent)] md:size-14 md:text-xl"
                  aria-hidden
                >
                  {i + 1}
                </div>
                <div className="border-border bg-card/80 group-hover:border-primary min-w-0 flex-1 cursor-default rounded-lg border p-3.5 transition-all duration-300 ease-out group-hover:bg-card group-hover:shadow-md md:p-5 md:group-hover:translate-x-1">
                  <h3 className="text-foreground group-hover:text-primary text-base font-bold tracking-tight transition-colors duration-300 md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground mt-2 text-xs leading-relaxed transition-colors duration-300 md:text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {cta ? (
          <motion.div
            className="border-primary/50 from-primary/10 to-primary/5 mt-8 rounded-xl border bg-gradient-to-br px-4 py-6 text-center md:mt-10 md:px-6 md:py-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={ctaVariants}
          >
            <h3 className="font-display text-foreground text-lg font-bold tracking-tight md:text-xl">
              {cta.title}
            </h3>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-xs md:text-sm">
              {cta.description}
            </p>
            <FlowButton
              href={cta.href}
              text={cta.buttonLabel}
              className="mt-4 uppercase tracking-wide"
            />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
