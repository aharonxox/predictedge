import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { computeTrialStatus } from "@/utils/trial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const trialStartedAt =
    (user.user_metadata?.trial_started_at as string | undefined) ||
    user.created_at;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: (user.user_metadata?.full_name as string | undefined) || null,
      createdAt: user.created_at,
      trial: computeTrialStatus(trialStartedAt),
    },
  });
}
