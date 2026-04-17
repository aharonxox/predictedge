import type { TrialStatus } from "@/types";

const TRIAL_DAYS = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;

/**
 * Compute trial status for a given signup timestamp.
 *
 * PredictionEdge gives every new account a 10-day free trial that is always
 * tracked server-side from the user's signup date (the `created_at` Supabase
 * sets at signup). There is no billing or payment flow in the app; after the
 * trial expires the user is shown a gated screen until access is restored.
 */
export function computeTrialStatus(createdAt: string | Date | null | undefined): TrialStatus {
  const createdAtDate =
    createdAt instanceof Date
      ? createdAt
      : createdAt
        ? new Date(createdAt)
        : new Date();

  const startMs = Number.isFinite(createdAtDate.getTime())
    ? createdAtDate.getTime()
    : Date.now();

  const endMs = startMs + TRIAL_DAYS * MS_PER_DAY;
  const now = Date.now();
  const remainingMs = Math.max(0, endMs - now);

  return {
    trialStartedAt: new Date(startMs).toISOString(),
    trialEndsAt: new Date(endMs).toISOString(),
    daysRemaining: Math.floor(remainingMs / MS_PER_DAY),
    hoursRemaining: Math.floor((remainingMs % MS_PER_DAY) / MS_PER_HOUR),
    expired: remainingMs <= 0,
  };
}

export const TRIAL_LENGTH_DAYS = TRIAL_DAYS;
