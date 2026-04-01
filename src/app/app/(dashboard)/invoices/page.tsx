import Link from "next/link";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listInvoicesForClient } from "@/lib/portal/data";
import { invoiceTotal } from "@/lib/portal/invoice-math";
import { getDashboardContext } from "@/lib/portal/session";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(amount);
}

export default async function InvoicesPage() {
  const { supabase, profile } = await getDashboardContext();
  const invoices = await listInvoicesForClient(supabase, profile.client_id);

  return (
    <div className="flex-1 py-8">
      <Container>
        <h1 className="font-display text-3xl tracking-tight">Invoices</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Download PDFs and pay securely once Stripe is connected.
        </p>
        <div className="border-border mt-8 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground text-center text-sm">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {inv.issuedDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {inv.dueDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === "paid"
                            ? "default"
                            : inv.status === "overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatMoney(invoiceTotal(inv), inv.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/app/invoices/${inv.id}`}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </div>
  );
}
