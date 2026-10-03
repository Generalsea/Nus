import { createClient } from '@/lib/supabase/server'

export async function recordActivityEvent(input: {
  organizationId: string
  eventName: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { ok: false as const, reason: 'unauthenticated' as const }
  }

  const { error } = await supabase.from('activity_events').insert({
    organization_id: input.organizationId,
    actor_user_id: user.id,
    event_name: input.eventName,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {},
  })

  if (error) {
    return { ok: false as const, reason: 'write_failed' as const, error }
  }

  return { ok: true as const }
}
