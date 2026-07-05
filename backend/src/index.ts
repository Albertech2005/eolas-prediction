import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import marketsRouter from "./routes/markets";
import smartMoneyRouter from "./routes/smartMoney";
import narrativesRouter from "./routes/narratives";
import battlesRouter from "./routes/battles";
import leaderboardRouter from "./routes/leaderboard";
import profileRouter from "./routes/profile";
import { startJobs } from "./jobs/scheduler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://eolas-prediction.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow all vercel preview deployments
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    return callback(null, true); // open for now
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "eolas-prediction-api" });
});

// Routes
app.use("/api/markets", marketsRouter);
app.use("/api/smart-money", smartMoneyRouter);
app.use("/api/narratives", narrativesRouter);
app.use("/api/battles", battlesRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/profile", profileRouter);

// Start background jobs
startJobs();

app.listen(PORT, () => {
  console.log(`🧠 EOLAS Prediction API running on port ${PORT}`);
});

export default app;
