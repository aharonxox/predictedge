import Link from "next/link";
import { ArrowRight, Target, LineChart, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getDailyPicks } from "@/utils/picks";
import { listMarkets } from "@/utils/markets";
import { PickCard } from "@/components/PickCard";
import { TRIAL_LENGTH_DAYS } from "@/utils/trial";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [{ picks, arena }, markets] = await Promise.all([
    getDailyPicks(),
    listMarkets(),
  ]);

  const topPick = picks[0];
  const totalVolume = markets.reduce((sum, m) => sum + m.volume24h, 0);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Your daily research desk: top picks, live markets, and AI analysis in one place."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          label="Today's top edge"
          value={topPick ? `${topPick.edgePct.toFixed(1)}%` : "—"}
          sub={topPick?.title || "No picks yet"}
        />
        <StatCard
          label="Markets tracked"
          value={markets.length.toString()}
          sub="Kalshi + Polymarket"
        />
        <StatCard
          label="24h volume (tracked)"
          value={`$${Math.round(totalVolume).toLocaleString()}`}
          sub="Sum across tracked contracts"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link
          href="/picks"
          className="rounded-2xl border border-line bg-bg-card p-5 hover:border-accent/40 transition"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Target className="h-5 w-5" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="font-semibold">Top 5 daily picks</h3>
            <ArrowRight className="h-4 w-4 text-ink-mute" />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            The 5 highest-edge contracts we&apos;re tracking today.
          </p>
        </Link>
        <Link
          href="/markets"
          className="rounded-2xl border border-line bg-bg-card p-5 hover:border-accent/40 transition"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
            <LineChart className="h-5 w-5" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="font-semibold">Browse markets</h3>
            <ArrowRight className="h-4 w-4 text-ink-mute" />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            Kalshi &amp; Polymarket with YES/NO, volume, and liquidity.
          </p>
        </Link>
        <Link
          href="/ai-chat"
          className="rounded-2xl border border-line bg-bg-card p-5 hover:border-accent/40 transition"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="font-semibold">AI research chat</h3>
            <ArrowRight className="h-4 w-4 text-ink-mute" />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            Ask an NVIDIA NIM-powered analyst grounded in Prediction Arena.
          </p>
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Top picks today</h2>
            <p className="text-sm text-ink-soft">
              Grounded in {arena.source} · fetched {new Date(arena.fetchedAt).toLocaleTimeString()}
            </p>
          </div>
          <Link
            href="/picks"
            className="text-sm text-accent-cyan hover:underline inline-flex items-center gap-1"
          >
            See all picks <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {picks.slice(0, 3).map((p) => (
            <PickCard key={p.id} pick={p} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">
          Trial &amp; access
        </h2>
        <div className="rounded-2xl border border-line bg-bg-card p-5">
          <p className="text-sm text-ink-soft leading-relaxed">
            Every PredictionEdge account includes a {TRIAL_LENGTH_DAYS}-day free
            trial tracked from your signup date. There&apos;s no billing or
            payment flow in the product — when your trial ends, access is
            paused and you&apos;ll see a trial-expired screen until the team
            restores access. You can always manage your profile and password
            on the{" "}
            <Link href="/account" className="text-accent-cyan hover:underline">
              account page
            </Link>
            .
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-card p-5">
      <div className="text-xs text-ink-soft">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? (
        <div className="mt-1 text-xs text-ink-mute line-clamp-1">{sub}</div>
      ) : null}
    </div>
  );
}
