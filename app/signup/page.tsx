"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");
      if (data.needsEmailConfirmation) {
        setInfo(
          "Account created. Check your inbox to confirm your email, then log in.",
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Start your 10-day free trial"
      subtitle="No credit card. No billing. Just 10 days of full PredictionEdge access."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-accent-cyan hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          label="Full name"
          placeholder="Ada Lovelace"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
        <TextField
          label="Work email"
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
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {error ? (
          <div className="rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-sm text-accent-red">
            {error}
          </div>
        ) : null}
        {info ? (
          <div className="rounded-lg border border-accent-green/30 bg-accent-green/10 px-3 py-2 text-sm text-accent-green">
            {info}
          </div>
        ) : null}
        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
