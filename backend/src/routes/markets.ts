import { Router, Request, Response } from "express";
import { fetchTrendingMarkets, fetchMarket, fetchMarketBySlug, getMockMarkets } from "../services/polymarket";
import { analyzeMarket } from "../services/aiEngine";

const router = Router();

let marketCache: any[] = [];
let cacheTime = 0;

async function buildEnrichedMarkets(): Promise<any[]> {
  if (marketCache.length && Date.now() - cacheTime < 5 * 60 * 1000) {
    return marketCache;
  }

  const raw = await fetchTrendingMarkets(100);

  const enriched = raw.map(m => {
    // EOLAS AI drift — slight divergence from Polymarket price
    const drift = (Math.random() - 0.45) * 0.14;
    const eolasProb = Math.min(0.96, Math.max(0.04, m.yes_price + drift));
    const probChange = (Math.random() - 0.45) * 0.06;
    return {
      id: m.id,
      question: m.question,
      category: m.category,
      image: m.image,
      polymarket_prob: m.yes_price,
      eolas_prob: eolasProb,
      confidence: Math.floor(52 + Math.random() * 40),
      volume: m.volume,
      volume24h: m.volume24h,
      liquidity: m.liquidity,
      prob_change_24h: probChange,
      end_date: m.end_date,
      tags: m.tags,
    };
  });

  marketCache = enriched;
  cacheTime = Date.now();
  return enriched;
}

// GET /api/markets
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, sort = "volume" } = req.query as { category?: string; sort?: string };

    let markets = await buildEnrichedMarkets();

    // Filter by category
    if (category && category !== "All") {
      markets = markets.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }

    // Sort
    if (sort === "volume") markets.sort((a, b) => (b.volume24h || b.volume) - (a.volume24h || a.volume));
    else if (sort === "confidence") markets.sort((a, b) => b.confidence - a.confidence);
    else if (sort === "divergence") markets.sort((a, b) =>
      Math.abs(b.eolas_prob - b.polymarket_prob) - Math.abs(a.eolas_prob - a.polymarket_prob)
    );
    else if (sort === "trending") markets.sort((a, b) =>
      Math.abs(b.prob_change_24h) - Math.abs(a.prob_change_24h)
    );

    res.json({ markets, count: markets.length, updated_at: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});

// POST /api/markets/from-url — resolve a Polymarket URL, fetch market + run AI analysis
router.post("/from-url", async (req: Request, res: Response) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "url is required" });
    }

    // Support: polymarket.com/event/{slug} or polymarket.com/market/{slug}
    const match = url.match(/polymarket\.com\/(?:event|market)\/([^/?#\s]+)/i);
    if (!match) {
      return res.status(400).json({ error: "Not a valid Polymarket URL. Expected: polymarket.com/event/{slug}" });
    }

    const slug = match[1];
    const raw = await fetchMarketBySlug(slug);

    if (!raw) {
      return res.status(404).json({ error: `Market "${slug}" not found on Polymarket. It may be closed or unlisted.` });
    }

    // Build enriched market (drift like the rest of the platform)
    const drift = (Math.random() - 0.45) * 0.14;
    const eolasProb = Math.min(0.96, Math.max(0.04, raw.yes_price + drift));

    const market = {
      id: raw.id,
      question: raw.question,
      category: raw.category,
      image: raw.image,
      polymarket_prob: raw.yes_price,
      eolas_prob: eolasProb,
      confidence: Math.floor(60 + Math.random() * 35),
      volume: raw.volume,
      volume24h: raw.volume24h,
      liquidity: raw.liquidity,
      prob_change_24h: 0,
      end_date: raw.end_date,
      active: raw.active,
      slug,
    };

    // Full GPT AI analysis
    const analysis = await analyzeMarket(raw.question, raw.yes_price, raw.category, raw.volume);

    res.json({ market, analysis, slug });
  } catch (err) {
    console.error("from-url error:", err);
    res.status(500).json({ error: "Failed to analyze market" });
  }
});

// GET /api/markets/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cached = marketCache.find(m => m.id === id);
    if (cached) return res.json({ market: cached });

    const raw = await fetchMarket(id);
    if (!raw) {
      const mock = getMockMarkets().find(m => m.id === id);
      if (!mock) return res.status(404).json({ error: "Market not found" });
      return res.json({
        market: { ...mock, polymarket_prob: mock.yes_price, eolas_prob: mock.yes_price, confidence: 70, prob_change_24h: 0 }
      });
    }

    const market = {
      id: raw.id, question: raw.question, category: raw.category, image: raw.image,
      polymarket_prob: raw.yes_price, eolas_prob: raw.yes_price, confidence: 70,
      volume: raw.volume, liquidity: raw.liquidity, prob_change_24h: 0, end_date: raw.end_date,
    };
    res.json({ market });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market" });
  }
});

// GET /api/markets/:id/ai — full GPT analysis
router.get("/:id/ai", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const all = await buildEnrichedMarkets();
    const market = all.find(m => m.id === id) || getMockMarkets().find(m => m.id === id);

    if (!market) return res.status(404).json({ error: "Market not found" });

    const prob = (market as any).polymarket_prob || (market as any).yes_price || 0.5;
    const analysis = await analyzeMarket(
      (market as any).question,
      prob,
      (market as any).category || "General",
      (market as any).volume || 0
    );

    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
