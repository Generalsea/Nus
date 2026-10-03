# Phase 11 — Milestone 1 — Foundation

## Status

Foundation implementation is synchronized to the dedicated NUS Supabase project and is ready for remote CI verification.

## Acceptance criteria

- [x] Dedicated Supabase project exists
- [x] Foundation migration applied
- [x] Workspace creation is atomic at database transaction scope
- [x] RLS enabled on foundation tables
- [x] Auth proxy uses `@supabase/ssr` and current Next.js 16 `proxy.ts` pattern
- [x] No DEBA credentials or database references are used
- [x] GitHub write/branch creation verified through authorized GitHub integration
- [x] CI workflow uses a connected runner to resolve pinned dependencies without requiring a local npm registry
- [ ] typecheck
- [ ] lint
- [ ] unit test execution
- [ ] production build
- [ ] browser E2E against local running application

## Gate

Milestone remains **READY FOR REMOTE CI VERIFICATION** until GitHub Actions completes the dependency install, typecheck, lint, unit tests, and production build successfully.
