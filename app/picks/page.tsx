import { AppShell } from "@/components/AppShell";
import { PickCard } from "@/components/PickCard";
import { getDailyPicks } from "@/utils/picks";

export const dynamic = "force-dynamic";

export default async function PicksPage() {
  const { picks, arena, generatedAt } = await getDailyPicks();

  return (
    <AppShell
      title="Top 5 daily picks"
      subtitle={`Highest-edge binary contracts across Kalshi and Polymarket. Generated ${new Date(generatedAt).toLocaleString()}.`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {picks.map((p) => (
          <PickCard key={p.id} pick={p} />
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">
          Research context
        </h2>
        <div className="rounded-2xl border border-line bg-bg-card p-5">
          <p className="text-sm text-ink-soft leading-relaxed">
            {arena.overview.summary}
          </p>
          <ul className="mt-4 grid md:grid-cols-2 gap-2 text-sm text-ink-soft list-disc pl-5">
            {arena.methodology.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {arena.confidenceSignals.map((s) => (
              <span
                key={s}
                className="rounded-full bg-bg-elev px-2.5 py-1 text-xs text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
