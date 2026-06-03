---
name: security-review
description: Review code for security vulnerabilities including XSS, injection, auth bypass, data exposure, and unsafe patterns. Use when editing API routes, auth flows, middleware, or any user-input handling code.
---

This skill performs security-focused code review, identifying vulnerabilities and suggesting fixes before they reach production.

## When to Activate

Automatically review security when:
- Editing API routes (`app/api/**`)
- Modifying authentication or middleware (`middleware.ts`, auth handlers)
- Handling user input (forms, query params, request bodies)
- Working with environment variables or secrets
- Modifying database queries or external API calls

## Security Patterns to Check

### 1. Injection Prevention
- **SQL Injection**: Never concatenate user input into queries. Use parameterized queries.
- **Command Injection**: Never pass user input to `exec()`, `spawn()`, or `eval()`.
- **XSS**: Sanitize all rendered user content. React auto-escapes JSX, but `dangerouslySetInnerHTML` bypasses this.
- **Header Injection**: Validate redirect URLs and response headers.

### 2. Authentication & Authorization
- Verify JWT tokens are validated on every protected route.
- Check that `middleware.ts` correctly guards all protected paths.
- Ensure session cookies use `httpOnly`, `secure`, `sameSite` flags.
- Verify Supabase auth tokens are refreshed properly.
- Never expose user data across accounts (IDOR).

### 3. Data Exposure
- Never log secrets, tokens, or API keys.
- Never expose internal error details to clients (use generic messages).
- Verify `.env` files are in `.gitignore`.
- Check that API responses don't leak sensitive fields.

### 4. API Security
- Rate limit sensitive endpoints (login, signup, password reset).
- Validate and sanitize all request body fields.
- Use appropriate HTTP methods (don't allow GET for mutations).
- Set proper CORS headers.

### 5. Dependency Security
- Flag known vulnerable packages.
- Avoid packages with excessive permissions or low maintenance.

### 6. PredictionEdge-Specific
- Verify trial status checks are server-side (not client-only).
- Ensure NVIDIA API key is never exposed to the client.
- Validate that Supabase RLS policies are in place for user data.
- Check that scraping endpoints don't expose raw HTML or allow SSRF.

## Output Format

For each finding:
```
[SEVERITY: critical|high|medium|low] - Brief description
  File: path/to/file.ts:line
  Issue: What's wrong
  Fix: How to fix it
```
