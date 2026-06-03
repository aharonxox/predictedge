---
name: code-review
description: Multi-dimensional code review for PredictionEdge. Use when reviewing changes or before committing.
---

## Review Dimensions

### Bugs
- Null/undefined access, race conditions, stale closures
- Missing await on async calls
- Incorrect TypeScript narrowing

### Quality
- Follow existing patterns in the codebase
- No dead code, console.logs, or commented-out blocks
- Meaningful variable/function names
- DRY — extract shared logic

### TypeScript
- No `any` types
- No unsafe `as` assertions
- Explicit return types on exports
- Proper interfaces for all data shapes

### Performance
- No unnecessary re-renders
- Proper key props on lists
- Lazy-load heavy components
- Server Components by default

### Conventions
- Tailwind utilities only (no inline styles)
- Components in `components/`, pages in `app/`
- API routes follow `{ data }` / `{ error }` pattern
- Auth via Supabase server client
