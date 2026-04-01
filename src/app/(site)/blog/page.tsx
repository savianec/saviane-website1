import { Container } from "@/components/site/container";
import { Blog7, type Blog7Post } from "@/components/ui/blog7";
import { formatBlogDate, posts } from "@/lib/content/blog";

export const metadata = {
  title: "Blog",
  description:
    "Notes on automation ROI, design systems, and performance, written for product and engineering leaders.",
};

function toBlog7Posts(): Blog7Post[] {
  return posts.map((p) => ({
    id: p.slug,
    title: p.title,
    summary: p.excerpt,
    label: p.category,
    author: p.author,
    published: `${formatBlogDate(p.date)} · ${p.readMinutes} min read`,
    url: `/blog/${p.slug}`,
    image: p.coverImage,
  }));
}

export default function BlogPage() {
  return (
    <Container className="py-14 md:py-20">
      <Blog7
        tagline="Journal"
        heading="Thinking in public"
        description="Practical writeups from active client work, no fluff, no paywall."
        buttonText="Browse articles"
        buttonUrl="#blog-posts"
        posts={toBlog7Posts()}
      />
    </Container>
  );
}
