import z from 'zod'

export const resourceSchema = z.object({
  event: z.string(),
  link: z.string().url(),
  dark: z.union([z.instanceof(File), z.string()]).nullable(),
  light: z.union([z.instanceof(File), z.string()]).nullable(),
})

export type Resource = z.infer<typeof resourceSchema>
