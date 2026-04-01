export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  category: string;
  /** Cover for blog cards (remote URL, e.g. Unsplash). */
  coverImage: string;
  author: string;
  body: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "ai-automation-roi",
    title: "A sane framework for AI automation ROI",
    excerpt:
      "Before you buy another seat of generic AI, map the workflow, failure cost, and human checkpoint. Here is the worksheet we use with clients.",
    date: "2026-03-12",
    readMinutes: 8,
    category: "Automation",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format&fit=crop",
    author: "saviane",
    body: [
      "Most automation pitches skip the hard part: defining what “done” means when the model is wrong. We start with a simple grid, task frequency, cost of error, and reversibility, and only then choose tooling.",
      "When error cost is high, we design for human-in-the-loop by default. That is not a compromise; it is how you ship without gambling your brand.",
      "Finally, we instrument everything. If you cannot trace which step failed, you do not have automation, you have a demo.",
    ],
  },
  {
    slug: "design-systems-that-survive",
    title: "Design systems that survive the first refactor",
    excerpt:
      "Tokens alone are not enough. Here is how we tie Figma decisions to code ownership so the system stays honest.",
    date: "2026-02-28",
    readMinutes: 6,
    category: "Design",
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop",
    author: "saviane",
    body: [
      "Systems die when they are owned by a single hero designer. We co-own components with engineering, publish changelogs, and treat breaking changes like API semver.",
      "Documentation lives next to usage: Storybook or inline examples in the repo, not a PDF nobody opens.",
      "The goal is not completeness on day one, it is a credible path for contributions without chaos.",
    ],
  },
  {
    slug: "web-performance-budgets",
    title: "Performance budgets that executives actually understand",
    excerpt:
      "Translate LCP and CLS into revenue risk and support load. A short guide for product leaders.",
    date: "2026-02-10",
    readMinutes: 5,
    category: "Engineering",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
    author: "saviane",
    body: [
      "Technical metrics matter, but they need a business frame. We correlate slow pages with funnel drop-offs and attach remediation to quarterly goals.",
      "Budgets should be per-template, not site-wide averages. Your marketing homepage and logged-in dashboard have different constraints.",
      "Review budgets in CI. If regressions ship silently, the budget was fiction.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatBlogDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
