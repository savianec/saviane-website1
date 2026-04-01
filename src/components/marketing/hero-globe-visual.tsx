"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const RotatingEarth = dynamic(
  () => import("@/components/ui/wireframe-dotted-globe"),
  { ssr: false, loading: () => null }
);

export function HeroGlobeVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative aspect-[4/3] w-full min-h-[220px] overflow-visible",
        className
      )}
    >
      <div className="absolute inset-0">
        <RotatingEarth className="h-full w-full min-h-0" />
      </div>
    </div>
  );
}
