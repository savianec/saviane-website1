import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Service-role client for admin-only server code. Bypasses RLS.
 * Never import from client components or pass the key to the browser.
 */
export function createAdminClient() {
  const publicEnv = getSupabasePublicEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!publicEnv || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_* or SUPABASE_SERVICE_ROLE_KEY for admin operations."
    );
  }

  return createClient(publicEnv.url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
