-- Enforce valid IANA time zones at the database boundary.
--
-- This keeps workspace scheduling/display deterministic even when a caller
-- bypasses the application-level Zod validation.

create function private.is_valid_timezone(p_timezone text)
returns boolean
language sql
stable
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from pg_timezone_names
    where name = p_timezone
  );
$$;

revoke all on function private.is_valid_timezone(text) from public, anon, authenticated;

alter table public.organizations
  add constraint organizations_timezone_chk
  check (private.is_valid_timezone(timezone));
