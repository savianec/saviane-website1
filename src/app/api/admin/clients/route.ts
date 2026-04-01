import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json(
      { error: session.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: session.status }
    );
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server is not configured for admin (missing service role key)." },
      { status: 503 }
    );
  }

  const { data, error } = await admin
    .from("clients")
    .select(
      `
      id,
      name,
      company,
      created_at,
      profiles ( id, email, display_name, phone )
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ clients: data ?? [] });
}
