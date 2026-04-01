"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { FlowButton } from "@/components/ui/flow-button";
import { Container } from "@/components/site/container";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SavianeLogo } from "@/components/site/logo";
import { SiteMainNavigation } from "@/components/site/site-main-navigation";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Meet our team" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-border/80 bg-background/80 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link
          href="/"
          className="text-foreground hover:opacity-90 flex items-center transition-opacity"
        >
          <SavianeLogo />
        </Link>

        <div className="hidden min-w-0 flex-1 justify-end md:flex">
          <SiteMainNavigation />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <FlowButton
            href="/contact"
            text="Start a project"
            className="hidden md:inline-flex"
          />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="font-display text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav
                className="mt-8 flex flex-col gap-1"
                aria-label="Mobile navigation"
              >
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({
                        variant: pathname === item.href ? "secondary" : "ghost",
                      }),
                      "justify-start"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <FlowButton
                  href="/contact"
                  text="Start a project"
                  className="mt-4 w-full max-w-xs self-center"
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
