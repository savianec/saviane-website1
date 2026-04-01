"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WarningGraphic } from "@/components/ui/warning-graphic";
import { cn } from "@/lib/utils";

export function SitePromoDialog() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [graphicKey, setGraphicKey] = React.useState(0);
  const prevPathRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (pathname !== "/") {
      setOpen(false);
      prevPathRef.current = pathname;
      return;
    }

    const wasAlreadyHome = prevPathRef.current === "/";
    prevPathRef.current = pathname;

    if (!wasAlreadyHome) {
      setOpen(true);
      setGraphicKey((k) => k + 1);
    }
  }, [pathname]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "max-h-[95dvh] max-w-[calc(100%-1.25rem)] gap-0 overflow-hidden border-0 bg-background/95 p-0 shadow-xl ring-1 ring-border/60 backdrop-blur-md sm:max-w-2xl md:max-w-3xl"
        )}
      >
        <div className="flex max-h-[min(92dvh,880px)] flex-col items-center gap-8 overflow-y-auto px-2 pt-10 pb-6 sm:px-6 sm:pt-12 sm:pb-8">
          <div
            className="flex w-full shrink-0 justify-center px-1"
            aria-hidden
          >
            <WarningGraphic
              key={graphicKey}
              width={600}
              height={230}
              enableAnimations
              animationSpeed={1.5}
              deferEntrance
              className="max-w-[min(94vw,36rem)] drop-shadow-lg sm:max-w-[min(90vw,40rem)] md:max-w-[min(88vw,44rem)]"
            />
          </div>

          <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
            <DialogTitle className="font-display text-foreground text-2xl leading-tight sm:text-3xl">
              Limited-time offers
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm sm:text-base">
              $500 websites and $250 for a one-month social media campaign.
              Subject to scope and availability. Use Contact to inquire.
            </DialogDescription>

            <div className="text-foreground w-full space-y-4 text-left text-base leading-relaxed sm:text-lg">
              <p>
                <span className="text-primary font-semibold">$500</span>{" "}
                websites: get a focused marketing site shipped without agency
                overhead.
              </p>
              <p>
                <span className="text-primary font-semibold">$250</span> for a
                one-month social media campaign: planning, creative direction,
                and a clear posting rhythm you can follow.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base">
                Reach out via{" "}
                <a
                  href="/contact"
                  className="text-primary font-medium underline-offset-2 hover:underline"
                >
                  Contact
                </a>{" "}
                to lock in availability.
              </p>
            </div>

            <DialogClose
              render={
                <Button size="lg" className="mt-2 min-w-[10rem] px-8" />
              }
            >
              Got it
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
