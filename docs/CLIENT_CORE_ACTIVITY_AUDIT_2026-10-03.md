# NUS Client Core — Activity Audit Hardening

Date: 2026-10-03

## Finding

The live database initially exposed the older actor-only SELECT policy on `activity_events`, even though Client Core requires tenant-level timeline visibility for organization members.

A second integrity issue was also identified: `authenticated` had effective INSERT capability on `activity_events` through existing table/column grants and an INSERT RLS policy. That would allow a signed-in client to manufacture audit events.

The wider foundation tables also retained broad default table privileges for `anon` and `authenticated`. RLS prevented unauthorized rows, but the privilege surface was broader than necessary.

## Fixes

Three hardening migrations were applied to the dedicated NUS Supabase project:

- `20261003144346_client_activity_security_hardening`
- `20261003144558_activity_events_write_lockdown`
- `20261003145121_foundation_grants_lockdown`

They:

1. Convert the private trigger function `private.record_client_activity()` to SECURITY DEFINER.
2. Keep its fixed `search_path = public, pg_catalog`.
3. Revoke EXECUTE from `public`, `anon`, and `authenticated`.
4. Replace the actor-only SELECT policy with organization-membership scoped SELECT.
5. Remove the `activity_events_insert_actor_member` policy.
6. Revoke all table privileges on `activity_events` from `anon` and `authenticated`, then grant SELECT only to `authenticated`.
7. Revoke broad default grants from foundation tables.
8. Restore only the required authenticated grants:
   - profiles: SELECT/INSERT/UPDATE
   - organizations: SELECT/INSERT/UPDATE
   - organization_members: SELECT/INSERT/DELETE

The result is an append-only audit surface for end users and a least-privilege foundation table surface.

## Verification

Live database evidence after all hardening:

- Security Advisor: 0 lints.
- Only `activity_events_select_org_member` remains for `authenticated`.
- `private.record_client_activity()` reports `SECURITY DEFINER`.
- `authenticated` can SELECT activity events.
- `authenticated` cannot INSERT, UPDATE, or DELETE activity events.
- `authenticated` cannot EXECUTE the internal trigger function directly.
- `anon` has no table privileges on the foundation or Client Core tables.
- Foundation authenticated grants are limited to the operations listed above.
- Migration history contains all three hardening migrations.
- Live data remains empty: organizations=0, clients=0, client_notes=0, activity_events=0.

The prior disposable RLS proof remains rolled back after execution.

## Remaining gate

This hardening closes the database-side activity/grant integrity gaps, but it does not replace browser-level authentication evidence.

The application-level proof still requires a real Supabase Auth user and a real browser/session executing:

Login → Workspace → Create Client → Retrieve → Edit → Add Note → Search.

NUS currently has zero persisted Auth users and no browser automation connector is available in the current execution environment. Therefore this remaining proof is intentionally not claimed.
