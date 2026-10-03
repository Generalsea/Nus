# NUS — MASTER PROJECT MAP & CONTINUITY CONTRACT

## Current authoritative state — 2026-10-03

- Product: NUS
- GitHub: Generalsea/Nus
- Supabase project: NUS
- Supabase ref: oghiyggxhxoxdysustkv
- Supabase URL: https://oghiyggxhxoxdysustkv.supabase.co
- Default branch: main
- Active phase: Phase 11 — Code Implementation
- Active milestone: Milestone 2 — Client Core
- Production status: NOT PRODUCTION READY
- Commercial validation: PARTIAL

## Hard isolation

NUS is independent from DEBA and every other project. Never use DEBA source, migrations, credentials, runtime state, branches, or Supabase ref gkwpjtbrecoesxyoybto.

## Product North Star

> I open NUS every morning because it tells me what matters today, protects me from missing opportunities, and removes repetitive administrative work.

## Core loop

Morning → Today priorities → appointments → at-risk clients → follow-ups → action → interaction → note/outcome → next action → reminder/automation → return tomorrow.

## Product laws

PRODUCT VALUE > FEATURE COUNT
RETENTION > NOVELTY
REAL DEMAND > PERSONAL OPINION
PROOF > ASSUMPTION
RELIABILITY > CODING SPEED
SIMPLICITY > ARCHITECTURAL COMPLEXITY
CUSTOMER OUTCOME > TECHNICAL SHOWCASE
RECURRING VALUE > ONE-TIME NOVELTY

## Phase state

| Phase | Status |
|---|---|
| 0 Project Framing | PASS |
| 1 Market + Micro-Niche Research | PASS |
| 2 Customer Problem Validation | PARTIAL — direct 10–15 customer validation remains open |
| 3 Competitor + Whitespace | PASS |
| 4 Product Definition | PASS |
| 5 Killer Feature + Retention | PASS |
| 6 Business Model + Economics | PASS — planning; pricing remains hypothesis |
| 7 UX / Journey | PASS |
| 8 Technical Architecture | PASS — modular monolith |
| 9 Database + Security Design | PASS |
| 10 MVP Implementation Plan | PASS |
| 11 Code Implementation | ACTIVE — Milestone 2 Client Core |
| 12 Testing + Bug Fixing | PENDING |
| 13 Security + Performance Audit | PENDING |
| 14 Deployment | PENDING |
| 15 Real-World Validation | PENDING |
| 16 Growth + Iteration | PENDING |

## MVP boundary

MUST HAVE: auth, workspace, clients, appointments, Today, follow-up, reminders, notification abstraction, notes/history, audit, validation/errors, analytics foundation.

NOT YET: microservices, native apps, full CRM/ERP, autonomous AI, large integration marketplace, complex enterprise RBAC, social features, advanced BI.

## Milestones

1. Foundation
2. Client Core
3. Appointment Core
4. Today Engine
5. Follow-up + Automation
6. Notification Provider
7. AI Action Layer

## Client Core

Scope: create, edit, retrieve, search, detail, notes, timeline/activity, workspace timezone handling, self-service email/password signup on the existing auth screen.

Security: tenant-scoped RLS, server-validated workspace selection, column-level mutable fields, append-only activity events for end users, least-privilege foundation grants, no anon table access, valid IANA workspace timezone constraint.

## Applied NUS migrations

- 20261003133448 foundation_core
- 20261003133636 foundation_workspace_atomic
- 20261003134008 foundation_function_hardening
- 20261003142451 client_core
- 20261003142516 client_core_hardening
- 20261003144346 client_activity_security_hardening
- 20261003144558 activity_events_write_lockdown
- 20261003144837 organizations_timezone_hardening
- 20261003145121 foundation_grants_lockdown
- 20261003145225 public_default_privileges_lockdown
- 20261003160304 foundation_identity_grants_lockdown
- 20261003160522 organization_owner_membership_guard
- 20261003161042 profiles_timezone_hardening
- 20261003161825 profile_trigger_search_path_hardening

The platform-managed supabase_admin default-privilege owner boundary remains documented; the application-owned migration path has explicit least-privilege defaults.

## Verification

- Supabase Security Advisor: 0 lints.
- All public NUS application tables have RLS enabled.
- anon has no NUS application-table grants.
- authenticated foundation grants are least-privilege, including immutable identity/audit columns excluded from client writes.
- authenticated can SELECT activity events but cannot INSERT, UPDATE, or DELETE them.
- authenticated cannot execute the private activity trigger.
- Valid IANA workspace timezones are enforced at the database boundary.
- Workspace selection is stored in a server-only cookie and revalidated against the authenticated user's membership before use.
- Client insert no longer attempts to write the insert-protected `archived_at` column.
- Foundation `profiles` and `organizations` identity/ownership/timestamp columns are excluded from authenticated UPDATE grants.
- Workspace owners cannot delete their own membership through the Data API; only `member` memberships can self-delete until ownership transfer/lifecycle is implemented.
- Both organization and profile timezones are enforced against the IANA timezone catalog at the database boundary.
- Client search neutralizes PostgREST wildcard/filter grammar characters before constructing the OR filter.
- Disposable cross-tenant RLS proof passed and was rolled back.
- Current live database counts: auth.users=0, organizations=0, clients=0, client_notes=0, activity_events=0.
- GitHub Actions Run #66: SUCCESS — dependency audit, typecheck, lint, unit tests, and production build all passed.
- GitHub Actions Run #67: SUCCESS on the current feature branch after final CI pinning.
- GitHub Actions Run #68: SUCCESS after the final E2E workflow fail-fast change.
- GitHub Actions Run #72: SUCCESS — npm audit, typecheck, lint, unit tests, and production build passed after workspace-context hardening.
- GitHub Actions Run #81: SUCCESS — latest Client Core state, HTTP security headers, root error/not-found boundaries, grant hardening, and owner-membership guard all passed CI.
- GitHub Actions Run #83: SUCCESS — profile timezone hardening passed CI; live DB constraint was verified.
- GitHub Actions Run #84: SUCCESS — latest search wildcard sanitization passed npm audit, typecheck, lint, unit tests, and production build.
- GitHub Actions Run #87: SUCCESS — fail-closed authenticated E2E guard and workspace-name validation passed npm audit, typecheck, lint, unit tests, and production build.
- GitHub Actions Run #91: SUCCESS — profile trigger SECURITY DEFINER search_path hardening passed npm audit, typecheck, lint, unit tests, and production build.
- Static high-risk repository scan found no matches for service-role credentials, dangerouslySetInnerHTML, innerHTML, eval(, or new Function(.
- package-lock.json is committed and lockfile v3; npm ci is reproducible.
- npm audit high-severity gate is enabled and currently passes.
- GitHub Actions checkout/setup-node are pinned by immutable SHA to current v7 releases.

## Real browser E2E evidence

A one-shot authenticated E2E execution was actually attempted on GitHub Actions Run 1 of the temporary test workflow.

Browser infrastructure succeeded:
- npm ci: PASS
- Chromium installation: PASS
- Playwright launched real Chromium: PASS

The application/Auth execution did not proceed because all four configured GitHub secrets resolved to empty values in the runner environment:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NUS_E2E_EMAIL
- NUS_E2E_PASSWORD

The application therefore failed its own environment validation, and the test failed before login. No database mutation occurred. The live database was rechecked afterward and remains empty.

The temporary test workflow was deleted immediately after the attempt. The permanent manual E2E workflow now fails fast with explicit missing-secret errors and requires the designated E2E workspace name. The browser test aborts before client mutation when the signed-in account does not resolve to that E2E workspace.

## Release hardening gates

- GitHub legacy Branch Protection cannot currently be verified from the connected integration because the protection endpoint returns 403 Resource not accessible by integration.
- GitHub repository Rulesets API currently returns no rulesets.
- Therefore main protection is NOT VERIFIED and must not be described as protected.
- Supabase Auth Redirect URLs for the real E2E environment remain unconfigured/unverified because no real E2E environment credentials are currently present.
- Production readiness remains NOT PRODUCTION READY.

## Current gate interpretation

Client Core implementation + database security + reproducible dependencies + CI quality gates: PASS through Run #72; the remaining release gates are external authenticated-browser proof and GitHub main protection.

Real authenticated browser persistence: NOT VERIFIED because the required GitHub secrets are absent.

GitHub main protection: NOT VERIFIED because the current integration cannot access the required administration endpoint.

Do not merge PR #2 or start Appointment Core until the two release gates above are evidenced through real external configuration.

## Engineering loop

INSPECT → PLAN → DESIGN → IMPLEMENT → TEST → VERIFY → DOCUMENT → PROCEED.

## Continuity command

أغابي = continue from the next unpassed NUS milestone using repository and Supabase evidence.
