# Phase 11 — Milestone 2 — Client Core

## Status

**ACTIVE — technical gate passed; browser authenticated-flow evidence pending.**

## Scope implemented

- client creation
- client editing
- client retrieval
- client search by name/phone/email
- client detail
- notes
- timeline/activity

## Acceptance criteria

A real authenticated user can create and retrieve only authorized client records.

## Security evidence

PASS:
- cross-tenant client reads return no unauthorized records
- cross-tenant client updates cannot mutate a record
- cross-tenant note attachment is rejected
- organization/authorship update keys are not granted to authenticated clients
- DELETE/TRUNCATE table privileges are not granted
- RLS is enabled on both Client Core tables
- Supabase Security Advisor reports 0 lints

A disposable authenticated-context transaction was rolled back after verification. No synthetic users, organizations or clients remain.

## Engineering verification

PASS:
- typecheck
- lint
- unit tests
- production build
- latest GitHub Actions Run #9 = SUCCESS

## Remaining gate

**Browser-level authenticated persistence is NOT VERIFIED.**

NUS currently has zero persisted Auth users and this environment exposes no browser automation connector. Enabling anonymous Auth solely to fabricate a passing E2E test would change the product/security surface and is therefore not being done.

The PR remains open until browser-level authenticated create → retrieve → edit → note → search flow is evidenced.

## Non-scope

- appointments
- reminders
- follow-up engine
- AI actions
- notification providers
- tags/custom fields
- pipeline/opportunity management

## Commercial continuity

Client data preserves lead_source for later acquisition and workflow analysis without speculative CRM scoring. Commercial validation remains PARTIAL and pricing remains a hypothesis until real customer evidence exists.
