export type WorkspaceMembership = {
  organization_id: string
  created_at: string
}

export function chooseWorkspace(
  memberships: readonly WorkspaceMembership[],
  selectedOrganizationId: string | null | undefined,
) {
  const selected =
    selectedOrganizationId
      ? memberships.find((membership) => membership.organization_id === selectedOrganizationId)
      : undefined

  return selected ?? memberships[0] ?? null
}
