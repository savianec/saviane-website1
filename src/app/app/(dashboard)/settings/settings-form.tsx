"use client";

import { useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  updateProfileSettings,
  type UpdateProfileResult,
} from "./actions";

type Prefs = {
  project_updates?: boolean;
  invoice_reminders?: boolean;
  marketing_digest?: boolean;
};

type Props = {
  displayName: string;
  email: string;
  phoneLabel: string;
  companyLabel: string;
  prefs: Prefs;
};

export function SettingsForm({
  displayName,
  email,
  phoneLabel,
  companyLabel,
  prefs,
}: Props) {
  const [state, formAction, pending] = useActionState<
    UpdateProfileResult | undefined,
    FormData
  >(updateProfileSettings, undefined);

  return (
    <form action={formAction}>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>How we address you on invoices and updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              name="display_name"
              className="mt-1.5"
              defaultValue={displayName}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1.5"
              defaultValue={email}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              className="mt-1.5"
              value={phoneLabel}
              readOnly
              disabled
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Contact your admin to update phone on file.
            </p>
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              className="mt-1.5"
              value={companyLabel}
              readOnly
              disabled
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Company is managed by your workspace admin.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Choose what hits your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="notify_project"
              value="on"
              defaultChecked={prefs.project_updates !== false}
              className="border-input text-primary focus-visible:ring-ring size-4 rounded border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <span className="text-sm">Project updates</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="notify_invoice"
              value="on"
              defaultChecked={prefs.invoice_reminders !== false}
              className="border-input text-primary focus-visible:ring-ring size-4 rounded border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <span className="text-sm">Invoice reminders</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="notify_marketing"
              value="on"
              defaultChecked={prefs.marketing_digest === true}
              className="border-input text-primary focus-visible:ring-ring size-4 rounded border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <span className="text-sm">Marketing digest</span>
          </label>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {state?.ok === true ? (
          <p className="text-muted-foreground text-sm">Saved.</p>
        ) : null}
        {state?.ok === false ? (
          <p className="text-destructive text-sm">{state.error}</p>
        ) : null}
      </div>
    </form>
  );
}
