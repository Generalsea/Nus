import { describe, expect, it } from 'vitest'
import { privateRedirect } from '@/lib/security/response'

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
