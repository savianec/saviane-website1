import { isValid, parse } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidDiscoveryCallTime } from "@/lib/discovery-call-slots";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    company: z.string().min(1),
    industry: z.string().min(1),
    brief: z.string().min(20),
    timeline: z.string().min(1),
    budget: z.string().min(1),
    services: z.array(z.string()).min(1),
    contactPreference: z.enum(["email", "phone", "meeting"]),
    phone: z.string().optional(),
    discoveryCallDate: z.string().optional(),
    discoveryCallTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contactPreference !== "meeting") return;
    const raw = data.discoveryCallDate?.trim() ?? "";
    if (!raw) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "discoveryCallDate required when contactPreference is meeting",
        path: ["discoveryCallDate"],
      });
      return;
    }
    const d = parse(raw, "yyyy-MM-dd", new Date());
    if (!isValid(d)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid discoveryCallDate",
        path: ["discoveryCallDate"],
      });
      return;
    }
    if (!isValidDiscoveryCallTime(data.discoveryCallTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "discoveryCallTime must be a valid slot between 7am and 7pm",
        path: ["discoveryCallTime"],
      });
    }
  });

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid form data", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const row = {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      industry: parsed.data.industry,
      brief: parsed.data.brief,
      timeline: parsed.data.timeline,
      budget: parsed.data.budget,
      services: parsed.data.services,
      contact_preference: parsed.data.contactPreference,
      phone: parsed.data.phone?.trim() || null,
      discovery_call_date: parsed.data.discoveryCallDate?.trim() || null,
      discovery_call_time: parsed.data.discoveryCallTime?.trim() || null,
    };

    try {
      const admin = createAdminClient();
      const { error } = await admin.from("enquiries").insert(row);
      if (error) {
        console.error("[contact] enquiries insert failed", error);
        return NextResponse.json(
          { message: "Could not save your request. Please try again or email us directly." },
          { status: 500 }
        );
      }
    } catch {
      // No service role / Supabase: keep local/dev behaviour (log only)
      console.info("[contact] project request (not persisted; add SUPABASE_SERVICE_ROLE_KEY)", {
        ...parsed.data,
        receivedAt: new Date().toISOString(),
      });
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            message:
              "Contact form is not configured for this environment. Please email us directly.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
