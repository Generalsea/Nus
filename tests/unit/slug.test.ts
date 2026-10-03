import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/domain/slug'

describe('slugify', () => {
  it('creates a stable lowercase slug', () => expect(slugify('My  Business')).toBe('my-business'))
  it('removes unsupported characters and trims separators', () => expect(slugify('--- Alpha / Beta !!! ---')).toBe('alpha-beta'))
  it('returns an empty string for unsupported-only input', () => expect(slugify('!!!')).toBe(''))
})
