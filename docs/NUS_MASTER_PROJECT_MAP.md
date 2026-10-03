# NUS — MASTER PROJECT MAP & CONTINUITY CONTRACT

## Current authoritative state — 2026-10-03

- Product: NUS
- GitHub: Generalsea/Nus
- Supabase project: NUS
- Supabase ref: oghiyggxhxoxdysustkv
- Default branch: main
- Active phase: Phase 11 — Code Implementation
- Active milestone: Milestone 2 — Client Core
- Production status: NOT PRODUCTION READY
- Commercial validation: PARTIAL

## Hard isolation
NUS is independent from DEBA and every other project. Never use DEBA source, migrations, credentials, runtime state, branches, or Supabase ref gkwpjtbrecoesxyoybto.

## Product North Star
> I open NUS every morning because it tells me what matters today, protects me from missing opportunities, and removes repetitive administrative work.

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

## Client Core
Scope: create, edit, retrieve, search, detail, notes, timeline/activity, workspace timezone handling, self-service email/password signup on the existing auth screen.

Security: tenant-scoped RLS, column-level mutable fields, append-only activity events for end users, least-privilege foundation grants, no anon table access, valid IANA workspace timezone constraint.

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

An attempted ALTER DEFAULT PRIVILEGES for the platform-owned supabase_admin role was denied by PostgreSQL permission boundaries. This is documented as a platform-managed owner limitation; application-created objects use the postgres owner and are covered by the NUS migration.

## Verification
- Supabase Security Advisor: 0 lints.
- All public NUS application tables have RLS enabled.
- anon has no table privileges on NUS application tables.
- authenticated foundation grants are least-privilege.
- authenticated can SELECT activity events but cannot INSERT, UPDATE, or DELETE them.
- authenticated cannot execute the private activity trigger.
- Africa/Cairo is accepted as a workspace timezone; invalid IANA values are rejected.
- Disposable cross-tenant RLS proof: own_visible=1, cross_visible=0, cross_insert_visible=0, cross_update_visible=0, cross_note_visible=0.
- Synthetic proof data was rolled back; current live counts for organizations, clients, notes, and activity events are zero.
- GitHub Actions Run #23: SUCCESS.
- GitHub Actions Run #29: SUCCESS.
- GitHub Actions Run #34: SUCCESS on head `c2317dfdf555c0acad7c64194e0f8a4dbff27d49`.
- Workspace onboarding now generates an ASCII-safe deterministic slug for Arabic-only names.
- Auth redirect responses are explicitly `private, no-store`, and the public auth matcher is limited to `/login` and `/auth/*`.

## Release hardening gates
- GitHub legacy Branch Protection reports `main` as `protected: false`.
- GitHub repository Rulesets API currently returns no rulesets.
- The connected GitHub tooling does not expose branch-protection/ruleset write operations, so `main` protection cannot be enabled from this execution context; do not treat `main` as protected until verified in GitHub settings.
- `package-lock.json` is currently absent; CI uses pinned direct dependency versions but `npm install` remains non-reproducible for transitive dependencies until a lockfile is committed.

## Current gate
Technical implementation: PASS.
Activity/audit hardening: PASS.
Timezone hardening: PASS.
Least-privilege hardening: PASS.
Self-service Auth UI: PASS at code/CI level.
Browser-level authenticated persistence: NOT VERIFIED.

Reason: NUS currently has zero persisted Auth users and the connected execution environment exposes no browser automation connector. Anonymous Auth is not enabled merely to manufacture E2E evidence.

Real remaining proof: Login or Signup → Workspace → Create Client → Retrieve → Edit → Add Note → Search, using a real session. The email-confirmation callback URL must also be present in Supabase Auth Redirect URLs configuration.

## Commercial continuity
Commercial validation remains PARTIAL. Pricing and unit-economics numbers remain hypotheses until real customer evidence is collected.

## Continuity command
أغابي = continue from the next unpassed NUS milestone using repository and Supabase evidence.