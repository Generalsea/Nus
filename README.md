# NUS

NUS is a focused Vertical Micro-SaaS / Digital Assistant built around a professional's daily operating workflow.

## Source of truth

Read [docs/NUS_MASTER_PROJECT_MAP.md](docs/NUS_MASTER_PROJECT_MAP.md) before continuing work.

## Infrastructure boundary

- GitHub: `Generalsea/Nus`
- Supabase: `NUS` / `oghiyggxhxoxdysustkv`
- Old DEBA Supabase: forbidden for NUS

## Current state

Phase 11 — Code Implementation, Milestone 2 — Client Core.

Technical, security, audit, timezone, dependency reproducibility, and CI gates are passing.

Remaining release gates:
- real authenticated browser persistence evidence
- verified protection of `main`
- Supabase Auth callback configuration for the real E2E environment

Commercial validation remains partial. Production readiness has not been declared.
