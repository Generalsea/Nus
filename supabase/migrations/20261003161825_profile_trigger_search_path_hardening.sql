alter function private.handle_new_user_profile()
  set search_path = pg_catalog, public;

revoke all on function private.handle_new_user_profile() from public, anon, authenticated;
