import { describe, expect, it } from 'vitest'
import { archiveTimestamp, normalizeClientSearch } from '@/lib/domain/client'

describe('client domain helpers', () => {
  it('sanitizes search syntax characters', () => {
    expect(normalizeClientSearch('  Ahmed,(test)%_  ')).toBe('Ahmed test')
  })

  it('bounds search length', () => {
    expect(normalizeClientSearch('x'.repeat(200))).toHaveLength(80)
  })

  it('sets archive timestamps only for archived clients', () => {
    expect(archiveTimestamp('active', '2026-10-03T00:00:00.000Z')).toBeNull()
    expect(archiveTimestamp('archived', '2026-10-03T00:00:00.000Z')).toBe('2026-10-03T00:00:00.000Z')
  })
})
