"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminProjectRow } from "@/components/admin/admin-project-types";

function formatStatus(status: string) {
  return status.replace(/^\w/, (c) => c.toUpperCase());
}

export function AdminProjectsList({ projects }: { projects: AdminProjectRow[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No projects yet. Provision a client or seed projects in the database.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Progress</TableHead>
          <TableHead>Last update</TableHead>
          <TableHead className="w-[80px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((p) => {
          const clientLabel =
            p.clients?.company?.trim() ||
            p.clients?.name?.trim() ||
            "-";
          const lastUpdate =
            typeof p.last_update === "string"
              ? p.last_update.slice(0, 10)
              : String(p.last_update);
          return (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{clientLabel}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{formatStatus(p.status)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {p.progress}%
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {lastUpdate}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="text-primary font-medium hover:underline"
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
