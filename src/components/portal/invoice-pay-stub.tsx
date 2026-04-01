"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function InvoicePayStub({ amountLabel }: { amountLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" size="lg" onClick={() => setOpen(true)}>
        Pay now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Stripe checkout</DialogTitle>
            <DialogDescription>
              Payments are not enabled in this demo. In production, this button
              loads a Stripe Payment Element with your invoice metadata and
              updates status via webhooks.
            </DialogDescription>
          </DialogHeader>
          <div className="border-border bg-muted/30 space-y-2 rounded-lg border p-4 text-sm">
            <p>
              <span className="text-muted-foreground">Amount due: </span>
              <span className="font-semibold">{amountLabel}</span>
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              PCI scope stays with Stripe, no card data touches this app.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
