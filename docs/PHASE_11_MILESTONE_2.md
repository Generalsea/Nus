# Phase 11 — Milestone 2 — Client Core

## Status
ACTIVE — Client Core implementation and database hardening are passing; authenticated browser persistence and repository governance evidence remain pending.

## Acceptance criteria
A real authenticated user can create and retrieve only authorized client records.

## Passed evidence
- Client creation/edit/retrieval/search/detail/notes/timeline implemented.
- Cross-tenant RLS proof passed and was rolled back.
- Activity event write surface is append-only for end users.
- Foundation and Client Core grants are least-privilege.
- Security Advisor = 0 lints.
- IANA timezone validation is enforced in app and DB.
- GitHub Actions Run #23 = SUCCESS.
- GitHub Actions Run #29 = SUCCESS.
- GitHub Actions Run #34 = SUCCESS after workspace-slug and auth-proxy hardening.
- GitHub Actions Run #41 = SUCCESS with committed lockfile and `npm ci`.
- GitHub Actions Run #49 = SUCCESS after Today/Client error-state hardening and E2E harness addition.
- GitHub Actions Run #51 = SUCCESS on the resulting baseline.
- Existing login screen now includes email/password signup, password confirmation, neutral errors, confirmation messaging, and safe callback return path.
- Workspace context is centralized and selected workspace IDs are server-validated against the signed-in user's memberships.
- Foundation identity/timestamp update grants are locked down at the database boundary.
- GitHub Actions Run #72 = SUCCESS after the latest Client Core hardening.
- GitHub Actions Run #87 = SUCCESS after making authenticated E2E fail closed on non-E2E workspaces.

## Release hardening notes
- Arabic-only workspace names now produce a valid deterministic ASCII slug instead of failing workspace creation.
- Auth redirect responses are marked `private, no-store` and `/auth` public matching is exact.
- `main` is not currently verified as protected in GitHub; do not merge based on repository governance assumptions.
- `package-lock.json` is committed; current CI uses `npm ci` and a high-severity `npm audit` gate.
- Signout clears the server workspace-context cookie so a subsequent account cannot inherit stale browser context.

## E2E readiness
- Playwright authenticated Client Core flow is implemented.
- Manual GitHub Actions workflow `.github/workflows/e2e.yml` is ready and requires a confirmed non-production Auth test account.

## Remaining gate
Browser-level authenticated persistence is NOT VERIFIED.

Required real flow:
Login/Signup → Workspace → Create Client → Retrieve → Edit → Add Note → Search.

NUS currently has zero Auth users and no browser automation connector is available in this execution environment. Email signup testing also depends on the actual callback URL being allowed by Supabase Auth Redirect URLs.

Do not advance to Appointment Core or merge PR #2 until this final authenticated browser proof exists.