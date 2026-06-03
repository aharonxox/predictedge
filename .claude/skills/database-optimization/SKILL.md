---
name: database-optimization
description: Optimize Supabase/PostgreSQL queries and database design. Use when working with database operations, queries, or schema changes.
---

Keep database operations fast and efficient for PredictionEdge.

## Query Optimization
- Use indexed columns in WHERE clauses
- Select only needed columns (`select('id, title, price')` not `select('*')`)
- Use pagination for large result sets (limit + offset or cursor-based)
- Avoid N+1 queries — batch with `.in()` or joins
- Use Supabase's `.single()` when expecting one row

## Supabase Patterns
```typescript
// Good: Specific select with filter
const { data } = await supabase
  .from('markets')
  .select('id, title, price, category')
  .eq('active', true)
  .order('created_at', { ascending: false })
  .limit(50);

// Good: RPC for complex queries
const { data } = await supabase.rpc('get_top_picks', { limit_count: 5 });
```

## Row Level Security (RLS)
- Every table with user data MUST have RLS enabled
- Policies should use `auth.uid()` for user scoping
- Test that users cannot access other users' data
- Service role key bypasses RLS — use only server-side

## Schema Design
- Use proper data types (not everything is `text`)
- Add indexes on frequently queried columns
- Use foreign keys for referential integrity
- Timestamp columns: `created_at` (default now()), `updated_at`
- Soft delete with `deleted_at` instead of hard delete when appropriate
