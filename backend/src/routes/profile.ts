import { Router, Request, Response } from "express";

const router = Router();

router.get("/:address", (req: Request, res: Response) => {
  const { address } = req.params;
  res.json({
    profile: {
      address,
      username: null,
      accuracy: 0,
      total_predictions: 0,
      correct: 0,
      reputation: 0,
      badges: [],
      joined_at: new Date().toISOString(),
    }
  });
});

export default router;
