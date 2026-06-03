---
name: typescript-strict
description: Enforce strict TypeScript patterns and eliminate unsafe type usage. Use when writing or reviewing TypeScript code to maintain type safety.
---

Write TypeScript that catches bugs at compile time, not runtime.

## Rules

### Never Use
- `any` — always find the proper type
- `as` type assertions — use type guards or discriminated unions instead
- `@ts-ignore` / `@ts-expect-error` — fix the underlying type issue
- `!` non-null assertion — handle null/undefined explicitly
- `Object`, `Function`, `{}` as types — too broad

### Always Use
- Explicit return types on exported functions
- `interface` for object shapes, `type` for unions/intersections
- `satisfies` to verify a value matches a type without widening
- Discriminated unions for state machines and variant types
- `readonly` for arrays and objects that shouldn't be mutated
- `unknown` instead of `any` for truly unknown values, then narrow

### Type Guards
```typescript
function isApiError(error: unknown): error is { message: string; code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
}
```

### React Patterns
```typescript
// Props with children
interface CardProps {
  title: string;
  children: React.ReactNode;
}

// Event handlers
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... };

// Refs
const inputRef = useRef<HTMLInputElement>(null);
```

### API Response Types
- Define explicit interfaces for all API request/response shapes
- Use generics for reusable patterns
- Type-narrow error responses separately from success responses
