export type ProjectStatus =
  | "discovery"
  | "design"
  | "development"
  | "review"
  | "delivered";

export type MockProject = {
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

export type MockInvoice = {
  id: string;
  number: string;
  status: "paid" | "unpaid" | "overdue";
  amount: number;
  currency: string;
  dueDate: string;
  issuedDate: string;
  lineItems: { description: string; hours?: number; rate?: number; amount: number }[];
  taxRate: number;
};

export const mockClientName = "Sarah Chen";

export const mockAnnouncements = [
  {
    title: "New portal features",
    body: "File previews and invoice PDFs are easier to access from your dashboard.",
  },
];

export const mockProjects: MockProject[] = [
  {
    id: "p1",
    name: "Website Redesign",
    status: "development",
    progress: 70,
    teamLead: "Christian Saviane",
    lastUpdate: "2026-03-28",
    description:
      "Modern redesign focused on conversion clarity, editorial case studies, and a maintainable component library.",
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    nextMilestone: "Homepage + case study templates in staging",
    nextMilestoneDue: "2026-04-02",
    deliverables: [
      { name: "Strategy & wireframes", done: true },
      { name: "Visual system", done: true },
      { name: "Development", done: false, note: "In progress" },
      { name: "QA & launch", done: false },
    ],
    team: [
      {
        name: "Christian Saviane",
        role: "Founder & Web and Automation Lead",
        email: "christian@saviane.example.com",
      },
    ],
    files: [
      {
        folder: "Brand assets",
        items: [
          { name: "Logo_final.svg", date: "2026-01-22" },
          { name: "Brand_guidelines.pdf", date: "2026-01-22" },
        ],
      },
      {
        folder: "Design",
        items: [
          { name: "Wireframes_v2.fig", date: "2026-02-05" },
          { name: "UI_v3.fig", date: "2026-02-18" },
        ],
      },
    ],
    messages: [
      {
        author: "Christian Saviane",
        text: "Staging link is updated with the new hero and case study module. Please review copy blocks in section two.",
        date: "2026-03-27",
      },
      {
        author: "Sarah Chen",
        text: "Looks great, can we tighten the CTA on mobile for thumb reach?",
        date: "2026-03-28",
      },
    ],
  },
  {
    id: "p2",
    name: "AI Intake Assistant",
    status: "design",
    progress: 45,
    teamLead: "Christian Saviane",
    lastUpdate: "2026-03-25",
    description:
      "Scoped copilot for qualifying inbound requests with human review before anything reaches CRM.",
    startDate: "2026-02-01",
    endDate: "2026-05-30",
    nextMilestone: "Pilot eval results + safety checklist sign-off",
    nextMilestoneDue: "2026-04-10",
    deliverables: [
      { name: "Workflow audit", done: true },
      { name: "Pilot prompts & evals", done: true },
      { name: "Integration", done: false },
    ],
    team: [
      {
        name: "Christian Saviane",
        role: "Founder & Web and Automation Lead",
        email: "christian@saviane.example.com",
      },
    ],
    files: [
      {
        folder: "Research",
        items: [{ name: "Intake_audit.pdf", date: "2026-02-08" }],
      },
    ],
    messages: [
      {
        author: "Christian Saviane",
        text: "Draft eval sheet is in Files. We need three example edge cases from your team by Friday.",
        date: "2026-03-24",
      },
    ],
  },
  {
    id: "p3",
    name: "Brand Motion Toolkit",
    status: "delivered",
    progress: 100,
    teamLead: "Christian Saviane",
    lastUpdate: "2026-02-20",
    description:
      "Motion tokens and reference implementations for marketing and in-product surfaces.",
    startDate: "2025-11-01",
    endDate: "2026-02-15",
    nextMilestone: "No upcoming milestone",
    nextMilestoneDue: "-",
    deliverables: [
      { name: "Motion principles", done: true },
      { name: "After Effects / Lottie pack", done: true },
      { name: "Handoff session", done: true },
    ],
    team: [
      {
        name: "Christian Saviane",
        role: "Founder & Web and Automation Lead",
        email: "christian@saviane.example.com",
      },
    ],
    files: [
      {
        folder: "Delivery",
        items: [{ name: "Motion_toolkit.zip", date: "2026-02-14" }],
      },
    ],
    messages: [],
  },
];

export const mockInvoices: MockInvoice[] = [
  {
    id: "inv1",
    number: "INV-2026-014",
    status: "unpaid",
    amount: 2200,
    currency: "AUD",
    dueDate: "2026-04-15",
    issuedDate: "2026-03-15",
    taxRate: 0.1,
    lineItems: [
      { description: "Development sprint, March", hours: 24, rate: 180, amount: 4320 },
      { description: "Credit, scope adjustment", amount: -2000 },
    ],
  },
  {
    id: "inv2",
    number: "INV-2026-009",
    status: "paid",
    amount: 5400,
    currency: "AUD",
    dueDate: "2026-02-10",
    issuedDate: "2026-01-20",
    taxRate: 0.1,
    lineItems: [
      { description: "Discovery & UX phase", amount: 4909.09 },
    ],
  },
];

export function getProject(id: string) {
  return mockProjects.find((p) => p.id === id);
}

export function getInvoice(id: string) {
  return mockInvoices.find((i) => i.id === id);
}

export function invoiceSubtotal(inv: MockInvoice) {
  return inv.lineItems.reduce((s, l) => s + l.amount, 0);
}

export function invoiceTax(inv: MockInvoice) {
  return Math.round(invoiceSubtotal(inv) * inv.taxRate * 100) / 100;
}

export function invoiceTotal(inv: MockInvoice) {
  return Math.round((invoiceSubtotal(inv) + invoiceTax(inv)) * 100) / 100;
}
