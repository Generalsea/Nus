# Phase 11 — Milestone 2 — Client Core

## Status

ACTIVE

## Scope

- client creation
- client editing
- client retrieval
- client search
- client detail
- notes
- timeline

## Acceptance criteria

A real authenticated user can create and retrieve only authorized client records.

## Required security proof

1. Cross-tenant client reads return no unauthorized records.
2. Cross-tenant client updates cannot mutate a record.
3. Client notes cannot be attached across tenant boundaries.
4. Organization and authorship keys are not writable through normal client grants.

## Required verification

- typecheck
- lint
- unit tests
- production build
- real persistence flow
- authorization proof
- no mock production state

## Non-scope

- appointments
- reminders
- follow-up engine
- AI actions
- notification providers
- tags/custom fields
- pipeline/opportunity management

## Commercial continuity

Client data is intentionally shaped to preserve later acquisition-source and workflow conversion evidence without adding speculative CRM scoring.
