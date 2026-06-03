---
name: feature-dev
description: Structured 7-phase feature development workflow. Use when building new features, pages, or significant additions to the codebase. Ensures thorough planning, implementation, and quality review.
---

This skill guides a structured approach to feature development, ensuring nothing is missed from planning through delivery.

## 7-Phase Workflow

### Phase 1: Requirements Analysis
- Clarify the feature scope and user stories
- Identify acceptance criteria
- List edge cases and error states
- Define what "done" looks like

### Phase 2: Codebase Exploration
- Search existing code for related patterns
- Identify files that will be modified or created
- Check for reusable components, utilities, or hooks
- Understand the data flow (API -> state -> UI)

### Phase 3: Architecture Design
- Design the component hierarchy
- Plan the data model and API contracts
- Identify new routes, API endpoints, or database changes
- Consider auth/permissions requirements
- Plan for loading, error, and empty states

### Phase 4: Implementation
- Build bottom-up: utilities -> hooks -> components -> pages
- Follow existing project patterns exactly
- Use TypeScript strictly — no `any`, proper interfaces
- Write self-documenting code with meaningful names
- Keep components focused and composable

### Phase 5: Styling & Polish
- Apply the frontend-design skill for UI work
- Ensure responsive design (mobile-first)
- Add proper loading skeletons and transitions
- Match the existing dark premium aesthetic
- Test all interactive states (hover, focus, active, disabled)

### Phase 6: Quality Review
- Run `npm run lint` and `npm run typecheck`
- Self-review the diff for bugs, security, and quality
- Check accessibility (keyboard nav, screen readers, contrast)
- Verify error handling is comprehensive
- Test edge cases (empty data, long strings, slow network)

### Phase 7: Delivery
- Write a clear, concise commit message
- Create a PR with context on what changed and why
- Include screenshots for UI changes
- List any manual testing steps
