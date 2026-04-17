"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export function AccountForms({
  email,
  fullName,
}: {
  email: string;
  fullName: string | null;
}) {
  const [name, setName] = useState(fullName || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  async function onUpdateProfile(e: FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    setProfileErr(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name.trim() || null },
      });
      if (error) throw error;
      setProfileMsg("Profile updated.");
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : "Update failed");
    } finally {
      setProfileLoading(false);
    }
  }

  async function onUpdatePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);
    setPasswordErr(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Password update failed");
      setPasswordMsg("Password updated.");
      setPassword("");
    } catch (err) {
      setPasswordErr(err instanceof Error ? err.message : "Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-medium">Profile</h2>
          <p className="text-xs text-ink-soft mt-0.5">
            Update your display name. Your email is your login and can&apos;t
            be changed here.
          </p>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onUpdateProfile}>
          <TextField label="Email" value={email} readOnly disabled />
          <TextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" loading={profileLoading}>
              Save profile
            </Button>
            {profileMsg ? (
              <span className="text-sm text-accent-green">{profileMsg}</span>
            ) : null}
            {profileErr ? (
              <span className="text-sm text-accent-red">{profileErr}</span>
            ) : null}
          </div>
        </form>
      </section>

      <div className="h-px bg-line" />

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-medium">Password</h2>
          <p className="text-xs text-ink-soft mt-0.5">
            Set a new password. You&apos;ll stay logged in on this device.
          </p>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onUpdatePassword}>
          <TextField
            label="New password"
            type="password"
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" loading={passwordLoading} disabled={password.length < 8}>
              Update password
            </Button>
            {passwordMsg ? (
              <span className="text-sm text-accent-green">{passwordMsg}</span>
            ) : null}
            {passwordErr ? (
              <span className="text-sm text-accent-red">{passwordErr}</span>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
