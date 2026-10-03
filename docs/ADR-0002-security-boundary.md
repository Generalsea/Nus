# ADR-0002 — Hard Project Isolation and Tenant Security

Status: Accepted
Date: 2026-10-03

## Hard boundary

NUS GitHub repository: `Generalsea/Nus`
NUS Supabase project ref: `oghiyggxhxoxdysustkv`

The old DEBA project is unrelated and must never be used by NUS.

## Security rules

1. Every business table is RLS-protected.
2. Authorization is enforced in the database/application layer, not by UI hiding.
3. Frontend code receives only publishable Supabase credentials.
4. No service-role key is stored in `NEXT_PUBLIC_*` variables.
5. Authenticated pages are dynamic and not ISR-cached.
6. AI business actions require validation and user confirmation.
7. Audit data is tenant-scoped.
