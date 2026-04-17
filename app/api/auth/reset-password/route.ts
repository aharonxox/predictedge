import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Password reset endpoint.
 *
 * - POST with { email }   -> sends a reset email with a callback link.
 * - POST with { password } while authenticated -> updates the user's password.
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin.replace(/\/$/, "");

  // Flow A: start a password reset by email.
  if (body.email && !body.password) {
    const email = body.email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password?mode=update`,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      message: "If that email exists, a reset link is on its way.",
    });
  }

  // Flow B: complete a password reset for the currently authenticated user.
  if (body.password) {
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    const { data, error } = await supabase.auth.updateUser({
      password: body.password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, userId: data.user?.id });
  }

  return NextResponse.json(
    { error: "Provide either { email } or { password }." },
    { status: 400 },
  );
}
