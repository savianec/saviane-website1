import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_PROJECT_EMBED_SELECT } from "@/lib/admin/admin-project-select";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPostgresUuid } from "@/lib/validation/postgres-uuid";

const statusSchema = z.enum([
  "discovery",
  "design",
  "development",
  "review",
  "delivered",
]);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const createProjectSchema = z.object({
  client_id: z.string().refine(isPostgresUuid, "Invalid client id"),
  name: z.string().min(1).max(500),
  status: statusSchema.optional(),
  progress: z.number().int().min(0).max(100).optional(),
  team_lead: z.string().min(1).max(500).optional(),
  description: z.string().min(1).max(50_000).optional(),
  start_date: isoDate.optional(),
  end_date: isoDate.optional(),
  next_milestone: z.string().min(1).max(500).optional(),
  next_milestone_due: z.string().min(1).max(100).optional(),
  last_update: isoDate.optional(),
});

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

async function getAdminJson() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return {
      error: NextResponse.json(
        { error: session.status === 401 ? "Unauthorized" : "Forbidden" },
        { status: session.status }
      ),
    };
  }
  try {
    return { admin: createAdminClient() };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Server is not configured for admin (missing service role key)." },
        { status: 503 }
      ),
    };
  }
}

export async function GET(request: Request) {
  const result = await getAdminJson();
  if ("error" in result) return result.error;
  const { admin } = result;

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId")?.trim();

  let query = admin
    .from("projects")
    .select(ADMIN_PROJECT_EMBED_SELECT)
    .order("last_update", { ascending: false });

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(request: Request) {
  const result = await getAdminJson();
  if ("error" in result) return result.error;
  const { admin } = result;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createProjectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const today = todayISODate();
  const startDate = body.start_date ?? today;
  const endDate = body.end_date ?? body.start_date ?? today;

  const { data: clientRow, error: clientErr } = await admin
    .from("clients")
    .select("id")
    .eq("id", body.client_id)
    .maybeSingle();

  if (clientErr) {
    return NextResponse.json({ error: clientErr.message }, { status: 500 });
  }
  if (!clientRow) {
    return NextResponse.json(
      { error: "Unknown client_id (no matching client)." },
      { status: 400 }
    );
  }

  const insert = {
    client_id: body.client_id,
    name: body.name.trim(),
    status: body.status ?? "discovery",
    progress: body.progress ?? 0,
    team_lead: body.team_lead?.trim() ?? "saviane",
    description:
      body.description?.trim() ??
      "Project overview will appear here once details are added.",
    start_date: startDate,
    end_date: endDate,
    next_milestone: body.next_milestone?.trim() ?? "Kickoff",
    next_milestone_due: body.next_milestone_due?.trim() ?? today,
    last_update: body.last_update ?? today,
  };

  const { data: created, error: insertErr } = await admin
    .from("projects")
    .insert(insert)
    .select(ADMIN_PROJECT_EMBED_SELECT)
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ project: created }, { status: 201 });
}
