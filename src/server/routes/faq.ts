import { protectedProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { FAQModel } from '../db/schemas/faq'
import { faqSchema } from '#/types/schemas/faq.schema'
import z from 'zod'

export const FAQRouter = {
  getAll: protectedProcedure.query(async () => {
    try {
      const faqs = await FAQModel.find()
      return faqs
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch faqs',
      })
    }
  }),
  create: protectedProcedure.input(faqSchema).mutation(async ({ input }) => {
    const faqData = await faqSchema.safeParseAsync(input)
    if (!faqData.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
    }
    const { question, answer } = faqData.data
    try {
      await FAQModel.insertOne({
        question,
        answer,
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add faq',
      })
    }
    return { message: 'FAQ added successfully', is_success: true }
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await FAQModel.deleteOne({ _id: input.id })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete faq',
        })
      }
      return { message: 'FAQ deleted successfully', is_success: true }
    }),
  update: protectedProcedure
    .input(faqSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      const faqData = await faqSchema.safeParseAsync(input)
      if (!faqData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      const { question, answer } = faqData.data
      try {
        await FAQModel.updateOne(
          { _id: input.id },
          { $set: { question, answer } },
        )
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update faq',
        })
      }
      return { message: 'FAQ updated successfully', is_success: true }
    }),
} satisfies TRPCRouterRecord
