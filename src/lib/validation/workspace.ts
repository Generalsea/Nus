import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  timezone: z.string().trim().min(1).max(64).default('Africa/Cairo'),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
