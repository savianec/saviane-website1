"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

const STATUS_OPTIONS = [
  { value: "discovery", label: "Discovery" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "review", label: "Review" },
  { value: "delivered", label: "Delivered" },
] as const;

type ClientRow = {
  id: string;
  name: string;
  company: string | null;
};

function clientOptionLabel(c: ClientRow) {
  return c.company?.trim() || c.name?.trim() || c.id;
}

function toDateInput(v: string) {
  if (!v) return "";
  return v.slice(0, 10);
}

export function AdminEditProjectForm({ initial }: { initial: AdminProjectRow }) {
  const router = useRouter();
  const [project, setProject] = useState(initial);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [clientId, setClientId] = useState(initial.client_id);
  const [progress, setProgress] = useState(initial.progress);
  const [status, setStatus] = useState(initial.status);
  const [teamLead, setTeamLead] = useState(initial.team_lead);
  const [description, setDescription] = useState(initial.description);
  const [nextMilestone, setNextMilestone] = useState(initial.next_milestone);
  const [nextMilestoneDue, setNextMilestoneDue] = useState(
    initial.next_milestone_due
  );
  const [lastUpdate, setLastUpdate] = useState(toDateInput(initial.last_update));
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

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
        if (!cancelled) setClients(data.clients ?? []);
      } catch (e) {
        if (!cancelled) {
          setClientsError(
            e instanceof Error ? e.message : "Failed to load clients"
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const clientOptions = useMemo((): ClientRow[] => {
    const byId = new Map(clients.map((c) => [c.id, c]));
    if (
      project.client_id &&
      project.clients &&
      !byId.has(project.client_id)
    ) {
      return [
        {
          id: project.client_id,
          name: project.clients.name,
          company: project.clients.company,
        },
        ...clients,
      ];
    }
    return clients;
  }, [clients, project.client_id, project.clients]);

  const clientLabel =
    project.clients?.company?.trim() ||
    project.clients?.name?.trim() ||
    "Client";

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: unknown;
      project?: AdminProjectRow;
    };
    if (!res.ok) {
      const err =
        typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error ?? res.statusText);
      throw new Error(err);
    }
    if (!data.project) throw new Error("Invalid response");
    return data.project;
  }

  function syncFromProject(next: AdminProjectRow) {
    setProject(next);
    setClientId(next.client_id);
    setProgress(next.progress);
    setStatus(next.status);
    setTeamLead(next.team_lead);
    setDescription(next.description);
    setNextMilestone(next.next_milestone);
    setNextMilestoneDue(next.next_milestone_due);
    setLastUpdate(toDateInput(next.last_update));
  }

  async function onSaveFields(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBanner(null);
    setSaving(true);
    try {
      const next = await patch({
        client_id: clientId,
        progress,
        status,
        team_lead: teamLead,
        description,
        next_milestone: nextMilestone,
        next_milestone_due: nextMilestoneDue,
        last_update: lastUpdate || undefined,
      });
      syncFromProject(next);
      setBanner("Project saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onPostComment(e: React.FormEvent) {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) {
      setError("Enter a message to post.");
      return;
    }
    setError(null);
    setBanner(null);
    setPosting(true);
    try {
      const next = await patch({
        appendMessage: {
          text,
          ...(commentAuthor.trim() ? { author: commentAuthor.trim() } : {}),
        },
      });
      syncFromProject(next);
      setCommentText("");
      setCommentAuthor("");
      setBanner("Message posted to portal.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post message");
    } finally {
      setPosting(false);
    }
  }

  const sortedMessages = [...(project.messages ?? [])].reverse();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {project.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {clientLabel}
          {project.clients?.name && project.clients?.company
            ? ` · ${project.clients.name}`
            : null}
        </p>
        <p className="mt-3 text-sm">
          <Link
            href="/admin/projects"
            className="text-primary hover:underline"
          >
            ← All projects
          </Link>
        </p>
      </div>

      {banner ? (
        <p className="text-muted-foreground text-sm">{banner}</p>
      ) : null}
      {clientsError ? (
        <p className="text-destructive text-sm">{clientsError}</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm whitespace-pre-wrap">{error}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Project fields</CardTitle>
          <CardDescription>
            Changes appear on the client portal overview and project detail.
            Moving a project to another client updates who sees it in the
            portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSaveFields} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={clientId}
                onValueChange={(v) => setClientId(v ?? clientId)}
              >
                <SelectTrigger id="client_id" className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {clientOptionLabel(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Status" />
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="next_milestone">Next milestone</Label>
                <Input
                  id="next_milestone"
                  value={nextMilestone}
                  onChange={(e) => setNextMilestone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_milestone_due">Milestone due</Label>
                <Input
                  id="next_milestone_due"
                  value={nextMilestoneDue}
                  onChange={(e) => setNextMilestoneDue(e.target.value)}
                  placeholder="e.g. 2026-04-15 or label"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_update">Last update (shown to client)</Label>
              <Input
                id="last_update"
                type="date"
                value={lastUpdate}
                onChange={(e) => setLastUpdate(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save project"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portal messages</CardTitle>
          <CardDescription>
            Newest first: same thread the client sees under Messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedMessages.length === 0 ? (
            <p className="text-muted-foreground text-sm">No messages yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {sortedMessages.map((m, i) => (
                <li
                  key={`${m.date}-${i}-${m.text.slice(0, 24)}`}
                  className="border-border rounded-md border p-3"
                >
                  <div className="text-muted-foreground flex flex-wrap gap-x-2 text-xs">
                    <span className="text-foreground font-medium">
                      {m.author}
                    </span>
                    <span>{m.date}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{m.text}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client message</CardTitle>
          <CardDescription>
            Appends to the portal thread. Author defaults to saviane if
            left blank.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onPostComment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment_author">Author (optional)</Label>
              <Input
                id="comment_author"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="saviane"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment_text">Message</Label>
              <Textarea
                id="comment_text"
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Update for the client…"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={posting}>
              {posting ? "Posting…" : "Post message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
