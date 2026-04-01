import { createClient } from "@/lib/supabase/server";
import { isUserAdminEmail } from "@/lib/admin/allowlist";
import type { User } from "@supabase/supabase-js";

export type AdminSessionResult =
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403 };

export async function requireAdminSession(): Promise<AdminSessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401 };
  }
  if (!isUserAdminEmail(user.email)) {
    return { ok: false, status: 403 };
  }
  return { ok: true, user };
}
