import { describe, expect, it } from 'vitest'
import { privateRedirect } from '@/lib/security/response'
import { safeInternalPath } from '@/lib/security/redirect'

describe('privateRedirect', () => {
  it('marks auth redirects as private and non-cacheable', () => {
    const response = privateRedirect(new URL('https://nus.invalid/login?error=auth_callback'))

    expect(response.status).toBe(307)
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(response.headers.get('location')).toBe('https://nus.invalid/login?error=auth_callback')
  })

  it('preserves the explicit redirect status', () => {
    const response = privateRedirect(new URL('https://nus.invalid/login'), 303)

    expect(response.status).toBe(303)
    expect(response.headers.get('cache-control')).toBe('private, no-store')
  })
})


describe('safeInternalPath encoded separators', () => {
  it('rejects encoded backslashes that could be normalized as path separators', () => {
    expect(safeInternalPath('/%5C%5Cevil.example')).toBe('/today')
  })

  it('rejects encoded double-slash paths', () => {
    expect(safeInternalPath('/%2F%2Fevil.example')).toBe('/today')
  })

  it('rejects encoded control characters', () => {
    expect(safeInternalPath('/ok%0D%0AInjected')).toBe('/today')
  })
})
