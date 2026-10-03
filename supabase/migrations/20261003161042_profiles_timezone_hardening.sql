-- Enforce valid IANA time zones for user profiles too.
--
-- Profile timezone is currently not the scheduling source of truth, but keeping
-- it valid prevents future features from inheriting malformed time-zone state.

alter table public.profiles
  add constraint profiles_timezone_chk
  check (private.is_valid_timezone(timezone));
