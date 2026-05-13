import { protectedProcedure } from '#/integrations/trpc/init'
import { alumniSchema } from '#/types/schemas/alumni.schema'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { Alumin } from '../db/schemas/alumni'
import z from 'zod'

export const AlumniRouter = {
  getAll: protectedProcedure.query(async () => {
    try {
      const alumnis = await Alumin.find()
      return alumnis
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch alumnis',
      })
    }
  }),
  create: protectedProcedure.input(alumniSchema).mutation(async ({ input }) => {
    const inputData = await alumniSchema.safeParseAsync(input)
    if (!inputData.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
    }
    const { current, year, name, post, socials, image } = inputData.data
    try {
      await Alumin.insertOne({
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

  getSingleAlumniByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const alumni = await Alumin.findById(input.id)
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await Alumin.deleteOne({ _id: input.id })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete alumni',
        })
      }
      return { message: 'Alumni deleted successfully', is_success: true }
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(alumniSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      try {
        const result = await Alumin.updateOne({ _id: id }, { $set: updateData })
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
