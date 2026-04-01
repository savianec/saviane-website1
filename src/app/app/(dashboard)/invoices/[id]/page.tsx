import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InvoicePayStub } from "@/components/portal/invoice-pay-stub";
import { SavianeLogoMark } from "@/components/site/logo";
import { getInvoiceForClient } from "@/lib/portal/data";
import {
  invoiceSubtotal,
  invoiceTax,
  invoiceTotal,
} from "@/lib/portal/invoice-math";
import { getDashboardContext } from "@/lib/portal/session";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(amount);
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile, client } = await getDashboardContext();
  const inv = await getInvoiceForClient(supabase, profile.client_id, id);
  if (!inv) notFound();

  const sub = invoiceSubtotal(inv);
  const tax = invoiceTax(inv);
  const total = invoiceTotal(inv);
  const amountLabel = formatMoney(total, inv.currency);

  const billToName = profile.display_name;
  const billToCompany = client?.company ?? "";
  const billToCity = client?.billing_city ?? "";

  return (
    <div className="flex-1 py-8">
      <Container>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/app/invoices">Invoices</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{inv.number}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl tracking-tight">
                {inv.number}
              </h1>
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
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Issued {inv.issuedDate} · Due {inv.dueDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" disabled>
              Download PDF
            </Button>
            {inv.status !== "paid" ? (
              <InvoicePayStub amountLabel={amountLabel} />
            ) : null}
          </div>
        </div>

        <div className="border-border mt-10 grid gap-8 rounded-xl border p-6 lg:grid-cols-2">
          <div>
            <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Bill to
            </h2>
            <p className="mt-2 text-sm font-medium">{billToName}</p>
            {billToCompany ? (
              <p className="text-muted-foreground text-sm">{billToCompany}</p>
            ) : null}
            {billToCity ? (
              <p className="text-muted-foreground text-sm">{billToCity}</p>
            ) : null}
          </div>
          <div>
            <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              From
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <SavianeLogoMark size={20} />
              <p className="text-sm font-medium">saviane</p>
            </div>
            <p className="text-muted-foreground text-sm">hello@saviane.example.com</p>
          </div>
        </div>

        <div className="border-border mt-8 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inv.lineItems.map((line, i) => (
                <TableRow key={i}>
                  <TableCell>{line.description}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {line.hours ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {line.rate != null ? formatMoney(line.rate, inv.currency) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatMoney(line.amount, inv.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  {formatMoney(sub, inv.currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right">
                  Tax ({Math.round(inv.taxRate * 100)}%)
                </TableCell>
                <TableCell className="text-right">
                  {formatMoney(tax, inv.currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {amountLabel}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <Separator className="my-10" />

        <p className="text-muted-foreground text-sm">
          <Link href="/app/invoices" className="text-primary hover:underline">
            ← Back to invoices
          </Link>
        </p>
      </Container>
    </div>
  );
}
