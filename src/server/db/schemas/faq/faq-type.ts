import z from 'zod'

export const faqTypeSchema = z.object({
  question: z.string().min(1, { message: 'Question is required' }),
  answer: z.string().min(1, { message: 'Answer is required' }),
})

export type FaqType = z.infer<typeof faqTypeSchema>
