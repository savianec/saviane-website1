import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(1, "Phone is required").max(80),
  companyName: z.string().min(1, "Company name is required").max(200),
  name: z.string().min(1, "Name is required").max(200),
});

export async function POST(request: Request) {
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
      { error: "Server is not configured for admin provisioning (missing service role key)." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password, phone, companyName, name } = parsed.data;
  const emailNorm = email.trim().toLowerCase();

  let userId: string | null = null;
  let clientId: string | null = null;

  try {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: emailNorm,
      password,
      email_confirm: true,
    });

    if (createErr) {
      const msg = createErr.message.toLowerCase();
      const status = "status" in createErr ? (createErr as { status?: number }).status : undefined;
      if (msg.includes("already") || msg.includes("registered") || status === 422) {
        return NextResponse.json(
          { error: "A user with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    }

    if (!created.user?.id) {
      return NextResponse.json({ error: "User creation returned no id." }, { status: 500 });
    }

    userId = created.user.id;

    const { data: clientRow, error: clientErr } = await admin
      .from("clients")
      .insert({ name, company: companyName })
      .select("id")
      .single();

    if (clientErr) {
      throw new Error(clientErr.message);
    }

    clientId = clientRow.id;

    const { error: profileErr } = await admin.from("profiles").insert({
      id: userId,
      client_id: clientId,
      display_name: name,
      email: emailNorm,
      phone: phone.trim(),
    });

    if (profileErr) {
      throw new Error(profileErr.message);
    }

    return NextResponse.json(
      { ok: true, userId, clientId },
      { status: 201 }
    );
  } catch (e) {
    if (userId) {
      await admin.auth.admin.deleteUser(userId);
    }
    if (clientId) {
      await admin.from("clients").delete().eq("id", clientId);
    }

    const message = e instanceof Error ? e.message : "Provisioning failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
