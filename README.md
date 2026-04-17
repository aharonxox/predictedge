# PredictionEdge

AI-powered prediction market analysis for Kalshi and Polymarket. Built with
Next.js 14 App Router, React 18, Tailwind CSS, Supabase Auth, NVIDIA NIM, and
deployed on Vercel.

> **No billing.** PredictionEdge does not include Stripe, subscriptions,
> webhooks, a pricing page, a billing portal, or any payment logic. Every user
> gets a 10-day free trial tracked server-side from their signup date, and the
> app focuses on auth, trial access, AI chat, picks, markets, account
> settings, and scraped market intelligence.

## Features

- **Supabase Auth** — email + password signup, login, logout, password reset,
  JWT session cookies, protected routes via `middleware.ts`.
- **10-day free trial** — computed server-side from signup `created_at` (and
  mirrored into `user_metadata.trial_started_at`). When it ends, protected
  pages render a clear &ldquo;trial expired&rdquo; gate.
- **Daily top-5 picks** — highest-edge binary contracts across Kalshi and
  Polymarket, fused with live Prediction Arena research context.
- **Markets browser** — searchable / filterable Kalshi + Polymarket markets.
- **AI research chat** — an NVIDIA NIM-powered analyst with a structured
  fallback when the upstream API is unavailable.
- **Prediction Arena intelligence** — a scraping + normalization layer over
  <https://www.predictionarena.ai> (methodology, rankings, recent trades,
  confidence signals) exposed at `/api/data/prediction-arena`.
- **Dark premium UI** — Linear/Perplexity-style Tailwind theme, responsive
  across desktop and mobile.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/signup` | Create account & start trial |
| `/login` | Sign in |
| `/reset-password` | Request reset link, then update password |
| `/dashboard` | Authenticated home |
| `/picks` | Top 5 daily picks |
| `/markets` | Kalshi + Polymarket browser |
| `/ai-chat` | NVIDIA NIM research analyst |
| `/account` | Profile + password |

## API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/auth/signup` | POST | Create a Supabase user, mark trial start |
| `/api/auth/login` | POST | Sign in with email + password |
| `/api/auth/logout` | POST | Clear the session |
| `/api/auth/me` | GET | Current user + trial status |
| `/api/auth/reset-password` | POST | Send reset email or update password |
| `/api/ai/chat` | POST | NVIDIA NIM chat completion (trial-gated) |
| `/api/data/prediction-arena` | GET | Arena context + picks + markets (trial-gated) |

## Local development

```bash
npm install
cp .env.local.example .env.local   # already provided; edit Supabase values
npm run dev
```

Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NVIDIA_API_KEY` (keep exactly as shipped)
- `NVIDIA_NIM_BASE_URL`
- `NVIDIA_NIM_MODEL`
- `NEXT_PUBLIC_SITE_URL`

## Deployment

See [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md).
