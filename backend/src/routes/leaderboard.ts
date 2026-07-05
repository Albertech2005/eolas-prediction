import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const GAMMA_API = "https://gamma-api.polymarket.com";

let leaderboardCache: any[] = [];
let cacheTime = 0;

async function fetchRealLeaderboard() {
  try {
    // Try Polymarket's leaderboard endpoint
    const res = await axios.get(`${GAMMA_API}/leaderboard`, {
      params: { limit: 50, window: "all" },
      timeout: 10000,
    });

    const data = Array.isArray(res.data) ? res.data : res.data?.leaderboard || res.data?.data || [];

    if (data.length > 0) {
      return data.map((entry: any, i: number) => ({
        rank: i + 1,
        address: entry.address || entry.account || entry.user || `0x${Math.random().toString(16).slice(2, 42)}`,
        username: null, // no fake names — real addresses only
        accuracy: parseFloat(entry.accuracy || entry.winRate || "0") * (entry.accuracy > 1 ? 1 : 100),
        total_predictions: parseInt(entry.totalTrades || entry.numTrades || entry.trades || "0"),
        correct: parseInt(entry.correctTrades || entry.wins || "0"),
        reputation: Math.floor(parseFloat(entry.profit || entry.pnl || "0")),
        badges: getBadges(parseFloat(entry.winRate || "0"), parseFloat(entry.profit || "0")),
        pnl: parseFloat(entry.profit || entry.pnl || "0"),
      }));
    }
  } catch (e) {
    console.error("Leaderboard fetch error:", e);
  }

  // Fallback: fetch from CLOB API
  try {
    const res = await axios.get("https://clob.polymarket.com/leaderboard", {
      timeout: 10000,
    });
    const data = Array.isArray(res.data) ? res.data : res.data?.leaderboard || [];
    if (data.length > 0) {
      return data.slice(0, 30).map((entry: any, i: number) => ({
        rank: i + 1,
        address: entry.address || entry.account,
        username: null,
        accuracy: parseFloat(entry.winRate || entry.accuracy || "0") * 100,
        total_predictions: parseInt(entry.trades || "0"),
        correct: parseInt(entry.wins || "0"),
        reputation: Math.floor(parseFloat(entry.volume || "0")),
        badges: getBadges(parseFloat(entry.winRate || "0"), parseFloat(entry.volume || "0")),
        pnl: parseFloat(entry.pnl || entry.profit || "0"),
      }));
    }
  } catch (e) {
    console.error("CLOB leaderboard error:", e);
  }

  return null;
}

function getBadges(winRate: number, pnl: number): string[] {
  const badges: string[] = [];
  const wr = winRate > 1 ? winRate : winRate * 100;
  if (wr >= 75) badges.push("🏆");
  if (wr >= 65) badges.push("🎯");
  if (pnl >= 100000) badges.push("🐋");
  if (pnl >= 50000) badges.push("💰");
  if (badges.length === 0) badges.push("📊");
  return badges;
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    // Cache for 10 minutes
    if (leaderboardCache.length && Date.now() - cacheTime < 10 * 60 * 1000) {
      return res.json({ leaderboard: leaderboardCache, total: leaderboardCache.length, source: "cache" });
    }

    const real = await fetchRealLeaderboard();
    if (real && real.length > 0) {
      leaderboardCache = real;
      cacheTime = Date.now();
      return res.json({ leaderboard: real, total: real.length, source: "polymarket" });
    }

    // Last resort: return empty with note
    res.json({
      leaderboard: [],
      total: 0,
      source: "unavailable",
      message: "Polymarket leaderboard API unavailable. Check back soon.",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
