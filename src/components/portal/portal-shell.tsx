"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Settings,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { SavianeLogo } from "@/components/site/logo";
import { PortalSignOut } from "@/components/portal/portal-sign-out";

export type PortalShellProps = {
  children: React.ReactNode;
  displayName?: string;
  userEmail?: string;
  clientCompany?: string;
  billingCity?: string;
};

const nav = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, match: /^\/app\/?$/ },
  { href: "/app/projects", label: "Projects", icon: FolderKanban, match: /^\/app\/projects/ },
  { href: "/app/invoices", label: "Invoices", icon: FileText, match: /^\/app\/invoices/ },
  { href: "/app/settings", label: "Settings", icon: Settings, match: /^\/app\/settings/ },
];

export function PortalShell({
  children,
  displayName,
  userEmail,
  clientCompany,
  billingCity,
}: PortalShellProps) {
  const pathname = usePathname();
  const headerLabel =
    displayName ?? userEmail ?? (clientCompany ? `${clientCompany}` : "Portal");
  const headerSub =
    displayName && userEmail
      ? userEmail
      : billingCity
        ? billingCity
        : undefined;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-sidebar-border border-b px-4 py-3">
          <Link
            href="/app"
            className="text-sidebar-foreground hover:text-sidebar-primary flex items-center gap-2 text-sm font-semibold tracking-tight transition-colors"
          >
            <SavianeLogo
              showWordmark
              markSize={22}
              wordmarkClassName="text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Client portal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active = item.match.test(pathname);
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        render={<Link href={item.href} />}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-sidebar-border border-t space-y-1 p-2">
          <PortalSignOut />
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-sidebar-foreground hover:text-sidebar-primary w-full justify-start gap-2"
            )}
          >
            <ExternalLink className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">
              Marketing site
            </span>
          </Link>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="border-border flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 h-6" />
          <span className="text-muted-foreground flex min-w-0 flex-col text-xs sm:flex-row sm:items-center sm:gap-2">
            <span className="text-foreground truncate font-medium normal-case">
              {headerLabel}
            </span>
            {headerSub ? (
              <span className="truncate normal-case">{headerSub}</span>
            ) : null}
          </span>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
