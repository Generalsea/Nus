-- Prevent future public-schema objects from inheriting broad client grants.
--
-- New application tables/functions/sequences must opt in to the exact
-- permissions they require. This preserves least privilege as the product grows.

alter default privileges in schema public
  revoke all on tables from anon, authenticated;

alter default privileges in schema public
  revoke all on functions from anon, authenticated;

alter default privileges in schema public
  revoke all on sequences from anon, authenticated;
