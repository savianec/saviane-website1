import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { getPostBySlug, posts } from "@/lib/content/blog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  return { title: p?.title ?? "Article", description: p?.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHeader title={post.title} description={post.excerpt} />
      <Container className="py-10 md:py-14">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge>{post.category}</Badge>
          <span className="text-muted-foreground">
            {post.date} · {post.readMinutes} min read
          </span>
        </div>
        <div className="prose prose-invert mt-10 max-w-2xl space-y-6">
          {post.body.map((para, i) => (
            <p
              key={i}
              className="text-muted-foreground leading-relaxed text-[1.05rem]"
            >
              {para}
            </p>
          ))}
        </div>

        <Separator className="my-14" />

        <div className="border-border bg-card/40 rounded-xl border p-6">
          <h2 className="font-display text-lg">Subscribe for the next article</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Drop your email in the site footer, we send a short digest, rarely.
          </p>
        </div>

        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-lg">Related</h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="text-primary hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
