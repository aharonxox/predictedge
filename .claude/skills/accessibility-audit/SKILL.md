---
name: accessibility-audit
description: Audit and improve web accessibility to meet WCAG 2.1 AA standards. Use when building UI components, forms, or interactive elements.
---

Ensure PredictionEdge is usable by everyone. Target WCAG 2.1 AA compliance.

## Checklist

### Semantic HTML
- Use proper heading hierarchy (h1 -> h2 -> h3, no skipping)
- Use `<nav>`, `<main>`, `<aside>`, `<footer>` landmarks
- Use `<button>` for actions, `<a>` for navigation
- Use `<ul>`/`<ol>` for lists, `<table>` for tabular data

### Keyboard Navigation
- All interactive elements are focusable and operable via keyboard
- Focus order follows visual layout (logical tab order)
- Custom components have proper `role`, `aria-label`, `aria-expanded` etc.
- No keyboard traps — users can always tab away
- Visible focus indicators (don't remove `outline` without replacement)

### Color & Contrast
- Text contrast ratio >= 4.5:1 (normal text) or >= 3:1 (large text)
- Don't rely on color alone to convey information
- Ensure UI is usable with high-contrast mode
- Test with color blindness simulators

### Forms
- Every input has an associated `<label>` (or `aria-label`)
- Error messages are linked to inputs via `aria-describedby`
- Required fields are marked with `aria-required`
- Form validation messages are announced to screen readers

### Images & Media
- All `<img>` tags have meaningful `alt` text (or `alt=""` for decorative)
- Icons used as buttons have `aria-label`
- Avoid auto-playing media

### Dynamic Content
- Use `aria-live` regions for dynamic updates (toast notifications, loading states)
- Modal dialogs trap focus and return focus on close
- Announce page transitions to screen readers

### Testing
- Test with keyboard only (no mouse)
- Test with a screen reader (VoiceOver, NVDA)
- Run axe-core or Lighthouse accessibility audit
