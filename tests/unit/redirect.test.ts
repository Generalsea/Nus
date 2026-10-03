import { describe, expect, it } from 'vitest'
import { safeInternalPath } from '@/lib/security/redirect'

describe('safeInternalPath', () => {
  it('accepts an internal route', () => {
    expect(safeInternalPath('/today?tab=work')).toBe('/today?tab=work')
  })

  it('accepts an internal route with a hash', () => {
    expect(safeInternalPath('/today#focus')).toBe('/today#focus')
  })

  it('rejects protocol-relative open redirects', () => {
    expect(safeInternalPath('//evil.example')).toBe('/today')
  })

  it('rejects absolute external URLs', () => {
    expect(safeInternalPath('https://evil.example')).toBe('/today')
  })

  it('rejects backslash-based redirect attempts', () => {
    expect(safeInternalPath('/\\evil.example')).toBe('/today')
  })

  it('rejects non-path values', () => {
    expect(safeInternalPath('today')).toBe('/today')
  })
})
