---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when building web components, pages, or applications for PredictionEdge. Generates creative, polished code that avoids generic AI aesthetics.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.

## Design Direction for PredictionEdge

PredictionEdge uses a **luxury abstract dark aesthetic**:
- Dark backgrounds (#05060A base)
- Purple/cyan accent gradients (#7C5CFF -> #38E1FF)
- Glassmorphism effects (frosted glass panels)
- Bold typography with tight letter-spacing
- Dramatic aurora gradients and noise textures
- Every page must feel like a $10,000+ custom build

## Implementation Guidelines

### Typography
- Use distinctive font pairings (current: Inter + JetBrains Mono)
- Headlines: bold weight, `tracking-tightest`, large sizes (40-76px)
- Apply `text-gradient` for emphasis text

### Color System
Use existing Tailwind tokens:
- `bg`, `bg-soft`, `bg-card`, `bg-elev`, `bg-ridge` for surfaces
- `ink`, `ink-soft`, `ink-mute` for text
- `accent`, `accent-cyan`, `accent-green`, `accent-red` for color accents
- `line`, `line-soft`, `line-strong` for borders

### Effects & Motion
- `glass` class for glassmorphism panels
- `aurora` background for hero sections
- `animate-fade-up` with staggered `animationDelay` for page loads
- `animate-shimmer` for loading states
- `animate-float` for subtle element movement
- `shadow-glow` and `shadow-glow-cyan` for luminous card effects

### Spatial Composition
- Bento grid layouts for feature showcases
- Generous whitespace (py-24 between sections)
- Max-width containers (max-w-6xl mx-auto px-6)
- Card-based layouts with `bg-card` + `border border-line`

### Never Do
- Generic Inter/Roboto without character
- Purple gradients on white backgrounds
- Predictable symmetric layouts
- Cookie-cutter card patterns
- Low-contrast text
