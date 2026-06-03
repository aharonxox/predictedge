# CLAUDE.md — PredictionEdge Project Intelligence

## Project Overview
PredictionEdge is an AI-powered prediction market analysis platform for Kalshi and Polymarket. Built with Next.js 14 App Router, React 18, Tailwind CSS, Supabase Auth, and NVIDIA NIM.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS (dark premium theme)
- **Auth**: Supabase (email/password, JWT cookies, middleware-protected routes)
- **AI**: NVIDIA NIM for research chat
- **Icons**: Lucide React
- **Deploy**: Vercel

## Architecture
```
app/
├── api/           # API routes (auth, ai, data)
├── (pages)/       # Page routes (dashboard, picks, markets, ai-chat, account)
├── layout.tsx     # Root layout with fonts
├── page.tsx       # Landing page
└── globals.css    # Global styles + Tailwind
components/        # Shared UI components
utils/             # Supabase clients, helpers
types/             # TypeScript type definitions
```

## Design System
- **Dark theme**: bg #05060A, cards #0C0F17, elevated #11151F
- **Accent**: Purple #7C5CFF, Cyan #38E1FF, Green #2BD9A4
- **Typography**: Inter (sans), JetBrains Mono (mono), tight letter-spacing headlines
- **Effects**: Glassmorphism (`glass` class), aurora gradients, noise textures, shimmer animations
- **Style**: Luxury abstract aesthetic — bold, premium, $10k+ custom build feel

## Key Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## Skills Installed
This repo includes specialized AI skills in `.claude/skills/` that activate automatically:

| Skill | Purpose |
|-------|---------|
| **frontend-design** | Production-grade UI with bold design choices (official Anthropic skill) |
| **security-review** | Vulnerability scanning for auth, API, injection, data exposure |
| **code-review** | Multi-dimensional review: bugs, quality, performance, TypeScript |
| **feature-dev** | 7-phase structured development workflow |
| **performance-optimization** | Core Web Vitals, bundle size, runtime efficiency |
| **accessibility-audit** | WCAG 2.1 AA compliance checking |
| **api-design** | REST API design patterns for Next.js |
| **testing-strategy** | Testing pyramid and test planning |
| **error-handling** | Comprehensive error handling patterns |
| **typescript-strict** | Strict TypeScript enforcement |
| **responsive-design** | Mobile-first responsive patterns |
| **seo-optimization** | Search engine and social sharing optimization |
| **database-optimization** | Supabase/PostgreSQL query and schema optimization |

## Conventions
- Use Tailwind utility classes — no inline styles or CSS modules
- Server Components by default, `"use client"` only when needed
- Auth checks via middleware.ts + Supabase server client
- Trial logic is server-side (10-day from signup)
- API errors return `{ error: "message" }` with proper status codes
- No `any` types, no `as` assertions without justification
