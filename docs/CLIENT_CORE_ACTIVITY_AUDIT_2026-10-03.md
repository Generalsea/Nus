# NUS Client Core — Activity Audit Hardening

Date: 2026-10-03

## Finding

The Client Core migration intended to make `activity_events` visible to organization members, but the live database still exposed the older actor-only SELECT policy.

At the same time, client and client-note lifecycle triggers write to `activity_events` while the authenticated role has no direct INSERT privilege on that table.

The combination was an integrity risk for the audit/timeline path: the browser flow could not be considered complete until the database-side writer and reader semantics were aligned.

## Fix

Migration `20261003144346_client_activity_security_hardening` was applied to the dedicated NUS Supabase project.

It:

1. Converts the private trigger function `private.record_client_activity()` to SECURITY DEFINER.
2. Keeps its fixed `search_path = public, pg_catalog`.
3. Revokes EXECUTE from `public`, `anon`, and `authenticated`.
4. Replaces the actor-only activity-event SELECT policy with organization-membership scoped SELECT.
5. Leaves authenticated users without direct INSERT privileges on `activity_events`.

## Verification

Live database evidence after the migration:

- Security Advisor: 0 lints.
- `activity_events_select_org_member` exists for `authenticated`.
- `private.record_client_activity()` reports `SECURITY DEFINER`.
- `authenticated` has no direct INSERT privilege on `activity_events`.
- Migration history contains `20261003144346 client_activity_security_hardening`.

The existing disposable RLS proof remains valid and is still rolled back after execution.

## Remaining gate

This hardening closes the database-side activity integrity gap, but it does not replace browser-level authentication evidence.

The application-level proof still requires a real Supabase Auth user and a real browser/session executing:

Login/Signup → Workspace → Create Client → Retrieve → Edit → Add Note → Search.

NUS currently has zero persisted Auth users and no browser automation connector is available in the current execution environment. Therefore this remaining proof is intentionally not claimed.
