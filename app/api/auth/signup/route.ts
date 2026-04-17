import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { computeTrialStatus } from "@/utils/trial";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; fullName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const fullName = body.fullName?.trim() || null;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin.replace(/\/$/, "");

  const trialStartedAt = new Date().toISOString();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/login`,
      data: {
        full_name: fullName,
        trial_started_at: trialStartedAt,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const trial = computeTrialStatus(trialStartedAt);

  return NextResponse.json({
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email,
          fullName,
          createdAt: data.user.created_at,
          trial,
        }
      : null,
    session: data.session,
    needsEmailConfirmation: !data.session,
  });
}
