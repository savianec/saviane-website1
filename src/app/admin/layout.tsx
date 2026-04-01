import Link from "next/link";
import { SavianeLogo } from "@/components/site/logo";

export const metadata = {
  title: "Admin",
  description: "Provision client portal accounts",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-dvh">
      <header className="border-border flex h-14 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-foreground flex items-center gap-2 text-sm font-semibold"
          >
            <SavianeLogo showWordmark markSize={22} />
            <span className="text-muted-foreground font-normal">Admin</span>
          </Link>
          <nav className="text-muted-foreground flex items-center gap-4 text-sm">
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors"
            >
              Provision
            </Link>
            <Link
              href="/admin/projects"
              className="hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/admin/enquiries"
              className="hover:text-foreground transition-colors"
            >
              Enquiries
            </Link>
          </nav>
        </div>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Marketing site
        </Link>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">{children}</div>
    </div>
  );
}
