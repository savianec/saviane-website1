"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import type { PortalProject } from "@/lib/portal/types";

export function ProjectDetailTabs({ project }: { project: PortalProject }) {
  return (
    <Tabs defaultValue="overview" className="mt-8 w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-6 text-sm leading-relaxed">
            <p>{project.description}</p>
            <div>
              <h3 className="text-foreground mb-2 text-sm font-semibold">
                Team
              </h3>
              <ul className="space-y-2">
                {project.team.map((m) => (
                  <li key={m.email}>
                    <span className="text-foreground">{m.name}</span>
                    <span className="text-muted-foreground">, {m.role}</span>
                    <br />
                    <a
                      href={`mailto:${m.email}`}
                      className="text-primary text-xs hover:underline"
                    >
                      {m.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-foreground mb-2 text-sm font-semibold">
                Next milestone
              </h3>
              <p>
                {project.nextMilestone}
                {project.nextMilestoneDue !== "-" ? (
                  <span className="text-muted-foreground">
                    {" "}
                    · Due {project.nextMilestoneDue}
                  </span>
                ) : null}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="deliverables" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.deliverables.map((d) => (
              <label
                key={d.name}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <Checkbox checked={d.done} disabled className="mt-0.5" />
                <span className="text-sm">
                  <span className="text-foreground font-medium">{d.name}</span>
                  {d.note ? (
                    <span className="text-muted-foreground">, {d.note}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="files" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shared files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {project.files.map((folder) => (
              <div key={folder.folder}>
                <h3 className="text-foreground text-sm font-semibold">
                  {folder.folder}
                </h3>
                <ul className="mt-2 space-y-1">
                  {folder.items.map((f) => (
                    <li
                      key={f.name}
                      className="text-muted-foreground flex justify-between text-sm"
                    >
                      <span>{f.name}</span>
                      <span className="text-xs">{f.date}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="mt-4" />
              </div>
            ))}
            <p className="text-muted-foreground text-xs">
              Uploads will connect to Supabase Storage in production.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="messages" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.messages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No messages yet.</p>
            ) : (
              project.messages.map((m, i) => (
                <div
                  key={`${m.date}-${i}`}
                  className="border-border rounded-lg border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium">{m.author}</span>
                    <Badge variant="secondary">{m.date}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">{m.text}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
