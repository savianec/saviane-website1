"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavianeLogo } from "@/components/site/logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const err = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="text-foreground mb-10 flex items-center gap-2 text-lg font-semibold"
      >
        <SavianeLogo showWordmark markSize={28} />
      </Link>
      <div className="border-border bg-card w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <h1 className="font-display text-2xl tracking-tight">Client portal</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in with the email and password for your workspace account.
        </p>
        {err ? (
          <p className="text-destructive mt-4 text-sm">
            Session error. Sign in again.
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
          {message ? <p className="text-destructive text-sm">{message}</p> : null}
        </form>
        <p className="text-muted-foreground mt-8 text-center text-xs">
          <Link href="/" className="text-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-svh" />}>
      <LoginForm />
    </Suspense>
  );
}
