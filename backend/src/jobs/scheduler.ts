import cron from "node-cron";
import { fetchTrendingMarkets } from "../services/polymarket";
import { getNarrativeScores } from "../services/narratives";

export function startJobs() {
  console.log("📅 Starting background jobs...");

  // Refresh markets every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      await fetchTrendingMarkets(30);
      console.log("✅ Markets refreshed");
    } catch (e) {
      console.error("Market refresh failed:", e);
    }
  });

  // Refresh narratives every hour
  cron.schedule("0 * * * *", async () => {
    try {
      await getNarrativeScores();
      console.log("✅ Narratives refreshed");
    } catch (e) {
      console.error("Narrative refresh failed:", e);
    }
  });
}
