import { Clock, ShieldCheck } from "lucide-react";
import { TRIAL_LENGTH_DAYS } from "@/utils/trial";

export function TrialExpired({ email }: { email?: string | null }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full rounded-2xl border border-line bg-bg-card/80 p-8 shadow-glow text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
          <Clock className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-xl font-semibold">Your {TRIAL_LENGTH_DAYS}-day trial has ended</h2>
        <p className="mt-2 text-sm text-ink-soft">
          {email ? (
            <>
              <span className="text-ink">{email}</span> completed PredictionEdge&apos;s free
              research window.{" "}
            </>
          ) : null}
          Access to picks, markets, and the AI analyst is paused. Reach out to
          the team at <a className="text-accent-cyan" href="mailto:hello@predictionedge.app">hello@predictionedge.app</a>{" "}
          to request an extension — we&apos;ll get you back in.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/account"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2 text-sm hover:bg-bg-elev"
          >
            <ShieldCheck className="h-4 w-4" /> Manage account
          </a>
        </div>
      </div>
    </div>
  );
}
