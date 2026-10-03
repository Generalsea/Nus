# Phase 11 — Milestone 2 — Client Core

## Status
ACTIVE — technical, security, timezone and Auth UI gates passed; browser authenticated-flow evidence pending.

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
- Existing login screen now includes email/password signup, password confirmation, neutral errors, confirmation messaging, and safe callback return path.

## Release hardening notes
- Arabic-only workspace names now produce a valid deterministic ASCII slug instead of failing workspace creation.
- Auth redirect responses are marked `private, no-store` and `/auth` public matching is exact.
- `main` is not currently verified as protected in GitHub; do not merge based on repository governance assumptions.
- `package-lock.json` is absent and remains a pre-production reproducibility gate.

## Remaining gate
Browser-level authenticated persistence is NOT VERIFIED.

Required real flow:
Login/Signup → Workspace → Create Client → Retrieve → Edit → Add Note → Search.

NUS currently has zero Auth users and no browser automation connector is available in this execution environment. Email signup testing also depends on the actual callback URL being allowed by Supabase Auth Redirect URLs.

Do not advance to Appointment Core or merge PR #2 until this final authenticated browser proof exists.