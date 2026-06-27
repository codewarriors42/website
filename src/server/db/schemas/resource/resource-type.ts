import z from 'zod'

export const resourceSchema = z.object({
  event: z.string(),
  link: z.string().url(),
  dark: z.string(),
  light: z.string(),
})

export type ResourceType = z.infer<typeof resourceSchema>
export type ResourceTypeWithId = ResourceType & { id: string }
