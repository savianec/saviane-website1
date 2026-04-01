export type ProjectStatus =
  | "discovery"
  | "design"
  | "development"
  | "review"
  | "delivered";

export type PortalProject = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  teamLead: string;
  lastUpdate: string;
  description: string;
  startDate: string;
  endDate: string;
  nextMilestone: string;
  nextMilestoneDue: string;
  deliverables: { name: string; done: boolean; note?: string }[];
  team: { name: string; role: string; email: string }[];
  files: { folder: string; items: { name: string; date: string }[] }[];
  messages: { author: string; text: string; date: string }[];
};

export type PortalInvoice = {
  id: string;
  number: string;
  status: "paid" | "unpaid" | "overdue";
  amount: number;
  currency: string;
  dueDate: string;
  issuedDate: string;
  lineItems: {
    description: string;
    hours?: number;
    rate?: number;
    amount: number;
  }[];
  taxRate: number;
};

export type PortalAnnouncement = {
  title: string;
  body: string;
};

export type PortalProfileRow = {
  id: string;
  client_id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  notification_prefs: Record<string, unknown>;
};

export type PortalClientRow = {
  id: string;
  name: string;
  company: string | null;
  billing_city: string | null;
};
