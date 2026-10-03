import { describe, expect, it } from 'vitest'
import { createWorkspaceSchema } from '@/lib/validation/workspace'

describe('createWorkspaceSchema', () => {
  it('accepts a valid workspace payload', () => {
    const result = createWorkspaceSchema.safeParse({ name: 'Clinic One', slug: 'clinic-one', timezone: 'Africa/Cairo' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid slugs', () => {
    const result = createWorkspaceSchema.safeParse({ name: 'Clinic One', slug: 'Clinic One', timezone: 'Africa/Cairo' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid IANA time zones', () => {
    const result = createWorkspaceSchema.safeParse({ name: 'Clinic One', slug: 'clinic-one', timezone: 'Not/AZone' })
    expect(result.success).toBe(false)
  })
})
