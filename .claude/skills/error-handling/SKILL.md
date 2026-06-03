---
name: error-handling
description: Implement comprehensive error handling patterns for both client and server code. Use when building features that interact with APIs, databases, or external services.
---

Handle errors gracefully so users never see a broken page.

## Patterns

### API Routes (Server)
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // validate, process, return
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[API_NAME]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

### Client Components
- Use React Error Boundaries for component-level crashes
- Show meaningful error states (not just "Error occurred")
- Provide retry actions where appropriate
- Log errors for debugging but show user-friendly messages

### Async Operations
- Always handle both success and failure cases
- Show loading states during async operations
- Handle timeout scenarios for external APIs
- Implement retry logic for transient failures (with exponential backoff)

### Form Validation
- Validate on blur and on submit
- Show inline error messages next to the relevant field
- Don't clear the form on error — let users fix and retry
- Disable submit button while processing

### Network Errors
- Detect offline state and show appropriate UI
- Handle API timeouts gracefully
- Differentiate between client errors (4xx) and server errors (5xx)
- Queue actions for retry when back online (if applicable)

### PredictionEdge Specific
- NVIDIA NIM API failures: Fall back to structured response
- Supabase auth errors: Clear session and redirect to login
- Trial expiration: Show the TrialExpired gate component
- Market data fetch failures: Show stale data indicator + retry
