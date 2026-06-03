---
name: performance-optimization
description: Optimize web application performance for Core Web Vitals, bundle size, and runtime efficiency. Use when addressing performance issues or building performance-critical features.
---

This skill focuses on making PredictionEdge fast. Target Lighthouse 90+ for performance.

## Key Areas

### 1. Core Web Vitals
- **LCP** (Largest Contentful Paint < 2.5s): Optimize hero images, preload critical fonts, minimize render-blocking resources
- **FID/INP** (Interaction to Next Paint < 200ms): Keep main thread free, defer non-critical JS
- **CLS** (Cumulative Layout Shift < 0.1): Set explicit dimensions on images/embeds, avoid dynamic content injection above the fold

### 2. Next.js Optimizations
- Use Server Components by default (no `"use client"` unless needed)
- Leverage ISR/SSG for data that doesn't change per-request
- Use `next/image` for automatic image optimization
- Use `next/font` for zero-layout-shift font loading
- Dynamic imports (`next/dynamic`) for heavy client components
- Route-level code splitting (already automatic with App Router)

### 3. Bundle Size
- Check imports — use named imports from specific paths
- Avoid importing entire libraries (e.g., `import { LineChart } from 'lucide-react'` not `import * as icons from 'lucide-react'`)
- Analyze bundle with `npx @next/bundle-analyzer`
- Lazy-load below-the-fold components

### 4. Runtime Performance
- Memoize expensive computations with `useMemo`
- Prevent unnecessary re-renders with `React.memo` for pure components
- Use `useCallback` for event handlers passed to child components
- Virtualize long lists (only render visible items)
- Debounce search inputs and API calls

### 5. Network
- Cache API responses appropriately (SWR, React Query, or fetch cache)
- Use streaming for AI chat responses
- Compress API payloads
- Set proper cache headers on API routes

### 6. CSS/Tailwind
- Purge unused CSS (Tailwind does this automatically in production)
- Prefer CSS animations over JS animations for better performance
- Use `will-change` sparingly and only when needed
- Avoid expensive selectors and deep nesting
