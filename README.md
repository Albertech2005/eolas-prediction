# EOLAS — AI Prediction Intelligence Platform

> "Before the market decides, EOLAS predicts."

The AI intelligence layer for prediction markets on Base. Built on top of Polymarket with AI probability engines, smart money tracking, narrative heatmaps, and viral prediction battles.

---

## 🏗️ Structure

```
eolas-prediction/
├── frontend/    → Next.js 14 (deploy to Vercel)
└── backend/     → Node.js + TypeScript (deploy to Railway)
```

---

## 🚀 Quick Start

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # already done — keys are pre-filled
npm run dev
# → http://localhost:4000
```

### 3. Test it
- Open http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Markets: http://localhost:3000/markets
- Smart Money: http://localhost:3000/smart-money
- Narratives: http://localhost:3000/narratives
- Battles: http://localhost:3000/battles
- Leaderboard: http://localhost:3000/leaderboard

---

## 🔑 Environment Variables

### Backend `.env`
| Variable | Value |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI key |
| `ALCHEMY_API_KEY` | Your Alchemy key |
| `PORT` | 4000 |

### Frontend `.env.local`
| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` (dev) or Railway URL (prod) |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set env var: NEXT_PUBLIC_API_URL = your Railway URL
```

### Backend → Railway
```bash
cd backend
# Push to GitHub, connect Railway to repo
# Set all env vars in Railway dashboard
# Railway auto-detects Node.js
```

---

## 🧠 Features

| Feature | Status |
|---|---|
| Trending Markets Dashboard | ✅ Live |
| AI Probability Engine (GPT-4o-mini) | ✅ Live |
| Smart Money Tracker | ✅ Live |
| Narrative Heatmap (AI-scored) | ✅ Live |
| Prediction Battles | ✅ Live |
| Leaderboard | ✅ Live |
| Wallet Authentication | 🔜 Phase 2 |
| EOLAS Token Gating | 🔜 Phase 2 |
| Telegram Notifications | 🔜 Phase 2 |

---

## 📡 APIs Used

- **Polymarket Gamma API** — live market data (free, no key)
- **OpenAI GPT-4o-mini** — AI probability engine + narrative scoring
- **Alchemy (Base)** — on-chain wallet analytics
- **CoinGecko** — (ready to add, no key for basic tier)

---

## 🎨 Design

- Dark mode, deep navy blue palette
- Trading terminal aesthetic
- Mobile responsive
- Tailwind CSS + custom glass-card components
