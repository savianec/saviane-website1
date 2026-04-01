export type AdminProjectClientEmbed = {
  id: string;
  name: string;
  company: string | null;
};

export type AdminProjectRow = {
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
  messages: { author: string; text: string; date: string }[];
  created_at: string;
  clients: AdminProjectClientEmbed | null;
};

/** Supabase types may infer `clients` as an array for embedded selects. */
export function normalizeAdminProjectRow(
  raw: Omit<AdminProjectRow, "clients"> & {
    clients: AdminProjectClientEmbed | AdminProjectClientEmbed[] | null;
  }
): AdminProjectRow {
  const c = raw.clients;
  const clients = Array.isArray(c) ? (c[0] ?? null) : c;
  return { ...raw, clients };
}
