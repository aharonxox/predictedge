import { AppShell, requireUser } from "@/components/AppShell";
import { AccountForms } from "./AccountForms";
import { TRIAL_LENGTH_DAYS } from "@/utils/trial";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <AppShell
      title="Account"
      subtitle="Manage your profile, password, and session."
      allowExpired
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-line bg-bg-card p-5">
          <AccountForms
            email={user.email}
            fullName={user.fullName}
          />
        </div>

        <aside className="rounded-2xl border border-line bg-bg-card p-5 flex flex-col gap-3">
          <div className="text-sm font-medium">Trial status</div>
          <div className="rounded-lg border border-line bg-bg-elev px-3 py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Started</span>
              <span>{new Date(user.trial.trialStartedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-ink-soft">Ends</span>
              <span>{new Date(user.trial.trialEndsAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-ink-soft">Remaining</span>
              <span
                className={
                  user.trial.expired ? "text-accent-red" : "text-ink"
                }
              >
                {user.trial.expired
                  ? "Expired"
                  : `${user.trial.daysRemaining}d ${user.trial.hoursRemaining}h`}
              </span>
            </div>
          </div>
          <p className="text-xs text-ink-mute leading-relaxed">
            Each PredictionEdge account includes a {TRIAL_LENGTH_DAYS}-day free
            trial. There is no billing or payment flow in the product; if your
            trial has ended and you need continued access, email{" "}
            <a className="text-accent-cyan" href="mailto:hello@predictionedge.app">
              hello@predictionedge.app
            </a>
            .
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
