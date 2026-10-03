# ADR-0001 — Application Stack

Status: Accepted for Phase 11 Foundation
Date: 2026-10-03

## Decision

NUS uses a modular monolith built around:

- Next.js 16.3.8 App Router
- React 19.2.0
- TypeScript 5.9.3 for conservative framework compatibility
- Supabase PostgreSQL + Auth
- `@supabase/ssr` 0.12.7
- `@supabase/supabase-js` 2.117.2
- Zod 4.6.5
- Tailwind CSS 4.3.3
- Vitest 5.0.3
- Playwright Test 1.63.0
- ESLint 9.39.5 + `eslint-config-next` 16.3.8

## Rationale

The stack keeps the MVP as one deployable application with a managed Postgres/Auth backend. Supabase's current Next.js guidance uses `@supabase/ssr`, cookie-based sessions and `proxy.ts` for Next.js 16. Next.js 16.3.8 is the current Active LTS security patch as of 2026-10-03.

## Explicit non-decisions

No microservices, native mobile clients, autonomous AI agent runtime, or provider-specific application logic are introduced during Foundation.
