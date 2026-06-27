import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { AluminModel } from '../db/schemas/alumni'
import { alumniSchema } from '../db/schemas/alumni/alumnis-type'

export const alumniRouter = {
  getAll: publicProcedure.query(async () => {
    try {
      const alumnis = await AluminModel.find()
      return alumnis
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch alumnis',
      })
    }
  }),
  create: publicProcedure.input(alumniSchema).mutation(async ({ input }) => {
    const inputData = await alumniSchema.safeParseAsync(input)
    if (!inputData.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
    }
    const { current, year, name, post, socials, image } = inputData.data
    try {
      await AluminModel.insertOne({
        name,
        year,
        post,
        current,
        socials,
        image,
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add alumni',
      })
    }
    return { message: 'Alumni added successfully', is_success: true }
  }),

  getSingleAlumniByID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const alumni = await AluminModel.findById(input.id)
        if (!alumni) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Alumni not found',
          })
        }
        return alumni
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch alumni',
        })
      }
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await AluminModel.deleteOne({ _id: input.id })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete alumni',
        })
      }
      return { message: 'Alumni deleted successfully', is_success: true }
    }),
  update: publicProcedure
    .input(z.object({ id: z.string() }).merge(alumniSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      try {
        const result = await AluminModel.updateOne(
          { _id: id },
          { $set: updateData },
        )
        if (result.matchedCount === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Alumni not found',
          })
        }
      } catch (err) {
        console.error(err)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update alumni',
        })
      }
      return { message: 'Alumni updated successfully', is_success: true }
    }),
} satisfies TRPCRouterRecord
