---
name: predictedge-dev
description: Development guide for PredictionEdge. Use when working on any task in this repo.
---

## Quick Reference

### Commands
```bash
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript strict check
```

### Stack
- Next.js 14 App Router, React 18, Tailwind CSS
- Supabase Auth (email/password, JWT cookies)
- NVIDIA NIM (AI chat)
- Lucide React (icons)
- Deployed on Vercel

### File Structure
- `app/api/auth/` — signup, login, logout, me, reset-password
- `app/api/ai/chat` — NVIDIA NIM chat endpoint
- `app/api/data/prediction-arena` — scraped market data
- `app/(pages)/` — dashboard, picks, markets, ai-chat, account
- `components/` — AppShell, Sidebar, TopBar, PickCard, MarketCard, etc.
- `utils/supabase/` — server and browser client helpers
- `middleware.ts` — auth guard for protected routes

### Design Tokens
- Background: bg (#05060A), bg-card (#0C0F17), bg-elev (#11151F)
- Text: ink (#F2F4FA), ink-soft (#ABB1C4), ink-mute (#6B7286)
- Accents: accent (#7C5CFF), accent-cyan (#38E1FF), accent-green (#2BD9A4)
- Borders: line (#1C2230), line-strong (#262D42)

### Auth Flow
1. User signs up -> `user_metadata.trial_started_at` set
2. Middleware checks JWT on protected routes
3. Trial computed server-side: 10 days from signup
4. Expired trial -> TrialExpired component gate

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NVIDIA_API_KEY` / `NVIDIA_NIM_BASE_URL` / `NVIDIA_NIM_MODEL`
- `NEXT_PUBLIC_SITE_URL`
