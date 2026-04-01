"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminProjectRow } from "@/components/admin/admin-project-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ClientRow = {
  id: string;
  name: string;
  company: string | null;
};

const STATUS_OPTIONS = [
  { value: "discovery", label: "Discovery" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "review", label: "Review" },
  { value: "delivered", label: "Delivered" },
] as const;

function clientLabel(c: ClientRow) {
  return c.company?.trim() || c.name?.trim() || c.id;
}

export function AdminNewProjectForm() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string>("discovery");
  const [progress, setProgress] = useState(0);
  const [teamLead, setTeamLead] = useState("saviane");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nextMilestone, setNextMilestone] = useState("");
  const [nextMilestoneDue, setNextMilestoneDue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/clients");
        const data = (await res.json()) as {
          clients?: ClientRow[];
          error?: unknown;
        };
        if (!res.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Failed to load clients"
          );
        }
        if (!cancelled) {
          setClients(data.clients ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load clients");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clientId) {
      setError("Select a client.");
      return;
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Project name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        client_id: clientId,
        name: trimmedName,
        status,
        progress,
        team_lead: teamLead.trim() || "saviane",
      };
      const desc = description.trim();
      if (desc) body.description = desc;
      if (startDate) body.start_date = startDate;
      if (endDate) body.end_date = endDate;
      if (nextMilestone.trim()) body.next_milestone = nextMilestone.trim();
      if (nextMilestoneDue.trim()) {
        body.next_milestone_due = nextMilestoneDue.trim();
      }

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        project?: AdminProjectRow;
        error?: unknown;
      };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error ?? res.statusText)
        );
      }
      if (!data.project?.id) throw new Error("Invalid response");
      router.push(`/admin/projects/${data.project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          New project
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Creates a portal project for the selected client. JSON fields
          (deliverables, team, files) start empty and can be extended later.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/admin/projects" className="text-primary hover:underline">
            ← All projects
          </Link>
        </p>
      </div>

      {loadError ? (
        <p className="text-destructive text-sm">{loadError}</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm whitespace-pre-wrap">{error}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Required: client and name. Dates default to today if omitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={clientId || undefined}
                onValueChange={(v) => setClientId(v ?? "")}
              >
                <SelectTrigger id="client" className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {clientLabel(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Website redesign"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) =>
                    setProgress(
                      Math.min(100, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
                  <SelectTrigger id="new_status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="team_lead">Team lead</Label>
              <Input
                id="team_lead"
                value={teamLead}
                onChange={(e) => setTeamLead(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Shown on the client portal overview"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start date (optional)</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End date (optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="next_milestone">Next milestone (optional)</Label>
                <Input
                  id="next_milestone"
                  value={nextMilestone}
                  onChange={(e) => setNextMilestone(e.target.value)}
                  placeholder="Defaults to Kickoff"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_milestone_due">Milestone due (optional)</Label>
                <Input
                  id="next_milestone_due"
                  value={nextMilestoneDue}
                  onChange={(e) => setNextMilestoneDue(e.target.value)}
                  placeholder="Date or label"
                />
              </div>
            </div>
            <Button type="submit" disabled={submitting || clients.length === 0}>
              {submitting ? "Creating…" : "Create project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
