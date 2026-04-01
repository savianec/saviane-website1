export type AiUseCaseCard = {
  num: string;
  name: string;
  description: string;
  tag: string;
};

export type AiUseCaseTab = {
  id: string;
  label: string;
  cards: AiUseCaseCard[];
};

/** Legal block: one top tab with intro + nested category tabs (AI for law firms). */
export type AiLegalUseCasesTab = {
  kind: "legal";
  id: "legal";
  label: string;
  intro: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
  };
  nestedTabs: AiUseCaseTab[];
};

export type AiUseCaseSectionTab = AiUseCaseTab | AiLegalUseCasesTab;

export function isLegalUseCaseTab(
  tab: AiUseCaseSectionTab
): tab is AiLegalUseCasesTab {
  return "kind" in tab && tab.kind === "legal";
}

const legalNestedTabs: AiUseCaseTab[] = [
  {
    id: "legal-documents",
    label: "Documents & Drafting",
    cards: [
      {
        num: "01 · Drafting",
        name: "Contract Drafting Assistant",
        description:
          "Generates first-draft agreements, NDAs, and standard forms from your templates, in minutes, not hours.",
        tag: "Speed",
      },
      {
        num: "02 · Review",
        name: "Contract Review & Redlining",
        description:
          "Flags non-standard clauses, missing provisions, and risk terms, so lawyers review smarter, not longer.",
        tag: "Risk Reduction",
      },
      {
        num: "03 · Drafting",
        name: "Pleadings & Correspondence Generator",
        description:
          "Drafts letters, demand notices, and court documents from matter details and prior precedents.",
        tag: "Precedent-Powered",
      },
      {
        num: "04 · Review",
        name: "Due Diligence Automation",
        description:
          "Extracts key terms, obligations, and red flags across large document sets, turning days into hours.",
        tag: "M&A Ready",
      },
      {
        num: "05 · Drafting",
        name: "Clause Library & Playbook Agent",
        description:
          "Surfaces your approved fallback language and negotiation positions in real time during review.",
        tag: "Consistency",
      },
    ],
  },
  {
    id: "legal-research",
    label: "Legal Research",
    cards: [
      {
        num: "01 · Research",
        name: "Case Law Research Agent",
        description:
          "Searches, summarises, and cites relevant case law across jurisdictions, in a fraction of the time.",
        tag: "10x Faster",
      },
      {
        num: "02 · Research",
        name: "Legislation & Regulatory Monitor",
        description:
          "Tracks changes to legislation and regulations relevant to your practice areas and delivers plain-English summaries.",
        tag: "Always Current",
      },
      {
        num: "03 · Research",
        name: "Legal Memo Generator",
        description:
          "Produces structured research memos from a brief, ready for senior review rather than starting from scratch.",
        tag: "Draft-Ready",
      },
      {
        num: "04 · Research",
        name: "Precedent Search & Retrieval",
        description:
          "Finds the most relevant prior work from your own document library instantly, no more hunting through shared drives.",
        tag: "Institutional Memory",
      },
      {
        num: "05 · Research",
        name: "Opposing Party Intelligence",
        description:
          "Aggregates publicly available information on opposing parties, counsel, and litigation history to inform strategy.",
        tag: "Strategic",
      },
    ],
  },
  {
    id: "legal-matters",
    label: "Matter Management",
    cards: [
      {
        num: "01 · Matters",
        name: "Matter Status Digest",
        description:
          "Pulls activity across all open matters and delivers a clear weekly summary to partners and supervisors.",
        tag: "Visibility",
      },
      {
        num: "02 · Matters",
        name: "Deadline & Diarising Agent",
        description:
          "Extracts critical dates from documents and court orders and populates your calendar automatically.",
        tag: "Zero Miss",
      },
      {
        num: "03 · Matters",
        name: "Time Entry Assistant",
        description:
          "Converts emails, notes, and calendar events into draft time entries, reducing write-off and lost time.",
        tag: "Revenue Recovery",
      },
      {
        num: "04 · Matters",
        name: "File Note Automation",
        description:
          "Transcribes and summarises calls and meetings into structured file notes, logged directly to the matter.",
        tag: "Zero Admin",
      },
      {
        num: "05 · Matters",
        name: "Budget & Scope Tracker",
        description:
          "Monitors time burn against matter budgets and flags scope creep before it becomes a write-off conversation.",
        tag: "Profitability",
      },
    ],
  },
  {
    id: "legal-client",
    label: "Client & Intake",
    cards: [
      {
        num: "01 · Intake",
        name: "New Matter Intake Workflow",
        description:
          "Captures client and matter details, runs conflict checks, and populates your practice management system automatically.",
        tag: "Day One Ready",
      },
      {
        num: "02 · Client",
        name: "Client Portal Assistant",
        description:
          "Answers routine client questions about matter progress 24/7, reducing inbound calls to the fee earner.",
        tag: "Live 24/7",
      },
      {
        num: "03 · Intake",
        name: "Engagement Letter Generator",
        description:
          "Produces tailored cost disclosure and retainer letters from intake details, ready to send in minutes.",
        tag: "Compliance",
      },
      {
        num: "04 · Client",
        name: "Client Update Automation",
        description:
          "Sends timely, personalised matter updates to clients at key milestones, without the manual effort.",
        tag: "Retention",
      },
      {
        num: "05 · Intake",
        name: "KYC & AML Document Collection",
        description:
          "Requests, chases, and verifies identity documents from clients automatically, keeping you compliant from day one.",
        tag: "AML Ready",
      },
    ],
  },
  {
    id: "legal-compliance",
    label: "Risk & Compliance",
    cards: [
      {
        num: "01 · Risk",
        name: "Conflict of Interest Checker",
        description:
          "Screens new matters against existing clients and related parties, flagging conflicts before they become problems.",
        tag: "Risk Gate",
      },
      {
        num: "02 · Compliance",
        name: "Regulatory Change Monitor",
        description:
          "Watches relevant regulators and delivers a plain-English briefing when rules affecting your clients change.",
        tag: "Always Current",
      },
      {
        num: "03 · Risk",
        name: "Contract Risk Scoring",
        description:
          "Assigns a risk rating to incoming contracts based on your firm's defined risk criteria, before a lawyer opens the file.",
        tag: "Triage",
      },
      {
        num: "04 · Compliance",
        name: "Privacy & Data Audit Assistant",
        description:
          "Reviews contracts and internal policies for data handling obligations and flags non-compliance with privacy law.",
        tag: "Privacy Ready",
      },
      {
        num: "05 · Risk",
        name: "Litigation Risk Assessor",
        description:
          "Analyses matter facts against precedent outcomes to model likely results and support settlement strategy.",
        tag: "Strategic",
      },
    ],
  },
  {
    id: "legal-inhouse",
    label: "In-House Specific",
    cards: [
      {
        num: "01 · In-House",
        name: "Legal Request Intake Portal",
        description:
          "Captures, triages, and routes legal requests from the business, replacing email chaos with a structured queue.",
        tag: "Visibility",
      },
      {
        num: "02 · In-House",
        name: "Self-Service Contract Engine",
        description:
          "Lets business units generate pre-approved standard contracts themselves, freeing legal for higher-value work.",
        tag: "Scale",
      },
      {
        num: "03 · In-House",
        name: "Legal Policy Chatbot",
        description:
          "Answers internal policy and compliance questions from staff instantly, reducing ad hoc legal queries by the dozen.",
        tag: "Internal-Facing",
      },
      {
        num: "04 · In-House",
        name: "External Counsel Management",
        description:
          "Tracks spend, matter status, and outside counsel performance across all external engagements in one place.",
        tag: "Cost Control",
      },
      {
        num: "05 · In-House",
        name: "Board & Executive Reporting",
        description:
          "Compiles legal team activity, risk exposure, and key matter updates into a board-ready report automatically.",
        tag: "Reporting",
      },
    ],
  },
];

const legalUseCasesMainTab: AiLegalUseCasesTab = {
  kind: "legal",
  id: "legal",
  label: "Legal & law firms",
  intro: {
    eyebrow: "AI for Legal",
    titleLine1: "Less admin.",
    titleLine2: "More practice.",
    subtitle:
      "Purpose-built AI systems for law firms and in-house legal teams, cutting the time spent on routine work so your lawyers can focus on what only they can do.",
  },
  nestedTabs: legalNestedTabs,
};

export const aiUseCaseTabs: AiUseCaseSectionTab[] = [
  {
    id: "agents",
    label: "AI Agents",
    cards: [
      {
        num: "01 · Agent",
        name: "Lead Qualification Bot",
        description:
          "Engages visitors instantly and delivers sales-ready leads with no manual effort required.",
        tag: "Live 24/7",
      },
      {
        num: "02 · Agent",
        name: "Customer Support Agent",
        description:
          "Answers common questions around the clock so your team handles only what truly needs them.",
        tag: "Live 24/7",
      },
      {
        num: "03 · Agent",
        name: "Appointment Booking Bot",
        description:
          "Clients book and reschedule through natural conversation, with no phone tag required.",
        tag: "Conversational",
      },
      {
        num: "04 · Agent",
        name: "AI Sales Assistant",
        description:
          "Guides prospects through your offer, handles objections, and nudges toward booking a call.",
        tag: "Revenue",
      },
      {
        num: "05 · Agent",
        name: "Onboarding Assistant",
        description:
          "Walks new clients through your process automatically, reducing drop-off from day one.",
        tag: "Retention",
      },
    ],
  },
  legalUseCasesMainTab,
  {
    id: "workflow",
    label: "Workflow",
    cards: [
      {
        num: "01 · Workflow",
        name: "Client Intake Automation",
        description:
          "Collects, organises, and routes new client information the moment it arrives.",
        tag: "Zero Manual Entry",
      },
      {
        num: "02 · Workflow",
        name: "Invoice & Document Processing",
        description:
          "Extracts data from invoices and contracts and pushes it straight into your systems.",
        tag: "Zero Manual Entry",
      },
      {
        num: "03 · Workflow",
        name: "Quote & Proposal Generator",
        description:
          "Turns job details into a professional, accurate quote in minutes, not hours.",
        tag: "Speed",
      },
      {
        num: "04 · Workflow",
        name: "Automated Follow-Up Sequences",
        description:
          "Timely, personalised follow-ups sent to leads and clients without lifting a finger.",
        tag: "Nurture",
      },
    ],
  },
  {
    id: "sales",
    label: "Sales & Marketing",
    cards: [
      {
        num: "01 · Marketing",
        name: "AI Content Pipeline",
        description:
          "Blog posts, social captions, and email drafts on a consistent schedule, ready for a quick review.",
        tag: "Always-On",
      },
      {
        num: "02 · Sales",
        name: "Personalised Outreach",
        description:
          "Researches prospects and writes hyper-personalised cold emails at scale.",
        tag: "At Scale",
      },
      {
        num: "03 · Marketing",
        name: "Review & Reputation Automation",
        description:
          "Asks happy customers for Google reviews automatically at exactly the right moment.",
        tag: "Reputation",
      },
      {
        num: "04 · Marketing",
        name: "Social Media Scheduling Agent",
        description:
          "Plans, writes, and queues your social content weeks ahead in minutes.",
        tag: "Always-On",
      },
      {
        num: "05 · Intel",
        name: "Market & Competitor Monitoring",
        description:
          "Scans the web daily for competitor moves and delivers a clean summary to your inbox.",
        tag: "Intelligence",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Reporting",
    cards: [
      {
        num: "01 · Data",
        name: "Natural Language Reporting",
        description:
          "Ask questions about your business data in plain English and get instant, accurate answers.",
        tag: "No-Code",
      },
      {
        num: "02 · Data",
        name: "Automated KPI Dashboard",
        description:
          "Pulls from all your tools and delivers a plain-English performance summary every week.",
        tag: "Weekly Digest",
      },
      {
        num: "03 · Data",
        name: "Anomaly Detection & Alerts",
        description:
          "Monitors key metrics around the clock and flags unusual drops or spikes early.",
        tag: "Real-Time",
      },
    ],
  },
  {
    id: "ops",
    label: "Internal Ops",
    cards: [
      {
        num: "01 · Ops",
        name: "Internal Knowledge Base Bot",
        description:
          "Instant answers from your SOPs and internal docs, slashing time wasted searching.",
        tag: "Team Efficiency",
      },
      {
        num: "02 · Ops",
        name: "Meeting Summary Agent",
        description:
          "Joins calls, writes the summary, pulls action items, and logs everything automatically.",
        tag: "Zero Admin",
      },
      {
        num: "03 · Ops",
        name: "HR & Staff Onboarding",
        description:
          "Guides new employees through paperwork, policies, and training without hand-holding.",
        tag: "Scale Hiring",
      },
      {
        num: "04 · Ops",
        name: "Job Ad & Screening Workflow",
        description:
          "Writes targeted job ads, screens applications, and surfaces best candidates first.",
        tag: "Scale Hiring",
      },
    ],
  },
  {
    id: "custom",
    label: "Industry Builds",
    cards: [
      {
        num: "01 · Trades",
        name: "Trades Job Management",
        description:
          "Handles inbound requests, generates quotes, schedules site visits, built for trade businesses.",
        tag: "Industry-Specific",
      },
      {
        num: "02 · Health",
        name: "Allied Health Patient Workflow",
        description:
          "Automates intake, pre-visit forms, reminders, and post-visit follow-ups.",
        tag: "Industry-Specific",
      },
      {
        num: "03 · Legal",
        name: "Legal Client Matter Intake",
        description:
          "Captures matter details, sends engagement letters, and populates your practice system.",
        tag: "Industry-Specific",
      },
      {
        num: "04 · Ecom",
        name: "E-commerce Returns Agent",
        description:
          "Handles returns, refund requests, and order queries, reducing support load automatically.",
        tag: "Industry-Specific",
      },
      {
        num: "05 · Proptech",
        name: "Real Estate Enquiry Agent",
        description:
          "Responds to property enquiries instantly and keeps leads warm until your agent is ready.",
        tag: "Industry-Specific",
      },
    ],
  },
];
