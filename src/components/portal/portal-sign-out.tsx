"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export function PortalSignOut() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/app/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "text-sidebar-foreground hover:text-sidebar-primary w-full justify-start gap-2"
      )}
    >
      <LogOut className="size-4" />
      <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
    </button>
  );
}
