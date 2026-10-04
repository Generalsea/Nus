import { describe, expect, it } from 'vitest'
import { clientNoteSchema, clientSchema } from '@/lib/validation/client'

describe('clientSchema', () => {
  it('accepts the minimum client record', () => {
    const result = clientSchema.safeParse({ full_name: 'Ahmed Mohamed' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.status).toBe('active')
  })

  it('rejects malformed email addresses', () => {
    expect(
      clientSchema.safeParse({
        full_name: 'Ahmed Mohamed',
        email: 'not-an-email',
      }).success,
    ).toBe(false)
  })

  it('accepts supported contact methods', () => {
    expect(
      clientSchema.safeParse({
        full_name: 'Ahmed Mohamed',
        preferred_contact_method: 'whatsapp',
      }).success,
    ).toBe(true)
  })

  it('rejects an overlong name', () => {
    expect(clientSchema.safeParse({ full_name: 'x'.repeat(161) }).success).toBe(false)
  })
})

describe('clientNoteSchema', () => {
  it('rejects empty notes', () => {
    expect(clientNoteSchema.safeParse({ body: '   ' }).success).toBe(false)
  })

  it('accepts a normal note', () => {
    expect(clientNoteSchema.safeParse({ body: 'Call after 6 PM.' }).success).toBe(true)
  })
})
