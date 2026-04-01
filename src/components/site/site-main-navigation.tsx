"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu-1";
import { services } from "@/lib/content/services";

const mainNav = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Meet our team" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteMainNavigation() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="max-w-none flex-1 justify-end">
      <NavigationMenuList className="flex-wrap justify-end gap-0 sm:gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[520px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink
                  closeOnClick
                  render={
                    <Link
                      href="/services"
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                    />
                  }
                >
                  <div className="mt-4 mb-2 text-lg font-medium">All services</div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    Strategy, design, and AI automation for teams that want clarity and speed.
                  </p>
                </NavigationMenuLink>
              </li>
              {services.map((service) => (
                <li key={service.slug}>
                  <NavigationMenuLink
                    closeOnClick
                    render={<Link href={`/services/${service.slug}`} />}
                  >
                    <div className="text-sm leading-none font-medium">{service.title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      {service.short}
                    </p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {mainNav.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              closeOnClick
              active={pathname === item.href}
              render={<Link href={item.href} className={navigationMenuTriggerStyle()} />}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>

      <NavigationMenuPositioner>
        <NavigationMenuPopup />
      </NavigationMenuPositioner>
    </NavigationMenu>
  );
}
