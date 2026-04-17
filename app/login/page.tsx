"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <TextField
        label="Email"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <TextField
        label="Password"
        type="password"
        required
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error ? (
        <div className="rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-sm text-accent-red">
          {error}
        </div>
      ) : null}
      <Button type="submit" loading={loading}>
        Log in
      </Button>
      <div className="text-right text-sm">
        <Link href="/reset-password" className="text-accent-cyan hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to resume your PredictionEdge research."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-accent-cyan hover:underline">
            Start your free trial
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
