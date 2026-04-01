import Link from "next/link";
import { Container } from "@/components/site/container";
import { SavianeLogo } from "@/components/site/logo";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Company: [
    { href: "/about", label: "Meet our team" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/app", label: "Client portal" },
  ],
  Services: [
    { href: "/services/web-design", label: "Web design" },
    { href: "/services/ai-automation", label: "AI automation" },
    { href: "/services/social-content", label: "Social content" },
  ],
  Legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-border bg-card/40 mt-auto border-t">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex hover:opacity-90 transition-opacity">
              <SavianeLogo markSize={26} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium web design and AI automation for teams that need craft,
              clarity, and shipping discipline.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-foreground mb-3 text-sm font-semibold">
              Newsletter
            </h3>
            <p className="text-muted-foreground mb-3 text-sm">
              Occasional notes on shipping, automation, and design systems, no
              spam.
            </p>
            <form className="flex flex-col gap-2 sm:flex-row" action="#" method="post">
              <Input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email for newsletter"
                className="bg-background"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <Separator className="my-10" />
        <div className="text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} saviane. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
