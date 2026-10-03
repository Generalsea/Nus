import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { chooseWorkspace } from '@/lib/workspace/selection'

export const WORKSPACE_COOKIE_NAME = 'nus_workspace_id'

export async function getWorkspaceContext() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      supabase,
      user: null,
      memberships: [],
      organizations: [],
      current: null,
    }
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id, role, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (membershipError || !memberships?.length) {
    return {
      supabase,
      user,
      memberships: memberships ?? [],
      organizations: [],
      current: null,
    }
  }

  const organizationIds = memberships.map((membership) => membership.organization_id)
  const { data: organizations, error: organizationError } = await supabase
    .from('organizations')
    .select('id, name, timezone')
    .in('id', organizationIds)
    .order('created_at', { ascending: true })

  if (organizationError || !organizations?.length) {
    return {
      supabase,
      user,
      memberships,
      organizations: organizations ?? [],
      current: null,
    }
  }

  const cookieStore = await cookies()
  const selectedOrganizationId = cookieStore.get(WORKSPACE_COOKIE_NAME)?.value ?? null
  const selectedMembership = chooseWorkspace(memberships, selectedOrganizationId)

  if (!selectedMembership) {
    return {
      supabase,
      user,
      memberships,
      organizations,
      current: null,
    }
  }

  const current = organizations.find(
    (organization) => organization.id === selectedMembership.organization_id,
  )

  return {
    supabase,
    user,
    memberships,
    organizations,
    current: current ?? null,
  }
}
