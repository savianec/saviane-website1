"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminSignOut } from "@/components/admin/admin-sign-out";

export type AdminProfileEmbed = {
  id: string;
  email: string | null;
  display_name: string;
  phone: string | null;
};

export type AdminClientRow = {
  id: string;
  name: string;
  company: string | null;
  created_at: string;
  profiles: AdminProfileEmbed[] | AdminProfileEmbed | null;
};

export function ProvisionClientDashboard({
  initialClients,
}: {
  initialClients: AdminClientRow[];
}) {
  const [clients, setClients] = useState(initialClients);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshList() {
    const res = await fetch("/api/admin/clients");
    if (!res.ok) return;
    const data = (await res.json()) as { clients: AdminClientRow[] };
    setClients(data.clients ?? []);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          phone: phone.trim(),
          companyName: companyName.trim(),
          name: name.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string | Record<string, string[]>; ok?: boolean };

      if (!res.ok) {
        if (typeof data.error === "string") {
          setError(data.error);
        } else if (data.error && typeof data.error === "object") {
          setError(JSON.stringify(data.error));
        } else {
          setError("Request failed");
        }
        return;
      }

      setMessage("Client account created. They can sign in at /app/login.");
      setEmail("");
      setPassword("");
      setPhone("");
      setCompanyName("");
      setName("");
      await refreshList();
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Provision clients</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Creates a Supabase Auth user, a company row, and a portal profile in one step.
          </p>
        </div>
        <AdminSignOut />
      </div>

      <section className="border-border bg-card rounded-xl border p-6">
        <h2 className="font-display text-lg tracking-tight">New client</h2>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="client-name">Name</Label>
            <Input
              id="client-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
              placeholder="Contact full name"
              autoComplete="name"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1.5"
              placeholder="Acme Inc."
              autoComplete="organization"
            />
          </div>
          <div>
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="client-phone">Phone</Label>
            <Input
              id="client-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5"
              autoComplete="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="client-password">Temporary password</Label>
            <Input
              id="client-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              autoComplete="new-password"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Minimum 8 characters. Ask the client to change it after first sign-in (future: password reset
              email).
            </p>
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create account"}
            </Button>
            {message ? <p className="text-muted-foreground self-center text-sm">{message}</p> : null}
            {error ? <p className="text-destructive self-center text-sm">{error}</p> : null}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg tracking-tight">Recent clients</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => void refreshList()}>
            Refresh
          </Button>
        </div>
        <div className="border-border overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-border border-b">
              <tr>
                <th className="p-3 font-medium">Company</th>
                <th className="p-3 font-medium">Contact</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted-foreground p-6 text-center">
                    No clients yet.
                  </td>
                </tr>
              ) : (
                clients.map((c) => {
                  const prof = Array.isArray(c.profiles)
                    ? c.profiles[0]
                    : c.profiles;
                  return (
                    <tr key={c.id} className="border-border border-b last:border-0">
                      <td className="p-3">{c.company ?? "-"}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3 text-muted-foreground">{prof?.email ?? "-"}</td>
                      <td className="p-3 text-muted-foreground">{prof?.phone ?? "-"}</td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
