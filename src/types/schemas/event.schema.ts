import z from 'zod'

export const eventSchema = z.object({
  name: z.string(),
})

export type Event = z.infer<typeof eventSchema>
