import { protectedProcedure } from '#/integrations/trpc/init'
import { contactSchema } from '#/types/schemas/contact.schema'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { ContactModel } from '../db/schemas/contact'

export const contactRouter = {
  create: protectedProcedure
    .input(contactSchema)
    .mutation(async ({ input }) => {
      const inputData = await contactSchema.safeParseAsync(input)
      if (!inputData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      try {
        await ContactModel.create({
          post: input.post,
          mail: input.mail,
        })
        return {
          message: 'Contact message created successfully',
          is_success: true,
        }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create contact message',
        })
      }
    }),
  update: protectedProcedure
    .input(contactSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      const inputData = await contactSchema.safeParseAsync(input)
      if (!inputData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      try {
        await ContactModel.findByIdAndUpdate(input.id, {
          post: input.post,
          mail: input.mail,
        })
        return {
          message: 'Contact message updated successfully',
          is_success: true,
        }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update contact message',
        })
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await ContactModel.findByIdAndDelete(input.id)
        return {
          message: 'Contact message deleted successfully',
          is_success: true,
        }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete contact message',
        })
      }
    }),
  getAll: protectedProcedure.query(async () => {
    try {
      const contacts = await ContactModel.find()
      return contacts
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch contacts',
      })
    }
  }),
} satisfies TRPCRouterRecord
