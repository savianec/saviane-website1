import type { PortalInvoice } from "@/lib/portal/types";

export function invoiceSubtotal(inv: PortalInvoice) {
  return inv.lineItems.reduce((s, l) => s + l.amount, 0);
}

export function invoiceTax(inv: PortalInvoice) {
  return Math.round(invoiceSubtotal(inv) * inv.taxRate * 100) / 100;
}

export function invoiceTotal(inv: PortalInvoice) {
  return Math.round((invoiceSubtotal(inv) + invoiceTax(inv)) * 100) / 100;
}
