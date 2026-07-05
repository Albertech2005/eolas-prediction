import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://eolas-prediction-production.up.railway.app";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Markets
export const getMarkets = (category?: string, sort?: string) =>
  api.get("/api/markets", { params: { category, sort } }).then(r => r.data);

export const getMarket = (id: string) =>
  api.get(`/api/markets/${id}`).then(r => r.data);

export const getAIAnalysis = (id: string) =>
  api.get(`/api/markets/${id}/ai`).then(r => r.data);

// Smart Money
export const getSmartMoney = () =>
  api.get("/api/smart-money").then(r => r.data);

export const getWalletProfile = (address: string) =>
  api.get(`/api/smart-money/${address}`).then(r => r.data);

// Narratives
export const getNarratives = () =>
  api.get("/api/narratives").then(r => r.data);

// Battles
export const getBattles = () =>
  api.get("/api/battles").then(r => r.data);

export const getBattle = (id: string) =>
  api.get(`/api/battles/${id}`).then(r => r.data);

export const voteBattle = (id: string, side: "yes" | "no", address: string) =>
  api.post(`/api/battles/${id}/vote`, { side, address }).then(r => r.data);

export const createBattle = (data: { question: string; description: string; address: string }) =>
  api.post("/api/battles", data).then(r => r.data);

// Leaderboard
export const getLeaderboard = () =>
  api.get("/api/leaderboard").then(r => r.data);

// Profile
export const getProfile = (address: string) =>
  api.get(`/api/profile/${address}`).then(r => r.data);
