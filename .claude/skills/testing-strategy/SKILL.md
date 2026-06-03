---
name: testing-strategy
description: Plan and implement testing for Next.js applications. Use when adding tests, debugging test failures, or improving test coverage.
---

Guide testing decisions for PredictionEdge.

## Testing Pyramid

### 1. Unit Tests
- Test utility functions, data transformers, and business logic
- Test React hooks in isolation
- Mock external dependencies (Supabase, NVIDIA API)
- Fast, deterministic, no network calls

### 2. Integration Tests
- Test API routes end-to-end with mocked database
- Test component trees that combine multiple components
- Test auth flows (signup, login, session refresh)
- Verify middleware behavior

### 3. E2E Tests
- Test critical user flows in a real browser
- Happy paths: signup -> dashboard -> picks -> AI chat
- Error paths: expired trial, invalid credentials, API failures
- Mobile responsive behavior

## What to Test

### Always Test
- API route handlers (input validation, auth checks, response format)
- Auth flows (signup, login, logout, password reset, trial expiration)
- Data transformation functions (market data parsing, pick scoring)
- Error boundaries and fallback states

### Skip Testing
- Static UI that doesn't contain logic
- Third-party library internals
- CSS/styling (use visual regression tools instead)

## Tools
- Jest + React Testing Library for unit/integration
- Playwright for E2E
- MSW (Mock Service Worker) for API mocking
