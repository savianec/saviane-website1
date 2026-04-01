export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  serviceTags: string[];
  teaser: string;
  image: string;
  challenge: string;
  execution: string;
  results: string[];
  testimonial: { quote: string; name: string; role: string };
  liveUrl?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "atlas-commerce",
    title: "Atlas Commerce Platform",
    industry: "E-commerce",
    serviceTags: ["web-design"],
    teaser:
      "Rebuilt the storefront on a component system that cut release risk and improved checkout completion.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    challenge:
      "A fragmented theme stack slowed releases and hid performance debt. Marketing could not ship campaigns without engineering fire drills.",
    execution:
      "We migrated to Next.js, introduced a typed design system, and instrumented the funnel end-to-end. Content editors work inside guardrails, not against them.",
    results: [
      "−38% LCP on collection pages (lab + field)",
      "Checkout completion +4.2 pts in 90 days",
      "Release cadence from monthly to weekly",
    ],
    testimonial: {
      quote:
        "saviane gave us velocity without sacrificing quality. Our team finally trusts the front end again.",
      name: "Priya Nair",
      role: "VP Digital, Atlas Retail Group",
    },
    liveUrl: "#",
  },
  {
    slug: "helix-fintech",
    title: "Helix Client Portal",
    industry: "Fintech",
    serviceTags: ["web-design", "ai-automation"],
    teaser:
      "A calmer portal experience with automated document intake and human-readable status.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    challenge:
      "Clients bounced between email threads and PDFs. Support load grew faster than headcount.",
    execution:
      "We redesigned the authenticated experience, added structured uploads, and layered automation for classification, always with explicit review steps for compliance.",
    results: [
      "Tier-1 tickets −27% post-launch",
      "Median onboarding time −3.5 days",
      "CSAT +12 pts on portal flows",
    ],
    testimonial: {
      quote:
        "The portal feels like a product, not a workaround. Our clients notice the difference immediately.",
      name: "Marcus Chen",
      role: "Head of Operations, Helix",
    },
  },
  {
    slug: "northwind-support",
    title: "Northwind Support Copilot",
    industry: "B2B SaaS",
    serviceTags: ["ai-automation"],
    teaser:
      "Scoped copilot that drafts replies from your knowledge base, no mystery training data.",
    image:
      "https://images.unsplash.com/photo-1531746797556-4c285c32b5e3?w=1200&q=80",
    challenge:
      "Support leaders wanted AI assistance but could not accept inconsistent answers or leaking customer data.",
    execution:
      "Retrieval over approved articles, structured response templates, and escalation hooks. Every suggestion is logged and reviewable.",
    results: [
      "Handle time −18% for L1",
      "First-contact resolution +9 pts",
      "Zero PII sent to external trainers",
    ],
    testimonial: {
      quote:
        "Finally an AI rollout our security team could sign. saviane was meticulous about boundaries.",
      name: "Elena Rossi",
      role: "Director CX, Northwind",
    },
  },
  {
    slug: "signal-brand",
    title: "Signal Rebrand & Site",
    industry: "Media",
    serviceTags: ["web-design"],
    teaser:
      "Editorial brand system with motion rules that scale from hero to product UI.",
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
    challenge:
      "Signal outgrew a slide-deck brand. Teams needed motion, layout, and tone guidance that worked in dark UI.",
    execution:
      "New typographic stack, tokenized palettes, motion curves, and a marketing site that demonstrates the system, not just describes it.",
    results: [
      "Brand consistency score +22 (internal audit)",
      "Campaign build time −40%",
      "Press pickup citing clarity of positioning",
    ],
    testimonial: {
      quote:
        "Our designers and engineers are speaking the same language now. That alone paid for the engagement.",
      name: "Jordan Blake",
      role: "Creative Director, Signal",
    },
  },
  {
    slug: "vertex-logistics",
    title: "Vertex Ops Dashboard",
    industry: "Logistics",
    serviceTags: ["web-design"],
    teaser:
      "Dense operational data made legible for dispatch leads on the floor.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
    challenge:
      "Spreadsheets and legacy dashboards could not surface exceptions fast enough during peak season.",
    execution:
      "Role-based views, alert routing, and a design system tuned for glanceability on tablets.",
    results: [
      "Exception response time −31%",
      "Training time for new leads −2 shifts",
      "Adoption 94% within six weeks",
    ],
    testimonial: {
      quote:
        "It is rare for an agency to respect operational reality. saviane shipped something crews actually use.",
      name: "Sam Okonkwo",
      role: "COO, Vertex Logistics",
    },
  },
  {
    slug: "lumen-health",
    title: "Lumen Patient Intake",
    industry: "Healthcare",
    serviceTags: ["web-design", "ai-automation"],
    teaser:
      "Accessible intake flows with smart routing and plain-language confirmations.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    challenge:
      "Paper intake drove errors and delayed care coordination. Compliance requirements discouraged experimentation.",
    execution:
      "Stepped forms with validation, offline-tolerant saves, and automation limited to non-clinical triage, always with clinician review.",
    results: [
      "Form error rate −46%",
      "No-show rate −6 pts",
      "Passed accessibility audit first pass",
    ],
    testimonial: {
      quote:
        "Thoughtful, careful work. Patients understand what happens next, that trust matters.",
      name: "Dr. Amira Hassan",
      role: "Chief Clinical Informatics, Lumen",
    },
  },
];

export function getCaseBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
