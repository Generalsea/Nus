create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by_user_id uuid not null references auth.users(id) on delete restrict,
  full_name text not null,
  phone text,
  email text,
  preferred_contact_method text,
  status text not null default 'active',
  lead_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint clients_full_name_chk check (length(trim(full_name)) between 2 and 160),
  constraint clients_phone_chk check (phone is null or length(trim(phone)) between 3 and 32),
  constraint clients_email_chk check (email is null or length(trim(email)) <= 254),
  constraint clients_preferred_contact_method_chk check (
    preferred_contact_method is null
    or preferred_contact_method in ('phone','whatsapp','email','other')
  ),
  constraint clients_status_chk check (status in ('active','archived')),
  constraint clients_lead_source_chk check (lead_source is null or length(trim(lead_source)) between 1 and 80),
  constraint clients_archive_consistency_chk check (
    (status = 'archived' and archived_at is not null)
    or (status = 'active' and archived_at is null)
  )
);

create index clients_org_status_updated_idx on public.clients (organization_id, status, updated_at desc);
create index clients_org_name_idx on public.clients (organization_id, lower(full_name));
create index clients_org_phone_idx on public.clients (organization_id, phone);
create index clients_org_email_idx on public.clients (organization_id, lower(email));

create table public.client_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_notes_body_chk check (length(trim(body)) between 1 and 5000)
);

create index client_notes_client_created_idx on public.client_notes (client_id, created_at desc);
create index client_notes_org_created_idx on public.client_notes (organization_id, created_at desc);

alter table public.clients enable row level security;
alter table public.client_notes enable row level security;

create policy clients_select_org_member on public.clients
for select to authenticated
using (
  organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);

create policy clients_insert_org_member on public.clients
for insert to authenticated
with check (
  created_by_user_id = (select auth.uid())
  and organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);

create policy clients_update_org_member on public.clients
for update to authenticated
using (
  organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
)
with check (
  organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);

create policy client_notes_select_org_member on public.client_notes
for select to authenticated
using (
  organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);

create policy client_notes_insert_org_member on public.client_notes
for insert to authenticated
with check (
  author_user_id = (select auth.uid())
  and organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
  and exists (
    select 1 from public.clients c
    where c.id = client_notes.client_id
      and c.organization_id = client_notes.organization_id
  )
);

create policy client_notes_update_author on public.client_notes
for update to authenticated
using (
  author_user_id = (select auth.uid())
  and organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
)
with check (
  author_user_id = (select auth.uid())
  and organization_id in (
    select om.organization_id from public.organization_members om
    where om.user_id = (select auth.uid())
  )
);

create or replace function private.record_client_activity()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  v_event_name text;
  v_entity_type text;
  v_entity_id uuid;
  v_org_id uuid;
begin
  if tg_table_name = 'clients' then
    v_entity_type := 'client';
    v_entity_id := new.id;
    v_org_id := new.organization_id;
    v_event_name := case tg_op
      when 'INSERT' then 'client_created'
      when 'UPDATE' then 'client_updated'
      else 'client_activity'
    end;
  elsif tg_table_name = 'client_notes' then
    v_entity_type := 'client_note';
    v_entity_id := new.id;
    v_org_id := new.organization_id;
    v_event_name := case tg_op
      when 'INSERT' then 'client_note_added'
      when 'UPDATE' then 'client_note_updated'
      else 'client_note_activity'
    end;
  end if;

  if (select auth.uid()) is not null then
    insert into public.activity_events (
      organization_id, actor_user_id, event_name, entity_type, entity_id, metadata
    )
    values (
      v_org_id, (select auth.uid()), v_event_name, v_entity_type, v_entity_id, '{}'::jsonb
    );
  end if;
  return new;
end;
$$;

create trigger clients_set_updated_at before update on public.clients
for each row execute function private.set_updated_at();

create trigger client_notes_set_updated_at before update on public.client_notes
for each row execute function private.set_updated_at();

create trigger clients_activity after insert or update on public.clients
for each row execute function private.record_client_activity();

create trigger client_notes_activity after insert or update on public.client_notes
for each row execute function private.record_client_activity();

revoke all on function private.record_client_activity() from public, anon, authenticated;