import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { ResourceModel } from '../db/schemas/resource'
import z from 'zod'
import { resourceSchema } from '../db/schemas/resource/resource-type'

export const resourceRouter = {
  getAll: publicProcedure.query(async () => {
    try {
      const resources = await ResourceModel.find().sort({ createdAt: -1 })
      return resources
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch resources',
      })
    }
  }),
  create: publicProcedure.input(resourceSchema).mutation(async ({ input }) => {
    const inputData = await resourceSchema.parseAsync(input)
    try {
      const newResource = new ResourceModel(inputData)
      await newResource.save()
      return { message: 'Resource created successfully', is_success: true }
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create resource',
      })
    }
  }),
  update: publicProcedure
    .input(
      resourceSchema.merge(resourceSchema.partial().extend({ id: z.string() })),
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      try {
        const updatedResource = await ResourceModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true },
        )
        if (!updatedResource) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }
        return { message: 'Resource updated successfully', is_success: true }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update resource',
        })
      }
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const deletedResource = await ResourceModel.findByIdAndDelete(input.id)
        if (!deletedResource) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }
        return { message: 'Resource deleted successfully', is_success: true }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete resource',
        })
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const resource = await ResourceModel.findById(input.id)
        if (!resource) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }
        return resource
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch resource',
        })
      }
    }),
} satisfies TRPCRouterRecord
