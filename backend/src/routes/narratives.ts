import { Router, Request, Response } from "express";
import { getNarrativeScores } from "../services/narratives";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const narratives = await getNarrativeScores();
    res.json({ narratives, count: narratives.length, updated_at: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch narratives" });
  }
});

export default router;
