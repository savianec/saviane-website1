import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PortalAnnouncement,
  PortalClientRow,
  PortalInvoice,
  PortalProfileRow,
  PortalProject,
  ProjectStatus,
} from "@/lib/portal/types";

type DbProject = {
  id: string;
  client_id: string;
  name: string;
  status: string;
  progress: number;
  team_lead: string;
  last_update: string;
  description: string;
  start_date: string;
  end_date: string;
  next_milestone: string;
  next_milestone_due: string;
  deliverables: unknown;
  team: unknown;
  files: unknown;
  messages: unknown;
};

type DbInvoice = {
  id: string;
  client_id: string;
  number: string;
  status: string;
  currency: string;
  due_date: string;
  issued_date: string;
  tax_rate: number;
  line_items: unknown;
};

function isoDate(s: string) {
  return s.slice(0, 10);
}

function asArray<T>(v: unknown, fallback: T[]): T[] {
  return Array.isArray(v) ? (v as T[]) : fallback;
}

function mapProject(row: DbProject): PortalProject {
  return {
    id: row.id,
    name: row.name,
    status: row.status as ProjectStatus,
    progress: row.progress,
    teamLead: row.team_lead,
    lastUpdate: isoDate(row.last_update),
    description: row.description,
    startDate: isoDate(row.start_date),
    endDate: isoDate(row.end_date),
    nextMilestone: row.next_milestone,
    nextMilestoneDue: row.next_milestone_due,
    deliverables: asArray(row.deliverables, []),
    team: asArray(row.team, []),
    files: asArray(row.files, []),
    messages: asArray(row.messages, []),
  };
}

function mapInvoice(row: DbInvoice): PortalInvoice {
  return {
    id: row.id,
    number: row.number,
    status: row.status as PortalInvoice["status"],
    amount: 0,
    currency: row.currency,
    dueDate: isoDate(row.due_date),
    issuedDate: isoDate(row.issued_date),
    lineItems: asArray(row.line_items, []),
    taxRate: Number(row.tax_rate),
  };
}

export async function getProfileRow(
  supabase: SupabaseClient,
  userId: string
): Promise<PortalProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, client_id, display_name, email, phone, notification_prefs")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as PortalProfileRow;
}

export async function getClientRow(
  supabase: SupabaseClient,
  clientId: string
): Promise<PortalClientRow | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, company, billing_city")
    .eq("id", clientId)
    .maybeSingle();

  if (error || !data) return null;
  return data as PortalClientRow;
}

export async function listProjectsForClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<PortalProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as DbProject[]).map(mapProject);
}

export async function getProjectForClient(
  supabase: SupabaseClient,
  clientId: string,
  projectId: string
): Promise<PortalProject | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .eq("id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return mapProject(data as DbProject);
}

export async function listInvoicesForClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<PortalInvoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", clientId)
    .order("issued_date", { ascending: false });

  if (error || !data) return [];
  return (data as DbInvoice[]).map(mapInvoice);
}

export async function getInvoiceForClient(
  supabase: SupabaseClient,
  clientId: string,
  invoiceId: string
): Promise<PortalInvoice | null> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", clientId)
    .eq("id", invoiceId)
    .maybeSingle();

  if (error || !data) return null;
  return mapInvoice(data as DbInvoice);
}

export async function listAnnouncementsForClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<PortalAnnouncement[]> {
  const { data, error } = await supabase
    .from("announcements")
    .select("title, body")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as PortalAnnouncement[];
}
