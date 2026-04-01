import * as React from "react";
import { cn } from "@/lib/utils";

export interface FlippingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  /** Pixel height for equal-size cards in a grid */
  height?: number;
}

/**
 * 3D flip on hover and keyboard focus (focus-within). Uses site `card` / `border` tokens.
 */
export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 400,
  ...props
}: FlippingCardProps) {
  return (
    <div
      className={cn(
        "group/flipping-card w-full outline-none [perspective:1000px]",
        "focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      tabIndex={0}
      {...props}
    >
      <div
        className={cn(
          "relative w-full rounded-xl border border-border bg-card text-card-foreground shadow-lg transition-transform duration-700 [transform-style:preserve-3d]",
          "group-hover/flipping-card:[transform:rotateY(180deg)] group-focus-within/flipping-card:[transform:rotateY(180deg)]"
        )}
        style={{ height }}
      >
        <div
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] bg-card [backface-visibility:hidden]",
            "[transform:rotateY(0deg)] [transform-style:preserve-3d]"
          )}
        >
          <div className="h-full w-full overflow-y-auto overscroll-contain [transform:translateZ(48px)_scale(0.96)]">
            {frontContent}
          </div>
        </div>
        <div
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] bg-card [backface-visibility:hidden]",
            "[transform:rotateY(180deg)] [transform-style:preserve-3d]"
          )}
        >
          <div className="h-full w-full overflow-y-auto overscroll-contain [transform:translateZ(48px)_scale(0.96)]">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
