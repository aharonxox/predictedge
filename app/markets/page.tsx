import { AppShell } from "@/components/AppShell";
import { MarketCard } from "@/components/MarketCard";
import { MarketsBrowser } from "./MarketsBrowser";
import { listMarkets } from "@/utils/markets";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const markets = await listMarkets();

  return (
    <AppShell
      title="Markets"
      subtitle="Browse Kalshi and Polymarket contracts side-by-side — filter by venue and category."
    >
      <MarketsBrowser markets={markets}>
        {(filtered) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {filtered.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
            {filtered.length === 0 ? (
              <div className="col-span-full text-sm text-ink-soft border border-line rounded-xl p-6 text-center">
                No markets match the current filters.
              </div>
            ) : null}
          </div>
        )}
      </MarketsBrowser>
    </AppShell>
  );
}
