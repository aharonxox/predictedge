---
name: seo-optimization
description: Optimize pages for search engine visibility and social sharing. Use when creating new pages or modifying page metadata.
---

Ensure PredictionEdge pages are discoverable and shareable.

## Technical SEO

### Metadata (Next.js)
```typescript
export const metadata: Metadata = {
  title: "Page Title — PredictionEdge",
  description: "Concise, compelling 150-160 char description with primary keywords.",
  openGraph: {
    title: "Page Title",
    description: "Social sharing description",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title",
    description: "Twitter description",
  },
};
```

### Page Structure
- One `<h1>` per page with primary keyword
- Logical heading hierarchy (h1 > h2 > h3)
- Descriptive link text (not "click here")
- Alt text on all meaningful images

### Performance (SEO Impact)
- LCP < 2.5s (Google ranking factor)
- Mobile-friendly (responsive design)
- No layout shift (CLS < 0.1)
- HTTPS everywhere

### Crawlability
- Clean URL structure (`/picks`, `/markets`, not `/page?id=123`)
- Proper canonical URLs
- Sitemap.xml for public pages
- robots.txt configured appropriately
- No broken internal links

### Structured Data
- Use JSON-LD for rich snippets where applicable
- WebSite, Organization, and WebPage schemas

## Content SEO
- Target keywords: prediction markets, Kalshi analysis, Polymarket picks, AI trading
- Unique title and description for every page
- Internal linking between related pages
