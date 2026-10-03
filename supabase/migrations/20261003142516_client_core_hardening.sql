revoke all on table public.clients from anon, authenticated;
revoke all on table public.client_notes from anon, authenticated;

grant select on public.clients to authenticated;
grant insert (
  organization_id,
  created_by_user_id,
  full_name,
  phone,
  email,
  preferred_contact_method,
  status,
  lead_source
) on public.clients to authenticated;
grant update (
  full_name,
  phone,
  email,
  preferred_contact_method,
  status,
  lead_source,
  archived_at
) on public.clients to authenticated;

grant select on public.client_notes to authenticated;
grant insert (
  organization_id,
  client_id,
  author_user_id,
  body
) on public.client_notes to authenticated;
grant update (body) on public.client_notes to authenticated;

create index clients_created_by_user_id_idx on public.clients (created_by_user_id);
create index client_notes_author_user_id_idx on public.client_notes (author_user_id);

drop policy if exists activity_events_select_actor on public.activity_events;
create policy activity_events_select_org_member on public.activity_events
for select to authenticated
using (
  organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);