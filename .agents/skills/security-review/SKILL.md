---
name: security-review
description: Review PredictionEdge code for security vulnerabilities. Use when modifying API routes, auth flows, middleware, or user-input handling.
---

## Security Review Checklist

### Auth & Sessions
- JWT tokens validated on every protected route
- middleware.ts guards all `/dashboard`, `/picks`, `/markets`, `/ai-chat`, `/account` paths
- Session cookies use httpOnly, secure, sameSite flags
- Supabase auth tokens refreshed properly
- No user data leaks across accounts (IDOR)

### API Routes
- All request bodies validated and sanitized
- Proper error responses (no stack traces to client)
- Rate limiting on auth endpoints
- Trial status checked server-side (not client-only)
- NVIDIA API key never exposed to client

### Data
- Environment variables in .env.local (in .gitignore)
- No secrets logged or exposed in responses
- Supabase RLS policies on user data tables
- Scraping endpoints don't allow SSRF

### Injection
- No raw SQL concatenation (use parameterized queries)
- No eval() or dangerouslySetInnerHTML with user input
- Validate redirect URLs to prevent open redirects
