/**
 * Public Supabase env (safe for browser; values are in NEXT_PUBLIC_*).
 */
export function getSupabasePublicEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

const CONFIG_HELP = `Missing Supabase environment variables.

Add a file at apps/web/.env.local (gitignored) with:

  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

Copy apps/web/.env.example as a template. Values: Supabase Dashboard → Project Settings → API.

Restart the Next.js dev server after saving .env.local.`;

export function requireSupabasePublicEnv(): { url: string; anonKey: string } {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(CONFIG_HELP);
  }
  return env;
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}
