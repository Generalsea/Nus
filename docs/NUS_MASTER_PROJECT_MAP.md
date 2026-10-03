# NUS — MASTER PROJECT MAP & CONTINUITY CONTRACT

## Current authoritative state — 2026-10-03

### Identity
- Product: NUS
- GitHub: `Generalsea/Nus`
- GitHub URL: https://github.com/Generalsea/Nus
- Supabase project: `NUS`
- Supabase ref: `oghiyggxhxoxdysustkv`
- Supabase region: `eu-central-1`
- Supabase URL: `https://oghiyggxhxoxdysustkv.supabase.co`
- Default branch: `main`
- Active phase: Phase 11 — Code Implementation
- Active milestone: Milestone 2 — Client Core
- Previous gate: Milestone 1 — Foundation = PASS
- Production status: NOT PRODUCTION READY
- Commercial validation: PARTIAL

## Hard isolation
NUS is independent from DEBA and every other project.

Never use or copy:
- DEBA source tree, branches, migrations, environment files or credentials
- DEBA Supabase project `gkwpjtbrecoesxyoybto`
- DEBA runtime or deployment state

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

## Phase state
| Phase | Status |
|---|---|
| 0 Project Framing | PASS |
| 1 Market + Micro-Niche Research | PASS |
| 2 Customer Problem Validation | PARTIAL — direct 10–15 customer validation remains open |
| 3 Competitor + Whitespace | PASS |
| 4 Product Definition | PASS |
| 5 Killer Feature + Retention | PASS |
| 6 Business Model + Economics | PASS (planning; pricing remains hypothesis) |
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
MUST HAVE:
- authentication
- workspace
- clients
- appointments
- Today
- follow-up
- reminders
- notification abstraction
- notes/history
- activity/audit
- validation/errors
- analytics foundation

DO NOT BUILD YET:
- microservices
- native mobile apps
- full CRM/ERP
- autonomous AI agent
- huge workflow builder
- large integration marketplace
- complex enterprise RBAC
- social features
- advanced BI
- unnecessary customization

## Milestone roadmap
1. Foundation — PASS
2. Client Core — ACTIVE
3. Appointment Core — PENDING
4. Today Engine — PENDING
5. Follow-up + Automation — PENDING
6. Notification Provider — PENDING
7. AI Action Layer — PENDING

## Client Core decision
Clients are tenant-owned operational records, not a full CRM contact object.

Stored fields:
- organization_id
- created_by_user_id
- full_name
- phone
- email
- preferred_contact_method
- status (active / archived)
- lead_source
- timestamps

Notes are separate `client_notes` records.
Client activity is recorded transactionally into `activity_events`.

No tags, scoring, pipeline stages, custom fields or opportunity objects are introduced in Client Core.

## Current NUS Supabase schema
Foundation:
- public.profiles
- public.organizations
- public.organization_members
- public.activity_events

Client Core:
- public.clients
- public.client_notes

Applied migrations:
- `20261003133448_foundation_core`
- `20261003133636_foundation_workspace_atomic`
- `20261003134008_foundation_function_hardening`
- `20261003142451_client_core`
- `20261003142516_client_core_hardening`

Current Security Advisor: 0 lints.

Current Performance Advisor: INFO-only unused indexes on low/zero-volume tables; no missing foreign-key index findings remain after Client Core hardening.

## Foundation verification evidence
GitHub Actions Run #4:
- npm install: PASS
- typecheck: PASS
- lint: PASS
- unit tests: PASS — 3 suites / 11 tests
- production build: PASS — Next.js 16.3.8

The Foundation PR #1 was merged to `main`.

## Client Core gate
Client Core remains OPEN until:
- real authenticated persistence is verified
- cross-tenant access denial is evidenced
- create/edit/retrieve/search/detail/notes/timeline flows are verified
- CI typecheck/lint/tests/build pass on the Client Core branch
- no mock production state is introduced

## Commercial continuity
Commercial validation remains PARTIAL.
Pricing and unit-economics numbers remain planning hypotheses until real customer evidence is collected.
Technical completion is not product-market validation.

## Strategic continuity
The exact canonical micro-niche wording from the prior strategic research must not be invented. It is a documentation-recovery item, not permission to restart discovery.

## Definition of Done
Every feature requires:
UI + backend behavior + validation + authorization + DB integrity + loading/empty/error/failure states + audit/event behavior + relevant tests + static checks + build + real flow verification + regression.

## Continuity protocol
At the start of every future NUS conversation:
1. Read this file.
2. Inspect current `Generalsea/Nus` state.
3. Inspect NUS Supabase only.
4. Determine the last passed gate.
5. Continue from that exact milestone.
6. Never restart Phase 0–10 without explicit evidence that a gate reopened.

## Operating command
`أغابي` = continue from the next unpassed NUS milestone using repository and Supabase evidence.
