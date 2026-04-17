import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { computeTrialStatus } from "@/utils/trial";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { TrialExpired } from "./TrialExpired";
import type { AppUser } from "@/types";

export async function requireUser(): Promise<AppUser> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const trialStartedAt =
    (user.user_metadata?.trial_started_at as string | undefined) ||
    user.created_at;

  return {
    id: user.id,
    email: user.email || "",
    fullName: (user.user_metadata?.full_name as string | undefined) || null,
    createdAt: user.created_at,
    trial: computeTrialStatus(trialStartedAt),
  };
}

export async function AppShell({
  children,
  title,
  subtitle,
  right,
  allowExpired = false,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  allowExpired?: boolean;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar title={title} subtitle={subtitle} trial={user.trial} right={right} />
        <div className="flex-1 min-w-0">
          {user.trial.expired && !allowExpired ? (
            <TrialExpired email={user.email} />
          ) : (
            <div className="px-6 py-6">{children}</div>
          )}
        </div>
      </main>
    </div>
  );
}
