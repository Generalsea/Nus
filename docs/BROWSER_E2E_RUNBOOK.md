# NUS — Browser E2E Runbook

## Purpose

This is the real authenticated Client Core gate. It must run against a dedicated test account and a non-production environment.

## Required environment

- `PLAYWRIGHT_BASE_URL` — optional; when omitted, Playwright starts the local Next.js server.
- `NEXT_PUBLIC_SUPABASE_URL` — required by the application runtime.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — required by the application runtime.
- `NUS_E2E_EMAIL` — confirmed Supabase Auth test account.
- `NUS_E2E_PASSWORD` — password for that account.
- `NUS_E2E_WORKSPACE_NAME` — dedicated workspace name; it must start with `E2E `.

The Auth test account must already be confirmed. Do not insert rows directly into `auth.users` and do not use service-role credentials in browser tests.

## Flow covered

Login → Today → Workspace onboarding when needed → Clients → Create client → Retrieve → Edit → Add note → Search.

The test uses unique names so a failed run does not depend on pre-existing client records. Before any client mutation, it verifies that the account is in the explicitly designated `E2E ...` workspace; a different pre-existing workspace causes an immediate failure.

## Gate interpretation

- PASS requires the complete flow to execute against a real Auth session.
- Missing environment variables are an environment failure, not a product pass.
- The repository also contains a manual GitHub Actions workflow at `.github/workflows/e2e.yml` for running this gate with repository secrets.
- The current project cannot claim this gate until an actual run is executed with a real confirmed account.
