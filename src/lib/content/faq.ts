export type FaqItem = {
  q: string;
  a: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "process",
    label: "Process",
    items: [
      {
        q: "How does a typical engagement start?",
        a: "We begin with a focused discovery week: goals, constraints, stakeholders, and success metrics. You receive a written plan with phases, dependencies, and a realistic timeline before build work ramps.",
      },
      {
        q: "Do you work with our internal team?",
        a: "Yes. We embed alongside product, design, and engineering, shared repos, async updates, and weekly demos. Handoff is continuous, not a big reveal at the end.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    items: [
      {
        q: "How do you price projects?",
        a: "Most work is scoped as phased milestones with fixed deliverables. When exploration is required, we can start with a paid discovery sprint. Enterprise retainers are available for ongoing roadmaps.",
      },
      {
        q: "Can we start small?",
        a: "Absolutely. Many clients begin with a technical or brand audit, a landing system, or a single automation pilot before broader platform work.",
      },
    ],
  },
  {
    id: "timeline",
    label: "Timeline",
    items: [
      {
        q: "How long does a marketing site take?",
        a: "A polished marketing site with CMS integration commonly lands between 6–10 weeks depending on content readiness, languages, and compliance reviews.",
      },
      {
        q: "What slows projects down?",
        a: "Ambiguous approvals, late content, and third-party integrations without owners. We surface these risks early so they do not become surprises.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    items: [
      {
        q: "What stack do you recommend?",
        a: "We default to Next.js, TypeScript, Tailwind, and shadcn-style component patterns for marketing and product surfaces. Backend choices depend on your compliance and team skills, often Supabase or your existing cloud.",
      },
      {
        q: "How do you handle AI safety?",
        a: "Least-privilege data access, structured outputs, evals, logging, and explicit human review for high-stakes decisions. We document failure modes and rollback paths before go-live.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      {
        q: "What happens after launch?",
        a: "We offer a warranty window for defects, optional monitoring, and retainer hours for iteration. Many clients keep a small monthly slot for experiments and performance tuning.",
      },
    ],
  },
];
