-- Prevent a workspace owner from deleting its own membership.
--
-- Owners must remain attached to the workspace until a deliberate ownership
-- transfer/lifecycle feature exists. Ordinary members may still leave.

drop policy if exists organization_members_delete_self
  on public.organization_members;

create policy organization_members_delete_member_self
on public.organization_members
for delete
to authenticated
using (
  user_id = (select auth.uid())
  and role = 'member'
);
