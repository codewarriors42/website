import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { ArchiveModel } from '../db/schemas/archive'
import z from 'zod'
import { archiveSchema } from '../db/schemas/archive/archive-type'

export const archiveRouter = {
  getAll: publicProcedure.query(async () => {
    try {
      const archives = await ArchiveModel.find()
      return archives
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch archives',
      })
    }
  }),
  create: publicProcedure.input(archiveSchema).mutation(async ({ input }) => {
    const inputData = await archiveSchema.safeParseAsync(input)
    if (!inputData.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
    }
    try {
      await ArchiveModel.insertOne({
        ...inputData.data,
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add archive',
      })
    }
    return { message: 'Archive added successfully', is_success: true }
  }),
  update: publicProcedure
    .input(archiveSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      const inputData = await archiveSchema.safeParseAsync(input)
      if (!inputData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      try {
        await ArchiveModel.findByIdAndUpdate(input.id, {
          ...inputData.data,
        })
        return { message: 'Archive updated successfully', is_success: true }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update archive',
        })
      }
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await ArchiveModel.findByIdAndDelete(input.id)
        return { message: 'Archive deleted successfully', is_success: true }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete archive',
        })
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const archive = await ArchiveModel.findById(input.id)
        if (!archive) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Archive not found',
          })
        }
        return archive
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch archive',
        })
      }
    }),
} satisfies TRPCRouterRecord
