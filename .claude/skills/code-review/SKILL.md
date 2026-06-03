---
name: code-review
description: Perform thorough automated code review checking for bugs, code quality, performance issues, and adherence to project conventions. Use when reviewing PRs or before committing changes.
---

This skill performs multi-dimensional code review, analyzing changes from several expert perspectives simultaneously.

## Review Dimensions

### 1. Bug Detection
- Off-by-one errors, null/undefined access, race conditions
- Incorrect async/await usage (missing await, unhandled promises)
- State management bugs (stale closures, missing dependencies in hooks)
- Incorrect TypeScript narrowing or type assertions

### 2. Code Quality
- Follow existing patterns and conventions in the codebase
- DRY principle — extract repeated logic into utilities
- Single responsibility — functions/components do one thing well
- Meaningful names — variables, functions, and files are self-documenting
- No dead code, commented-out blocks, or console.log statements

### 3. Performance
- Unnecessary re-renders in React components
- Missing `key` props or incorrect key usage in lists
- Large bundle imports that could be tree-shaken or lazy-loaded
- N+1 query patterns in API routes
- Missing caching opportunities (ISR, SWR, memoization)

### 4. TypeScript Strictness
- No `any` types — use proper typing
- No type assertions (`as`) unless absolutely necessary with a comment explaining why
- Prefer discriminated unions over type assertions
- Use `satisfies` for type-checking without widening
- All function parameters and return types should be explicit

### 5. Project Conventions (PredictionEdge)
- Use Tailwind utility classes — no inline styles or CSS modules
- Components in `components/`, pages in `app/`, utilities in `utils/`
- API routes use Next.js App Router convention (`route.ts`)
- Error handling: try/catch with proper NextResponse error codes
- Auth checks via Supabase + middleware pattern

## Review Process

1. Read the full diff/changes
2. Analyze each dimension above
3. Prioritize findings by impact (critical > high > medium > low)
4. Suggest specific fixes, not just problems
5. Acknowledge good patterns when seen
