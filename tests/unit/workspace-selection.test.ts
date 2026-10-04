import { describe, expect, it } from 'vitest'
import { chooseWorkspace, type WorkspaceMembership } from '@/lib/workspace/selection'

const memberships: WorkspaceMembership[] = [
  { organization_id: 'org-a', created_at: '2026-01-01T00:00:00.000Z' },
  { organization_id: 'org-b', created_at: '2026-01-02T00:00:00.000Z' },
]

describe('chooseWorkspace', () => {
  it('uses a selected membership when it belongs to the user', () => {
    expect(chooseWorkspace(memberships, 'org-b')?.organization_id).toBe('org-b')
  })

  it('falls back to the oldest membership when the cookie is stale or unknown', () => {
    expect(chooseWorkspace(memberships, 'org-missing')?.organization_id).toBe('org-a')
    expect(chooseWorkspace(memberships, null)?.organization_id).toBe('org-a')
  })

  it('returns null when the user has no memberships', () => {
    expect(chooseWorkspace([], 'org-a')).toBeNull()
  })
})
