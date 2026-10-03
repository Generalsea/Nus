-- Apply least-privilege table grants to the NUS foundation tables.
--
-- RLS remains the authorization boundary; these grants reduce the reachable
-- surface before policy evaluation and prevent accidental broad writes.

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.organization_members from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.organizations to authenticated;
grant select, insert, delete on table public.organization_members to authenticated;

revoke delete, truncate on table public.profiles from authenticated;
revoke delete, truncate on table public.organizations from authenticated;
revoke truncate on table public.organization_members from authenticated;
