import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface NarrativeData {
  name: string;
  score: number;
  change_7d: number;
  social_volume: number;
  markets_count: number;
  emoji: string;
  description: string;
}

let cachedNarratives: NarrativeData[] | null = null;
let cacheExpiry = 0;

export async function getNarrativeScores(): Promise<NarrativeData[]> {
  if (cachedNarratives && cacheExpiry > Date.now()) return cachedNarratives;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `You are EOLAS AI. Score these crypto/prediction market narratives based on current market conditions, social sentiment, and trend momentum as of mid-2026.

Narratives to score:
1. Prediction Markets (Polymarket, PredictIt growth)
2. AI Agents (autonomous AI, agent frameworks)
3. Base Ecosystem (Coinbase L2, Base adoption)
4. RWAs (Real World Assets tokenization)
5. Meme Coins (degen culture, viral tokens)
6. DeFi (DEXes, lending, yield)
7. Layer 2s (Optimism, Arbitrum, zkSync)
8. Bitcoin L2s (stacks, merlin, lightning)
9. SocialFi (decentralized social, friend.tech successors)
10. Stablecoins (USDC, DAI, algorithmic)

For each, provide realistic scores based on actual 2026 trends. Respond in JSON:
{
  "narratives": [
    {
      "name": "Prediction Markets",
      "score": 91,
      "change_7d": 8.3,
      "social_volume": 142000,
      "markets_count": 2400,
      "emoji": "🔮",
      "description": "Polymarket volumes hitting all-time highs"
    }
  ]
}`
      }],
      response_format: { type: "json_object" },
      max_tokens: 1200,
      temperature: 0.4,
    });

    const data = JSON.parse(res.choices[0].message.content || "{}");
    cachedNarratives = data.narratives || getDefaultNarratives();
    cacheExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    return cachedNarratives!;
  } catch (err) {
    console.error("Narrative AI error:", err);
    return getDefaultNarratives();
  }
}

export function getDefaultNarratives(): NarrativeData[] {
  return [
    { name: "Prediction Markets", score: 91, change_7d: 12.4, social_volume: 142000, markets_count: 2400, emoji: "🔮", description: "Polymarket volumes hitting all-time highs" },
    { name: "AI Agents", score: 87, change_7d: 9.1, social_volume: 284000, markets_count: 890, emoji: "🤖", description: "Autonomous AI agents taking over DeFi and social" },
    { name: "Base Ecosystem", score: 83, change_7d: 6.7, social_volume: 98000, markets_count: 430, emoji: "🔵", description: "Coinbase's L2 becoming the home for onchain apps" },
    { name: "RWAs", score: 79, change_7d: 4.2, social_volume: 76000, markets_count: 310, emoji: "🏦", description: "Tokenized treasuries and real estate going mainstream" },
    { name: "DeFi", score: 74, change_7d: 2.8, social_volume: 189000, markets_count: 1200, emoji: "⚡", description: "DEX volumes recovering, new lending primitives emerging" },
    { name: "Layer 2s", score: 71, change_7d: -1.3, social_volume: 134000, markets_count: 680, emoji: "🔗", description: "L2 wars intensify but user fragmentation grows" },
    { name: "Meme Coins", score: 68, change_7d: 15.2, social_volume: 412000, markets_count: 560, emoji: "🐸", description: "Degen culture alive — viral tokens dominating CT" },
    { name: "Stablecoins", score: 65, change_7d: 0.4, social_volume: 67000, markets_count: 220, emoji: "💵", description: "New stablecoin regulation bringing institutional trust" },
    { name: "Bitcoin L2s", score: 58, change_7d: -3.1, social_volume: 44000, markets_count: 150, emoji: "₿", description: "BTC L2s struggling for developer mindshare" },
    { name: "SocialFi", score: 42, change_7d: -8.4, social_volume: 21000, markets_count: 80, emoji: "🌐", description: "Social-fi cooling after friend.tech decline" },
  ];
}
