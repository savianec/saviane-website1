import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Blog7Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
}

export interface Blog7Props {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  posts: Blog7Post[];
  className?: string;
}

function PostLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Blog7({
  tagline = "Latest updates",
  heading = "Blog posts",
  description = "Discover the latest trends, tips, and best practices in modern web development.",
  buttonText = "View all articles",
  buttonUrl = "#",
  posts,
  className,
}: Blog7Props) {
  const ctaExternal = buttonUrl.startsWith("http");
  const ctaClassName = cn(
    buttonVariants({ variant: "link", size: "default" }),
    "h-auto px-0 py-2 text-base underline-offset-4 w-full sm:w-auto"
  );

  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:gap-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 md:mb-5">
            {tagline}
          </Badge>
          <h1 className="font-display text-foreground mb-3 text-pretty text-3xl font-semibold tracking-tight md:mb-4 md:text-4xl lg:mb-5 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h1>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-sm leading-relaxed md:mb-8 md:text-base lg:text-lg">
            {description}
          </p>
          {ctaExternal ? (
            <a href={buttonUrl} className={ctaClassName} target="_blank" rel="noopener noreferrer">
              {buttonText}
              <ArrowRight className="ml-2 size-4" />
            </a>
          ) : (
            <Link href={buttonUrl} className={ctaClassName}>
              {buttonText}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          )}
        </div>

        <div
          id="blog-posts"
          className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {posts.map((post) => {
            const ext = post.url.startsWith("http");
            return (
              <Card
                key={post.id}
                className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden p-0 py-0 shadow-sm ring-1 ring-border/60"
              >
                <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                  {ext ? (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block size-full transition-opacity duration-200 hover:opacity-90"
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </a>
                  ) : (
                    <Link
                      href={post.url}
                      className="relative block size-full transition-opacity duration-200 hover:opacity-90"
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </Link>
                  )}
                </div>
                <CardHeader className="gap-2 pb-2">
                  <Badge variant="secondary" className="w-fit">
                    {post.label}
                  </Badge>
                  <CardTitle className="text-base leading-snug font-semibold md:text-lg">
                    <PostLink
                      href={post.url}
                      className="text-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {post.title}
                    </PostLink>
                  </CardTitle>
                  <p className="text-muted-foreground text-xs">
                    {post.author} · {post.published}
                  </p>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.summary}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto border-0 bg-transparent px-4 pb-4 pt-0">
                  <PostLink
                    href={post.url}
                    className="text-foreground hover:text-primary inline-flex items-center text-sm font-medium hover:underline"
                  >
                    Read more
                    <ArrowRight className="ml-2 size-4" />
                  </PostLink>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
