import { protectedProcedure } from '#/integrations/trpc/init'
import { eventSchema } from '#/types/schemas/event.schema'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { EventModel } from '../db/schemas/event'
import z from 'zod'

export const eventRouter = {
  getAll: protectedProcedure.query(async () => {
    try {
      const events = await EventModel.find()
      return events
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch events',
      })
    }
  }),
  create: protectedProcedure.input(eventSchema).mutation(async ({ input }) => {
    const inputData = await eventSchema.safeParseAsync(input)
    if (!inputData.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
    }
    const { name } = inputData.data
    try {
      await EventModel.insertOne({
        name,
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add event',
      })
    }
    return { message: 'Event added successfully', is_success: true }
  }),
  update: protectedProcedure
    .input(eventSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      const inputData = await eventSchema.safeParseAsync(input)
      if (!inputData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      const { name } = inputData.data
      try {
        await EventModel.updateOne({ _id: input.id }, { $set: { name } })
        return { message: 'Event updated successfully', is_success: true }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event',
        })
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await EventModel.deleteOne({ _id: input.id })
        return { message: 'Event deleted successfully', is_success: true }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete event',
        })
      }
    }),
} satisfies TRPCRouterRecord
