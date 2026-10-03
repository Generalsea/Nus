import { describe, expect, it } from 'vitest'
import { slugify, slugifyWorkspaceName } from '@/lib/domain/slug'

describe('slugify', () => {
  it('creates a stable lowercase slug', () => expect(slugify('My  Business')).toBe('my-business'))
  it('removes unsupported characters and trims separators', () =>
    expect(slugify('--- Alpha / Beta !!! ---')).toBe('alpha-beta'))
  it('returns an empty string for unsupported-only input', () => expect(slugify('!!!')).toBe(''))
})

describe('slugifyWorkspaceName', () => {
  it('keeps normal latin workspace names readable', () => {
    expect(slugifyWorkspaceName('My Clinic')).toBe('my-clinic')
  })

  it('creates a stable ASCII slug for Arabic-only names', () => {
    const first = slugifyWorkspaceName('عيادتي في القاهرة')
    const second = slugifyWorkspaceName('عيادتي في القاهرة')

    expect(first).toBe(second)
    expect(first).toMatch(/^workspace-[a-z0-9]+$/)
    expect(first).toHaveLength(23)
  })
})
