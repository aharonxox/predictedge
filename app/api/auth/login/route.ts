import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { computeTrialStatus } from "@/utils/trial";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const trialStartedAt =
    (data.user?.user_metadata?.trial_started_at as string | undefined) ||
    data.user?.created_at ||
    new Date().toISOString();

  return NextResponse.json({
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email,
          fullName:
            (data.user.user_metadata?.full_name as string | undefined) || null,
          createdAt: data.user.created_at,
          trial: computeTrialStatus(trialStartedAt),
        }
      : null,
  });
}
