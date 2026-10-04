-- Lock foundation identity columns behind least-privilege grants.
--
-- The RLS owner/member policies already constrain which rows are reachable.
-- Column-level grants additionally prevent authenticated clients from changing
-- row identity/audit columns such as primary keys, ownership and timestamps.

revoke insert, update on table public.profiles from authenticated;
grant insert (
  id,
  display_name,
  timezone,
  locale
) on table public.profiles to authenticated;
grant update (
  display_name,
  timezone,
  locale
) on table public.profiles to authenticated;

revoke insert, update on table public.organizations from authenticated;
grant insert (
  name,
  slug,
  owner_id,
  timezone
) on table public.organizations to authenticated;
grant update (
  name,
  slug,
  timezone
) on table public.organizations to authenticated;
