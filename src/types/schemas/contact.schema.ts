import z from 'zod'

export const contactSchema = z.object({
  post: z.string().min(1, 'Post is required'),
  mail: z.string().email('Invalid email address').min(1, 'Email is required'),
})

export type ContactSchema = z.infer<typeof contactSchema>
