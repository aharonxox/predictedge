"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode");
  const [isUpdate, setIsUpdate] = useState(mode === "update");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Supabase sends users back here after clicking the reset email link; once
  // the session is restored we switch into "update password" mode.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const client = createSupabaseBrowserClient();
      client.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsUpdate(true);
        }
      });
    } catch {
      /* noop: env not configured yet */
    }
  }, []);

  async function onRequestReset(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not send reset email");
      setInfo(data.message || "Check your email for a reset link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdatePassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Password update failed");
      setInfo("Password updated. Redirecting to your dashboard…");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password update failed");
    } finally {
      setLoading(false);
    }
  }

  if (isUpdate) {
    return (
      <form className="flex flex-col gap-4" onSubmit={onUpdatePassword}>
        <TextField
          label="New password"
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
          Update password
        </Button>
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onRequestReset}>
      <TextField
        label="Email"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
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
        Send reset link
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We&apos;ll email you a secure link."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-accent-cyan hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
