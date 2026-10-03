# NUS Client Core — Security Proof

Date: 2026-10-03

## Database-level authenticated-context test

A disposable PostgreSQL transaction was executed against the dedicated NUS Supabase project `oghiyggxhxoxdysustkv`.

The test created two synthetic authenticated identities and two isolated organizations, configured the request JWT claims for user A, and exercised the actual RLS policies on `public.clients` and `public.client_notes`.

The transaction ended with `ROLLBACK`, so the synthetic identities and rows were not retained.

## Observed proof

```json
{
  "effective_user": "11111111-1111-4111-8111-111111111111",
  "own_visible": 1,
  "cross_visible": 0,
  "cross_insert_visible": 0,
  "cross_update_visible": 0,
  "cross_note_visible": 0
}
```

Interpretation:
- the authenticated user can see the client record in its own organization
- a client in another organization is invisible
- a cross-tenant client insert is rejected
- a cross-tenant update cannot affect or expose the other tenant's row
- a cross-tenant note cannot be attached to the other tenant's client

This is database/RLS proof, not browser-level proof of the production login UI.

## Grants proof

Column privileges confirm:
- clients: full_name insert/update = true
- clients: organization_id update = false
- clients: created_by_user_id update = false
- client_notes: body insert/update = true
- client_notes: organization_id update = false
- client_notes: author_user_id update = false

Table-level DELETE/TRUNCATE privileges for `authenticated` are false on both Client Core tables.

## Foundation identity grant proof

A live privilege check after the latest migration confirmed that authenticated users cannot UPDATE `profiles.id`, `profiles.updated_at`, `organizations.id`, `organizations.owner_id`, or `organizations.created_at`, while intended mutable fields remain writable. Authenticated INSERT on organizations does not include the generated primary key.

Observed results:

```text
profiles_id_update=false
profiles_updated_at_update=false
org_id_update=false
org_owner_update=false
org_created_at_update=false
org_name_update=true
org_name_insert=true
org_id_insert=false
```

This closes an identity-column mutation path at the database grant layer rather than relying only on application types.

## Current gate interpretation

CI Run #87 also passes the latest E2E-harness hardening. Supabase Security Advisor remains at 0 lints, and the live database remains empty. Supabase Security Advisor remains at 0 lints, and the live database remains empty.

The remaining application-level evidence is a real login/signup browser flow against the NUS Auth service. NUS currently contains zero persisted auth users, and no browser automation connector is exposed in this environment; therefore that evidence is intentionally not claimed.
