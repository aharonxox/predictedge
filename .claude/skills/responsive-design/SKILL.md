---
name: responsive-design
description: Build responsive interfaces that work flawlessly from 320px to 2560px. Use when creating or modifying any UI component.
---

Every PredictionEdge page must work perfectly on all screen sizes.

## Breakpoints (Tailwind)
- `sm`: 640px (large phones)
- `md`: 768px (tablets)
- `lg`: 1024px (small laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large screens)

## Approach: Mobile-First
- Write base styles for mobile (320px)
- Add complexity at larger breakpoints with `sm:`, `md:`, `lg:`
- Never hide critical content on mobile — restructure instead

## Common Patterns

### Layout
- Single column on mobile -> multi-column on desktop
- Use `flex-col md:flex-row` for directional changes
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Max-width containers: `max-w-6xl mx-auto px-4 md:px-6`

### Typography
- Scale headings: `text-2xl md:text-4xl lg:text-6xl`
- Body text stays readable: `text-sm md:text-base`
- Line lengths: max `max-w-prose` (~65ch) for readability

### Navigation
- Hamburger menu on mobile, horizontal nav on desktop
- Sidebar collapses to bottom nav or drawer on mobile
- Sticky header with reduced height on mobile

### Images & Media
- Use `w-full` with `max-w-` constraints
- Different aspect ratios per breakpoint if needed
- Hide decorative elements on small screens: `hidden md:block`

### Touch Targets
- Minimum 44x44px touch targets on mobile
- Adequate spacing between interactive elements
- Larger buttons on mobile: `py-3 md:py-2`

### Testing
- Test at: 320px, 375px, 768px, 1024px, 1440px, 1920px
- Check for horizontal scroll at every size
- Verify text doesn't overflow containers
- Test both portrait and landscape on tablets
