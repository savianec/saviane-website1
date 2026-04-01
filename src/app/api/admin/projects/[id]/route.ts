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

const patchSchema = z
  .object({
    client_id: z.string().refine(isPostgresUuid, "Invalid client id").optional(),
    progress: z.number().int().min(0).max(100).optional(),
    status: statusSchema.optional(),
    team_lead: z.string().min(1).max(500).optional(),
    description: z.string().min(1).max(50_000).optional(),
    next_milestone: z.string().min(1).max(500).optional(),
    next_milestone_due: z.string().min(1).max(100).optional(),
    last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    appendMessage: z
      .object({
        text: z.string().min(1).max(10_000),
        author: z.string().max(200).optional(),
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.client_id !== undefined ||
      data.progress !== undefined ||
      data.status !== undefined ||
      data.team_lead !== undefined ||
      data.description !== undefined ||
      data.next_milestone !== undefined ||
      data.next_milestone_due !== undefined ||
      data.last_update !== undefined ||
      data.appendMessage !== undefined,
    { message: "At least one field is required" }
  );

type ProjectMessage = { author: string; text: string; date: string };

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function asMessageArray(v: unknown): ProjectMessage[] {
  return Array.isArray(v) ? (v as ProjectMessage[]) : [];
}

async function getAdmin() {
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const result = await getAdmin();
  if ("error" in result) return result.error;
  const { admin } = result;

  const { id } = await context.params;
  if (!isPostgresUuid(id)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("projects")
    .select(ADMIN_PROJECT_EMBED_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const result = await getAdmin();
  if ("error" in result) return result.error;
  const { admin } = result;

  const { id } = await context.params;
  if (!isPostgresUuid(id)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;

  if (body.client_id !== undefined) {
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
  }

  const { data: existing, error: fetchErr } = await admin
    .from("projects")
    .select(
      "id, progress, status, team_lead, last_update, description, next_milestone, next_milestone_due, messages"
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};

  if (body.client_id !== undefined) updates.client_id = body.client_id;
  if (body.progress !== undefined) updates.progress = body.progress;
  if (body.status !== undefined) updates.status = body.status;
  if (body.team_lead !== undefined) updates.team_lead = body.team_lead;
  if (body.description !== undefined) updates.description = body.description;
  if (body.next_milestone !== undefined) updates.next_milestone = body.next_milestone;
  if (body.next_milestone_due !== undefined) {
    updates.next_milestone_due = body.next_milestone_due;
  }

  let messages = asMessageArray(existing.messages);
  if (body.appendMessage) {
    messages = [
      ...messages,
      {
        author: body.appendMessage.author?.trim() || "saviane",
        text: body.appendMessage.text.trim(),
        date: todayISODate(),
      },
    ];
    updates.messages = messages;
  }

  const portalVisibleScalarChanged =
    body.progress !== undefined ||
    body.status !== undefined ||
    body.team_lead !== undefined ||
    body.description !== undefined ||
    body.next_milestone !== undefined ||
    body.next_milestone_due !== undefined;

  const shouldBumpLastUpdate =
    portalVisibleScalarChanged || body.appendMessage !== undefined;
  if (shouldBumpLastUpdate) {
    updates.last_update =
      body.last_update !== undefined ? body.last_update : todayISODate();
  } else if (body.last_update !== undefined) {
    updates.last_update = body.last_update;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data: updated, error: updateErr } = await admin
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select(ADMIN_PROJECT_EMBED_SELECT)
    .single();

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ project: updated });
}
