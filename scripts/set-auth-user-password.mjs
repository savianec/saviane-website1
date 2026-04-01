/**
 * Create or update a Supabase Auth user (password + confirmed email).
 * Uses SUPABASE_SERVICE_ROLE_KEY. Run locally only; never commit secrets.
 *
 * Usage (from apps/web):
 *   node --env-file=.env.local scripts/set-auth-user-password.mjs <email> <password>
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDotEnvLocal() {
  const path = resolve(__dirname, "..", ".env.local");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const [, , emailArg, passwordArg] = process.argv;
if (!emailArg || !passwordArg) {
  console.error(
    "Usage: node --env-file=.env.local scripts/set-auth-user-password.mjs <email> <password>\n" +
      "Or run without --env-file if vars are already in the environment."
  );
  process.exit(1);
}

loadDotEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceRole) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (from .env.local)."
  );
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
const password = passwordArg;

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail() {
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    const users = data?.users ?? [];
    const match = users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (users.length < perPage) return null;
    page += 1;
  }
}

try {
  const existing = await findUserByEmail();
  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    console.log("Updated password and confirmed email for:", data.user.email);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: emailArg.trim(),
      password,
      email_confirm: true,
    });
    if (error) throw error;
    console.log("Created user:", data.user.email);
  }
} catch (e) {
  console.error(e.message ?? e);
  process.exit(1);
}
