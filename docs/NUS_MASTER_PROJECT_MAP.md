# NUS — MASTER PROJECT MAP & CONTINUITY CONTRACT

## Current authoritative state — 2026-10-03

### Identity
- Product: NUS
- GitHub: `Generalsea/Nus`
- GitHub URL: https://github.com/Generalsea/Nus
- Supabase project: `NUS`
- Supabase project ref: `oghiyggxhxoxdysustkv`
- Supabase region: `eu-central-1`
- Supabase URL: `https://oghiyggxhxoxdysustkv.supabase.co`
- Default GitHub branch: `main`
- Active phase: Phase 11 — Code Implementation
- Active milestone: Milestone 1 — Foundation
- Production status: NOT PRODUCTION READY
- Commercial validation: PARTIAL

## Hard isolation
NUS is independent from DEBA and every other project.

Never use or copy:
- DEBA source tree
- DEBA branches
- DEBA migrations
- DEBA Supabase project `gkwpjtbrecoesxyoybto`
- DEBA environment files
- DEBA credentials
- DEBA runtime state

The NUS database is `oghiyggxhxoxdysustkv` only.

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

## Current Phase State
| Phase | Status |
|---|---|
| 0 Project Framing | PASS |
| 1 Market + Micro-Niche Research | PASS |
| 2 Customer Problem Validation | PARTIAL |
| 3 Competitor + Whitespace | PASS |
| 4 Product Definition | PASS |
| 5 Killer Feature + Retention | PASS |
| 6 Business Model + Economics | PASS (planning) |
| 7 UX / Journey | PASS |
| 8 Technical Architecture | PASS — modular monolith |
| 9 Database + Security Design | PASS |
| 10 MVP Implementation Plan | PASS |
| 11 Code Implementation | ACTIVE — Milestone 1 |
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

## Current Foundation implementation
Applied to NUS Supabase:
- profiles
- organizations
- organization_members
- activity_events
- profile auto-provision trigger
- updated_at triggers
- tenant-aware RLS policies
- atomic `public.create_organization(...)` function using SECURITY INVOKER
- private helper function EXECUTE privileges revoked from public/anon/authenticated

## Verification evidence
- Supabase project status: ACTIVE_HEALTHY
- PostgreSQL: 17.11.0.002
- Foundation tables verified with RLS enabled
- Security advisor after migration: 0 lints
- Performance advisor currently reports unused indexes only because the tables are empty; this is expected pre-usage telemetry, not a correctness defect
- Applied migrations: `20261003133448`, `20261003133636`, `20261003134008`

## GitHub write status
GitHub write access is **RESOLVED**. The authenticated account has `admin` permission on `Generalsea/Nus`, branch `feature/phase-11-foundation` was created, commit `ad8e451b535772e1a995da2f4cbc04d8d31780ad` was published, and PR #1 was opened for the foundation changes.

## Continuity protocol
At the start of every future NUS conversation:
1. Read this file.
2. Inspect current `Generalsea/Nus` state.
3. Inspect the NUS Supabase project only.
4. Determine the last passed gate.
5. Continue from that exact milestone.
6. Do not restart Phase 0–10 without explicit evidence that a gate reopened.

## Engineering loop
INSPECT → PLAN → DESIGN → IMPLEMENT → TEST → VERIFY → DOCUMENT → PROCEED.

---

# 29. LIVE PLATFORM STATUS — 2026-10-03

## GitHub

The canonical repository is `Generalsea/Nus`. The repository is public and its default branch is `main`.

The ChatGPT GitHub integration can now read and write `Generalsea/Nus` through the authorized account. Repository permission is `admin`, and the foundation branch was created successfully.

No credential is guessed, extracted, or bypassed.

## Local source of truth

The verified local implementation branch is:

`feature/phase-11-foundation`

The local repository has a valid `origin` pointing to `https://github.com/Generalsea/Nus.git`.

The local foundation commits are preserved and bundled separately when required.

## Dependency verification

The execution container still cannot reach the npm registry and has no local dependency cache. Dependency-backed verification remains unavailably local, but connected GitHub Actions has now resolved and executed the full dependency-backed CI sequence successfully.

### Latest verification checkpoint — 2026-10-03
- Local syntax parser: `20/20 PASS` across tracked `.ts`, `.tsx`, and `.mjs` implementation/test/migration files.
- JSON parsing: `package.json` + `tsconfig.json` = `2/2 PASS`.
- Redirect security runtime cases: `6/6 PASS`.
- `git diff --check`: PASS.
- GitHub Actions Run #4: **SUCCESS** on commit `ad8e451b535772e1a995da2f4cbc04d8d31780ad`.
- Connected runner: Node.js `22.23.3`, npm `10.9.9`.
- `npm install --no-audit --no-fund`: PASS; `404` packages resolved.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — `3` suites / `11` tests.
- `npm run build`: PASS — Next.js `16.3.8` production build.
- `package-lock.json` remains absent; CI intentionally uses connected `npm install` during bootstrap. Capture a committed lockfile before production-hardening/deployment.

## Foundation gate

Milestone 1 — Foundation is **PASS**. Browser E2E remains a later application-flow verification item and does not reopen the completed Foundation gate. Production readiness remains **NOT PRODUCTION READY** and commercial validation remains **PARTIAL**.
