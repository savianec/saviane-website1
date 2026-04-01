import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EnquiryRow } from "@/lib/admin/enquiry-types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { formatDiscoveryTimeLabel } from "@/lib/discovery-call-slots";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Enquiry · ${id.slice(0, 8)}…` };
}

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/admin/login");
  }

  const { id } = await params;

  let enquiry: EnquiryRow | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      enquiry = data as EnquiryRow;
    }
  } catch {
    enquiry = null;
  }

  if (!enquiry) {
    notFound();
  }

  const meetingSummary =
    enquiry.contact_preference === "meeting" &&
    enquiry.discovery_call_date &&
    enquiry.discovery_call_time
      ? `${enquiry.discovery_call_date} · ${formatDiscoveryTimeLabel(enquiry.discovery_call_time)}`
      : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/enquiries"
          className="text-primary hover:underline text-sm"
        >
          ← All enquiries
        </Link>
        <h1 className="text-foreground mt-4 text-2xl font-semibold tracking-tight">
          {enquiry.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {format(new Date(enquiry.created_at), "EEEE, MMMM d, yyyy · HH:mm")}
        </p>
      </div>

      <dl className="grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Email
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${enquiry.email}`}
              className="text-primary hover:underline"
            >
              {enquiry.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Company
          </dt>
          <dd className="mt-1 text-foreground">{enquiry.company}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Industry
          </dt>
          <dd className="mt-1 text-foreground">{enquiry.industry}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Timeline
          </dt>
          <dd className="mt-1 text-foreground">{enquiry.timeline}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Budget
          </dt>
          <dd className="mt-1 text-foreground">{enquiry.budget}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Follow-up preference
          </dt>
          <dd className="mt-1 capitalize text-foreground">
            {enquiry.contact_preference}
            {enquiry.phone ? ` · ${enquiry.phone}` : null}
          </dd>
        </div>
        {meetingSummary ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Requested discovery call
            </dt>
            <dd className="mt-1 text-foreground">{meetingSummary}</dd>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Services
          </dt>
          <dd className="mt-1 text-foreground">
            {enquiry.services?.length
              ? enquiry.services.join(", ")
              : "-"}
          </dd>
        </div>
      </dl>

      <Separator />

      <div>
        <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
          Brief
        </h2>
        <p className="text-muted-foreground mt-3 whitespace-pre-wrap leading-relaxed">
          {enquiry.brief}
        </p>
      </div>
    </div>
  );
}
