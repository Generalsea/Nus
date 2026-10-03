import { z } from 'zod'

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max).optional(),
  )

const optionalEmail = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().email().max(254).optional(),
)

export const clientSchema = z.object({
  full_name: z.string().trim().min(2).max(160),
  phone: optionalText(32).refine((value) => value === undefined || value.length >= 3, 'Invalid phone'),
  email: optionalEmail,
  preferred_contact_method: z.enum(['phone', 'whatsapp', 'email', 'other']).optional(),
  status: z.enum(['active', 'archived']).default('active'),
  lead_source: optionalText(80),
})

export const clientNoteSchema = z.object({
  body: z.string().trim().min(1).max(5000),
})

export type ClientInput = z.infer<typeof clientSchema>
export type ClientNoteInput = z.infer<typeof clientNoteSchema>