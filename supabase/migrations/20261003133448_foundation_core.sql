create schema if not exists private;
create or replace function private.set_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Africa/Cairo',
  locale text not null default 'ar-EG',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_locale_chk check (locale in ('ar-EG','en-US'))
);
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete restrict,
  timezone text not null default 'Africa/Cairo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_chk check (length(trim(name)) between 2 and 120),
  constraint organizations_slug_chk check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);
create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id),
  constraint organization_members_role_chk check (role in ('owner','member'))
);
create index organization_members_user_id_idx on public.organization_members (user_id);
create index organizations_owner_id_idx on public.organizations (owner_id);
create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  event_name text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint activity_events_event_name_chk check (event_name ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$')
);
create index activity_events_org_created_idx on public.activity_events (organization_id, created_at desc);
create index activity_events_actor_created_idx on public.activity_events (actor_user_id, created_at desc);
create index activity_events_entity_idx on public.activity_events (entity_type, entity_id) where entity_type is not null and entity_id is not null;
create or replace function private.handle_new_user_profile() returns trigger language plpgsql security definer set search_path = public, private as $$ begin insert into public.profiles (id) values (new.id) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user_profile();
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at before update on public.organizations for each row execute function private.set_updated_at();
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.activity_events enable row level security;
create policy profiles_select_self on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_insert_self on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update_self on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy organizations_select_member on public.organizations for select to authenticated using (exists (select 1 from public.organization_members om where om.organization_id = organizations.id and om.user_id = (select auth.uid())));
create policy organizations_insert_owner on public.organizations for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy organizations_update_owner on public.organizations for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy organization_members_select_self on public.organization_members for select to authenticated using ((select auth.uid()) = user_id);
create policy organization_members_insert_owner_self on public.organization_members for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.organizations o where o.id = organization_members.organization_id and o.owner_id = (select auth.uid())));
create policy organization_members_delete_self on public.organization_members for delete to authenticated using ((select auth.uid()) = user_id);
create policy activity_events_select_actor on public.activity_events for select to authenticated using ((select auth.uid()) = actor_user_id);
create policy activity_events_insert_actor_member on public.activity_events for insert to authenticated with check (actor_user_id = (select auth.uid()) and exists (select 1 from public.organization_members om where om.organization_id = activity_events.organization_id and om.user_id = (select auth.uid())));
revoke all on schema private from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.organizations to authenticated;
grant select, insert, delete on public.organization_members to authenticated;
grant select, insert on public.activity_events to authenticated;
