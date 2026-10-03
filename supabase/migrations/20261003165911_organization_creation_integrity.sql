-- Close the workspace-creation RLS recursion and enforce the owner-membership invariant.
--
-- The private helper is SECURITY DEFINER because the organizations SELECT policy
-- itself depends on organization_members; using the helper avoids recursive RLS.
-- It is not exposed through the Data API and is callable only by authenticated
-- requests through policy evaluation.

create or replace function private.is_organization_owner(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.organizations o
      where o.id = p_organization_id
        and o.owner_id = (select auth.uid())
    );
$$;

revoke all on function private.is_organization_owner(uuid) from public, anon, authenticated;
grant execute on function private.is_organization_owner(uuid) to authenticated;

drop policy if exists organization_members_insert_owner_self
  on public.organization_members;

create policy organization_members_insert_owner_self
on public.organization_members
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and (select private.is_organization_owner(organization_id))
);

create or replace function private.ensure_organization_owner_membership()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  v_user_id uuid;
begin
  v_user_id := (select auth.uid());

  if v_user_id is not null and new.owner_id = v_user_id then
    insert into public.organization_members (organization_id, user_id, role)
    values (new.id, v_user_id, 'owner')
    on conflict (organization_id, user_id) do nothing;
  end if;

  return new;
end;
$$;

revoke all on function private.ensure_organization_owner_membership() from public, anon, authenticated;

drop trigger if exists organizations_owner_membership
  on public.organizations;

create trigger organizations_owner_membership
after insert on public.organizations
for each row
execute function private.ensure_organization_owner_membership();

create or replace function public.create_organization(
  p_name text,
  p_slug text,
  p_timezone text default 'Africa/Cairo'
)
returns public.organizations
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  created_org public.organizations;
  v_user_id uuid;
  v_slug text;
begin
  v_user_id := (select auth.uid());

  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if length(trim(p_name)) < 2 or length(trim(p_name)) > 120 then
    raise exception 'invalid_organization_name';
  end if;

  v_slug := lower(trim(p_slug));
  if v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'invalid_organization_slug';
  end if;

  if length(p_timezone) < 1 or length(p_timezone) > 64 then
    raise exception 'invalid_timezone';
  end if;

  insert into public.organizations (name, slug, owner_id, timezone)
  values (trim(p_name), v_slug, v_user_id, p_timezone);

  insert into public.organization_members (organization_id, user_id, role)
  select o.id, v_user_id, 'owner'
  from public.organizations o
  where o.slug = v_slug
    and o.owner_id = v_user_id
  on conflict (organization_id, user_id) do nothing;

  select o.*
    into created_org
  from public.organizations o
  where o.slug = v_slug
    and o.owner_id = v_user_id;

  if not found then
    raise exception 'organization_creation_failed';
  end if;

  return created_org;
end;
$$;

revoke all on function public.create_organization(text, text, text) from public, anon;
grant execute on function public.create_organization(text, text, text) to authenticated;
