"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";
import {
  DISCOVERY_CALL_TIME_VALUES,
  formatDiscoveryTimeLabel,
  isValidDiscoveryCallTime,
} from "@/lib/discovery-call-slots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format, isValid, parse } from "date-fns";
import { GlassCalendar } from "@/components/ui/glass-calendar";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    company: z.string().min(1, "Company is required"),
    industry: z.string().min(1, "Select an industry"),
    brief: z.string().min(20, "Add a bit more detail (20+ characters)"),
    timeline: z.string().min(1, "Select a timeline"),
    budget: z.string().min(1, "Select a budget range"),
    services: z.array(z.string()).min(1, "Pick at least one service"),
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
        message: "Pick a date for your discovery call",
        path: ["discoveryCallDate"],
      });
      return;
    }
    const d = parse(raw, "yyyy-MM-dd", new Date());
    if (!isValid(d)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date",
        path: ["discoveryCallDate"],
      });
      return;
    }
    if (!isValidDiscoveryCallTime(data.discoveryCallTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a time between 7:00 AM and 7:00 PM",
        path: ["discoveryCallTime"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const serviceOptions = [
  { id: "web", label: "Website design & development" },
  { id: "ai", label: "AI automation & integration" },
  {
    id: "social",
    label: "Social media content (plan, edit, deliver)",
  },
];

export function ProjectRequestForm() {
  const [step, setStep] = React.useState(0);
  const totalSteps = 5;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      industry: "",
      brief: "",
      timeline: "",
      budget: "",
      services: [],
      contactPreference: "email",
      phone: "",
      discoveryCallDate: "",
      discoveryCallTime: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const services = watch("services");
  const discoveryCallDateStr = watch("discoveryCallDate") ?? "";
  const discoveryCallTimeStr = watch("discoveryCallTime") ?? "";
  const contactPreference = useWatch({
    control,
    name: "contactPreference",
    defaultValue: "email",
  });

  React.useEffect(() => {
    if (contactPreference !== "meeting") {
      setValue("discoveryCallDate", "", { shouldValidate: true });
      setValue("discoveryCallTime", "", { shouldValidate: true });
    }
  }, [contactPreference, setValue]);

  async function nextStep() {
    const fields: Record<number, (keyof FormValues)[]> = {
      0: ["name", "email", "company", "industry"],
      1: ["brief", "timeline", "budget"],
      2: ["services"],
      3: ["contactPreference"],
    };
    const toValidate = [...(fields[step] ?? [])];
    const ok = await trigger(toValidate);
    if (ok && step < totalSteps - 1) setStep((s) => s + 1);
  }

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.message ?? "Something went wrong");
        return;
      }
      toast.success("Thanks, we will reply within one business day.");
      form.reset();
      setStep(0);
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-card/40 mx-auto max-w-lg rounded-xl border p-6 md:p-8 min-[480px]:max-w-xl"
    >
      <div className="mb-8 flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-muted-foreground text-sm">
        Step {step + 1} of {totalSteps}
      </p>

      {step === 0 ? (
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" className="mt-1.5" {...register("name")} />
            {errors.name ? (
              <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              className="mt-1.5"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" className="mt-1.5" {...register("company")} />
            {errors.company ? (
              <p className="text-destructive mt-1 text-xs">
                {errors.company.message}
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={watch("industry")}
              onValueChange={(v) =>
                setValue("industry", v ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger id="industry" className="mt-1.5 w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS / Technology</SelectItem>
                <SelectItem value="commerce">E-commerce</SelectItem>
                <SelectItem value="finance">Financial services</SelectItem>
                <SelectItem value="health">Healthcare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.industry ? (
              <p className="text-destructive mt-1 text-xs">
                {errors.industry.message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="brief">What are you building?</Label>
            <Textarea
              id="brief"
              rows={5}
              className="mt-1.5"
              placeholder="Goals, audience, constraints, links…"
              {...register("brief")}
            />
            {errors.brief ? (
              <p className="text-destructive mt-1 text-xs">{errors.brief.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Select
              value={watch("timeline")}
              onValueChange={(v) =>
                setValue("timeline", v ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger id="timeline" className="mt-1.5 w-full">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">ASAP (&lt; 6 weeks)</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
                <SelectItem value="half">Next 3–6 months</SelectItem>
                <SelectItem value="explore">Exploring options</SelectItem>
              </SelectContent>
            </Select>
            {errors.timeline ? (
              <p className="text-destructive mt-1 text-xs">
                {errors.timeline.message}
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="budget">Budget range</Label>
            <Select
              value={watch("budget")}
              onValueChange={(v) =>
                setValue("budget", v ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger id="budget" className="mt-1.5 w-full">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1000">$0 – $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 – $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 – $10,000</SelectItem>
                <SelectItem value="10000-20000">$10,000 – $20,000</SelectItem>
                <SelectItem value="20000+">$20,000+</SelectItem>
              </SelectContent>
            </Select>
            {errors.budget ? (
              <p className="text-destructive mt-1 text-xs">{errors.budget.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6 space-y-3">
          <Label>Services needed</Label>
          {serviceOptions.map((opt) => (
            <label
              key={opt.id}
              className="border-border hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <Checkbox
                checked={services?.includes(opt.id)}
                onCheckedChange={(checked) => {
                  const next = new Set(services ?? []);
                  if (checked) next.add(opt.id);
                  else next.delete(opt.id);
                  setValue("services", [...next], { shouldValidate: true });
                }}
              />
              <span className="text-sm leading-snug">{opt.label}</span>
            </label>
          ))}
          {errors.services ? (
            <p className="text-destructive text-xs">{errors.services.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className={step === 3 ? "mt-6 space-y-4" : "hidden"} aria-hidden={step !== 3}>
        <Label>How should we follow up?</Label>
        <div className="space-y-2">
          {(
            [
              ["email", "Email"],
              ["phone", "Phone"],
              ["meeting", "Calendar meeting"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="border-border flex cursor-pointer items-center gap-3 rounded-lg border p-3"
            >
              <input
                type="radio"
                value={value}
                className="text-primary accent-primary size-4"
                {...register("contactPreference")}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
        {contactPreference === "phone" ? (
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" className="mt-1.5" {...register("phone")} />
          </div>
        ) : null}
        <p className="text-muted-foreground text-sm">
          Next, you will confirm a discovery call date if you chose calendar
          meeting, or review and send your request.
        </p>
      </div>

      {step === 4 ? (
        <div className="mt-6 space-y-4">
          {contactPreference === "meeting" ? (
            <>
              <div>
                <Label>Discovery call date</Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  Choose a day, then pick a time between 7:00 AM and 7:00 PM.
                </p>
              </div>
              <GlassCalendar
                key="discovery-calendar"
                className="mx-auto min-h-[220px] w-full max-w-[360px] sm:mx-0"
                selectedDate={
                  discoveryCallDateStr
                    ? parse(
                        discoveryCallDateStr,
                        "yyyy-MM-dd",
                        new Date()
                      )
                    : null
                }
                onDateSelect={(d) => {
                  const next = format(d, "yyyy-MM-dd");
                  if (next !== discoveryCallDateStr) {
                    setValue("discoveryCallTime", "", { shouldValidate: true });
                  }
                  setValue("discoveryCallDate", next, {
                    shouldValidate: true,
                  });
                }}
              />
              {discoveryCallDateStr ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Date:{" "}
                    <span className="text-foreground font-medium">
                      {format(
                        parse(
                          discoveryCallDateStr,
                          "yyyy-MM-dd",
                          new Date()
                        ),
                        "EEEE, MMMM d, yyyy"
                      )}
                    </span>
                  </p>
                  <div>
                    <Label className="text-foreground">Preferred time</Label>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Times shown in your local timezone. We will confirm by
                      email.
                    </p>
                    <div
                      className="mt-3 grid max-h-52 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4"
                      role="listbox"
                      aria-label="Preferred call time"
                    >
                      {DISCOVERY_CALL_TIME_VALUES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="option"
                          aria-selected={discoveryCallTimeStr === t}
                          className={cn(
                            buttonVariants({
                              variant:
                                discoveryCallTimeStr === t
                                  ? "default"
                                  : "outline",
                              size: "sm",
                            }),
                            "w-full font-normal"
                          )}
                          onClick={() =>
                            setValue("discoveryCallTime", t, {
                              shouldValidate: true,
                            })
                          }
                        >
                          {formatDiscoveryTimeLabel(t)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {discoveryCallTimeStr ? (
                    <p className="text-muted-foreground text-sm">
                      Scheduled:{" "}
                      <span className="text-foreground font-medium">
                        {format(
                          parse(
                            discoveryCallDateStr,
                            "yyyy-MM-dd",
                            new Date()
                          ),
                          "MMM d, yyyy"
                        )}{" "}
                        · {formatDiscoveryTimeLabel(discoveryCallTimeStr)}
                      </span>
                    </p>
                  ) : null}
                  {errors.discoveryCallTime ? (
                    <p className="text-destructive text-xs">
                      {errors.discoveryCallTime.message}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {errors.discoveryCallDate ? (
                <p className="text-destructive text-xs">
                  {errors.discoveryCallDate.message}
                </p>
              ) : null}
            </>
          ) : (
            <div className="space-y-2">
              <Label>Almost done</Label>
              <p className="text-muted-foreground text-sm">
                {contactPreference === "phone"
                  ? "We will call you using the number you provided."
                  : "We will email you at the address you provided."}{" "}
                Submit your request when you are ready.
              </p>
            </div>
          )}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < totalSteps - 1 ? (
          <Button type="button" onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Submit request"}
          </Button>
        )}
      </div>
    </form>
  );
}
