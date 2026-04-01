"use client";

import type { ReactNode } from "react";
import { useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HolographicCardProps {
  children: ReactNode;
  className?: string;
}

export default function HolographicCard({
  children,
  className,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !cardRef.current) return;
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
      card.style.setProperty("--bg-x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--bg-y", `${(y / rect.height) * 100}%`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
    [reduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (reduceMotion || !cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--x", "50%");
    card.style.setProperty("--y", "50%");
    card.style.setProperty("--bg-x", "50%");
    card.style.setProperty("--bg-y", "50%");
  }, [reduceMotion]);

  if (reduceMotion) {
    return <div className={cn("h-full min-h-0", className)}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "holographic-card group relative h-full min-h-0 overflow-hidden rounded-xl",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bg-card absolute inset-0 z-0 rounded-[inherit]"
        aria-hidden
      />
      <div className="holo-glow absolute inset-0 z-[1] rounded-[inherit]" aria-hidden />
      <div className="relative z-[2] flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
