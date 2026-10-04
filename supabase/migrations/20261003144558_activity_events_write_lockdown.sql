-- Lock activity_events to append-only internal recording.
--
-- End users may read their organization's audit timeline, but they must not
-- be able to manufacture or mutate audit records through the Data API.
-- Lifecycle events are written only by the private SECURITY DEFINER trigger.

drop policy if exists activity_events_insert_actor_member on public.activity_events;

revoke all on table public.activity_events from anon, authenticated;
grant select on table public.activity_events to authenticated;
