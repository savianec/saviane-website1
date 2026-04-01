import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EnquiryRow } from "@/lib/admin/enquiry-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export const metadata = {
  title: "Enquiries · Admin",
  description: "Start a project submissions from the marketing site",
};

export default async function AdminEnquiriesPage() {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/admin/login");
  }

  let enquiries: EnquiryRow[] = [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!error && data) {
      enquiries = data as EnquiryRow[];
    }
  } catch {
    enquiries = [];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Enquiries
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Submissions from the site &ldquo;Start a project&rdquo; wizard (
          <code className="text-foreground">/contact</code>). Stored when{" "}
          <code className="text-foreground">SUPABASE_SERVICE_ROLE_KEY</code> is
          set and the <code className="text-foreground">enquiries</code> table
          exists.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-sm">
          No enquiries yet, or the table is missing / admin client could not
          connect. Run the latest Supabase migration and submit a test from{" "}
          <Link href="/contact" className="text-primary hover:underline">
            /contact
          </Link>
          .
        </p>
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                    {format(new Date(e.created_at), "MMM d, yyyy · HH:mm")}
                  </TableCell>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${e.email}`}
                      className="text-primary hover:underline"
                    >
                      {e.email}
                    </a>
                  </TableCell>
                  <TableCell>{e.company}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {e.industry}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm capitalize">
                    {e.contact_preference}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/enquiries/${e.id}`}
                      className="text-primary text-sm hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
