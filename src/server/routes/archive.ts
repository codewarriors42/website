import { protectedProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { ArchiveModel } from '../db/schemas/archive'
import { archiveSchema } from '#/types/schemas/archive.schema'
import z from 'zod'

export const archiveRouter = {
  getAll: protectedProcedure.query(async () => {
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
  create: protectedProcedure
    .input(archiveSchema)
    .mutation(async ({ input }) => {
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
  update: protectedProcedure
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
  delete: protectedProcedure
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
} satisfies TRPCRouterRecord
