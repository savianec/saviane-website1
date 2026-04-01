"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const shellClassName = cn(
  "group relative inline-flex items-center justify-center gap-1 overflow-hidden rounded-[100px]",
  "border-[1.5px] border-border/70 bg-transparent px-8 py-3 text-sm font-semibold text-foreground",
  "cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
  "hover:border-transparent hover:rounded-xl hover:text-primary-foreground",
  "active:scale-[0.95]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

const arrowClassName = cn(
  "pointer-events-none absolute z-[9] h-4 w-4 text-foreground",
  "transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "group-hover:text-primary-foreground"
);

function FlowButtonInner({ label }: { label: ReactNode }) {
  return (
    <>
      <ArrowRight
        className={cn(
          arrowClassName,
          "left-[-25%] fill-none stroke-current group-hover:left-4"
        )}
        aria-hidden
      />
      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3">
        {label}
      </span>
      <span
        className="bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100"
        aria-hidden
      />
      <ArrowRight
        className={cn(
          arrowClassName,
          "right-4 fill-none stroke-current group-hover:right-[-25%]"
        )}
        aria-hidden
      />
    </>
  );
}

export type FlowButtonProps = {
  text?: string;
  children?: ReactNode;
  className?: string;
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function FlowButton({
  text,
  children,
  className,
  href,
  type = "button",
  ...buttonProps
}: FlowButtonProps) {
  const label = children ?? text ?? "Start a project";
  const classes = cn(shellClassName, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        <FlowButtonInner label={label} />
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...buttonProps}>
      <FlowButtonInner label={label} />
    </button>
  );
}
