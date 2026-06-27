import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { FaqModel } from '../db/schemas/faq'
import { faqTypeSchema } from '../db/schemas/faq/faq-type'

export const FAQRouter = {
  getAll: publicProcedure.query(async () => {
    try {
      const faqs = await FaqModel.find()
      return faqs
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch faqs',
      })
    }
  }),
  create: publicProcedure.input(faqTypeSchema).mutation(async ({ input }) => {
    const faqData = await faqTypeSchema.safeParseAsync(input)
    if (!faqData.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
    }
    const { question, answer } = faqData.data
    try {
      await FaqModel.insertOne({
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
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await FaqModel.deleteOne({ _id: input.id })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete faq',
        })
      }
      return { message: 'FAQ deleted successfully', is_success: true }
    }),
  update: publicProcedure
    .input(faqTypeSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      const faqData = await faqTypeSchema.safeParseAsync(input)
      if (!faqData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      const { question, answer } = faqData.data
      try {
        await FaqModel.updateOne(
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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const faq = await FaqModel.findOne({ _id: input.id })
        if (!faq) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'FAQ not found',
          })
        }
        return faq
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch faq',
        })
      }
    }),
} satisfies TRPCRouterRecord
