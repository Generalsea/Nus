-- Harden Client Core activity recording and timeline visibility.
--
-- Activity events are internal audit records. Clients should not receive
-- INSERT privileges on activity_events; the client lifecycle trigger therefore
-- runs as a locked-down SECURITY DEFINER function in the private schema.
--
-- Timeline reads are tenant-scoped: any authenticated member of the
-- organization may read the events belonging to that organization.

alter function private.record_client_activity()
  security definer;

alter function private.record_client_activity()
  set search_path = public, pg_catalog;

revoke all on function private.record_client_activity() from public, anon, authenticated;

drop policy if exists activity_events_select_actor on public.activity_events;
drop policy if exists activity_events_select_org_member on public.activity_events;

create policy activity_events_select_org_member
on public.activity_events
for select
to authenticated
using (
  organization_id in (
    select om.organization_id
    from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);
