import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In-memory battles store (replace with DB later)
let battles: any[] = [
  {
    id: "btl-001", question: "Will Bitcoin hit $200K before 2028?", category: "Crypto",
    yes_votes: 847, no_votes: 423, yes_amount: 142000, no_amount: 68000,
    total_participants: 1270, creator: "0xDemoCreator",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: "active",
  },
  {
    id: "btl-002", question: "Will Ethereum flip Bitcoin in market cap by 2027?", category: "Crypto",
    yes_votes: 312, no_votes: 891, yes_amount: 48000, no_amount: 134000,
    total_participants: 1203, creator: "0xDemoCreator2",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 60).toISOString(),
    status: "active",
  },
  {
    id: "btl-003", question: "Will AI replace more than 5 million jobs by 2026?", category: "Tech",
    yes_votes: 1204, no_votes: 678, yes_amount: 89000, no_amount: 52000,
    total_participants: 1882, creator: "0xDemoCreator3",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 10).toISOString(),
    status: "active",
  },
  {
    id: "btl-004", question: "Will Polymarket reach $10B volume in 2026?", category: "Prediction Markets",
    yes_votes: 598, no_votes: 203, yes_amount: 74000, no_amount: 28000,
    total_participants: 801, creator: "0xDemoCreator4",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 45).toISOString(),
    status: "active",
  },
  {
    id: "btl-005", question: "Will Base become the #1 L2 by TVL before 2027?", category: "Crypto",
    yes_votes: 742, no_votes: 389, yes_amount: 112000, no_amount: 58000,
    total_participants: 1131, creator: "0xDemoCreator5",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 90).toISOString(),
    status: "active",
  },
  {
    id: "btl-006", question: "Did Solana have more transactions than Ethereum in Q1 2026?", category: "Crypto",
    yes_votes: 934, no_votes: 412, yes_amount: 0, no_amount: 0,
    total_participants: 1346, creator: "0xDemoCreator6",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    ends_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "resolved", result: "yes",
  },
];

// GET /api/battles
router.get("/", (_req: Request, res: Response) => {
  res.json({ battles, count: battles.length });
});

// GET /api/battles/:id
router.get("/:id", (req: Request, res: Response) => {
  const battle = battles.find(b => b.id === req.params.id);
  if (!battle) return res.status(404).json({ error: "Battle not found" });
  res.json({ battle });
});

// POST /api/battles/:id/vote
router.post("/:id/vote", (req: Request, res: Response) => {
  const { side } = req.body as { side: "yes" | "no"; address: string };
  const battle = battles.find(b => b.id === req.params.id);
  if (!battle) return res.status(404).json({ error: "Battle not found" });
  if (battle.status !== "active") return res.status(400).json({ error: "Battle is not active" });

  if (side === "yes") { battle.yes_votes++; battle.yes_amount += 100; }
  else { battle.no_votes++; battle.no_amount += 100; }
  battle.total_participants++;

  res.json({ success: true, battle });
});

// POST /api/battles — create new battle
router.post("/", (req: Request, res: Response) => {
  const { question, description, address } = req.body;
  if (!question?.trim()) return res.status(400).json({ error: "Question is required" });

  const battle = {
    id: `btl-${uuidv4().slice(0, 8)}`,
    question: question.trim(),
    description: description || "",
    category: "General",
    yes_votes: 0, no_votes: 0,
    yes_amount: 0, no_amount: 0,
    total_participants: 0,
    creator: address || "0xAnonymous",
    created_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: "active",
  };

  battles.unshift(battle);
  res.json({ success: true, battle });
});

export default router;
