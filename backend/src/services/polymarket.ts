import axios from "axios";

const GAMMA_API = "https://gamma-api.polymarket.com";

export interface PolyMarket {
  id: string;
  question: string;
  category: string;
  image?: string;
  volume: number;
  volume24h: number;
  liquidity: number;
  yes_price: number;
  no_price: number;
  end_date?: string;
  active: boolean;
  tags: string[];
}

function parseOutcomePrices(raw: any): [number, number] {
  try {
    // API returns a JSON string e.g. '["0.525","0.475"]'
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    const yes = Math.min(0.99, Math.max(0.01, parseFloat(arr[0]) || 0.5));
    const no  = Math.min(0.99, Math.max(0.01, parseFloat(arr[1]) || 1 - yes));
    return [yes, no];
  } catch {
    return [0.5, 0.5];
  }
}

function getCategory(question: string): string {
  const q = question.toLowerCase();

  // Sports — World Cup 2026 is massive right now, check first
  if (/\b(world cup|fifa|premier league|champions league|la liga|serie a|bundesliga|ligue 1|nba|nfl|mlb|nhl|ufc|mma|formula 1|f1|wimbledon|us open|french open|australian open|rugby|cricket|golf|boxing|superbowl|super bowl|nascar|copa america|euro 2024|euro 2025|euro 2026|sport)\b/.test(q)) return "Sports";
  if (/\b(soccer|football|basketball|baseball|hockey|tennis|volleyball|handball|athletics|olympics|match|fixture|draw|score|win on |team to advance|spread:|o\/u |over\/under)\b/.test(q)) return "Sports";
  // Country sports matchups e.g. "Will France win" "Will Argentina"
  if (/will (france|germany|spain|brazil|argentina|england|portugal|morocco|netherlands|usa|mexico|japan|colombia|croatia|belgium|switzerland|paraguay|egypt|uruguay|senegal|ecuador|canada|chile|peru|korea|australia|nigeria) (win|advance|qualify|beat|score)/i.test(q)) return "Sports";

  // Politics
  if (/\b(election|president|prime minister|chancellor|minister|congress|senate|parliament|vote|ballot|party|democrat|republican|trump|biden|harris|modi|macron|putin|xi jinping|zelensky|netanyahu|milei|lula|erdogan|sunak|nato|sanctions|war|ceasefire|impeach|resign|next leader|leader out)\b/.test(q)) return "Politics";

  // Crypto
  if (/\b(bitcoin|btc|ethereum|eth|solana|sol|xrp|ripple|cardano|ada|dogecoin|doge|shiba|bnb|binance|coinbase|crypto|token|defi|nft|blockchain|web3|dao|dex|layer 2|base chain|polygon|arbitrum|optimism|avalanche|chainlink|uniswap|aave|stablecoin|usdc|usdt|altcoin|bull run|bear market|halving|memecoin)\b/.test(q)) return "Crypto";

  // Finance
  if (/\b(fed|federal reserve|interest rate|inflation|recession|gdp|stock market|s&p 500|nasdaq|dow jones|earnings|ipo|merger|acquisition|bond|treasury|dollar|euro|yen|pound|oil price|gold price|commodity|economy|unemployment|cpi|fomc)\b/.test(q)) return "Finance";

  // Tech
  if (/\b(openai|chatgpt|gpt|claude|gemini|ai model|artificial intelligence|apple|google|meta|microsoft|amazon|nvidia|spacex|tesla|starlink|iphone|android|chip|semiconductor|antitrust|data center|startup|y combinator|vc funding|tech company)\b/.test(q)) return "Tech";

  // Entertainment
  if (/\b(oscar|grammy|emmy|bafta|golden globe|movie|film|album|song|singer|rapper|actor|actress|netflix|disney|hbo|spotify|billboard|box office|rihanna|taylor swift|beyonce|drake|kanye|celebrity|reality tv|season)\b/.test(q)) return "Entertainment";

  // Science & Health
  if (/\b(climate|nasa|spacex|mars|moon|rocket|launch|vaccine|drug|fda|cancer|health|disease|pandemic|virus|earthquake|hurricane|temperature|co2|carbon|renewable|nuclear|asteroid)\b/.test(q)) return "Science";

  return "General";
}

export async function fetchTrendingMarkets(limit = 100): Promise<PolyMarket[]> {
  try {
    const res = await axios.get(`${GAMMA_API}/markets`, {
      params: {
        limit,
        active: true,
        closed: false,
        order: "volume24hr",
        ascending: false,
      },
      timeout: 12000,
    });

    const markets = Array.isArray(res.data) ? res.data : (res.data?.markets || []);

    return markets
      .filter((m: any) => m.question && m.active && !m.closed)
      .map((m: any) => {
        const [yes, no] = parseOutcomePrices(m.outcomePrices);
        return {
          id: m.id || m.conditionId || m.slug,
          question: m.question,
          category: getCategory(m.question),
          image: m.image || m.icon,
          volume: parseFloat(m.volume || "0"),
          volume24h: parseFloat(m.volume24hr || "0"),
          liquidity: parseFloat(m.liquidity || "0"),
          yes_price: yes,
          no_price: no,
          end_date: m.endDate || m.endDateIso,
          active: true,
          tags: [],
        };
      });
  } catch (err) {
    console.error("Polymarket fetch error:", err);
    return getMockMarkets();
  }
}

export async function fetchMarket(id: string): Promise<PolyMarket | null> {
  try {
    const res = await axios.get(`${GAMMA_API}/markets/${id}`, { timeout: 8000 });
    const m = res.data;
    const [yes, no] = parseOutcomePrices(m.outcomePrices);
    return {
      id: m.id || m.conditionId,
      question: m.question,
      category: getCategory(m.question),
      image: m.image || m.icon,
      volume: parseFloat(m.volume || "0"),
      volume24h: parseFloat(m.volume24hr || "0"),
      liquidity: parseFloat(m.liquidity || "0"),
      yes_price: yes,
      no_price: no,
      end_date: m.endDate,
      active: true,
      tags: [],
    };
  } catch {
    return null;
  }
}

export function getMockMarkets(): PolyMarket[] {
  return [
    { id: "will-eth-15k", question: "Will Ethereum reach $15,000 in 2026?", category: "Crypto", volume: 2840000, volume24h: 142000, liquidity: 540000, yes_price: 0.34, no_price: 0.66, active: true, tags: [] },
    { id: "will-btc-200k", question: "Will Bitcoin hit $200K before 2027?", category: "Crypto", volume: 5120000, volume24h: 256000, liquidity: 1200000, yes_price: 0.28, no_price: 0.72, active: true, tags: [] },
    { id: "will-france-win-wc", question: "Will France win the 2026 FIFA World Cup?", category: "Sports", volume: 3036000, volume24h: 890000, liquidity: 720000, yes_price: 0.356, no_price: 0.644, active: true, tags: [] },
    { id: "will-fed-cut", question: "Will the Fed cut rates 3+ times in 2026?", category: "Finance", volume: 1650000, volume24h: 82000, liquidity: 380000, yes_price: 0.45, no_price: 0.55, active: true, tags: [] },
    { id: "will-trump-2028", question: "Will Trump win the 2028 US election?", category: "Politics", volume: 3200000, volume24h: 160000, liquidity: 720000, yes_price: 0.38, no_price: 0.62, active: true, tags: [] },
    { id: "will-openai-ipo", question: "Will OpenAI IPO before end of 2026?", category: "Tech", volume: 1100000, volume24h: 55000, liquidity: 290000, yes_price: 0.41, no_price: 0.59, active: true, tags: [] },
    { id: "will-rihanna-album", question: "New Rihanna Album before GTA VI?", category: "Entertainment", volume: 848000, volume24h: 42000, liquidity: 180000, yes_price: 0.525, no_price: 0.475, active: true, tags: [] },
    { id: "will-spacex-mars", question: "Will SpaceX launch a crewed Mars mission in 2026?", category: "Science", volume: 340000, volume24h: 17000, liquidity: 78000, yes_price: 0.08, no_price: 0.92, active: true, tags: [] },
  ];
}
