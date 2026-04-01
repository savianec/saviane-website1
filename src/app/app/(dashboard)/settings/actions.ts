"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

export async function updateProfileSettings(
  _prev: UpdateProfileResult | undefined,
  formData: FormData
): Promise<UpdateProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not signed in." };
  }

  const display_name = String(formData.get("display_name") ?? "").trim();
  if (!display_name) {
    return { ok: false, error: "Display name is required." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const notification_prefs = {
    project_updates: formData.get("notify_project") === "on",
    invoice_reminders: formData.get("notify_invoice") === "on",
    marketing_digest: formData.get("notify_marketing") === "on",
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name,
      email: email || null,
      notification_prefs,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/app");
  revalidatePath("/app/settings");
  return { ok: true };
}
