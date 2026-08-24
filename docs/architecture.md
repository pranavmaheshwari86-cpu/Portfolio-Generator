# Technical Architecture Document

## System Design & Principles

The AI-Powered Premium Portfolio Generator operates on the foundational principle:

> **Do not generate random HTML directly from LLMs. Generate a structured canonical representation (Portfolio Schema / IR) and render it deterministically via curated, accessible React component primitives.**

```text
               USER
                 │
                 ▼
         NEXT.JS WEB (App Router)
                 │
            REST API / SSE
                 │
                 ▼
          NESTJS CORE API
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
PostgreSQL    AIService   File Storage
(Drizzle)    (Multi-Tier)   (Uploads)
```

## Security Controls
- **Input Validation**: All incoming requests validated via strict Zod schemas with `ZodValidationPipe`.
- **JWT & Password Security**: Passwords hashed with `bcrypt` (10 rounds), signed JWT tokens with expiry.
- **Resource Ownership**: Strict ownership verification on all resume, profile, portfolio, and version endpoints.
- **Untrusted File Sandboxing**: In-memory PDF parsing with MIME type and size checks.
