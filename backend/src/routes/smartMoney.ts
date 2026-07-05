import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const DATA_API = "https://data-api.polymarket.com";

// Fetch real positions for any wallet from Polymarket's data API
async function fetchWalletPositions(address: string) {
  try {
    const res = await axios.get(`${DATA_API}/positions`, {
      params: { user: address.toLowerCase(), limit: 50, sizeThreshold: 0 },
      timeout: 10000,
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Positions fetch error:", err);
    return [];
  }
}

// Fetch real trade activity for any wallet
async function fetchWalletActivity(address: string) {
  try {
    const res = await axios.get(`${DATA_API}/activity`, {
      params: { user: address.toLowerCase(), limit: 50 },
      timeout: 10000,
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

// Compute basic stats from real positions
function computeStats(positions: any[], activity: any[]) {
  const activePositions = positions.filter(p => !p.redeemable && parseFloat(p.currentValue || "0") > 0);
  const redeemedPositions = positions.filter(p => p.redeemable);

  const totalCurrentValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue || "0"), 0);
  const totalBought = positions.reduce((sum, p) => sum + parseFloat(p.totalBought || "0"), 0);
  const totalCashPnl = positions.reduce((sum, p) => sum + parseFloat(p.cashPnl || "0"), 0);
  const totalRealizedPnl = positions.reduce((sum, p) => sum + parseFloat(p.realizedPnl || "0"), 0);

  const wins = positions.filter(p => parseFloat(p.cashPnl || "0") > 0).length;
  const winRate = positions.length > 0 ? (wins / positions.length) * 100 : 0;

  return {
    total_positions: positions.length,
    active_positions: activePositions.length,
    total_invested: totalBought,
    current_value: totalCurrentValue,
    cash_pnl: totalCashPnl,
    realized_pnl: totalRealizedPnl,
    win_rate: winRate,
    wins,
  };
}

// GET /api/smart-money/lookup/:address — real on-chain lookup
router.get("/lookup/:address", async (req: Request, res: Response) => {
  const { address } = req.params;

  if (!address || !address.startsWith("0x") || address.length !== 42) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  try {
    const [positions, activity] = await Promise.all([
      fetchWalletPositions(address),
      fetchWalletActivity(address),
    ]);

    const stats = computeStats(positions, activity);

    // Format active positions for display
    const activePositions = positions
      .filter(p => !p.redeemable && parseFloat(p.currentValue || "0") > 0.01)
      .sort((a, b) => parseFloat(b.currentValue || "0") - parseFloat(a.currentValue || "0"))
      .slice(0, 20)
      .map(p => ({
        market: p.title || p.slug,
        outcome: p.outcome,
        size: parseFloat(p.size || "0"),
        avg_price: parseFloat(p.avgPrice || "0"),
        current_price: parseFloat(p.curPrice || "0"),
        current_value: parseFloat(p.currentValue || "0"),
        total_bought: parseFloat(p.totalBought || "0"),
        cash_pnl: parseFloat(p.cashPnl || "0"),
        percent_pnl: parseFloat(p.percentPnl || "0"),
        redeemable: p.redeemable,
        icon: p.icon,
        event_slug: p.eventSlug,
      }));

    res.json({
      address,
      stats,
      positions: activePositions,
      raw_count: positions.length,
      source: "polymarket-data-api",
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Smart money lookup error:", err);
    res.status(500).json({ error: "Failed to fetch wallet data" });
  }
});

// GET /api/smart-money — overview page (no fake wallets)
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Enter any wallet address to see their real Polymarket positions.",
    source: "polymarket-data-api",
    note: "All data is fetched live from Polymarket's public data API.",
  });
});

export default router;
