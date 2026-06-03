---
name: api-design
description: Design and implement robust, consistent REST API routes. Use when creating or modifying API endpoints in the Next.js App Router.
---

Build API routes that are consistent, secure, and well-documented.

## Standards

### Route Structure
- Follow Next.js App Router conventions: `app/api/[domain]/route.ts`
- Group related endpoints under a common path prefix
- Use proper HTTP methods: GET (read), POST (create/action), PUT (replace), PATCH (update), DELETE (remove)

### Request Handling
- Validate all input with explicit type checks (or Zod schemas if available)
- Return early on validation failures with 400 status
- Parse request body with `await request.json()` in try/catch
- Use URL search params for GET query parameters

### Response Format
```typescript
// Success
return NextResponse.json({ data: result }, { status: 200 });

// Error
return NextResponse.json({ error: "Human-readable message" }, { status: 4xx });
```

### Authentication
- Check auth on every protected endpoint using Supabase server client
- Return 401 for unauthenticated, 403 for unauthorized
- Check trial status for trial-gated endpoints
- Never trust client-side auth state alone

### Error Handling
- Wrap handler body in try/catch
- Log errors server-side for debugging
- Return generic messages to clients (never expose stack traces)
- Use appropriate status codes (400, 401, 403, 404, 429, 500)

### Performance
- Use streaming responses for AI/LLM endpoints
- Set appropriate cache headers for read-only data
- Avoid N+1 queries — batch database calls
- Keep response payloads minimal

### PredictionEdge Conventions
- Auth helpers in `utils/supabase/`
- AI endpoints under `app/api/ai/`
- Data endpoints under `app/api/data/`
- Auth endpoints under `app/api/auth/`
