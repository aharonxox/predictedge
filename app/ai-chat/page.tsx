import { AppShell } from "@/components/AppShell";
import { ChatClient } from "./ChatClient";
import { getPredictionArenaContext } from "@/utils/prediction-arena";

export const dynamic = "force-dynamic";

export default async function AiChatPage() {
  const arena = await getPredictionArenaContext();

  return (
    <AppShell
      title="AI research chat"
      subtitle="Ask the analyst anything about Kalshi / Polymarket contracts. Grounded in Prediction Arena methodology."
    >
      <ChatClient
        arenaBrief={{
          fetchedAt: arena.fetchedAt,
          venues: arena.overview.venues,
          points: arena.methodology.points.slice(0, 4),
        }}
      />
    </AppShell>
  );
}
