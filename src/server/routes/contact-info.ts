import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { contactSchema } from '../db/schemas/contact-info/contact-type'
import { ContactModel } from '../db/schemas/contact-info'

export const contactRouter = {
  create: publicProcedure.input(contactSchema).mutation(async ({ input }) => {
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
  update: publicProcedure
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
  delete: publicProcedure
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
  getAll: publicProcedure.query(async () => {
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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const contact = await ContactModel.findById(input.id)
        if (!contact) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Contact message not found',
          })
        }
        return contact
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contact message',
        })
      }
    }),
} satisfies TRPCRouterRecord
