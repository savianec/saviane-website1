export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  problem: string;
  solution: string;
  process: { title: string; description: string }[];
  resourceLabel: string;
};

export const services: Service[] = [
  {
    slug: "web-design",
    title: "Website Design & Development",
    short:
      "Performance-led sites with clear story, conversion paths, and maintainable code.",
    icon: "layout",
    problem:
      "Most marketing sites look fine in Figma but fail in production: slow LCP, vague messaging, and brittle components that teams are afraid to touch.",
    solution:
      "We design in the browser, validate with analytics-ready structure, and ship Next.js builds your team can extend. Accessibility and SEO are defaults, not add-ons.",
    process: [
      {
        title: "Discovery & IA",
        description:
          "Stakeholder interviews, sitemap, and measurable goals tied to funnel stages.",
      },
      {
        title: "UX & UI systems",
        description:
          "Component library in code, content model, and responsive patterns tested on real devices.",
      },
      {
        title: "Build & integrate",
        description:
          "Next.js App Router, CMS hooks, forms, and analytics events wired for iteration.",
      },
      {
        title: "Launch & handoff",
        description:
          "Playbooks, monitoring, and a clean repo so your engineers stay productive.",
      },
    ],
    resourceLabel: "Web strategy checklist",
  },
  {
    slug: "ai-automation",
    title: "AI Automation & Integration",
    short:
      "Practical automations that remove repetitive work, without risky black-box prompts.",
    icon: "bot",
    problem:
      "Teams adopt AI tools that create shadow workflows: inconsistent outputs, no audit trail, and zero ownership when something breaks.",
    solution:
      "We map processes, choose the smallest reliable model for each step, and add human checkpoints where stakes are high. Everything is observable and versioned.",
    process: [
      {
        title: "Workflow audit",
        description:
          "Map inputs, approvals, and failure modes before any model touches production data.",
      },
      {
        title: "Pilot design",
        description:
          "Structured prompts, JSON schemas, evals, and rollback paths for edge cases.",
      },
      {
        title: "Integration",
        description:
          "APIs, queues, and logging that fit your existing stack, Supabase, Stripe, CRMs, or internal tools.",
      },
      {
        title: "Governance",
        description:
          "Access control, retention policy, and runbooks so ops stays in control.",
      },
    ],
    resourceLabel: "AI automation readiness guide",
  },
  {
    slug: "social-content",
    title: "Social Media Content, Made Simple",
    short:
      "We build the content plan, you record the footage, we edit and return post-ready clips, a cost-effective way to stay consistent on social.",
    icon: "video",
    problem:
      "Agency-style shoots are costly, and ad-hoc clips rarely compound. Teams need a steady feed without hiring a full production bench.",
    solution:
      "You get a clear plan and shot list aligned to your brand, you capture on the schedule that fits you, then we handle the edit pass: pacing, captions, simple motion, and exports sized for each channel. Repeatable, predictable, and priced for ongoing use.",
    process: [
      {
        title: "Content plan & shot list",
        description:
          "Pillars, formats, hooks, and a capture checklist so recording days stay short and on-message.",
      },
      {
        title: "You record",
        description:
          "Film to the plan with the gear you already have, phone or camera, we only need clean audio and usable takes.",
      },
      {
        title: "We edit & package",
        description:
          "Cuts, subtitles, light graphics, and aspect ratios for feed, story, or short-form, ready to upload.",
      },
      {
        title: "Delivery & iteration",
        description:
          "Named files, posting notes, and one structured revision round so your team can publish with confidence.",
      },
    ],
    resourceLabel: "Social content planning worksheet",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
